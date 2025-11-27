import React, { createContext, useState, useContext, ReactNode } from 'react';
import {
    Announcement, Book, BookLoan, SystemSettings, UserAccount, HealthRecord,
    AIConfiguration, MessageTemplate, AdminContextType
} from '@/types';
import {
    ANNOUNCEMENTS_DATA, BOOKS_DATA, BOOK_LOANS_DATA, SYSTEM_SETTINGS_DATA,
    USER_ACCOUNTS_DATA, HEALTH_RECORDS_DATA, MESSAGE_TEMPLATES_DATA
} from '@/constants';

const DEFAULT_AI_CONFIG: AIConfiguration = {
  trainingText: `A Abordagem Educacional por Princípios (AEP) é uma metodologia cristã que visa ensinar o aluno a pensar e a raciocinar a partir de princípios bíblicos, relacionando-os com todas as áreas do conhecimento. Os 4 passos do raciocínio são:
1.  **Pesquisar:** Identificar as verdades e princípios bíblicos no conteúdo académico.
2.  **Raciocinar:** Meditar sobre essas verdades e como se aplicam ao assunto.
3.  **Relacionar:** Estabelecer a relação entre o princípio bíblico e o conteúdo, entendendo a causa e efeito.
4.  **Registrar:** Documentar o entendimento para uso futuro e para ensinar a outros.
O plano de aula deve refletir esses passos e integrar a cosmovisão cristã de forma autêntica.`,
  input_fields: [
    { id: 'topic', label: 'Tópico Principal da Aula', placeholder: 'Ex: O Ciclo da Água', type: 'text' },
    { id: 'bible_verse', label: 'Texto Bíblico de Referência', placeholder: 'Ex: Gênesis 1:6-8', type: 'text' },
    { id: 'key_principle', label: 'Princípio-Chave', placeholder: 'Ex: Soberania de Deus na criação', type: 'text' },
    { id: 'age_group', label: 'Faixa Etária', placeholder: 'Ex: Alunos da 5ª Classe', type: 'text' },
  ],
};

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const AdminProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [announcements, setAnnouncements] = useState<Announcement[]>(ANNOUNCEMENTS_DATA);
    const [books, setBooks] = useState<Book[]>(BOOKS_DATA);
    const [bookLoans, setBookLoans] = useState<BookLoan[]>(BOOK_LOANS_DATA);
    const [systemSettings, setSystemSettings] = useState<SystemSettings>(SYSTEM_SETTINGS_DATA);
    const [users, setUsers] = useState<UserAccount[]>(USER_ACCOUNTS_DATA);
    const [healthRecords, setHealthRecords] = useState<HealthRecord[]>(HEALTH_RECORDS_DATA);
    const [aiConfiguration, setAIConfiguration] = useState<AIConfiguration>(DEFAULT_AI_CONFIG);
    const [messageTemplates, setMessageTemplates] = useState<MessageTemplate[]>(MESSAGE_TEMPLATES_DATA);

    const updateSettings = (settings: SystemSettings) => setSystemSettings(settings);
    const addUser = (user: Omit<UserAccount, 'id' | 'lastLogin'>) => setUsers(prev => [...prev, { ...user, id: Date.now(), lastLogin: new Date().toISOString() }]);
    const updateUser = (updatedUser: UserAccount) => setUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
    const deleteUser = (id: number) => setUsers(prev => prev.filter(u => u.id !== id));
    const updateAIConfiguration = (config: AIConfiguration) => setAIConfiguration(config);

    const addMessageTemplate = (template: Omit<MessageTemplate, 'id'>) => setMessageTemplates(prev => [...prev, { ...template, id: Date.now() }]);
    const updateMessageTemplate = (updatedTemplate: MessageTemplate) => setMessageTemplates(prev => prev.map(t => t.id === updatedTemplate.id ? updatedTemplate : t));
    const deleteMessageTemplate = (id: number) => setMessageTemplates(prev => prev.filter(t => t.id !== id));

    const addBook = (book: Omit<Book, 'id' | 'availableStock'>) => setBooks(prev => [...prev, { ...book, id: Date.now(), availableStock: book.totalStock }]);
    const updateBook = (updatedBook: Book) => setBooks(prev => prev.map(b => b.id === updatedBook.id ? updatedBook : b));
    const deleteBook = (id: number) => setBooks(prev => prev.filter(b => b.id !== id));

    const addLoan = (loan: Omit<BookLoan, 'id' | 'status'>) => {
        setBooks(prevBooks => {
            const bookToUpdate = prevBooks.find(b => b.id === loan.bookId);
            if (bookToUpdate && bookToUpdate.availableStock > 0) {
                setBookLoans(prevLoans => [...prevLoans, { ...loan, id: Date.now(), status: 'Em Dia' as const }]);
                return prevBooks.map(b => b.id === loan.bookId ? { ...b, availableStock: b.availableStock - 1 } : b);
            }
            return prevBooks;
        });
    };
    
    const returnLoan = (loanId: number) => {
        setBookLoans(prevLoans => {
            const loanToReturn = prevLoans.find(l => l.id === loanId);
            if (loanToReturn) {
                setBooks(prevBooks => prevBooks.map(b => b.id === loanToReturn.bookId ? { ...b, availableStock: b.availableStock + 1 } : b));
            }
            return prevLoans.map(l => l.id === loanId ? { ...l, status: 'Devolvido' as const, returnDate: new Date().toISOString().split('T')[0] } : l);
        });
    };

    const updateAnnouncement = (announcement: Announcement) => setAnnouncements(prev => prev.map(a => a.id === announcement.id ? announcement : a));
    
    const value: AdminContextType = {
        announcements, books, bookLoans, systemSettings, users, healthRecords, aiConfiguration, messageTemplates,
        updateSettings, addUser, updateUser, deleteUser, updateAIConfiguration,
        addMessageTemplate, updateMessageTemplate, deleteMessageTemplate,
        addBook, updateBook, deleteBook, addLoan, returnLoan, updateAnnouncement,
    };

    return (
        <AdminContext.Provider value={value}>
            {children}
        </AdminContext.Provider>
    );
};

export const useAdminData = () => {
    const context = useContext(AdminContext);
    if (context === undefined) {
        throw new Error('useAdminData must be used within an AdminProvider');
    }
    return context;
};