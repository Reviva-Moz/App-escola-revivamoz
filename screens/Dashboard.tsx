
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import PageHeader from '../components/Header';
import StatCard from '../components/StatCard';
import { UsersIcon, CheckCircleIcon, CurrencyDollarIcon, ArrowTrendingUpIcon, ArrowTrendingDownIcon, ScaleIcon } from '@heroicons/react/24/outline';
import { TOTAL_STUDENTS, TOTAL_TEACHERS, APPROVAL_RATE, FINANCIAL_SUMMARY, CLASS_DISTRIBUTION_DATA } from '../constants';
import { formatCurrency } from '../utils/formatters';
import { Card } from '../components/ui/Card';
import { useTheme } from '../context/ThemeContext';

const Dashboard: React.FC = () => {
  const { theme } = useTheme();
  const tickColor = theme === 'dark' ? '#94a3b8' : '#475569';

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
          details="Margem: 62%"
          colorClass="bg-reviva-green"
        />
      </div>

       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <StatCard 
            icon={<ArrowTrendingUpIcon className="h-7 w-7 text-white" />}
            title="Total Receitas"
            value={formatCurrency(FINANCIAL_SUMMARY.totalRevenue)}
            details="+8% vs mês anterior"
            colorClass="bg-emerald-500"
          />
          <StatCard 
            icon={<ArrowTrendingDownIcon className="h-7 w-7 text-white" />}
            title="Total Despesas"
            value={formatCurrency(FINANCIAL_SUMMARY.totalExpenses)}
            details="-2% vs mês anterior"
            colorClass="bg-red-500"
          />
          <StatCard 
            icon={<CurrencyDollarIcon className="h-7 w-7 text-white" />}
            title="Inadimplência"
            value={formatCurrency(FINANCIAL_SUMMARY.defaults)}
            details="1 aluno em atraso"
            colorClass="bg-amber-500"
          />
      </div>


      {/* Class Distribution Chart */}
      <Card>
        <div className="p-4 sm:p-6">
            <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-200 mb-4">Distribuição de Alunos por Classe</h3>
            <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
                <BarChart
                data={CLASS_DISTRIBUTION_DATA}
                margin={{ top: 5, right: 20, left: -10, bottom: 5 }}
                >
                <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
                <XAxis dataKey="name" tick={{ fontSize: 12, fill: tickColor }} />
                <YAxis tickFormatter={(value) => `${value}`} tick={{ fill: tickColor }} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(128, 128, 128, 0.1)' }} />
                <Legend wrapperStyle={{ color: tickColor }} />
                <Bar dataKey="Alunos" fill="#2d5a27" />
                </BarChart>
            </ResponsiveContainer>
            </div>
        </div>
      </Card>
    </>
  );
};

export default Dashboard;