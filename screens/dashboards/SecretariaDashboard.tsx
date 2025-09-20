
import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../../components/Header';
import { useData } from '../../context/DataContext';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { PlusIcon, UserPlusIcon, UsersIcon, BookOpenIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { Badge } from '../../components/ui/Badge';
import QuickLinkCard from '../../components/dashboards/QuickLinkCard';

const SecretariaDashboard: React.FC = () => {
    const navigate = useNavigate();
    const { announcements } = useData();
    const [searchTerm, setSearchTerm] = useState('');

    const recentAnnouncements = useMemo(() => 
        announcements.slice(0, 3), 
    [announcements]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        // Numa app real, isto navegaria para uma página de resultados de pesquisa
        alert(`A pesquisar por: "${searchTerm}"... (funcionalidade a implementar)`);
    };

    const categoryBadgeVariant = (cat: any) => {
        switch(cat) {
            case 'Urgente': return 'destructive' as const;
            case 'Evento': return 'warning' as const;
            case 'Informativo': return 'default' as const;
        }
    };

    return (
        <>
            <PageHeader title="Dashboard da Secretaria" subtitle="Atalhos e informações para as suas tarefas diárias." />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <QuickLinkCard title="Cadastrar Aluno" icon={<UserPlusIcon />} onClick={() => navigate('/alunos/novo')} />
                <QuickLinkCard title="Cadastrar Professor" icon={<UserPlusIcon />} onClick={() => navigate('/professores/novo')} />
                <QuickLinkCard title="Criar Nova Turma" icon={<UsersIcon />} onClick={() => navigate('/turmas/novo')} />
                <QuickLinkCard title="Adicionar Disciplina" icon={<BookOpenIcon />} onClick={() => navigate('/disciplinas/novo')} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card>
                    <div className="p-4 border-b dark:border-slate-700">
                        <h3 className="text-lg font-semibold">Pesquisa Rápida</h3>
                    </div>
                    <form onSubmit={handleSearch} className="p-6">
                        <p className="mb-4 text-sm text-slate-600 dark:text-slate-400">Encontre rapidamente um aluno, professor ou colaborador.</p>
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
                     <div className="p-4 border-b dark:border-slate-700">
                        <h3 className="text-lg font-semibold">Comunicados Recentes</h3>
                    </div>
                     <div className="p-6 space-y-4">
                        {recentAnnouncements.map(ann => (
                            <div key={ann.id} className="border-b border-slate-200 dark:border-slate-700 pb-3 last:border-b-0">
                                <div className="flex justify-between items-start">
                                    <h4 className="font-semibold">{ann.title}</h4>
                                     <Badge variant={categoryBadgeVariant(ann.category)}>{ann.category}</Badge>
                                </div>
                                <p className="text-sm text-slate-500 dark:text-slate-400">Para: {ann.target}</p>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>
        </>
    );
};

export default SecretariaDashboard;
