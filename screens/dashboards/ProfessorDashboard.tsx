

import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../../components/Header';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { Card } from '../../components/ui/Card';
import ProfileCard from '../../components/dashboards/ProfileCard';
// FIX: Added UsersIcon to the import to resolve a compilation error.
import { CalendarDaysIcon, ClockIcon, UsersIcon } from '@heroicons/react/24/outline';
import { Badge } from '../../components/ui/Badge';

const InfoCard: React.FC<{ title: string; icon: React.ReactNode; children: React.ReactNode }> = ({ title, icon, children }) => (
    <Card>
        <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex items-center gap-3">
            <div className="text-reviva-green dark:text-reviva-green-light">{icon}</div>
            <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">{title}</h3>
        </div>
        <div className="p-4 md:p-6">{children}</div>
    </Card>
);

const ProfessorDashboard: React.FC = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const { teachers, classes, classCurriculum, lessonPlans, calendarEvents, subjects } = useData();
    
    // Simula a obtenção do professor logado. Numa app real, isto viria do user object.
    const loggedInTeacher = useMemo(() => 
        teachers.find(t => t.email.toLowerCase() === user?.email.toLowerCase()),
        [user, teachers]
    );

    const teacherClasses = useMemo(() => {
        if (!loggedInTeacher) return [];
        const teacherClassIds = new Set(
            classCurriculum.filter(cc => cc.teacherId === loggedInTeacher.id).map(cc => cc.classId)
        );
        return classes.filter(c => teacherClassIds.has(c.id));
    }, [loggedInTeacher, classCurriculum, classes]);

    const today = new Date().toISOString().split('T')[0];
    const todaysSchedule = useMemo(() => {
        if (!loggedInTeacher) return [];
        return lessonPlans
            .filter(lp => lp.date === today && classCurriculum.some(cc => cc.classId === lp.classId && cc.subjectId === lp.subjectId && cc.teacherId === loggedInTeacher.id))
            .map(lp => ({
                ...lp,
                className: classes.find(c => c.id === lp.classId)?.name || '',
                subjectName: subjects.find(s => s.id === lp.subjectId)?.name || ''
            }))
            .sort((a,b) => a.className.localeCompare(b.className));
    }, [loggedInTeacher, lessonPlans, today, classCurriculum, classes, subjects]);
    
    const upcomingTests = useMemo(() => {
        if (teacherClasses.length === 0) return [];
        const teacherClassIds = teacherClasses.map(c => c.id);
        return calendarEvents.filter(e => 
            e.type === 'Prova' && 
            e.classId && 
            teacherClassIds.includes(e.classId) && 
            new Date(e.date) >= new Date()
        ).slice(0, 5);
    }, [teacherClasses, calendarEvents]);

    if (!loggedInTeacher) {
        return (
             <PageHeader 
                title="Bem-vindo(a)!" 
                subtitle="Não foi possível encontrar os seus dados de professor. Contacte o administrador." 
            />
        );
    }

    return (
        <>
            <PageHeader title={`Bem-vindo(a), ${loggedInTeacher.name.split(' ')[0]}!`} subtitle="Aqui está um resumo do seu dia e das suas atividades." />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-8">
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
                    
                    <InfoCard title="Próximas Avaliações Agendadas" icon={<CalendarDaysIcon className="h-6 w-6"/>}>
                         {upcomingTests.length > 0 ? (
                             <ul className="space-y-3">
                                {upcomingTests.map(event => (
                                    <li key={event.id} className="flex items-start gap-3">
                                        <div className="flex-shrink-0 text-center bg-slate-100 dark:bg-slate-700 rounded-md p-2 w-16">
                                            <p className="font-bold text-reviva-green dark:text-reviva-green-light text-lg">{new Date(event.date).toLocaleDateString('pt-MZ', { day: '2-digit' })}</p>
                                            <p className="text-xs">{new Date(event.date).toLocaleDateString('pt-MZ', { month: 'short' })}</p>
                                        </div>
                                        <div>
                                            <p className="font-semibold">{event.title}</p>
                                            <Badge variant='warning'>{classes.find(c => c.id === event.classId)?.name}</Badge>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                             <p className="text-center text-slate-500 dark:text-slate-400 py-4">Nenhuma avaliação agendada.</p>
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
                                    <li key={c.id} className="p-2 bg-slate-50 dark:bg-slate-700/50 rounded-md text-center font-semibold hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer" onClick={() => navigate(`/turmas/${c.id}/detalhes`)}>
                                        {c.name}
                                    </li>
                                ))}
                            </ul>
                        ) : (
                             <p className="text-center text-slate-500 dark:text-slate-400 py-4">Nenhuma turma atribuída.</p>
                        )}
                    </InfoCard>
                </div>
            </div>
        </>
    );
};

export default ProfessorDashboard;