




import React, { useState } from 'react';
import PageHeader from '../components/Header';
import StatCard from '../components/StatCard';
import DataTable from '../components/DataTable';
import CategoryPieChart from '../components/charts/CategoryPieChart';
import { formatCurrency } from '../utils/formatters';
import { 
    FINANCIAL_SUMMARY, REVENUE_CATEGORIES, EXPENSE_CATEGORIES, ENROLLMENTS_DATA, TUITION_DATA, 
    CATEGORIES_DATA, SCHOLARSHIPS_DATA, STUDENT_SCHOLARSHIPS_DATA, TRANSACTIONS_DATA
} from '../constants';
import { ArrowTrendingUpIcon, ArrowTrendingDownIcon, ScaleIcon, CurrencyDollarIcon, PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { Enrollment, Tuition, Category, Scholarship, Transaction } from '../types';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Card } from '../components/ui/Card';

type Tab = 'dashboard' | 'transactions' | 'enrollments' | 'tuition' | 'categories' | 'scholarships';

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

const TransactionLedger: React.FC<{
    transactions: Transaction[];
    categories: Category[];
    onEdit: (transaction: Transaction) => void;
    onDelete: (id: number) => void;
    onAdd: () => void;
}> = ({ transactions, categories, onEdit, onDelete, onAdd }) => {

    const transactionRows = transactions.map(t => {
        const category = categories.find(c => c.id === t.categoryId);
        return [
            new Date(t.date).toLocaleDateString('pt-MZ'),
            t.description,
            category?.name || 'Sem Categoria',
            <Badge variant={t.type === 'Receita' ? 'success' : 'destructive'}>{t.type}</Badge>,
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
                headers={['Data', 'Descrição', 'Categoria', 'Tipo', 'Valor', 'Ações']}
                rows={transactionRows} 
                title=""
            />
        </Card>
    );
};

const CategoryManagement: React.FC<{
    categories: Category[];
    onEdit: (category: Category) => void;
    onDelete: (id: number) => void;
    onAdd: (type: Category['type']) => void;
}> = ({ categories, onEdit, onDelete, onAdd }) => {
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
    scholarships: Scholarship[];
    onEdit: (scholarship: Scholarship) => void;
    onDelete: (id: number) => void;
    onAdd: () => void;
}> = ({ scholarships, onEdit, onDelete, onAdd }) => {
    const studentCount = (scholarshipId: number) => {
        return STUDENT_SCHOLARSHIPS_DATA.filter(ss => ss.scholarshipId === scholarshipId).length;
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
    const [activeTab, setActiveTab] = useState<Tab>('dashboard');

    // State for transactions
    const [transactions, setTransactions] = useState<Transaction[]>(TRANSACTIONS_DATA);
    const [isTransactionModalOpen, setTransactionModalOpen] = useState(false);
    const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);

    // State for categories
    const [categories, setCategories] = useState<Category[]>(CATEGORIES_DATA);
    const [isCategoryModalOpen, setCategoryModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | { type: Category['type'] } | null>(null);

    // State for scholarships
    const [scholarships, setScholarships] = useState<Scholarship[]>(SCHOLARSHIPS_DATA);
    const [isScholarshipModalOpen, setScholarshipModalOpen] = useState(false);
    const [editingScholarship, setEditingScholarship] = useState<Scholarship | null>(null);
    
    const tabs: { id: Tab, label: string }[] = [
        { id: 'dashboard', label: 'Dashboard' },
        { id: 'transactions', label: 'Transações' },
        { id: 'enrollments', label: 'Matrículas' },
        { id: 'tuition', label: 'Mensalidades' },
        { id: 'scholarships', label: 'Bolsas de Estudo' },
        { id: 'categories', label: 'Categorias' },
    ];

    // --- Transaction Modal Logic ---
    const handleAddTransaction = () => {
        setEditingTransaction(null);
        setTransactionModalOpen(true);
    };
    const handleEditTransaction = (transaction: Transaction) => {
        setEditingTransaction(transaction);
        setTransactionModalOpen(true);
    };
    const handleDeleteTransaction = (id: number) => {
        if (window.confirm('Tem a certeza que deseja remover esta transação?')) {
            setTransactions(trans => trans.filter(t => t.id !== id));
        }
    };
    const handleSaveTransaction = (data: Omit<Transaction, 'id'>) => {
        if (editingTransaction) { // Editing
            setTransactions(trans => trans.map(t => t.id === editingTransaction.id ? { ...t, ...data } : t));
        } else { // Adding
            const newTransaction: Transaction = { ...data, id: Date.now() };
            setTransactions(trans => [...trans, newTransaction]);
        }
        setTransactionModalOpen(false);
        setEditingTransaction(null);
    };


    // --- Category Modal Logic ---
    const handleAddCategory = (type: Category['type']) => {
        setEditingCategory({ type });
        setCategoryModalOpen(true);
    };
    const handleEditCategory = (category: Category) => {
        setEditingCategory(category);
        setCategoryModalOpen(true);
    };
    const handleDeleteCategory = (id: number) => {
        if (window.confirm('Tem a certeza?')) {
            setCategories(cats => cats.filter(c => c.id !== id));
        }
    };
    const handleSaveCategory = (name: string) => {
        if (!editingCategory) return;
        
        if ('id' in editingCategory) { // Editing
            setCategories(cats => cats.map(c => c.id === (editingCategory as Category).id ? { ...c, name } : c));
        } else { // Adding
            const newCategory: Category = {
                id: Date.now(), // simple unique id
                name,
                type: editingCategory.type,
            };
            setCategories(cats => [...cats, newCategory]);
        }
        setCategoryModalOpen(false);
        setEditingCategory(null);
    };

    // --- Scholarship Modal Logic ---
    const handleAddScholarship = () => {
        setEditingScholarship(null);
        setScholarshipModalOpen(true);
    };
    const handleEditScholarship = (scholarship: Scholarship) => {
        setEditingScholarship(scholarship);
        setScholarshipModalOpen(true);
    };
    const handleDeleteScholarship = (id: number) => {
        if (window.confirm('Tem a certeza?')) {
            setScholarships(sch => sch.filter(s => s.id !== id));
        }
    };
    const handleSaveScholarship = (data: Omit<Scholarship, 'id'>) => {
        if (editingScholarship) { // Editing
            setScholarships(sch => sch.map(s => s.id === editingScholarship.id ? { ...s, ...data } : s));
        } else { // Adding
            const newScholarship: Scholarship = { ...data, id: Date.now() };
            setScholarships(sch => [...sch, newScholarship]);
        }
        setScholarshipModalOpen(false);
        setEditingScholarship(null);
    };

    const renderContent = () => {
        switch (activeTab) {
            case 'dashboard':
                return <FinancialDashboard />;
            case 'transactions':
                return <TransactionLedger transactions={transactions} categories={categories} onAdd={handleAddTransaction} onEdit={handleEditTransaction} onDelete={handleDeleteTransaction} />;
            case 'enrollments':
                return <DataTable title="Gestão de Matrículas" headers={['Aluno', 'Data', 'Valor', 'Desconto', 'Status', 'Ações']} rows={ENROLLMENTS_DATA.map((e: Enrollment) => [e.studentName, e.date, formatCurrency(e.amount), formatCurrency(e.discount), getStatusBadge(e.status), <Button variant="link">Gerar Recibo</Button>])} />;
            case 'tuition':
                const tuitionRows = TUITION_DATA.map((t: Tuition) => {
                    const studentScholarship = STUDENT_SCHOLARSHIPS_DATA.find(ss => ss.studentId === t.studentId);
                    const scholarship = studentScholarship ? scholarships.find(s => s.id === studentScholarship.scholarshipId) : null;
                    
                    let discount = 0;
                    if (scholarship) {
                        if (scholarship.type === 'Percentagem') {
                            discount = t.amount * (scholarship.value / 100);
                        } else {
                            discount = scholarship.value;
                        }
                    }
                    const finalAmount = t.amount - discount;

                    return [
                        t.studentName, 
                        t.month, 
                        t.dueDate, 
                        formatCurrency(t.amount),
                        <span className="text-orange-600 dark:text-orange-400">{formatCurrency(discount)}</span>,
                        <span className="font-bold text-reviva-green">{formatCurrency(finalAmount)}</span>,
                        getStatusBadge(t.status), 
                        <Button variant="link" className="text-amber-600 hover:text-amber-800">Enviar Alerta</Button>
                    ];
                });
                 return <DataTable title="Gestão de Mensalidades" headers={['Aluno', 'Mês', 'Vencimento', 'Valor Bruto', 'Desconto', 'Valor Final', 'Status', 'Ações']} rows={tuitionRows} />;
            case 'categories':
                return <CategoryManagement categories={categories} onAdd={handleAddCategory} onEdit={handleEditCategory} onDelete={handleDeleteCategory} />;
            case 'scholarships':
                return <ScholarshipManagement scholarships={scholarships} onAdd={handleAddScholarship} onEdit={handleEditScholarship} onDelete={handleDeleteScholarship} />;
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
            
            {/* Transaction Modal */}
            <Modal
                isOpen={isTransactionModalOpen}
                onClose={() => setTransactionModalOpen(false)}
                title={editingTransaction ? 'Editar Transação' : 'Nova Transação'}
            >
                <TransactionForm
                    transaction={editingTransaction}
                    categories={categories}
                    onSave={handleSaveTransaction}
                    onCancel={() => setTransactionModalOpen(false)}
                />
            </Modal>

            {/* Category Modal */}
            <Modal
                isOpen={isCategoryModalOpen}
                onClose={() => setCategoryModalOpen(false)}
                title={editingCategory && 'id' in editingCategory ? 'Editar Categoria' : `Adicionar Categoria de ${editingCategory?.type}`}
            >
                <CategoryForm
                    category={editingCategory && 'id' in editingCategory ? editingCategory : null}
                    onSave={handleSaveCategory}
                    onCancel={() => setCategoryModalOpen(false)}
                />
            </Modal>
            
            {/* Scholarship Modal */}
            <Modal
                isOpen={isScholarshipModalOpen}
                onClose={() => setScholarshipModalOpen(false)}
                title={editingScholarship ? 'Editar Bolsa de Estudo' : 'Criar Nova Bolsa de Estudo'}
            >
                <ScholarshipForm
                    scholarship={editingScholarship}
                    onSave={handleSaveScholarship}
                    onCancel={() => setScholarshipModalOpen(false)}
                />
            </Modal>
        </>
    );
};

// --- Form Components for Modals ---

const TransactionForm: React.FC<{
    transaction: Transaction | null;
    categories: Category[];
    onSave: (data: Omit<Transaction, 'id'>) => void;
    onCancel: () => void;
}> = ({ transaction, categories, onSave, onCancel }) => {
    const [date, setDate] = useState(transaction?.date || new Date().toISOString().split('T')[0]);
    const [description, setDescription] = useState(transaction?.description || '');
    const [type, setType] = useState<Transaction['type']>(transaction?.type || 'Receita');
    const [categoryId, setCategoryId] = useState(transaction?.categoryId.toString() || '');
    const [amount, setAmount] = useState(transaction?.amount.toString() || '');
    
    const filteredCategories = categories.filter(c => c.type === type);

    // Effect to reset category if type changes and selected category is no longer valid
    React.useEffect(() => {
        if (!filteredCategories.some(c => c.id.toString() === categoryId)) {
            setCategoryId('');
        }
    }, [type, filteredCategories, categoryId]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({ date, description, type, categoryId: parseInt(categoryId), amount: parseFloat(amount) });
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <Input id="date" label="Data" type="date" value={date} onChange={e => setDate(e.target.value)} required />
            <Input id="description" label="Descrição" value={description} onChange={e => setDescription(e.target.value)} required />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                 <Select id="type" label="Tipo" value={type} onChange={e => setType(e.target.value as Transaction['type'])}>
                    <option value="Receita">Receita</option>
                    <option value="Despesa">Despesa</option>
                </Select>
                <Input id="amount" label="Valor (MZN)" type="number" step="0.01" value={amount} onChange={e => setAmount(e.target.value)} required />
            </div>
            <Select id="category" label="Categoria" value={categoryId} onChange={e => setCategoryId(e.target.value)} required>
                <option value="">Selecione uma categoria</option>
                {filteredCategories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </Select>
            <div className="flex justify-end gap-4 pt-4">
                <Button type="button" variant="secondary" onClick={onCancel}>Cancelar</Button>
                <Button type="submit">Salvar</Button>
            </div>
        </form>
    )
}

const CategoryForm: React.FC<{
    category: Category | null;
    onSave: (name: string) => void;
    onCancel: () => void;
}> = ({ category, onSave, onCancel }) => {
    const [name, setName] = useState(category?.name || '');
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(name);
    }
    
    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <Input id="category-name" label="Nome da Categoria" value={name} onChange={e => setName(e.target.value)} required />
            <div className="flex justify-end gap-4 pt-4">
                <Button type="button" variant="secondary" onClick={onCancel}>Cancelar</Button>
                <Button type="submit">Salvar</Button>
            </div>
        </form>
    );
};

const ScholarshipForm: React.FC<{
    scholarship: Scholarship | null;
    onSave: (data: Omit<Scholarship, 'id'>) => void;
    onCancel: () => void;
}> = ({ scholarship, onSave, onCancel }) => {
    const [name, setName] = useState(scholarship?.name || '');
    const [type, setType] = useState<Scholarship['type']>(scholarship?.type || 'Percentagem');
    const [value, setValue] = useState(scholarship?.value.toString() || '');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({ name, type, value: Number(value) });
    }

    return (
         <form onSubmit={handleSubmit} className="space-y-4">
            <Input id="scholarship-name" label="Nome da Bolsa" value={name} onChange={e => setName(e.target.value)} required />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Select id="scholarship-type" label="Tipo" value={type} onChange={e => setType(e.target.value as Scholarship['type'])}>
                    <option value="Percentagem">Percentagem</option>
                    <option value="Valor Fixo">Valor Fixo</option>
                </Select>
                 <Input id="scholarship-value" label={type === 'Percentagem' ? 'Valor (%)' : 'Valor (MZN)'} type="number" value={value} onChange={e => setValue(e.target.value)} required />
            </div>
             <div className="flex justify-end gap-4 pt-4">
                <Button type="button" variant="secondary" onClick={onCancel}>Cancelar</Button>
                <Button type="submit">Salvar</Button>
            </div>
        </form>
    );
};


export default Financial;