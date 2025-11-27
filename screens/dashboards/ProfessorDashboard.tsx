



import React, { useMemo, useState, FC } from 'react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../../components/Header';
import { useCoreData } from '../../context/CoreDataContext';
import { useAcademicData } from '../../context/AcademicContext';
import { useAuth } from '../../context/AuthContext';
import { Card } from '../../components/ui/Card';
import ProfileCard from '../../components/dashboards/ProfileCard';
import { ClockIcon, UsersIcon, PresentationChartBarIcon, ExclamationTriangleIcon, DocumentChartBarIcon, PrinterIcon } from '@heroicons/react/24/outline';
import { Badge } from '../../components/ui/Badge';
import { GradeRecord, Class, Student } from '../../types';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid } from 'recharts';
import { useTheme } from '../../context/ThemeContext';
import { Modal } from '../../components/ui/Modal';
import { Button } from '../../components/ui/Button';
import { calculateAverage } from '../../utils/formatters';

const InfoCard: React.FC<{ title: string; icon: React.ReactNode; children: React.ReactNode }> = ({ title, icon, children }) => (
    <Card>
        <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex items-center gap-3">
            <div className="text-reviva-green dark:text-reviva-green-light">{icon}</div>
            <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">{title}</h3>
        </div>
        <div className="p-4 md:p-6">{children}</div>
    </Card>
);

