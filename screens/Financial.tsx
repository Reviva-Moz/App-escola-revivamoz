

import React, { useState } from 'react';
import PageHeader from '../components/Header';
import StatCard from '../components/StatCard';
import DataTable from '../components/DataTable';
import CategoryPieChart from '../components/charts/CategoryPieChart';
import { formatCurrency } from '../utils/formatters';
import { FINANCIAL_SUMMARY, REVENUE_CATEGORIES, EXPENSE_CATEGORIES, ENROLLMENTS_DATA, TUITION_DATA } from '../constants';
import { ArrowTrendingUpIcon, ArrowTrendingDownIcon, ScaleIcon, CurrencyDollarIcon } from '@heroicons/react/24/outline';
import { Enrollment, Tuition } from '../types';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';

type Tab = 'dashboard' | 'revenues' | 'expenses' | 'enrollments' | 'tuition';

const FinancialDashboard: React.FC = () => (
    <div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
             <StatCard 
                icon={<ArrowTrendingUpIcon className="h-7 w-7 text-white" />}
                title="Total Receitas"
                value={formatCurrency(FINANCIAL_SUMMARY.totalRevenue)}
                colorClass="bg-emerald-500"
            />
            <StatCard 
                icon={<ArrowTrendingDownIcon className="h-7 w-7 text-white" />}
                title="Total Despesas"
                value={formatCurrency(FINANCIAL_SUMMARY.totalExpenses)}
                colorClass="bg-red-500"
            />
             <StatCard 
                icon={<ScaleIcon className="h-7 w-7 text-white" />}
                title="Saldo Atual"
                value={formatCurrency(FINANCIAL_SUMMARY.currentBalance)}
                colorClass="bg-reviva-green"
            />
             <StatCard 
                icon={<CurrencyDollarIcon className="h-7 w-7 text-white" />}
                title="Inadimplência"
                value={formatCurrency(FINANCIAL_SUMMARY.defaults)}
                colorClass="bg-amber-500"
            />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <CategoryPieChart title="Receitas Categorizadas" data={REVENUE_CATEGORIES} />
            <CategoryPieChart title="Despesas Categorizadas" data={EXPENSE_CATEGORIES} />
        </div>
    </div>
);

const getStatusBadge = (status: 'Pago' | 'Pendente' | 'Atrasado') => {
    switch (status) {
        case 'Pago': return <Badge variant="success">Pago</Badge>;
        case 'Pendente': return <Badge variant="warning">Pendente</Badge>;
        case 'Atrasado': return <Badge variant="destructive">Atrasado</Badge>;
    }
};

const Financial: React.FC = () => {
    const [activeTab, setActiveTab] = useState<Tab>('dashboard');
    
    const tabs: { id: Tab, label: string }[] = [
        { id: 'dashboard', label: 'Dashboard' },
        { id: 'revenues', label: 'Receitas' },
        { id: 'expenses', label: 'Despesas' },
        { id: 'enrollments', label: 'Matrículas' },
        { id: 'tuition', label: 'Mensalidades' },
    ];

    const renderContent = () => {
        switch (activeTab) {
            case 'dashboard':
                return <FinancialDashboard />;
            case 'revenues':
                return <DataTable title="Detalhes de Receitas" headers={['Categoria', 'Valor']} rows={REVENUE_CATEGORIES.map(r => [r.name, formatCurrency(r.amount)])} />;
            case 'expenses':
                return <DataTable title="Detalhes de Despesas" headers={['Categoria', 'Valor']} rows={EXPENSE_CATEGORIES.map(e => [e.name, formatCurrency(e.amount)])} />;
            case 'enrollments':
                return <DataTable title="Gestão de Matrículas" headers={['Aluno', 'Data', 'Valor', 'Desconto', 'Status', 'Ações']} rows={ENROLLMENTS_DATA.map((e: Enrollment) => [e.studentName, e.date, formatCurrency(e.amount), formatCurrency(e.discount), getStatusBadge(e.status), <Button variant="link">Gerar Recibo</Button>])} />;
            case 'tuition':
                 return <DataTable title="Gestão de Mensalidades" headers={['Aluno', 'Mês', 'Vencimento', 'Valor', 'Status', 'Ações']} rows={TUITION_DATA.map((t: Tuition) => [t.studentName, t.month, t.dueDate, formatCurrency(t.amount), getStatusBadge(t.status), <Button variant="link" className="text-amber-600 hover:text-amber-800">Enviar Alerta</Button>])} />;
            default:
                return null;
        }
    };
    
    return (
        <>
            <PageHeader title="Sistema Financeiro Completo" subtitle="Controle total sobre as finanças da escola" />
            <div className="mb-6 border-b border-slate-200 dark:border-slate-700">
                <nav className="-mb-px flex space-x-6 overflow-x-auto" aria-label="Tabs">
                    {tabs.map(tab => (
                         <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                            className={`${ activeTab === tab.id ? 'border-reviva-green text-reviva-green' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:border-slate-600' }
                            whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors focus:outline-none`}
                         >
                            {tab.label}
                        </button>
                    ))}
                </nav>
            </div>
            
            <div>
                {renderContent()}
            </div>
        </>
    );
};

export default Financial;