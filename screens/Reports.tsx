

import React, { useState } from 'react';
import PageHeader from '../components/Header';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { STUDENTS_DATA, TEACHERS_DATA, FINANCIAL_SUMMARY, REVENUE_CATEGORIES, EXPENSE_CATEGORIES } from '../constants';
import { Student, Teacher, FinancialCategory, PredictiveAnalysisResult, GradeRecord } from '../types';
import { formatCurrency, calculateAverage } from '../utils/formatters';
import { XMarkIcon, PrinterIcon } from '@heroicons/react/24/solid';
import { useData } from '../context/DataContext';
import { SparklesIcon, DocumentArrowDownIcon } from '../components/icons';
import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

// Define report types
type ReportType = 'students' | 'teachers' | 'financial' | null;

const Reports: React.FC = () => {
    const { students, grades, attendance, classes } = useData();
    const [activeReport, setActiveReport] = useState<ReportType>(null);
    const [reportData, setReportData] = useState<any>(null);

    const [isPredictiveReportOpen, setPredictiveReportOpen] = useState<boolean>(false);
    const [predictiveData, setPredictiveData] = useState<PredictiveAnalysisResult | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const generateReport = (type: ReportType) => {
        setActiveReport(type);
        // In a real app, you might fetch or calculate this data based on filters
        switch (type) {
            case 'students':
                setReportData(STUDENTS_DATA);
                break;
            case 'teachers':
                setReportData(TEACHERS_DATA);
                break;
            case 'financial':
                setReportData({
                    summary: FINANCIAL_SUMMARY,
                    revenues: REVENUE_CATEGORIES,
                    expenses: EXPENSE_CATEGORIES,
                });
                break;
            default:
                setReportData(null);
        }
    };

    const generatePredictiveAnalysis = async () => {
        setIsLoading(true);
        setError(null);
        setPredictiveData(null);
        setPredictiveReportOpen(true);

        try {
            if (!process.env.API_KEY) {
              throw new Error("A chave de API não está configurada.");
            }
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            
            const fullStudentData = students.map(student => {
                const studentGrades = grades.find(g => g.studentId === student.id);
                const studentAttendance = attendance.filter(a => a.studentId === student.id);
                const studentClass = classes.find(c => c.id === student.classId);

                return {
                    id: student.id,
                    name: student.name,
                    class: studentClass?.name || 'N/A',
                    grades: studentGrades ? Object.entries(studentGrades.gradesBySubject).map(([subjectId, gradeRecord]) => ({
                        subjectId,
                        average: calculateAverage(gradeRecord as GradeRecord)
                    })).filter(g => g.average !== null) : [],
                    attendance: {
                        total: studentAttendance.length,
                        absent: studentAttendance.filter(a => a.status === 'Ausente').length
                    }
                };
            });
            
            const responseSchema = {
                type: Type.OBJECT,
                properties: {
                    atRiskStudents: {
                        type: Type.ARRAY, description: "Lista de alunos em risco.",
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                studentId: { type: Type.NUMBER },
                                name: { type: Type.STRING },
                                class: { type: Type.STRING },
                                reason: { type: Type.STRING, description: "Explicação concisa do porquê o aluno está em risco (ex: notas baixas em X, muitas faltas)." },
                                recommendation: { type: Type.STRING, description: "Uma recomendação acionável para este aluno (ex: 'Sessão de reforço em Matemática', 'Reunião com os pais sobre assiduidade')." },
                            }, required: ['studentId', 'name', 'class', 'reason', 'recommendation']
                        }
                    },
                    highPerformingStudents: {
                        type: Type.ARRAY, description: "Lista de alunos com alto desempenho.",
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                studentId: { type: Type.NUMBER },
                                name: { type: Type.STRING },
                                class: { type: Type.STRING },
                                reason: { type: Type.STRING, description: "Explicação concisa do porquê o aluno se destaca (ex: médias consistentemente altas)." },
                                recommendation: { type: Type.STRING, description: "Uma recomendação para desafiar este aluno (ex: 'Projetos de pesquisa avançada', 'Participação em olimpíadas')." },
                            }, required: ['studentId', 'name', 'class', 'reason', 'recommendation']
                        }
                    },
                    generalRecommendations: {
                        type: Type.ARRAY, description: "Três recomendações pedagógicas gerais para a escola com base nos dados agregados.",
                        items: { type: Type.STRING }
                    }
                },
                required: ['atRiskStudents', 'highPerformingStudents', 'generalRecommendations']
            };
            
            const prompt = `Analise os seguintes dados de alunos e forneça uma análise preditiva. Dados: ${JSON.stringify(fullStudentData)}`;

            const response: GenerateContentResponse = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
                config: {
                    systemInstruction: `Você é um psicólogo educacional e analista de dados. Sua tarefa é identificar alunos em risco de insucesso académico ou evasão, alunos com alto desempenho que podem ser desafiados, e fornecer recomendações gerais para a escola. Baseie sua análise nas notas (a média é de 0 a 20, sendo 10 a nota de aprovação) e na assiduidade. Forneça razões claras e recomendações acionáveis para cada aluno identificado.`,
                    responseMimeType: "application/json",
                    responseSchema: responseSchema,
                }
            });

            // FIX: Per the guidelines, response.text should be a string.
            // Using String() handles potential typing issues where it is inferred as 'unknown'.
            const result = JSON.parse(String(response.text).trim()) as PredictiveAnalysisResult;
            setPredictiveData(result);

        } catch (err) {
            console.error("Error generating predictive analysis:", err);
            setError("Não foi possível gerar a análise. Verifique se a sua Chave de API está configurada corretamente e tente novamente.");
        } finally {
            setIsLoading(false);
        }
    };

    const closeReport = () => {
        setActiveReport(null);
        setReportData(null);
    };

    const handlePrint = () => {
        const printContent = document.getElementById('printable-report');
        if (!printContent) return;
    
        const printWindow = window.open('', '_blank', 'height=800,width=1000');
        if (!printWindow) return;
    
        printWindow.document.write('<html><head><title>Relatório - Escola Reviva</title>');
        printWindow.document.write('<script src="https://cdn.tailwindcss.com"></script>');
        printWindow.document.write('<style>body { -webkit-print-color-adjust: exact; font-family: sans-serif; } @page { size: A4; margin: 20mm; } .printable-header { text-align: center; margin-bottom: 20px; } .printable-header h1 { font-size: 24px; font-weight: bold; } table { width: 100%; border-collapse: collapse; margin-top: 10px; } th, td { border: 1px solid #ddd; padding: 8px; text-align: left;} thead { background-color: #f2f2f2; } </style>');
        printWindow.document.write('</head><body>');
        printWindow.document.write(printContent.innerHTML);
        printWindow.document.write('</body></html>');
        printWindow.document.close();
        printWindow.focus();
        
        setTimeout(() => {
            printWindow.print();
            printWindow.close();
        }, 500);
    };

    const handleDownloadPdf = () => {
        const input = document.getElementById('printable-report');
        if (input) {
            html2canvas(input, { scale: 2 }) // Aumenta a escala para melhor resolução
                .then(canvas => {
                    const imgData = canvas.toDataURL('image/png');
                    const pdf = new jsPDF('p', 'mm', 'a4');
                    const pdfWidth = pdf.internal.pageSize.getWidth();
                    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
                    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
                    pdf.save('relatorio-escola-reviva.pdf');
                });
        }
    };

    const ReportModal: React.FC = () => {
        if (!activeReport || !reportData) return null;

        let title = '';
        let content = null;

        switch (activeReport) {
            case 'students':
                title = 'Relatório de Alunos';
                content = (
                    <table className="w-full text-sm">
                        <thead>
                            <tr>
                                <th>Nome</th>
                                <th>Classe</th>
                                <th>Encarregado</th>
                                <th>Telefone</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {(reportData as Student[]).map(s => (
                                <tr key={s.id}>
                                    <td className="font-medium">{s.name}</td>
                                    <td>{s.class}</td>
                                    <td>{s.guardian}</td>
                                    <td>{s.phone}</td>
                                    <td>{s.status}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                );
                break;
            case 'teachers':
                title = 'Relatório de Professores';
                content = (
                     <table className="w-full text-sm">
                        <thead>
                            <tr>
                                <th>Nome</th>
                                <th>Email</th>
                                <th>Telefone</th>
                                <th>Qualificações</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {(reportData as Teacher[]).map(t => (
                                <tr key={t.id}>
                                    <td className="font-medium">{t.name}</td>
                                    <td>{t.email}</td>
                                    <td>{t.phone}</td>
                                    <td>{t.qualifications}</td>
                                    <td>{t.status}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                );
                break;
            case 'financial':
                title = 'Relatório Financeiro Resumido';
                content = (
                     <div>
                        <h3 className="text-lg font-bold mb-2 text-slate-800 dark:text-slate-200">Resumo Geral</h3>
                        <div className="grid grid-cols-2 gap-4 mb-6 p-4 bg-slate-100 dark:bg-slate-700/50 rounded-lg">
                            <div><strong>Total Receitas:</strong> {formatCurrency(reportData.summary.totalRevenue)}</div>
                            <div><strong>Total Despesas:</strong> {formatCurrency(reportData.summary.totalExpenses)}</div>
                            <div><strong>Saldo Atual:</strong> {formatCurrency(reportData.summary.currentBalance)}</div>
                            <div><strong>Inadimplência:</strong> {formatCurrency(reportData.summary.defaults)}</div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div>
                                <h3 className="text-lg font-bold mb-2 text-slate-800 dark:text-slate-200">Detalhe de Receitas</h3>
                                <table className="w-full text-sm">
                                    <tbody>
                                    {(reportData.revenues as FinancialCategory[]).map(r => (
                                        <tr key={r.name} className="border-b border-slate-200 dark:border-slate-700">
                                            <td className="py-1">{r.name}</td>
                                            <td className="py-1 text-right font-semibold">{formatCurrency(r.amount)}</td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                             <div>
                                <h3 className="text-lg font-bold mb-2 text-slate-800 dark:text-slate-200">Detalhe de Despesas</h3>
                                <table className="w-full text-sm">
                                    <tbody>
                                    {(reportData.expenses as FinancialCategory[]).map(e => (
                                        <tr key={e.name} className="border-b border-slate-200 dark:border-slate-700">
                                            <td className="py-1">{e.name}</td>
                                            <td className="py-1 text-right font-semibold">{formatCurrency(e.amount)}</td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                );
                break;
        }

        return (
             <div className="fixed inset-0 bg-black bg-opacity-60 z-40 flex justify-center items-center p-4" aria-modal="true" role="dialog">
                <Card className="w-full max-w-4xl max-h-[90vh] flex flex-col">
                    <div className="p-4 flex justify-between items-center border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 rounded-t-xl">
                        <h2 className="text-xl font-bold text-reviva-green dark:text-reviva-green-light">{title}</h2>
                        <div className="flex items-center gap-2">
                             <Button onClick={handleDownloadPdf} variant="secondary" size="sm">
                                <DocumentArrowDownIcon className="h-4 w-4 mr-2"/> Download PDF
                            </Button>
                            <Button onClick={handlePrint} variant="secondary" size="sm">
                                <PrinterIcon className="h-4 w-4 mr-2"/> Imprimir
                            </Button>
                            <Button variant="ghost" size="icon" onClick={closeReport} aria-label="Fechar modal">
                                <XMarkIcon className="h-6 w-6" />
                            </Button>
                        </div>
                    </div>
                    <div className="p-6 overflow-y-auto">
                        <div id="printable-report">
                            <div className="printable-header">
                                <h1>Escola Reviva</h1>
                                <p className="text-gray-600">{title}</p>
                                <p className="text-xs text-gray-500">Gerado em: {new Date().toLocaleDateString('pt-MZ')}</p>
                            </div>
                            {content}
                        </div>
                    </div>
                </Card>
            </div>
        );
    };
    
    const PredictiveReportModal: React.FC = () => {
        if (!isPredictiveReportOpen) return null;

        return (
            <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4" aria-modal="true" role="dialog">
                <Card className="w-full max-w-4xl max-h-[90vh] flex flex-col">
                    <div className="p-4 flex justify-between items-center border-b border-slate-200 dark:border-slate-700">
                        <h2 className="text-xl font-bold text-reviva-green dark:text-reviva-green-light flex items-center gap-2">
                            <SparklesIcon className="h-6 w-6"/> Análise Preditiva de Alunos
                        </h2>
                        <Button variant="ghost" size="icon" onClick={() => setPredictiveReportOpen(false)} aria-label="Fechar modal">
                            <XMarkIcon className="h-6 w-6" />
                        </Button>
                    </div>
                    <div className="p-6 overflow-y-auto">
                        {isLoading && (
                            <div className="text-center py-16">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-reviva-green mx-auto"></div>
                                <p className="mt-4 text-slate-600 dark:text-slate-400">A IA está a analisar os dados dos alunos...</p>
                                <p className="text-sm text-slate-500">Isto pode demorar alguns instantes.</p>
                            </div>
                        )}
                        {error && (
                             <div className="text-center py-16 text-red-500">
                                <h3 className="font-bold text-lg">Ocorreu um Erro</h3>
                                <p>{error}</p>
                            </div>
                        )}
                        {predictiveData && (
                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-lg font-bold text-red-600 dark:text-red-400 mb-2">Alunos a Necessitar de Atenção ({predictiveData.atRiskStudents.length})</h3>
                                    <div className="space-y-4">
                                        {predictiveData.atRiskStudents.map(student => (
                                            <div key={student.studentId} className="p-4 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 rounded-r-lg">
                                                <p className="font-bold">{student.name} <span className="font-normal text-sm text-slate-500 dark:text-slate-400">- {student.class}</span></p>
                                                <p className="text-sm mt-1"><strong className="text-slate-700 dark:text-slate-300">Motivo:</strong> {student.reason}</p>
                                                <p className="text-sm mt-1"><strong className="text-slate-700 dark:text-slate-300">Recomendação:</strong> {student.recommendation}</p>
                                            </div>
                                        ))}
                                        {predictiveData.atRiskStudents.length === 0 && <p className="text-sm text-slate-500">Nenhum aluno identificado neste grupo.</p>}
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-green-600 dark:text-green-400 mb-2">Alunos em Destaque ({predictiveData.highPerformingStudents.length})</h3>
                                     <div className="space-y-4">
                                        {predictiveData.highPerformingStudents.map(student => (
                                            <div key={student.studentId} className="p-4 bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500 rounded-r-lg">
                                                <p className="font-bold">{student.name} <span className="font-normal text-sm text-slate-500 dark:text-slate-400">- {student.class}</span></p>
                                                <p className="text-sm mt-1"><strong className="text-slate-700 dark:text-slate-300">Motivo:</strong> {student.reason}</p>
                                                <p className="text-sm mt-1"><strong className="text-slate-700 dark:text-slate-300">Recomendação:</strong> {student.recommendation}</p>
                                            </div>
                                        ))}
                                         {predictiveData.highPerformingStudents.length === 0 && <p className="text-sm text-slate-500">Nenhum aluno identificado neste grupo.</p>}
                                    </div>
                                </div>
                                 <div>
                                    <h3 className="text-lg font-bold text-slate-700 dark:text-slate-200 mb-2">Recomendações Pedagógicas Gerais</h3>
                                    <ul className="list-disc list-inside space-y-1 text-sm text-slate-600 dark:text-slate-300">
                                        {predictiveData.generalRecommendations.map((rec, index) => <li key={index}>{rec}</li>)}
                                    </ul>
                                </div>
                            </div>
                        )}
                    </div>
                </Card>
            </div>
        );
    };

    return (
        <>
            <PageHeader title="Relatórios" subtitle="Gere relatórios detalhados sobre as operações da escola" />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card className="p-6 flex flex-col justify-between hover:shadow-lg dark:hover:border-slate-600 transition-shadow">
                    <div>
                        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">Relatório de Alunos</h3>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">Gere uma lista completa de todos os alunos matriculados, com detalhes de contacto e status.</p>
                    </div>
                    <Button onClick={() => generateReport('students')} className="mt-4 w-full">
                        Gerar Relatório
                    </Button>
                </Card>

                <Card className="p-6 flex flex-col justify-between hover:shadow-lg dark:hover:border-slate-600 transition-shadow">
                    <div>
                        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">Relatório de Professores</h3>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">Exporte uma lista do corpo docente, incluindo contactos e qualificações.</p>
                    </div>
                    <Button onClick={() => generateReport('teachers')} className="mt-4 w-full">
                        Gerar Relatório
                    </Button>
                </Card>

                <Card className="p-6 flex flex-col justify-between hover:shadow-lg dark:hover:border-slate-600 transition-shadow">
                    <div>
                        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">Relatório Financeiro</h3>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">Obtenha um resumo das finanças, incluindo receitas, despesas e balanço atual.</p>
                    </div>
                    <Button onClick={() => generateReport('financial')} className="mt-4 w-full">
                         Gerar Relatório
                    </Button>
                </Card>

                 <Card className="md:col-span-2 lg:col-span-3 p-6 flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-50 dark:bg-slate-800/50 border-reviva-green">
                    <div>
                        <h3 className="text-lg font-bold text-reviva-green dark:text-reviva-green-light flex items-center gap-2">
                            <SparklesIcon className="h-6 w-6" />
                            Análise Preditiva de Alunos (IA)
                        </h3>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">Utilize Inteligência Artificial para identificar alunos em risco, alunos com alto desempenho e obter recomendações pedagógicas para intervenções proativas.</p>
                    </div>
                    <Button onClick={generatePredictiveAnalysis} className="mt-4 w-full sm:w-auto self-end" disabled={isLoading}>
                        {isLoading ? 'A Analisar...' : 'Gerar Análise com IA'}
                    </Button>
                </Card>
            </div>
            
            <ReportModal />
            <PredictiveReportModal />
        </>
    );
};

export default Reports;