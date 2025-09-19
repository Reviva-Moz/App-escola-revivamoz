
import React, { useState, useMemo } from 'react';
import PageHeader from '../components/Header';
import DataTable from '../components/DataTable';
import { BOOKS_DATA, BOOK_LOANS_DATA, STUDENTS_DATA } from '../constants';
import { Book, BookLoan } from '../types';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { PlusIcon } from '@heroicons/react/24/outline';

type Tab = 'catalog' | 'loans';

const Library: React.FC = () => {
    const [activeTab, setActiveTab] = useState<Tab>('catalog');
    const [books, setBooks] = useState<Book[]>(BOOKS_DATA);
    const [loans, setLoans] = useState<BookLoan[]>(BOOK_LOANS_DATA);

    // Modal States
    const [isBookModalOpen, setBookModalOpen] = useState(false);
    const [isLoanModalOpen, setLoanModalOpen] = useState(false);
    
    // Form States
    const [newBook, setNewBook] = useState<Omit<Book, 'id' | 'availableStock'>>({ title: '', author: '', isbn: '', totalStock: 1 });
    const [newLoan, setNewLoan] = useState<Omit<BookLoan, 'id'|'status'>>({ bookId: 0, studentId: 0, loanDate: new Date().toISOString().split('T')[0], dueDate: '' });
    
    const handleSaveBook = () => {
        const bookToAdd: Book = {
            ...newBook,
            id: Date.now(),
            availableStock: newBook.totalStock,
        };
        setBooks(prev => [...prev, bookToAdd]);
        setBookModalOpen(false);
        setNewBook({ title: '', author: '', isbn: '', totalStock: 1 });
    };

    const handleSaveLoan = () => {
        if (!newLoan.bookId || !newLoan.studentId || !newLoan.dueDate) {
            alert("Preencha todos os campos.");
            return;
        }
        const loanToAdd: BookLoan = {
            ...newLoan,
            id: Date.now(),
            status: 'Em Dia'
        };
        setLoans(prev => [...prev, loanToAdd]);
        // Update available stock
        setBooks(prevBooks => prevBooks.map(b => b.id === newLoan.bookId ? { ...b, availableStock: b.availableStock - 1 } : b));
        setLoanModalOpen(false);
        setNewLoan({ bookId: 0, studentId: 0, loanDate: new Date().toISOString().split('T')[0], dueDate: '' });
    };
    
    const bookRows = books.map(book => [
        <span className="font-medium text-gray-900 dark:text-gray-200">{book.title}</span>,
        book.author,
        book.isbn,
        book.totalStock,
        book.availableStock,
        <Badge variant={book.availableStock > 0 ? 'success' : 'default'}>{book.availableStock > 0 ? 'Disponível' : 'Indisponível'}</Badge>
    ]);
    
    const getLoanStatusBadge = (status: BookLoan['status']) => {
        switch (status) {
            case 'Em Dia': return <Badge variant="success">Em Dia</Badge>;
            case 'Atrasado': return <Badge variant="destructive">Atrasado</Badge>;
            case 'Devolvido': return <Badge variant="default">Devolvido</Badge>;
        }
    };

    const loanRows = loans.map(loan => {
        const book = books.find(b => b.id === loan.bookId);
        const student = STUDENTS_DATA.find(s => s.id === loan.studentId);
        return [
            <span className="font-medium text-gray-900 dark:text-gray-200">{book?.title || 'Livro não encontrado'}</span>,
            student?.name || 'Aluno não encontrado',
            loan.loanDate,
            loan.dueDate,
            getLoanStatusBadge(loan.status),
            loan.status !== 'Devolvido' ? <Button variant="link" size="sm">Registar Devolução</Button> : null
        ]
    });

    const renderContent = () => {
        switch(activeTab) {
            case 'catalog':
                return <DataTable title="Catálogo de Livros" headers={['Título', 'Autor', 'ISBN', 'Qtd. Total', 'Qtd. Disponível', 'Status']} rows={bookRows} />;
            case 'loans':
                return <DataTable title="Empréstimos Atuais e Histórico" headers={['Livro', 'Aluno', 'Data de Empréstimo', 'Data de Devolução', 'Status', 'Ações']} rows={loanRows} />;
        }
    };

    return (
        <>
            <PageHeader title="Gestão da Biblioteca" subtitle="Administre o catálogo de livros e os empréstimos">
                <div className="flex gap-4">
                    <Button onClick={() => setLoanModalOpen(true)} variant="secondary">
                        <PlusIcon className="h-5 w-5 mr-2" />
                        Registar Empréstimo
                    </Button>
                     <Button onClick={() => setBookModalOpen(true)}>
                        <PlusIcon className="h-5 w-5 mr-2" />
                        Adicionar Livro
                    </Button>
                </div>
            </PageHeader>

            <div className="mb-6 border-b border-slate-200 dark:border-slate-700">
                <nav className="-mb-px flex space-x-6">
                    <button onClick={() => setActiveTab('catalog')} className={`${activeTab === 'catalog' ? 'border-reviva-green text-reviva-green' : 'border-transparent text-slate-500 hover:text-slate-700'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}>
                        Catálogo
                    </button>
                    <button onClick={() => setActiveTab('loans')} className={`${activeTab === 'loans' ? 'border-reviva-green text-reviva-green' : 'border-transparent text-slate-500 hover:text-slate-700'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}>
                        Empréstimos
                    </button>
                </nav>
            </div>
            
            {renderContent()}

            {/* Add Book Modal */}
            <Modal isOpen={isBookModalOpen} onClose={() => setBookModalOpen(false)} title="Adicionar Novo Livro">
                <form onSubmit={(e) => { e.preventDefault(); handleSaveBook(); }} className="space-y-4">
                    <Input id="title" label="Título" value={newBook.title} onChange={e => setNewBook({...newBook, title: e.target.value})} required/>
                    <Input id="author" label="Autor" value={newBook.author} onChange={e => setNewBook({...newBook, author: e.target.value})} required/>
                    <Input id="isbn" label="ISBN" value={newBook.isbn} onChange={e => setNewBook({...newBook, isbn: e.target.value})}/>
                    <Input id="stock" label="Quantidade em Stock" type="number" min="1" value={newBook.totalStock} onChange={e => setNewBook({...newBook, totalStock: parseInt(e.target.value) || 1})} required/>
                     <div className="flex justify-end gap-4 pt-4">
                        <Button type="button" variant="secondary" onClick={() => setBookModalOpen(false)}>Cancelar</Button>
                        <Button type="submit">Adicionar Livro</Button>
                    </div>
                </form>
            </Modal>

            {/* Add Loan Modal */}
             <Modal isOpen={isLoanModalOpen} onClose={() => setLoanModalOpen(false)} title="Registar Novo Empréstimo">
                <form onSubmit={(e) => { e.preventDefault(); handleSaveLoan(); }} className="space-y-4">
                    <Select id="loan-book" label="Livro" value={newLoan.bookId} onChange={e => setNewLoan({...newLoan, bookId: parseInt(e.target.value)})} required>
                         <option value="">Selecione um livro</option>
                         {books.filter(b => b.availableStock > 0).map(b => <option key={b.id} value={b.id}>{b.title}</option>)}
                    </Select>
                     <Select id="loan-student" label="Aluno" value={newLoan.studentId} onChange={e => setNewLoan({...newLoan, studentId: parseInt(e.target.value)})} required>
                         <option value="">Selecione um aluno</option>
                         {STUDENTS_DATA.filter(s => s.status === 'Ativo').map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                    </Select>
                    <Input id="due-date" label="Data de Devolução" type="date" value={newLoan.dueDate} onChange={e => setNewLoan({...newLoan, dueDate: e.target.value})} required/>
                     <div className="flex justify-end gap-4 pt-4">
                        <Button type="button" variant="secondary" onClick={() => setLoanModalOpen(false)}>Cancelar</Button>
                        <Button type="submit">Registar</Button>
                    </div>
                </form>
            </Modal>
        </>
    );
};

export default Library;
