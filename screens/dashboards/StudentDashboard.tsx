

import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PageHeader from '../../components/Header';
import { Card } from '../../components/ui/Card';
import { ArrowLeftIcon, BookOpenIcon, CalendarDaysIcon, ChartPieIcon, CurrencyDollarIcon, PlusIcon } from '@heroicons/react/24/outline';
import { Button } from '../../components/ui/Button';
import { GradeRecord, Subject, Tuition, HealthRecord } from '../../types';
import { Badge } from '../../components/ui/Badge';
import { formatCurrency } from '../../utils/formatters';
import { HeartIcon } from '../../components/icons';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { useData } from '../../context/DataContext';
import ProfileCard from '../../components/dashboards/ProfileCard';

const InfoCard: React.FC<{ title: string; icon: React.ReactNode; children: React.ReactNode; actions?: React.ReactNode }> = ({ title, icon, children, actions }) => (
    <Card>
        <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
            <div className="flex items-center gap-3">
                <div className="text-reviva-green dark:text-reviva-green-light">{icon}</div>
                <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">{title}</h3>
            </div>
            {actions && <div>{actions}</div>}
        </div>
        <div className="p-4 md:p-6">{children}</div>
    </Card>
);

const HealthRecordModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    onSave: (record: Omit<HealthRecord, 'id' | 'studentId' | 'recordedBy'>) => void;
}> = ({ isOpen, onClose, onSave }) => {
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [description, setDescription] = useState('');
    const [actionTaken, setActionTaken] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({ date, description, actionTaken });
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Adicionar Ocorrência de Saúde">
            <form onSubmit={handleSubmit} className="space-y-4">
                <Input id="health-date" label="Data da Ocorrência" type="date" value={date} onChange={e => setDate(e.target.value)} required />
                <div>
                    <label htmlFor="health-description" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Descrição da Ocorrência</label>
                    <textarea id="health-description" rows={3} value={description} onChange={e => setDescription(e.target.value)} className="w-full p-2 border rounded-lg dark:bg-slate-700 dark:border-slate-600" required />
                </div>
                 <div>
                    <label htmlFor="health-action" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Ação Tomada</label>
                    <textarea id="health-action" rows={3} value={actionTaken} onChange={e => setActionTaken(e.target.value)} className="w-full p-2 border rounded-lg dark:bg-slate-700 dark:border-slate-600" required />
                </div>
                <div className="flex justify-end gap-4 pt-4">
                    <Button type="button" variant="secondary" onClick={onClose}>Cancelar</Button>
                    <Button type="submit">Salvar Registo</Button>
                </div>
            </form>
        </Modal>
    );
};

const StudentDashboard: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    
    // Numa app real, o ID viria do contexto do utilizador. Para demo, usamos o da URL ou um fallback.
    const studentId = parseInt(id || '1');
    
    const { 
        students, 
        grades: gradesData,
        subjects,
        classCurriculum,
        tuition,
        calendarEvents,
        healthRecords: allHealthRecords
    } = useData();

    const [healthRecords, setHealthRecords] = useState(() => allHealthRecords.filter(r => r.studentId === studentId));
    const [isHealthModalOpen, setHealthModalOpen] = useState(false);

    const student = students.find(s => s.id === studentId);
    
    if (!student) {
        return (
            <div className="text-center py-10">
                <h2 className="text-2xl font-bold">Aluno não encontrado</h2>
                <Button onClick={() => navigate('/alunos')} className="mt-4">Voltar para a lista</Button>
            </div>
        );
    }
    
    // --- Data processing ---
    const studentGrades = gradesData.find(sg => sg.studentId === studentId);
    const subjectsForClass = classCurriculum
        .filter(c => c.classId === student.classId)
        .map(c => subjects.find(s => s.id === c.subjectId))
        .filter((s): s is Subject => s !== undefined);

    const pendingTuition = tuition.filter(t => t.studentId === studentId && (t.status === 'Pendente' || t.status === 'Atrasado'));
    
    const upcomingEvents = calendarEvents.filter(event => {
        const eventDate = new Date(event.date);
        const today = new Date();
        today.setHours(0,0,0,0); // Compare dates only
        const isFuture = eventDate >= today;
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

    const handleSaveHealthRecord = (record: Omit<HealthRecord, 'id' | 'studentId' | 'recordedBy'>) => {
        const newRecord: HealthRecord = {
            ...record,
            id: Date.now(),
            studentId,
            recordedBy: 'Sónia Pereira', // Logged-in user
        };
        // TODO: Call context function
        setHealthRecords(prev => [newRecord, ...prev]);
    };
    
    return (
        <>
            <PageHeader title={`Portal do Aluno`} subtitle={`Visão consolidada para o percurso académico.`} />

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
                     
                      <InfoCard 
                        title="Registo de Saúde" 
                        icon={<HeartIcon className="h-6 w-6"/>}
                        actions={<Button size="sm" onClick={() => setHealthModalOpen(true)}><PlusIcon className="h-4 w-4 mr-1"/> Adicionar</Button>}
                      >
                         {healthRecords.length > 0 ? (
                             <div className="space-y-4 max-h-64 overflow-y-auto pr-2">
                                {healthRecords.map(rec => (
                                    <div key={rec.id} className="p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg text-sm">
                                        <div className="flex justify-between items-center mb-1">
                                            <p className="font-bold">{new Date(rec.date).toLocaleDateString('pt-MZ', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
                                            <p className="text-xs text-slate-500">Por: {rec.recordedBy}</p>
                                        </div>
                                        <p><span className="font-semibold">Ocorrência:</span> {rec.description}</p>
                                        <p><span className="font-semibold">Ação Tomada:</span> {rec.actionTaken}</p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                             <p className="text-center text-slate-500 dark:text-slate-400 py-4">Nenhum registo de saúde encontrado.</p>
                        )}
                     </InfoCard>

                </div>

                {/* Sidebar Column */}
                <div className="space-y-8">
                    <ProfileCard 
                        name={student.name}
                        imageUrl={student.photoUrl}
                        details={{
                            Turma: student.class,
                            Idade: `${student.age} anos`,
                            Encarregado: student.guardian,
                            Telefone: student.phone
                        }}
                    />
                    
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

            <HealthRecordModal
                isOpen={isHealthModalOpen}
                onClose={() => setHealthModalOpen(false)}
                onSave={handleSaveHealthRecord}
            />
        </>
    );
};

export default StudentDashboard;
