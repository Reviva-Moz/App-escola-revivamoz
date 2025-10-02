

import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../../components/Header';
import { useData } from '../../context/DataContext';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { PlusIcon, UserPlusIcon, UsersIcon, BookOpenIcon, MagnifyingGlassIcon, BellIcon, CurrencyDollarIcon } from '@heroicons/react/24/outline';
import { Badge } from '../../components/ui/Badge';
import QuickLinkCard from '../../components/dashboards/QuickLinkCard';
import StatCard from '../../components/StatCard';

const SecretariaDashboard: React.FC = () => {
    const navigate = useNavigate();
    const { announcements, students, activities, calendarEvents } = useData();
    const [searchTerm, setSearchTerm] = useState('');

    const upcomingEvents = calendarEvents.filter(e => new Date(e.date) >= new Date()).slice(0, 4);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        alert(`A pesquisar por: "${searchTerm}"... (funcionalidade a implementar)`);
    };
    
    const ActivityIcon = ({ type }: { type: string }) => {
        const iconClass = "h-5 w-5";
        switch(type) {
          case 'new_student': return <UserPlusIcon className={iconClass} />;
          case 'payment': return <CurrencyDollarIcon className={iconClass} />;
          case 'announcement': return <BellIcon className={iconClass} />;
          default: return <UserPlusIcon className={iconClass} />;
        }
    };

    return (
        <>
            <PageHeader title="Dashboard da Secretaria" subtitle="Atalhos e informações para as suas tarefas diárias." />
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                 <StatCard 
                    icon={<UserPlusIcon className="h-7 w-7 text-white" />}
                    title="Novas Matrículas (Mês)"
                    value="12" // Mocked data
                    colorClass="bg-emerald-500"
                />
                <StatCard 
                    icon={<UsersIcon className="h-7 w-7 text-white" />}
                    title="Alunos Ativos"
                    value={students.filter(s => s.status === 'Ativo').length.toString()}
                    colorClass="bg-blue-500"
                />
                 <StatCard 
                    icon={<BookOpenIcon className="h-7 w-7 text-white" />}
                    title="Documentos Pendentes"
                    value="8" // Mocked data
                    colorClass="bg-amber-500"
                />
                 <StatCard 
                    icon={<BellIcon className="h-7 w-7 text-white" />}
                    title="Anúncios Publicados"
                    value={announcements.length.toString()}
                    colorClass="bg-indigo-500"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-2">
                    <Card>
                        <div className="p-4 border-b dark:border-slate-700 flex justify-between items-center">
                            <h3 className="text-lg font-semibold">Atividade Recente</h3>
                            <Button variant="secondary" onClick={() => navigate('/alunos/novo')}>
                                <PlusIcon className="h-4 w-4 mr-2"/> Nova Matrícula
                            </Button>
                        </div>
                         <div className="p-6 space-y-4 max-h-96 overflow-y-auto">
                            {activities.map(act => (
                                <div key={act.id} className="flex gap-4 items-start">
                                <div className="text-reviva-green dark:text-reviva-green-light mt-1 bg-slate-100 dark:bg-slate-700 p-2 rounded-full"><ActivityIcon type={act.type}/></div>
                                <div>
                                    <p className="text-sm font-medium">{act.description}</p>
                                    <p className="text-xs text-slate-500">{new Date(act.date).toLocaleString('pt-MZ', {dateStyle: 'short', timeStyle: 'short'})}</p>
                                </div>
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>

                {/* Sidebar */}
                <div className="space-y-8">
                    <Card>
                        <div className="p-4 border-b dark:border-slate-700">
                            <h3 className="text-lg font-semibold">Pesquisa Rápida</h3>
                        </div>
                        <form onSubmit={handleSearch} className="p-6">
                            <p className="mb-4 text-sm text-slate-600 dark:text-slate-400">Encontre um aluno, professor ou colaborador.</p>
                            <div className="flex gap-2">
                                <Input 
                                    id="search-all" 
                                    placeholder="Digite o nome..." 
                                    value={searchTerm} 
                                    onChange={e => setSearchTerm(e.target.value)}
                                />
                                <Button type="submit" size="icon" aria-label="Pesquisar">
                                    <MagnifyingGlassIcon className="h-5 w-5"/>
                                </Button>
                            </div>
                        </form>
                    </Card>
                    <Card>
                        <div className="p-4 border-b dark:border-slate-700"><h3 className="text-lg font-semibold">Próximos Eventos</h3></div>
                        <div className="p-4 space-y-3">
                        {upcomingEvents.map(event => (
                            <div key={event.id}>
                            <p className="font-semibold">{event.title}</p>
                            <p className="text-sm text-slate-500">{new Date(event.date).toLocaleDateString('pt-MZ', {weekday: 'long', day: '2-digit', month: 'long'})}</p>
                            </div>
                        ))}
                        <Button variant="link" size="sm" onClick={() => navigate('/calendario')}>Ver calendário completo</Button>
                        </div>
                    </Card>
                </div>
            </div>
        </>
    );
};

export default SecretariaDashboard;