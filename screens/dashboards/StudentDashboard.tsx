import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PageHeader from '../../components/Header';
import { Card } from '../../components/ui/Card';
import { BookOpenIcon, CalendarDaysIcon, ChartPieIcon, CurrencyDollarIcon, PlusIcon, BellIcon } from '@heroicons/react/24/outline';
import { Button } from '../../components/ui/Button';
import { GradeRecord, Subject, Tuition, HealthRecord, AnnouncementCategory, Student } from '../../types';
import { Badge } from '../../components/ui/Badge';
import { formatCurrency, calculateAverage } from '../../utils/formatters';
import { HeartIcon } from '../../components/icons';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { useCoreData } from '../../context/CoreDataContext';
import { useAcademicData } from '../../context/AcademicContext';
import { useFinancialData } from '../../context/FinancialContext';
import { useAdminData } from '../../context/AdminContext';
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
    const studentId = parseInt(id || '1');
    
    const { students, subjects, classCurriculum } = useCoreData();
    const { grades: gradesData, calendarEvents, attendance } = useAcademicData();
    const { tuition } = useFinancialData();
    const { healthRecords: allHealthRecords, announcements } = useAdminData();


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
        today.setHours(0,0,0,0);
        const isFuture = eventDate >= today;
        const isForClass = event.type === 'Prova' && event.classId === student.classId;
        const isGeneral = event.type !== 'Prova';
        return isFuture && (isForClass || isGeneral);
    }).sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 3);
    
    const studentAnnouncements = announcements.filter(a => a.target === 'Todos' || a.target === 'Pais' || a.target === student.class).slice(0, 3);

    const overallAverage = useMemo(() => {
        if (!studentGrades) return null;
        const subjectAverages = Object.values(studentGrades.gradesBySubject)
            .map(rec => calculateAverage(rec as GradeRecord))
            .filter((avg): avg is number => avg !== null);
        if (subjectAverages.length === 0) return null;
        const totalAverage = subjectAverages.reduce((a, b) => a + b, 0) / subjectAverages.length;
        return totalAverage.toFixed(2);
    }, [studentGrades]);

    const attendanceStats = useMemo(() => {
        const records = attendance.filter(a => a.studentId === studentId);
        const total = records.length;
        const present = records.filter(r => r.status === 'Presente').length;
        const absent = records.filter(r => r.status === 'Ausente').length;
        const justified = records.filter(r => r.status === 'Justificado').length;
        const rate = total > 0 ? (present / total) * 100 : 100;
        return { total, present, absent, justified, rate: rate.toFixed(0) };
    }, [attendance, studentId]);

    const handleSaveHealthRecord = (record: Omit<HealthRecord, 'id' | 'studentId' | 'recordedBy'>) => {
        const newRecord: HealthRecord = {
            ...record,
            id: Date.now(),
            studentId,
            recordedBy: 'Secretaria' // Mocked user
        };
        setHealthRecords(prev => [newRecord, ...prev]);
        // Here we would also call a context function to persist this data
        // updateHealthRecords(studentId, [newRecord, ...healthRecords]);
    };
    
    const categoryBadgeVariant = (cat: AnnouncementCategory) => {
        switch(cat) {
            case 'Urgente': return 'destructive' as const;
            case 'Evento': return 'warning' as const;
            case 'Informativo': return 'default' as const;
        }
    }

    return (
        <>
            <PageHeader title="Portal do Aluno" subtitle={`Bem-vindo ao portal de ${student.name}`} />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Grade Summary */}
                    <InfoCard title="Desempenho Académico" icon={<BookOpenIcon className="h-6 w-6"/>} actions={<Badge variant="success">{`Média Geral: ${overallAverage ?? 'N/A'}`}</Badge>}>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead className="text-left text-slate-600 dark:text-slate-400">
                                    <tr>
                                        <th className="p-2">Disciplina</th>
                                        <th className="p-2 text-center">Nota 1</th>
                                        <th className="p-2 text-center">Nota 2</th>
                                        <th className="p-2 text-center">Exame</th>
                                        <th className="p-2 text-center font-bold">Média</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {subjectsForClass.map(subject => {
                                        const grades = studentGrades?.gradesBySubject[subject.id];
                                        const average = calculateAverage(grades);
                                        const averageColor = !average ? '' : average >= 10 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400';

                                        return (
                                            <tr key={subject.id} className="border-t border-slate-200 dark:border-slate-700">
                                                <td className="p-2 font-medium text-slate-800 dark:text-slate-200">{subject.name}</td>
                                                <td className="p-2 text-center">{grades?.nota1 ?? '-'}</td>
                                                <td className="p-2 text-center">{grades?.nota2 ?? '-'}</td>
                                                <td className="p-2 text-center">{grades?.finalExam ?? '-'}</td>
                                                <td className={`p-2 text-center font-bold text-lg ${averageColor}`}>{average?.toFixed(2) ?? '-'}</td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </InfoCard>

                    {/* Financial Summary */}
                    <InfoCard title="Situação Financeira" icon={<CurrencyDollarIcon className="h-6 w-6"/>} actions={<Button onClick={() => navigate('/financeiro')}>Ver Detalhes</Button>}>
                         {pendingTuition.length > 0 ? (
                            <ul className="space-y-3">
                                {pendingTuition.map(t => (
                                    <li key={t.id} className="flex justify-between items-center p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                                        <div>
                                            <p className="font-semibold">Mensalidade de {t.month}</p>
                                            <p className="text-xs text-slate-500">Vencimento: {t.dueDate}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-bold text-red-600 dark:text-red-400">{formatCurrency(t.amount)}</p>
                                            <Badge variant="destructive">{t.status}</Badge>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                         ) : (
                            <p className="text-center text-green-600 dark:text-green-400 py-4 font-semibold">Sem pendências financeiras. Parabéns!</p>
                         )}
                    </InfoCard>
                    
                    {/* Announcements */}
                    <InfoCard title="Mural de Avisos" icon={<BellIcon className="h-6 w-6"/>}>
                         <div className="space-y-4">
                            {studentAnnouncements.map(a => (
                                <div key={a.id} className="border-b pb-3 dark:border-slate-700 last:border-b-0 last:pb-0">
                                    <div className="flex justify-between items-start">
                                        <h4 className="font-bold">{a.title}</h4>
                                        <Badge variant={categoryBadgeVariant(a.category)}>{a.category}</Badge>
                                    </div>
                                    <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">{a.content}</p>
                                </div>
                            ))}
                        </div>
                    </InfoCard>

                </div>

                {/* Sidebar */}
                <div className="space-y-8">
                    <ProfileCard 
                        name={student.name} 
                        imageUrl={student.photoUrl} 
                        details={{ Turma: student.class, Encarregado: student.guardian, Telefone: student.phone }}
                    />
                    
                    <InfoCard title="Assiduidade" icon={<ChartPieIcon className="h-6 w-6"/>}>
                        <div className="text-center">
                             <div className="text-4xl font-bold text-reviva-green">{attendanceStats.rate}%</div>
                             <p className="text-sm text-slate-500">de presença</p>
                             <div className="text-xs mt-2 grid grid-cols-3 gap-1">
                                <span><strong>{attendanceStats.present}</strong> Presente</span>
                                <span><strong>{attendanceStats.absent}</strong> Faltas</span>
                                <span><strong>{attendanceStats.justified}</strong> Just.</span>
                             </div>
                        </div>
                    </InfoCard>

                    <InfoCard title="Calendário Pessoal" icon={<CalendarDaysIcon className="h-6 w-6"/>}>
                        <ul className="space-y-3">
                            {upcomingEvents.map(event => (
                                <li key={event.id}>
                                    <p className="font-semibold">{event.title}</p>
                                    <p className="text-sm text-slate-500">{new Date(event.date).toLocaleDateString('pt-MZ', { day: '2-digit', month: 'long'})} - <Badge variant={event.type === 'Prova' ? 'warning' : 'default'}>{event.type}</Badge></p>
                                </li>
                            ))}
                        </ul>
                    </InfoCard>

                    <InfoCard title="Ficha de Saúde" icon={<HeartIcon className="h-6 w-6"/>} actions={<Button variant="secondary" size="sm" onClick={() => setHealthModalOpen(true)}><PlusIcon className="h-4 w-4 mr-1"/>Adicionar</Button>}>
                        {healthRecords.length > 0 ? (
                            <ul className="space-y-3">
                                {healthRecords.slice(0, 3).map(record => (
                                    <li key={record.id} className="text-sm">
                                        <p className="font-semibold">{new Date(record.date).toLocaleDateString('pt-MZ')}: <span className="font-normal">{record.description}</span></p>
                                        <p className="text-xs text-slate-500">Ação: {record.actionTaken}</p>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                             <p className="text-center text-slate-500 dark:text-slate-400 text-sm py-2">Nenhum registo de saúde.</p>
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