const ClassReportModal: FC<{
    isOpen: boolean;
    onClose: () => void;
    classInfo: Class | undefined;
    teacherId: number | undefined;
}> = ({ isOpen, onClose, classInfo, teacherId }) => {
    const { students, subjects, classCurriculum } = useCoreData();
    const { grades } = useAcademicData();

    const reportData = useMemo(() => {
        if (!classInfo || !teacherId) return { students: [], subjects: [] };
        
        const classStudents = students.filter(s => s.classId === classInfo.id);
        const teacherSubjects = classCurriculum
            .filter(cc => cc.classId === classInfo.id && cc.teacherId === teacherId)
            .map(cc => subjects.find(s => s.id === cc.subjectId))
            .filter((s): s is NonNullable<typeof s> => s !== undefined);
        
        return { students: classStudents, subjects: teacherSubjects };
    }, [classInfo, teacherId, students, subjects, classCurriculum]);

    const handlePrint = () => {
        const printContent = document.getElementById('printable-report-content');
        if (!printContent) return;
        const printWindow = window.open('', '', 'height=600,width=800');
        printWindow?.document.write('<html><head><title>Pauta da Turma</title>');
        printWindow?.document.write('<script src="https://cdn.tailwindcss.com"></script>');
        printWindow?.document.write('<style>@media print { .no-print { display: none; } }</style>');
        printWindow?.document.write('</head><body>');
        printWindow?.document.write(printContent.innerHTML);
        printWindow?.document.write('</body></html>');
        printWindow?.document.close();
        printWindow?.focus();
        setTimeout(() => printWindow?.print(), 500);
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={`Pauta - ${classInfo?.name}`}>
            <div id="printable-report-content">
                <h3 className="text-center text-lg font-bold">Pauta de Avaliação - {classInfo?.name}</h3>
                <div className="overflow-x-auto mt-4 border rounded-lg dark:border-slate-700">
                    <table className="w-full text-xs">
                        <thead className="bg-slate-50 dark:bg-slate-700/50">
                            <tr>
                                <th className="p-2 text-left">Aluno</th>
                                {reportData.subjects.map(sub => (
                                    <th key={sub.id} className="p-2 text-center border-l dark:border-slate-600">{sub.name}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {reportData.students.map(student => (
                                <tr key={student.id} className="border-t dark:border-slate-700">
                                    <td className="p-2 font-medium">{student.name}</td>
                                    {reportData.subjects.map(sub => {
                                        const gradeData = grades.find(g => g.studentId === student.id)?.gradesBySubject[sub.id];
                                        const average = calculateAverage(gradeData);
                                        return (
                                            <td key={sub.id} className="p-2 text-center border-l dark:border-slate-600 font-bold">
                                                {average?.toFixed(2) ?? '-'}
                                            </td>
                                        );
                                    })}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            <div className="flex justify-end gap-4 pt-6 no-print">
                 <Button variant="secondary" onClick={handlePrint}>
                    <PrinterIcon className="h-4 w-4 mr-2"/>Imprimir
                </Button>
                <Button onClick={onClose}>Fechar</Button>
            </div>
        </Modal>
    );
};


const ProfessorDashboard: React.FC = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const { theme } = useTheme();
    const { teachers, classes, classCurriculum, subjects, students } = useCoreData();
    const { lessonPlans, grades } = useAcademicData();
    
    const [isReportModalOpen, setReportModalOpen] = useState(false);
    const [selectedClassForReport, setSelectedClassForReport] = useState<Class | undefined>(undefined);

    const loggedInTeacher = useMemo(() => 
        teachers.find(t => t.email.toLowerCase() === user?.email.toLowerCase()),
        [user, teachers]
    );

    const teacherCurriculum = useMemo(() => {
        if (!loggedInTeacher) return [];
        return classCurriculum.filter(cc => cc.teacherId === loggedInTeacher.id);
    }, [loggedInTeacher, classCurriculum]);
    
    const teacherClasses = useMemo(() => {
        const teacherClassIds = new Set(teacherCurriculum.map(cc => cc.classId));
        return classes.filter(c => teacherClassIds.has(c.id));
    }, [teacherCurriculum, classes]);

    const today = new Date().toISOString().split('T')[0];
    const todaysSchedule = useMemo(() => {
        if (!loggedInTeacher) return [];
        return lessonPlans
            .filter(lp => lp.date === today && teacherCurriculum.some(cc => cc.classId === lp.classId && cc.subjectId === lp.subjectId))
            .map(lp => ({
                ...lp,
                className: classes.find(c => c.id === lp.classId)?.name || '',
                subjectName: subjects.find(s => s.id === lp.subjectId)?.name || ''
            }))
            .sort((a,b) => a.className.localeCompare(b.className));
    }, [loggedInTeacher, lessonPlans, today, teacherCurriculum, classes, subjects]);
    
    const performanceData = useMemo(() => {
        if (!loggedInTeacher) return [];
        return teacherClasses.map(cls => {
            const studentsInClass = students.filter(s => s.classId === cls.id);
            const subjectsInClass = teacherCurriculum
                .filter(cc => cc.classId === cls.id)
                .map(cc => cc.subjectId);

            const classAverages = studentsInClass.map(student => {
                const studentGrades = grades.find(g => g.studentId === student.id);
                if (!studentGrades) return null;

                const subjectAverages = subjectsInClass.map(subId => {
                    return calculateAverage(studentGrades.gradesBySubject[subId]);
                }).filter((avg): avg is number => avg !== null);

                if (subjectAverages.length === 0) return null;
                return subjectAverages.reduce((a, b) => a + b, 0) / subjectAverages.length;
            }).filter((avg): avg is number => avg !== null);

            const average = classAverages.length > 0 ? classAverages.reduce((a,b) => a + b, 0) / classAverages.length : 0;
            return { name: cls.name, "Média da Turma": parseFloat(average.toFixed(2)) };
        });
    }, [loggedInTeacher, teacherClasses, students, grades, teacherCurriculum]);

    const handleOpenReport = (classInfo: Class) => {
        setSelectedClassForReport(classInfo);
        setReportModalOpen(true);
    };

    if (!loggedInTeacher) {
        return (
             <PageHeader 
                title="Bem-vindo(a)!" 
                subtitle="Não foi possível encontrar os seus dados de professor. Contacte o administrador." 
            />
        );
    }

    const tickColor = theme === 'dark' ? '#94a3b8' : '#475569';

    return (
        <>
            <PageHeader title={`Bem-vindo(a), ${loggedInTeacher.name.split(' ')[0]}!`} subtitle="Aqui está um resumo do seu dia e das suas atividades." />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-8">
                    <InfoCard title="Média Geral por Turma" icon={<PresentationChartBarIcon className="h-6 w-6"/>}>
                        <div style={{ width: '100%', height: 250 }}>
                            <ResponsiveContainer>
                                <BarChart data={performanceData} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
                                    <XAxis dataKey="name" tick={{ fontSize: 12, fill: tickColor }} />
                                    <YAxis tick={{ fill: tickColor }} domain={[0, 20]}/>
                                    <Tooltip cursor={{ fill: 'rgba(128, 128, 128, 0.1)' }} />
                                    <Legend />
                                    <Bar dataKey="Média da Turma" fill="#387a3d" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </InfoCard>

                    <InfoCard title="Agenda do Dia" icon={<ClockIcon className="h-6 w-6"/>}>
                        {todaysSchedule.length > 0 ? (
                            <ul className="space-y-3">
                                {todaysSchedule.map(plan => (
                                    <li key={plan.id} className="p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                                        <p className="font-bold text-reviva-green">{plan.title}</p>
                                        <p className="text-sm">{plan.subjectName} - {plan.className}</p>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                             <p className="text-center text-slate-500 dark:text-slate-400 py-4">Não tem aulas agendadas para hoje no seu plano.</p>
                        )}
                    </InfoCard>
                </div>
                
                {/* Sidebar */}
                <div className="space-y-8">
                    <ProfileCard 
                        name={loggedInTeacher.name} 
                        imageUrl={loggedInTeacher.photoUrl} 
                        details={{ Email: loggedInTeacher.email, Telefone: loggedInTeacher.phone }}
                    />
                    <InfoCard title="Minhas Turmas" icon={<UsersIcon className="h-6 w-6"/>}>
                        {teacherClasses.length > 0 ? (
                            <ul className="space-y-2">
                                {teacherClasses.map(c => (
                                    <li key={c.id} className="flex justify-between items-center p-2 bg-slate-50 dark:bg-slate-700/50 rounded-md font-semibold hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer" onClick={() => navigate(`/turmas/${c.id}/detalhes`)}>
                                        <span>{c.name}</span>
                                        <Badge>{c.studentCount} alunos</Badge>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                             <p className="text-center text-slate-500 dark:text-slate-400 py-4">Nenhuma turma atribuída.</p>
                        )}
                    </InfoCard>

                    <InfoCard title="Relatórios Rápidos" icon={<DocumentChartBarIcon className="h-6 w-6"/>}>
                         <div className="space-y-2">
                            {teacherClasses.map(c => (
                                <Button key={c.id} variant="secondary" className="w-full justify-start" onClick={() => handleOpenReport(c)}>
                                    Gerar Pauta - {c.name}
                                </Button>
                            ))}
                        </div>
                    </InfoCard>
                </div>
            </div>

            <ClassReportModal 
                isOpen={isReportModalOpen}
                onClose={() => setReportModalOpen(false)}
                classInfo={selectedClassForReport}
                teacherId={loggedInTeacher.id}
            />
        </>
    );
};

export default ProfessorDashboard;
