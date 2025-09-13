
import React, { useState } from 'react';
import PageHeader from '../components/Header';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { STUDENTS_DATA, TEACHERS_DATA, FINANCIAL_SUMMARY, REVENUE_CATEGORIES, EXPENSE_CATEGORIES } from '../constants';
import { Student, Teacher, FinancialCategory } from '../types';
import { formatCurrency } from '../utils/formatters';
import { XMarkIcon, PrinterIcon } from '@heroicons/react/24/solid';

// Define report types
type ReportType = 'students' | 'teachers' | 'financial' | null;

const Reports: React.FC = () => {
    const [activeReport, setActiveReport] = useState<ReportType>(null);
    const [reportData, setReportData] = useState<any>(null);

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
            </div>
            
            <ReportModal />
        </>
    );
};

export default Reports;