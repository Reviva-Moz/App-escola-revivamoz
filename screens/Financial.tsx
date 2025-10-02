

import React, { useState, useMemo, useEffect } from 'react';
import PageHeader from '../components/Header';
import StatCard from '../components/StatCard';
import DataTable from '../components/DataTable';
import CategoryPieChart from '../components/charts/CategoryPieChart';
import KanbanBoard from '../components/KanbanBoard';
import { formatCurrency } from '../utils/formatters';
import { 
    FINANCIAL_SUMMARY, REVENUE_CATEGORIES, EXPENSE_CATEGORIES, ENROLLMENTS_DATA, PAYMENT_METHODS_DATA
} from '../constants';
import { ArrowTrendingUpIcon, ArrowTrendingDownIcon, ScaleIcon, CurrencyDollarIcon, PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { Enrollment, Tuition, Category, Scholarship, Transaction, PaymentMethod, MessageTemplate } from '../types';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Card } from '../components/ui/Card';
import { useData } from '../context/DataContext';
import SendReminderModal from '../components/SendReminderModal';
import SchedulingModal from '../components/SchedulingModal';

type Tab = 'dashboard' | 'transactions' | 'cashier' | 'enrollments' | 'tuition' | 'kanban' | 'scholarships' | 'categories' | 'paymentMethods' | 'messageTemplates';

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

