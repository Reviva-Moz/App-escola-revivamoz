

import React from 'react';
import { NavLink } from 'react-router-dom';
import PageHeader from '../../components/Header';
import StatCard from '../../components/StatCard';
import { UsersIcon, CheckCircleIcon, CurrencyDollarIcon, ScaleIcon, LinkIcon, CalendarDaysIcon, UserPlusIcon, BellIcon, PresentationChartLineIcon } from '@heroicons/react/24/outline';
import { TOTAL_STUDENTS, TOTAL_TEACHERS, APPROVAL_RATE, FINANCIAL_SUMMARY, CLASS_DISTRIBUTION_DATA } from '../../constants';
import { formatCurrency } from '../../utils/formatters';
import { Card } from '../../components/ui/Card';
import { useTheme } from '../../context/ThemeContext';
import { useData } from '../../context/DataContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';

const AdminDiretoriaDashboard: React.FC = () => {
  const { theme } = useTheme();
  const { tuition, activities, calendarEvents } = useData();
  const tickColor = theme === 'dark' ? '#94a3b8' : '#475569';

  const overdueTuition = tuition.filter(t => t.status === 'Atrasado');
  const upcomingEvents = calendarEvents.filter(e => new Date(e.date) >= new Date()).slice(0, 4);

  const ActivityIcon = ({ type }: { type: string }) => {
    const iconClass = "h-5 w-5";
    switch(type) {
      case 'new_student': return <UserPlusIcon className={iconClass} />;
      case 'payment': return <CurrencyDollarIcon className={iconClass} />;
      case 'announcement': return <BellIcon className={iconClass} />;
      default: return <UserPlusIcon className={iconClass} />;
    }
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-slate-700 p-2 border border-slate-200 dark:border-slate-600 rounded shadow-sm">
          <p className="label font-semibold text-slate-800 dark:text-slate-200">{`${label}`}</p>
          <p className="intro text-reviva-green">{`Alunos : ${payload[0].value}`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <>
      <PageHeader title="Dashboard Principal" subtitle="Visão geral e estatísticas da Escola Reviva" />
      
      {/* General & Financial Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard 
          icon={<UsersIcon className="h-7 w-7 text-white" />}
          title="Total de Alunos"
          value={TOTAL_STUDENTS.toString()}
          colorClass="bg-blue-500"
        />
        <StatCard 
          icon={<UsersIcon className="h-7 w-7 text-white" />}
          title="Total de Professores"
          value={TOTAL_TEACHERS.toString()}
          colorClass="bg-indigo-500"
        />
        <StatCard 
          icon={<CheckCircleIcon className="h-7 w-7 text-white" />}
          title="Taxa de Aprovação"
          value={`${APPROVAL_RATE}%`}
          colorClass="bg-green-500"
        />
         <StatCard 
          icon={<ScaleIcon className="h-7 w-7 text-white" />}
          title="Saldo Atual"
          value={formatCurrency(FINANCIAL_SUMMARY.currentBalance)}
          colorClass="bg-reviva-green"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          <Card>
            <div className="p-4 sm:p-6">
                <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-200 mb-4">Distribuição de Alunos por Classe</h3>
                <div style={{ width: '100%', height: 300 }}>
                <ResponsiveContainer>
                    <BarChart data={CLASS_DISTRIBUTION_DATA} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
                      <XAxis dataKey="name" tick={{ fontSize: 12, fill: tickColor }} />
                      <YAxis tick={{ fill: tickColor }} />
                      <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(128, 128, 128, 0.1)' }} />
                      <Bar dataKey="Alunos" fill="#387a3d" />
                    </BarChart>
                </ResponsiveContainer>
                </div>
            </div>
          </Card>
          
          <Card>
            <div className="p-4 border-b dark:border-slate-700"><h3 className="text-lg font-semibold">Resumo de Inadimplência</h3></div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-slate-600 dark:text-slate-400">
                    <th className="p-3 font-medium">Aluno</th>
                    <th className="p-3 font-medium">Mês</th>
                    <th className="p-3 font-medium">Valor</th>
                  </tr>
                </thead>
                <tbody>
                  {overdueTuition.map(t => (
                    <tr key={t.id} className="border-t dark:border-slate-700">
                      <td className="p-3 font-semibold">{t.studentName}</td>
                      <td className="p-3">{t.month}</td>
                      <td className="p-3 text-red-600 dark:text-red-400 font-bold">{formatCurrency(t.amount)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
        
        {/* Sidebar Content */}
        <div className="lg:col-span-1 space-y-8">
          <Card>
            <div className="p-4 border-b dark:border-slate-700"><h3 className="text-lg font-semibold">Atalhos Rápidos</h3></div>
            <div className="p-4 space-y-2">
              <NavLink to="/alunos/novo" className="flex items-center gap-3 p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700"><UserPlusIcon className="h-5 w-5 text-reviva-green"/><span>Cadastrar Aluno</span></NavLink>
              <NavLink to="/financeiro" className="flex items-center gap-3 p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700"><CurrencyDollarIcon className="h-5 w-5 text-reviva-green"/><span>Ver Financeiro</span></NavLink>
              <NavLink to="/relatorios" className="flex items-center gap-3 p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700"><PresentationChartLineIcon className="h-5 w-5 text-reviva-green"/><span>Gerar Relatórios</span></NavLink>
              <NavLink to="/comunicacao" className="flex items-center gap-3 p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700"><BellIcon className="h-5 w-5 text-reviva-green"/><span>Enviar Comunicado</span></NavLink>
            </div>
          </Card>

          <Card>
            <div className="p-4 border-b dark:border-slate-700"><h3 className="text-lg font-semibold">Atividade Recente</h3></div>
            <div className="p-4 space-y-4">
              {activities.map(act => (
                <div key={act.id} className="flex gap-3">
                  <div className="text-reviva-green dark:text-reviva-green-light mt-1"><ActivityIcon type={act.type}/></div>
                  <div>
                    <p className="text-sm">{act.description}</p>
                    <p className="text-xs text-slate-500">{new Date(act.date).toLocaleString('pt-MZ', {dateStyle: 'short', timeStyle: 'short'})}</p>
                  </div>
                </div>
              ))}
            </div>
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
              <Button variant="link" size="sm" onClick={() => (window.location.hash = '/calendario')}>Ver calendário completo</Button>
            </div>
          </Card>
        </div>
      </div>
    </>
  );
};

export default AdminDiretoriaDashboard;