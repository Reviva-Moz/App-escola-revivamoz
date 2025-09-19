
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PageHeader from '../components/Header';
import { 
    STUDENTS_DATA, 
    GRADES_DATA,
    SUBJECTS_DATA,
    CLASS_CURRICULUM_DATA,
    TUITION_DATA,
    CALENDAR_EVENTS_DATA
} from '../constants';
import { Card } from '../components/ui/Card';
import { ArrowLeftIcon, BookOpenIcon, CalendarDaysIcon, ChartPieIcon, CurrencyDollarIcon, UserCircleIcon } from '@heroicons/react/24/outline';
import { Button } from '../components/ui/Button';
import { GradeRecord, Subject, Tuition } from '../types';
import { Badge } from '../components/ui/Badge';
import { formatCurrency } from '../utils/formatters';

const InfoCard: React.FC<{ title: string; icon: React.ReactNode; children: React.ReactNode }> = ({ title, icon, children }) => (
    <Card>
        <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex items-center gap-3">
            <div className="text-reviva-green dark:text-reviva-green-light">{icon}</div>
            <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">{title}</h3>
        </div>
        <div className="p-4 md:p-6">{children}</div>
    </Card>
);

const StudentPortal: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const studentId = parseInt(id || '0');

    const student = STUDENTS_DATA.find(s => s.id === studentId);
    
    if (!student) {
        return (
            <div className="text-center py-10">
                <h2 className="text-2xl font-bold">Aluno não encontrado</h2>
                <Button onClick={() => navigate('/alunos')} className="mt-4">Voltar para a lista</Button>
            </div>
        );
    }
    
    // --- Data processing ---
    const studentGrades = GRADES_DATA.find(sg => sg.studentId === studentId);
    const subjectsForClass = CLASS_CURRICULUM_DATA
        .filter(c => c.classId === student.classId)
        .map(c => SUBJECTS_DATA.find(s => s.id === c.subjectId))
        .filter((s): s is Subject => s !== undefined);

    const pendingTuition = TUITION_DATA.filter(t => t.studentId === studentId && (t.status === 'Pendente' || t.status === 'Atrasado'));
    
    const upcomingEvents = CALENDAR_EVENTS_DATA.filter(event => {
        const eventDate = new Date(event.date);
        const isFuture = eventDate >= new Date();
        const isForClass = event.type === 'Prova' && event.classId === student.classId;
        const isGeneral = event.type !== 'Prova';
        return isFuture && (isForClass || isGeneral);
    }).sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 5);

    const calculateAverage = (gradeRecord: GradeRecord): string => {
        const notes = [gradeRecord.nota1, gradeRecord.nota2, gradeRecord.finalExam];
        const validNotes = notes.map(n => parseFloat(String(n))).filter(n => !isNaN(n) && n >= 0 && n <= 20);
        if (validNotes.length === 0) return '-';
        const sum = validNotes.reduce((acc, curr) => acc + curr, 0);
        return (sum / validNotes.length).toFixed(2);
    };

    const getStatusBadge = (status: Tuition['status']) => {
        switch (status) {
            case 'Pago': return <Badge variant="success">Pago</Badge>;
            case 'Pendente': return <Badge variant="warning">Pendente</Badge>;
            case 'Atrasado': return <Badge variant="destructive">Atrasado</Badge>;
        }
    };
    
    return (
        <>
            <div className="flex items-center mb-6">
                 <Button variant="ghost" size="icon" onClick={() => navigate('/alunos')} className="mr-2">
                    <ArrowLeftIcon className="h-6 w-6" />
                </Button>
                <PageHeader title={`Portal do Aluno: ${student.name}`} subtitle={`Visão consolidada para ${student.class}`} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content Column */}
                <div className="lg:col-span-2 space-y-8">
                    <InfoCard title="Desempenho Académico" icon={<BookOpenIcon className="h-6 w-6"/>}>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead className="text-left text-slate-600 dark:text-slate-400">
                                    <tr>
                                        <th className="p-2">Disciplina</th>
                                        <th className="p-2 text-center">Nota 1</th>
                                        <th className="p-2 text-center">Nota 2</th>
                                        <th className="p-2 text-center">Exame Final</th>
                                        <th className="p-2 text-center font-bold">Média</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {subjectsForClass.map(subject => {
                                        const grades = studentGrades?.gradesBySubject[subject.id];
                                        const average = grades ? calculateAverage(grades) : '-';
                                        const avgNum = parseFloat(average);
                                        const averageColor = isNaN(avgNum) ? '' : avgNum >= 10 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400';

                                        return (
                                            <tr key={subject.id} className="border-t border-slate-200 dark:border-slate-700">
                                                <td className="p-2 font-medium text-slate-800 dark:text-slate-200">{subject.name}</td>
                                                <td className="p-2 text-center">{grades?.nota1 || '-'}</td>
                                                <td className="p-2 text-center">{grades?.nota2 || '-'}</td>
                                                <td className="p-2 text-center">{grades?.finalExam || '-'}</td>
                                                <td className={`p-2 text-center font-bold text-lg ${averageColor}`}>{average}</td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </InfoCard>

                     <InfoCard title="Situação Financeira" icon={<CurrencyDollarIcon className="h-6 w-6"/>}>
                        {pendingTuition.length > 0 ? (
                             <ul className="space-y-3">
                                {pendingTuition.map(t => (
                                    <li key={t.id} className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                                        <div>
                                            <p className="font-semibold">Mensalidade de {t.month}</p>
                                            <p className="text-sm text-slate-500 dark:text-slate-400">Vencimento: {t.dueDate}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-bold">{formatCurrency(t.amount)}</p>
                                            {getStatusBadge(t.status)}
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                             <p className="text-center text-slate-500 dark:text-slate-400 py-4">Nenhuma mensalidade pendente.</p>
                        )}
                     </InfoCard>

                </div>

                {/* Sidebar Column */}
                <div className="space-y-8">
                    <InfoCard title="Dados do Aluno" icon={<UserCircleIcon className="h-6 w-6"/>}>
                        <div className="space-y-2 text-sm">
                            <p><strong>Idade:</strong> {student.age} anos</p>
                            <p><strong>Encarregado:</strong> {student.guardian}</p>
                            <p><strong>Telefone:</strong> {student.phone}</p>
                            <p><strong>Status:</strong> <Badge variant={student.status === 'Ativo' ? 'success' : 'default'}>{student.status}</Badge></p>
                        </div>
                    </InfoCard>
                    
                    <InfoCard title="Assiduidade (Simulado)" icon={<ChartPieIcon className="h-6 w-6"/>}>
                        <div className="flex justify-around text-center">
                            <div>
                                <p className="text-3xl font-bold text-green-500">96%</p>
                                <p className="text-sm text-slate-500 dark:text-slate-400">Presenças</p>
                            </div>
                            <div>
                                <p className="text-3xl font-bold text-red-500">4%</p>
                                <p className="text-sm text-slate-500 dark:text-slate-400">Faltas</p>
                            </div>
                        </div>
                         <p className="text-xs text-center mt-4 text-slate-400 dark:text-slate-500">Dados simulados para o trimestre atual.</p>
                    </InfoCard>

                    <InfoCard title="Próximos Eventos" icon={<CalendarDaysIcon className="h-6 w-6"/>}>
                         {upcomingEvents.length > 0 ? (
                             <ul className="space-y-3">
                                {upcomingEvents.map(event => (
                                    <li key={event.id} className="flex items-start gap-3">
                                        <div className="flex-shrink-0 text-center bg-slate-100 dark:bg-slate-700 rounded-md p-2 w-16">
                                            <p className="font-bold text-reviva-green dark:text-reviva-green-light text-lg">{new Date(event.date).toLocaleDateString('pt-MZ', { day: '2-digit' })}</p>
                                            <p className="text-xs">{new Date(event.date).toLocaleDateString('pt-MZ', { month: 'short' })}</p>
                                        </div>
                                        <div>
                                            <p className="font-semibold">{event.title}</p>
                                            <Badge variant={event.type === 'Prova' ? 'warning' : 'default'}>{event.type}</Badge>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                             <p className="text-center text-slate-500 dark:text-slate-400 py-4">Nenhum evento agendado.</p>
                        )}
                    </InfoCard>
                </div>
            </div>
        </>
    );
};

export default StudentPortal;