const DailyCashier: React.FC<{ transactions: Transaction[], categories: Category[] }> = ({ transactions, categories }) => {
    const todayStr = new Date().toISOString().split('T')[0];
    const [selectedDate, setSelectedDate] = useState(todayStr);

    const cashTransactions = useMemo(() =>
        transactions.filter(t => t.paymentMethod === 'Dinheiro' && t.date === selectedDate)
    , [transactions, selectedDate]);
    
    const dailyIncome = useMemo(() => cashTransactions.filter(t => t.type === 'Receita').reduce((sum, t) => sum + t.amount, 0), [cashTransactions]);
    const dailyExpense = useMemo(() => cashTransactions.filter(t => t.type === 'Despesa').reduce((sum, t) => sum + t.amount, 0), [cashTransactions]);
    const dailyBalance = dailyIncome - dailyExpense;

    const rows = cashTransactions.map(t => {
        const category = categories.find(c => c.id === t.categoryId);
        return [
            t.description,
            category?.name || 'N/A',
            <Badge variant={t.type === 'Receita' ? 'success' : 'destructive'}>{t.type}</Badge>,
            <span className={`font-bold ${t.type === 'Receita' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                {t.type === 'Receita' ? '+' : '-'} {formatCurrency(t.amount)}
            </span>
        ];
    });

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
                 <DataTable title={`Movimentos do dia ${new Date(selectedDate + 'T00:00:00').toLocaleDateString('pt-MZ')}`} headers={['Descrição', 'Categoria', 'Tipo', 'Valor']} rows={rows} />
            </div>
            <div>
                <Card>
                    <div className="p-4 border-b dark:border-slate-700">
                        <h3 className="text-lg font-semibold">Resumo do Caixa</h3>
                    </div>
                     <div className="p-6 space-y-4">
                         <div>
                            <label htmlFor="cashier-date" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Selecionar Data</label>
                            <Input id="cashier-date" type="date" value={selectedDate} onChange={e => setSelectedDate(e.target.value)} />
                        </div>
                        <div className="space-y-3 pt-4">
                             <div className="flex justify-between items-center text-lg">
                                <span className="text-slate-600 dark:text-slate-300">Total Entradas:</span>
                                <span className="font-bold text-green-600 dark:text-green-400">{formatCurrency(dailyIncome)}</span>
                            </div>
                             <div className="flex justify-between items-center text-lg">
                                <span className="text-slate-600 dark:text-slate-300">Total Saídas:</span>
                                <span className="font-bold text-red-600 dark:text-red-400">{formatCurrency(dailyExpense)}</span>
                            </div>
                             <div className="flex justify-between items-center text-xl pt-2 border-t dark:border-slate-600">
                                <span className="font-semibold text-slate-800 dark:text-slate-100">Saldo do Dia:</span>
                                <span className="font-extrabold text-reviva-green">{formatCurrency(dailyBalance)}</span>
                            </div>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
};

const PaymentMethodsManagement: React.FC = () => {
    const [methods, setMethods] = useState<PaymentMethod[]>(PAYMENT_METHODS_DATA);
    
    const rows = methods.map(method => [
        <span className="font-medium text-slate-800 dark:text-slate-200">{method.name}</span>,
        method.type,
        method.instructions,
        <Badge variant={method.status === 'Ativo' ? 'success' : 'default'}>{method.status}</Badge>,
        <div className="flex">
            <Button variant="link" size="sm"><PencilIcon className="h-4 w-4 mr-1"/>Editar</Button>
            <Button variant="link" size="sm" className="text-red-500"><TrashIcon className="h-4 w-4 mr-1"/>Remover</Button>
        </div>
    ]);

    return (
        <Card>
            <div className="p-4 flex justify-between items-center">
                <h3 className="text-lg font-semibold">Métodos de Pagamento</h3>
                <Button><PlusIcon className="h-5 w-5 mr-2"/>Novo Método</Button>
            </div>
            <DataTable 
                headers={['Nome', 'Tipo', 'Instruções', 'Status', 'Ações']}
                rows={rows} 
                title=""
            />
        </Card>
    );
};


const getStatusBadge = (status: 'Pago' | 'Pendente' | 'Atrasado' | 'Em Cobrança') => {
    switch (status) {
        case 'Pago': return <Badge variant="success">Pago</Badge>;
        case 'Pendente': return <Badge variant="warning">Pendente</Badge>;
        case 'Atrasado': return <Badge variant="destructive">Atrasado</Badge>;
        case 'Em Cobrança': return <Badge variant="info">Em Cobrança</Badge>;
    }
};

const TransactionLedger: React.FC<{
    onEdit: (transaction: Transaction) => void;
    onDelete: (id: number) => void;
    onAdd: () => void;
}> = ({ onEdit, onDelete, onAdd }) => {
    const { transactions, categories } = useData();
    const transactionRows = transactions.map(t => {
        const category = categories.find(c => c.id === t.categoryId);
        return [
            new Date(t.date).toLocaleDateString('pt-MZ'),
            t.description,
            category?.name || 'Sem Categoria',
            <Badge variant={t.type === 'Receita' ? 'success' : 'destructive'}>{t.type}</Badge>,
            t.paymentMethod || 'N/D',
            <span className={`font-bold ${t.type === 'Receita' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                {t.type === 'Receita' ? '+' : '-'} {formatCurrency(t.amount)}
            </span>,
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-1">
                <Button variant="link" size="sm" onClick={() => onEdit(t)}><PencilIcon className="h-4 w-4 mr-1"/>Editar</Button>
                <Button variant="link" size="sm" className="text-red-500" onClick={() => onDelete(t.id)}><TrashIcon className="h-4 w-4 mr-1"/>Remover</Button>
            </div>
        ]
    });

    return (
        <Card>
            <div className="p-4 flex justify-between items-center">
                <h3 className="text-lg font-semibold">Livro-Razão Financeiro</h3>
                <Button onClick={onAdd}><PlusIcon className="h-5 w-5 mr-2"/>Nova Transação</Button>
            </div>
            <DataTable 
                headers={['Data', 'Descrição', 'Categoria', 'Tipo', 'Método', 'Valor', 'Ações']}
                rows={transactionRows} 
                title=""
            />
        </Card>
    );
};

const CategoryManagement: React.FC<{
    onEdit: (category: Category) => void;
    onDelete: (id: number) => void;
    onAdd: (type: Category['type']) => void;
}> = ({ onEdit, onDelete, onAdd }) => {
    const { categories } = useData();
    const renderRows = (type: Category['type']) => {
        return categories
            .filter(c => c.type === type)
            .map(c => [
                c.name,
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-1">
                    <Button variant="link" size="sm" onClick={() => onEdit(c)}><PencilIcon className="h-4 w-4 mr-1"/>Editar</Button>
                    <Button variant="link" size="sm" className="text-red-500" onClick={() => onDelete(c.id)}><TrashIcon className="h-4 w-4 mr-1"/>Remover</Button>
                </div>
            ]);
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
                 <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-semibold">Categorias de Receita</h3>
                    <Button onClick={() => onAdd('Receita')}><PlusIcon className="h-5 w-5 mr-2"/>Adicionar</Button>
                </div>
                <DataTable title="" headers={['Nome', 'Ações']} rows={renderRows('Receita')} />
            </div>
            <div>
                 <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-semibold">Categorias de Despesa</h3>
                    <Button onClick={() => onAdd('Despesa')}><PlusIcon className="h-5 w-5 mr-2"/>Adicionar</Button>
                </div>
                <DataTable title="" headers={['Nome', 'Ações']} rows={renderRows('Despesa')} />
            </div>
        </div>
    );
};

const ScholarshipManagement: React.FC<{
    onEdit: (scholarship: Scholarship) => void;
    onDelete: (id: number) => void;
    onAdd: () => void;
}> = ({ onEdit, onDelete, onAdd }) => {
    const { scholarships, studentScholarships } = useData();
    const studentCount = (scholarshipId: number) => {
        return studentScholarships.filter(ss => ss.scholarshipId === scholarshipId).length;
    };
    
    const scholarshipRows = scholarships.map(s => [
        <span className="font-medium text-slate-800 dark:text-slate-200">{s.name}</span>,
        s.type,
        s.type === 'Percentagem' ? `${s.value}%` : formatCurrency(s.value),
        `${studentCount(s.id)} Alunos`,
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
            <Button variant="link" size="sm" onClick={() => onEdit(s)}><PencilIcon className="h-4 w-4 mr-1"/>Editar</Button>
            <Button variant="link" size="sm" className="text-reviva-green"><PlusIcon className="h-4 w-4 mr-1"/>Atribuir</Button>
            <Button variant="link" size="sm" className="text-red-500" onClick={() => onDelete(s.id)}><TrashIcon className="h-4 w-4 mr-1"/>Remover</Button>
        </div>
    ]);
    
    return (
        <Card>
            <div className="p-4 flex justify-between items-center">
                <h3 className="text-lg font-semibold">Bolsas de Estudo Cadastradas</h3>
                <Button onClick={onAdd}><PlusIcon className="h-5 w-5 mr-2"/>Criar Bolsa</Button>
            </div>
            <DataTable headers={['Nome da Bolsa', 'Tipo', 'Valor/Percentagem', 'Beneficiários', 'Ações']} rows={scholarshipRows} title=""/>
        </Card>
    );
};


const Financial: React.FC = () => {
    const {
        transactions, categories, scholarships, students, tuition, studentScholarships, messageTemplates: initialTemplates
    } = useData();

    const [activeTab, setActiveTab] = useState<Tab>('dashboard');
    const [messageTemplates, setMessageTemplates] = useState<MessageTemplate[]>(initialTemplates);

    // State for transactions
    const [isTransactionModalOpen, setTransactionModalOpen] = useState(false);
    const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);

    // State for categories
    const [isCategoryModalOpen, setCategoryModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | { type: Category['type'] } | null>(null);

    // State for scholarships
    const [isScholarshipModalOpen, setScholarshipModalOpen] = useState(false);
    const [editingScholarship, setEditingScholarship] = useState<Scholarship | null>(null);

    // Kanban & Communication State
    const [kanbanTuitions, setKanbanTuitions] = useState<Tuition[]>(tuition);
    const [isCommunicationModalOpen, setCommunicationModalOpen] = useState(false);
    const [isSchedulingModalOpen, setSchedulingModalOpen] = useState(false);
    const [selectedTuition, setSelectedTuition] = useState<Tuition | null>(null);
    const [communicationChannel, setCommunicationChannel] = useState<'whatsapp' | 'sms'>('whatsapp');
    
    // Message Template State
    const [isTemplateModalOpen, setTemplateModalOpen] = useState(false);
    const [editingTemplate, setEditingTemplate] = useState<MessageTemplate | null>(null);

    // Automatically update overdue payments on load.
    useEffect(() => {
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Set to midnight to compare dates only.

        let hasChanges = false;
        const updatedTuitions = kanbanTuitions.map(t => {
            // Check only 'Pendente' items to avoid re-evaluating already 'Atrasado' ones.
            if (t.status === 'Pendente') {
                // Safely create date object to avoid timezone issues.
                const dueDate = new Date(t.dueDate + 'T00:00:00');
                if (dueDate < today) {
                    hasChanges = true;
                    return { ...t, status: 'Atrasado' as const };
                }
            }
            return t;
        });

        if (hasChanges) {
            setKanbanTuitions(updatedTuitions);
        }
    }, []); // Run only once on component mount.


    const tabs: { id: Tab, label: string }[] = [
        { id: 'dashboard', label: 'Dashboard' },
        { id: 'transactions', label: 'Transações' },
        { id: 'cashier', label: 'Caixa Diário' },
        { id: 'enrollments', label: 'Matrículas' },
        { id: 'tuition', label: 'Mensalidades' },
        { id: 'kanban', label: 'Cobrança (Kanban)' },
        { id: 'scholarships', label: 'Bolsas de Estudo' },
        { id: 'categories', label: 'Categorias' },
        { id: 'paymentMethods', label: 'Métodos de Pagamento' },
        { id: 'messageTemplates', label: 'Modelos de Mensagem' },
    ];

    // --- Transaction Modal Logic ---
    const handleAddTransaction = () => { setEditingTransaction(null); setTransactionModalOpen(true); };
    const handleEditTransaction = (transaction: Transaction) => { setEditingTransaction(transaction); setTransactionModalOpen(true); };
    const handleDeleteTransaction = (id: number) => { if (window.confirm('Tem a certeza?')) console.log("Delete transaction", id); };
    const handleSaveTransaction = (data: Omit<Transaction, 'id'>) => { console.log("Save transaction", data); setTransactionModalOpen(false); setEditingTransaction(null); };

    // --- Category Modal Logic ---
    const handleAddCategory = (type: Category['type']) => { setEditingCategory({ type }); setCategoryModalOpen(true); };
    const handleEditCategory = (category: Category) => { setEditingCategory(category); setCategoryModalOpen(true); };
    const handleDeleteCategory = (id: number) => { if (window.confirm('Tem a certeza?')) console.log("Delete category", id); };
    const handleSaveCategory = (name: string) => { if (!editingCategory) return; console.log("Save category", name); setCategoryModalOpen(false); setEditingCategory(null); };

    // --- Scholarship Modal Logic ---
    const handleAddScholarship = () => { setEditingScholarship(null); setScholarshipModalOpen(true); };
    const handleEditScholarship = (scholarship: Scholarship) => { setEditingScholarship(scholarship); setScholarshipModalOpen(true); };
    const handleDeleteScholarship = (id: number) => { if (window.confirm('Tem a certeza?')) console.log("Delete scholarship", id); };
    const handleSaveScholarship = (data: Omit<Scholarship, 'id'>) => { console.log("Save scholarship", data); setScholarshipModalOpen(false); setEditingScholarship(null); };
    
    // --- Message Template Logic ---
    const handleAddTemplate = () => { setEditingTemplate(null); setTemplateModalOpen(true); };
    const handleEditTemplate = (template: MessageTemplate) => { setEditingTemplate(template); setTemplateModalOpen(true); };
    const handleDeleteTemplate = (id: number) => { if(window.confirm("Tem a certeza?")) setMessageTemplates(prev => prev.filter(t => t.id !== id)); };
    const handleSaveTemplate = (data: Omit<MessageTemplate, 'id'> & {id?:number}) => {
        if(data.id) {
            setMessageTemplates(prev => prev.map(t => t.id === data.id ? {...t, ...data} : t));
        } else {
            setMessageTemplates(prev => [...prev, {...data, id: Date.now() }]);
        }
        setTemplateModalOpen(false);
    };

    // --- Kanban & Communication Logic ---
    const kanbanColumns = useMemo(() => kanbanTuitions.reduce((acc, current) => {
        if (!acc[current.status]) acc[current.status] = [];
        acc[current.status].push(current);
        return acc;
    }, {} as Record<Tuition['status'], Tuition[]>), [kanbanTuitions]);
    
    const handleKanbanStatusChange = (tuitionId: number, newStatus: Tuition['status']) => {
        const tuitionToMove = kanbanTuitions.find(t => t.id === tuitionId);
        if (!tuitionToMove || tuitionToMove.status === newStatus) return;
        
        if (newStatus === 'Em Cobrança') {
            setSelectedTuition(tuitionToMove);
            setCommunicationChannel('whatsapp'); // Default
            setCommunicationModalOpen(true);
            return; // Don't update state here, let the modal handler do it
        }

        if (newStatus === 'Pago') {
             if (!window.confirm(`Confirmar o pagamento da mensalidade de ${tuitionToMove.month} para ${tuitionToMove.studentName}?`)) return;
        }
        
        setKanbanTuitions(prev => prev.map(t => t.id === tuitionId ? { ...t, status: newStatus } : t));
    };

    const handleOpenScheduling = (tuition: Tuition) => { setSelectedTuition(tuition); setSchedulingModalOpen(true); };
    const handleOpenWhatsApp = (tuition: Tuition) => { setSelectedTuition(tuition); setCommunicationChannel('whatsapp'); setCommunicationModalOpen(true); };
    const handleOpenSms = (tuition: Tuition) => { setSelectedTuition(tuition); setCommunicationChannel('sms'); setCommunicationModalOpen(true); };

    const handleScheduleReminder = (data: { date: string, time: string, channel: 'whatsapp' | 'sms' }) => {
        if(!selectedTuition) return;
        const scheduledAt = `${data.date}T${data.time}`;
        setKanbanTuitions(prev => prev.map(t => 
            t.id === selectedTuition.id ? { ...t, reminderScheduledAt: scheduledAt, reminderType: data.channel } : t
        ));
        setSchedulingModalOpen(false);
        alert(`Lembrete para ${selectedTuition.studentName} agendado para ${new Date(scheduledAt).toLocaleString('pt-MZ')} via ${data.channel.toUpperCase()}.`);
    };

    const handleSendReminder = (channel: 'whatsapp' | 'sms', message: string) => {
        if (!selectedTuition) return;
        setKanbanTuitions(prev => prev.map(t => t.id === selectedTuition.id ? { ...t, status: 'Em Cobrança' } : t));
        setCommunicationModalOpen(false);
        setSelectedTuition(null);
        alert(`Lembrete enviado para ${selectedTuition.studentName} via ${channel.toUpperCase()}!`);
    };

    const renderContent = () => {
        switch (activeTab) {
            case 'dashboard': return <FinancialDashboard />;
            case 'transactions': return <TransactionLedger onAdd={handleAddTransaction} onEdit={handleEditTransaction} onDelete={handleDeleteTransaction} />;
            case 'cashier': return <DailyCashier transactions={transactions} categories={categories} />;
            case 'enrollments': return <DataTable title="Gestão de Matrículas" headers={['Aluno', 'Data', 'Valor', 'Desconto', 'Status', 'Ações']} rows={ENROLLMENTS_DATA.map((e: Enrollment) => [e.studentName, e.date, formatCurrency(e.amount), formatCurrency(e.discount), getStatusBadge(e.status), <Button variant="link">Gerar Recibo</Button>])} />;
            case 'tuition':
                const tuitionRows = tuition.map((t: Tuition) => {
                    const studentScholarship = studentScholarships.find(ss => ss.studentId === t.studentId);
                    const scholarship = studentScholarship ? scholarships.find(s => s.id === studentScholarship.scholarshipId) : null;
                    let scholarshipDiscount = scholarship ? (scholarship.type === 'Percentagem' ? t.amount * (scholarship.value / 100) : scholarship.value) : 0;
                    const SIBLING_DISCOUNT_PERCENTAGE = 10;
                    const currentStudent = students.find(s => s.id === t.studentId);
                    let siblingDiscount = 0, isSiblingDiscounted = false;
                    if (currentStudent) {
                        const siblings = students.filter(s => s.guardian === currentStudent.guardian && s.phone === currentStudent.phone).sort((a, b) => a.id - b.id);
                        if (siblings.length > 1 && siblings[0].id !== currentStudent.id) {
                            siblingDiscount = t.amount * (SIBLING_DISCOUNT_PERCENTAGE / 100);
                            isSiblingDiscounted = true;
                        }
                    }
                    const totalDiscount = scholarshipDiscount + siblingDiscount;
                    return [ t.studentName, t.month, t.dueDate, formatCurrency(t.amount),
                        <span className="flex items-center">{formatCurrency(totalDiscount)}{isSiblingDiscounted && <Badge variant="warning" className="ml-2">Irmão</Badge>}</span>,
                        <span className="font-bold text-reviva-green">{formatCurrency(t.amount - totalDiscount)}</span>,
                        getStatusBadge(t.status), 
                        <Button variant="link" className="text-amber-600 hover:text-amber-800">Enviar Alerta</Button>
                    ];
                });
                 return <DataTable title="Gestão de Mensalidades" headers={['Aluno', 'Mês', 'Vencimento', 'Valor Bruto', 'Desconto', 'Valor Final', 'Status', 'Ações']} rows={tuitionRows} />;
            case 'kanban': return <KanbanBoard columns={kanbanColumns} onStatusChange={handleKanbanStatusChange} onSchedule={handleOpenScheduling} onSendSms={handleOpenSms} onSendWhatsApp={handleOpenWhatsApp} />;
            case 'categories': return <CategoryManagement onAdd={handleAddCategory} onEdit={handleEditCategory} onDelete={handleDeleteCategory} />;
            case 'scholarships': return <ScholarshipManagement onAdd={handleAddScholarship} onEdit={handleEditScholarship} onDelete={handleDeleteScholarship} />;
            case 'paymentMethods': return <PaymentMethodsManagement />;
            case 'messageTemplates':
                const templateRows = messageTemplates.map(t => [
                    <span className="font-medium text-slate-800 dark:text-slate-200">{t.name}</span>,
                    t.shortcut,
                    <p className="whitespace-pre-wrap max-w-md">{t.content}</p>,
                    <div className="flex"><Button variant="link" size="sm" onClick={()=>handleEditTemplate(t)}><PencilIcon className="h-4 w-4 mr-1"/>Editar</Button><Button variant="link" size="sm" className="text-red-500" onClick={()=>handleDeleteTemplate(t.id)}><TrashIcon className="h-4 w-4 mr-1"/>Remover</Button></div>
                ]);
                return <Card><div className="p-4 flex justify-between items-center"><h3 className="text-lg font-semibold">Modelos de Mensagem</h3><Button onClick={handleAddTemplate}><PlusIcon className="h-5 w-5 mr-2"/>Novo Modelo</Button></div><DataTable title="" headers={['Nome', 'Atalho', 'Conteúdo', 'Ações']} rows={templateRows}/></Card>;
            default: return null;
        }
    };
    
    return (
        <>
            <PageHeader title="Sistema Financeiro Completo" subtitle="Controle total sobre as finanças da escola" />
            <div className="mb-6 border-b border-slate-200 dark:border-slate-700">
                <nav className="-mb-px flex space-x-6 overflow-x-auto" aria-label="Tabs">{tabs.map(tab => (<button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`${ activeTab === tab.id ? 'border-reviva-green text-reviva-green' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:border-slate-600' } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors focus:outline-none`}>{tab.label}</button>))}</nav>
            </div>
            
            <div>{renderContent()}</div>
            
            <Modal isOpen={isTransactionModalOpen} onClose={() => setTransactionModalOpen(false)} title={editingTransaction ? 'Editar Transação' : 'Nova Transação'}><TransactionForm transaction={editingTransaction} categories={categories} onSave={handleSaveTransaction} onCancel={() => setTransactionModalOpen(false)}/></Modal>
            <Modal isOpen={isCategoryModalOpen} onClose={() => setCategoryModalOpen(false)} title={editingCategory && 'id' in editingCategory ? 'Editar Categoria' : `Adicionar Categoria de ${editingCategory?.type}`}><CategoryForm category={editingCategory && 'id' in editingCategory ? editingCategory : null} onSave={handleSaveCategory} onCancel={() => setCategoryModalOpen(false)}/></Modal>
            <Modal isOpen={isScholarshipModalOpen} onClose={() => setScholarshipModalOpen(false)} title={editingScholarship ? 'Editar Bolsa de Estudo' : 'Criar Nova Bolsa de Estudo'}><ScholarshipForm scholarship={editingScholarship} onSave={handleSaveScholarship} onCancel={() => setScholarshipModalOpen(false)}/></Modal>
            <SendReminderModal isOpen={isCommunicationModalOpen} onClose={() => setCommunicationModalOpen(false)} onSend={handleSendReminder} tuition={selectedTuition} channel={communicationChannel} templates={messageTemplates} />
            <SchedulingModal isOpen={isSchedulingModalOpen} onClose={() => setSchedulingModalOpen(false)} onSchedule={handleScheduleReminder} tuition={selectedTuition} templates={messageTemplates} />
            <Modal isOpen={isTemplateModalOpen} onClose={() => setTemplateModalOpen(false)} title={editingTemplate ? 'Editar Modelo' : 'Novo Modelo de Mensagem'}><MessageTemplateForm onSave={handleSaveTemplate} onCancel={()=>setTemplateModalOpen(false)} template={editingTemplate}/></Modal>
        </>
    );
};

// --- Form Components for Modals ---
const TransactionForm: React.FC<{ transaction: Transaction | null; categories: Category[]; onSave: (data: Omit<Transaction, 'id'>) => void; onCancel: () => void; }> = ({ transaction, categories, onSave, onCancel }) => {
    const [date, setDate] = useState(transaction?.date || new Date().toISOString().split('T')[0]);
    const [description, setDescription] = useState(transaction?.description || '');
    const [type, setType] = useState<Transaction['type']>(transaction?.type || 'Receita');
    const [categoryId, setCategoryId] = useState(transaction?.categoryId.toString() || '');
    const [amount, setAmount] = useState(transaction?.amount.toString() || '');
    const [paymentMethod, setPaymentMethod] = useState<Transaction['paymentMethod']>(transaction?.paymentMethod || 'Dinheiro');
    const filteredCategories = categories.filter(c => c.type === type);
    React.useEffect(() => { if (!filteredCategories.some(c => c.id.toString() === categoryId)) setCategoryId(''); }, [type, filteredCategories, categoryId]);
    const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); onSave({ date, description, type, categoryId: parseInt(categoryId), amount: parseFloat(amount), paymentMethod }); }
    return <form onSubmit={handleSubmit} className="space-y-4"><Input id="date" label="Data" type="date" value={date} onChange={e => setDate(e.target.value)} required /><Input id="description" label="Descrição" value={description} onChange={e => setDescription(e.target.value)} required /><div className="grid grid-cols-1 sm:grid-cols-2 gap-4"><Select id="type" label="Tipo" value={type} onChange={e => setType(e.target.value as Transaction['type'])}><option value="Receita">Receita</option><option value="Despesa">Despesa</option></Select><Input id="amount" label="Valor (MZN)" type="number" step="0.01" value={amount} onChange={e => setAmount(e.target.value)} required /></div><Select id="category" label="Categoria" value={categoryId} onChange={e => setCategoryId(e.target.value)} required><option value="">Selecione uma categoria</option>{filteredCategories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}</Select><Select id="paymentMethod" label="Método de Pagamento" value={paymentMethod} onChange={e => setPaymentMethod(e.target.value as Transaction['paymentMethod'])}><option value="Dinheiro">Dinheiro</option><option value="Transferência">Transferência Bancária</option><option value="Digital">Digital (M-Pesa, e-Mola)</option></Select><div className="flex justify-end gap-4 pt-4"><Button type="button" variant="secondary" onClick={onCancel}>Cancelar</Button><Button type="submit">Salvar</Button></div></form>
}
const CategoryForm: React.FC<{ category: Category | null; onSave: (name: string) => void; onCancel: () => void; }> = ({ category, onSave, onCancel }) => {
    const [name, setName] = useState(category?.name || '');
    const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); onSave(name); }
    return <form onSubmit={handleSubmit} className="space-y-4"><Input id="category-name" label="Nome da Categoria" value={name} onChange={e => setName(e.target.value)} required /><div className="flex justify-end gap-4 pt-4"><Button type="button" variant="secondary" onClick={onCancel}>Cancelar</Button><Button type="submit">Salvar</Button></div></form>;
};
const ScholarshipForm: React.FC<{ scholarship: Scholarship | null; onSave: (data: Omit<Scholarship, 'id'>) => void; onCancel: () => void; }> = ({ scholarship, onSave, onCancel }) => {
    const [name, setName] = useState(scholarship?.name || '');
    const [type, setType] = useState<Scholarship['type']>(scholarship?.type || 'Percentagem');
    const [value, setValue] = useState(scholarship?.value.toString() || '');
    const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); onSave({ name, type, value: Number(value) }); }
    return <form onSubmit={handleSubmit} className="space-y-4"><Input id="scholarship-name" label="Nome da Bolsa" value={name} onChange={e => setName(e.target.value)} required /><div className="grid grid-cols-1 sm:grid-cols-2 gap-4"><Select id="scholarship-type" label="Tipo" value={type} onChange={e => setType(e.target.value as Scholarship['type'])}><option value="Percentagem">Percentagem</option><option value="Valor Fixo">Valor Fixo</option></Select><Input id="scholarship-value" label={type === 'Percentagem' ? 'Valor (%)' : 'Valor (MZN)'} type="number" value={value} onChange={e => setValue(e.target.value)} required /></div><div className="flex justify-end gap-4 pt-4"><Button type="button" variant="secondary" onClick={onCancel}>Cancelar</Button><Button type="submit">Salvar</Button></div></form>;
};
const MessageTemplateForm: React.FC<{ template: MessageTemplate | null; onSave: (data: Omit<MessageTemplate, 'id'> & {id?:number}) => void; onCancel: () => void; }> = ({ template, onSave, onCancel }) => {
    const [name, setName] = useState(template?.name || '');
    const [shortcut, setShortcut] = useState(template?.shortcut || '');
    const [content, setContent] = useState(template?.content || '');
    const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); onSave({ id: template?.id, name, shortcut, content }); }
    return <form onSubmit={handleSubmit} className="space-y-4"><Input id="template-name" label="Nome do Modelo" value={name} onChange={e => setName(e.target.value)} required /><Input id="template-shortcut" label="Atalho" value={shortcut} onChange={e => setShortcut(e.target.value)} required placeholder="Ex: /lembrete1" /><div><label htmlFor="template-content" className="block text-sm font-medium mb-1">Conteúdo</label><textarea id="template-content" rows={5} value={content} onChange={e => setContent(e.target.value)} className="w-full p-2 border rounded-lg dark:bg-slate-700 dark:border-slate-600" required /><p className="text-xs text-slate-500 mt-1">Use {`{aluno}`}, {`{mes}`}, e {`{valor}`} para substituição automática.</p></div><div className="flex justify-end gap-4 pt-4"><Button type="button" variant="secondary" onClick={onCancel}>Cancelar</Button><Button type="submit">Salvar Modelo</Button></div></form>
}

export default Financial;