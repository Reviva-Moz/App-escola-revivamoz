

import React, { createContext, useState, useContext, ReactNode, useMemo, useEffect } from 'react';
import { 
    Student, Teacher, Staff, Subject, Class, Transaction, Category, Scholarship, Announcement, 
    Book, BookLoan, LessonPlan, SystemSettings, UserAccount, HealthRecord, StudentGrades, 
    CalendarEvent, DataContextType, ClassCurriculum, StudentScholarship, Tuition, Activity, 
    AIConfiguration, MessageTemplate, AttendanceRecord, PaymentMethod
} from '../types';

import {
    STUDENTS_DATA, TEACHERS_DATA, STAFF_DATA, SUBJECTS_DATA, CLASSES_DATA, TRANSACTIONS_DATA,
    CATEGORIES_DATA, SCHOLARSHIPS_DATA, ANNOUNCEMENTS_DATA, BOOKS_DATA, BOOK_LOANS_DATA,
    LESSON_PLANS_DATA, SYSTEM_SETTINGS_DATA, USER_ACCOUNTS_DATA, HEALTH_RECORDS_DATA, GRADES_DATA,
    CALENDAR_EVENTS_DATA, CLASS_CURRICULUM_DATA, STUDENT_SCHOLARSHIPS_DATA, TUITION_DATA,
    ATTENDANCE_DATA, RECENT_ACTIVITIES_DATA, MESSAGE_TEMPLATES_DATA, PAYMENT_METHODS_DATA
} from '../constants';
import { saveDataToLocalDB, loadDataFromLocalDB } from '../utils/db';

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


const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [students, setStudents] = useState<Student[]>([]);
    const [teachers, setTeachers] = useState<Teacher[]>([]);
    const [staff, setStaff] = useState<Staff[]>([]);
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [classes, setClasses] = useState<Class[]>([]);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [scholarships, setScholarships] = useState<Scholarship[]>([]);
    const [announcements, setAnnouncements] = useState<Announcement[]>([]);
    const [books, setBooks] = useState<Book[]>([]);
    const [bookLoans, setBookLoans] = useState<BookLoan[]>([]);
    const [lessonPlans, setLessonPlans] = useState<LessonPlan[]>([]);
    const [systemSettings, setSystemSettings] = useState<SystemSettings>(SYSTEM_SETTINGS_DATA);
    const [users, setUsers] = useState<UserAccount[]>([]);
    const [healthRecords, setHealthRecords] = useState<HealthRecord[]>([]);
    const [grades, setGrades] = useState<StudentGrades[]>([]);
    const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>([]);
    const [classCurriculum, setClassCurriculum] = useState<ClassCurriculum[]>([]);
    const [studentScholarships, setStudentScholarships] = useState<StudentScholarship[]>([]);
    const [tuition, setTuition] = useState<Tuition[]>([]);
    const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
    const [activities, setActivities] = useState<Activity[]>([]);
    const [aiConfiguration, setAIConfiguration] = useState<AIConfiguration>(DEFAULT_AI_CONFIG);
    const [messageTemplates, setMessageTemplates] = useState<MessageTemplate[]>([]);
    const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const allDataKeys = [
        'students', 'teachers', 'staff', 'subjects', 'classes', 'transactions', 'categories', 
        'scholarships', 'announcements', 'books', 'bookLoans', 'lessonPlans', 'systemSettings', 
        'users', 'healthRecords', 'grades', 'calendarEvents', 'classCurriculum', 
        'studentScholarships', 'tuition', 'attendance', 'activities', 'aiConfiguration', 
        'messageTemplates', 'paymentMethods'
    ];

    const stateSetters: { [key: string]: React.Dispatch<React.SetStateAction<any>> } = {
        students: setStudents, teachers: setTeachers, staff: setStaff, subjects: setSubjects,
        classes: setClasses, transactions: setTransactions, categories: setCategories,
        scholarships: setScholarships, announcements: setAnnouncements, books: setBooks,
        bookLoans: setBookLoans, lessonPlans: setLessonPlans, systemSettings: setSystemSettings,
        users: setUsers, healthRecords: setHealthRecords, grades: setGrades,
        calendarEvents: setCalendarEvents, classCurriculum: setClassCurriculum,
        studentScholarships: setStudentScholarships, tuition: setTuition, attendance: setAttendance,
        activities: setActivities, aiConfiguration: setAIConfiguration, messageTemplates: setMessageTemplates,
        paymentMethods: setPaymentMethods
    };
    
    // Helper para atualizar estado e persistir no IndexedDB
    const updateAndPersist = <T,>(key: string, setter: React.Dispatch<React.SetStateAction<T>>, data: T) => {
        setter(data);
        saveDataToLocalDB(key, data);
    };

    useEffect(() => {
        const loadAndSyncData = async () => {
            setIsLoading(true);

            // Dados mockados que simulam uma resposta da rede
            const networkData = {
                students: STUDENTS_DATA, teachers: TEACHERS_DATA, staff: STAFF_DATA, subjects: SUBJECTS_DATA,
                classes: CLASSES_DATA, transactions: TRANSACTIONS_DATA, categories: CATEGORIES_DATA,
                scholarships: SCHOLARSHIPS_DATA, announcements: ANNOUNCEMENTS_DATA, books: BOOKS_DATA,
                bookLoans: BOOK_LOANS_DATA, lessonPlans: LESSON_PLANS_DATA, systemSettings: SYSTEM_SETTINGS_DATA,
                users: USER_ACCOUNTS_DATA, healthRecords: HEALTH_RECORDS_DATA, grades: GRADES_DATA,
                calendarEvents: CALENDAR_EVENTS_DATA, classCurriculum: CLASS_CURRICULUM_DATA,
                studentScholarships: STUDENT_SCHOLARSHIPS_DATA, tuition: TUITION_DATA, attendance: ATTENDANCE_DATA,
                activities: RECENT_ACTIVITIES_DATA, aiConfiguration: DEFAULT_AI_CONFIG, messageTemplates: MESSAGE_TEMPLATES_DATA,
                paymentMethods: PAYMENT_METHODS_DATA,
            };

            try {
                // Tenta carregar do "network" (mock) e salvar localmente se online
                if (!navigator.onLine) throw new Error("Offline");
                
                await Promise.all(allDataKeys.map(key => saveDataToLocalDB(key, (networkData as any)[key])));
                allDataKeys.forEach(key => stateSetters[key]((networkData as any)[key]));

            } catch (e) {
                console.warn("App is offline. Loading data from local storage.");
                
                // Carrega do local se offline ou se a "rede" falhar
                const localDataPromises = allDataKeys.map(key => loadDataFromLocalDB(key));
                const allLocalData = await Promise.all(localDataPromises);
                
                allDataKeys.forEach((key, index) => {
                    const localData = allLocalData[index];
                    const fallbackData = (networkData as any)[key];
                    // Usa dados locais se existirem, senão usa os dados mockados como fallback
                    stateSetters[key](localData !== undefined ? localData : fallbackData);
                });
            } finally {
                setIsLoading(false);
            }
        };

        loadAndSyncData();
    }, []);

    const classesWithDetails = useMemo(() => {
        return classes.map(cls => {
            const teacher = teachers.find(t => t.id === cls.teacherId);
            const studentCount = students.filter(s => s.classId === cls.id).length;
            return { ...cls, teacherName: teacher ? teacher.name : 'N/A', studentCount: studentCount };
        });
    }, [classes, teachers, students]);

    // --- CRUD Functions ---
    const addStudent = (student: Omit<Student, 'id' | 'class'>) => setStudents(prev => { const newState = [...prev, { ...student, id: Date.now(), class: '' }]; saveDataToLocalDB('students', newState); return newState; });
    const updateStudent = (updatedStudent: Omit<Student, 'id' | 'class'> & { id: number }) => setStudents(prev => { const newState = prev.map(s => s.id === updatedStudent.id ? { ...s, ...updatedStudent } : s); saveDataToLocalDB('students', newState); return newState; });
    const deleteStudent = (id: number) => setStudents(prev => { const newState = prev.filter(s => s.id !== id); saveDataToLocalDB('students', newState); return newState; });

    const addTeacher = (teacher: Omit<Teacher, 'id'>) => setTeachers(prev => { const newState = [...prev, { ...teacher, id: Date.now() }]; saveDataToLocalDB('teachers', newState); return newState; });
    const updateTeacher = (updatedTeacher: Teacher) => setTeachers(prev => { const newState = prev.map(t => t.id === updatedTeacher.id ? updatedTeacher : t); saveDataToLocalDB('teachers', newState); return newState; });
    const deleteTeacher = (id: number) => setTeachers(prev => { const newState = prev.filter(t => t.id !== id); saveDataToLocalDB('teachers', newState); return newState; });
    
    const addStaff = (staffMember: Omit<Staff, 'id'>) => setStaff(prev => { const newState = [...prev, { ...staffMember, id: Date.now() }]; saveDataToLocalDB('staff', newState); return newState; });
    const updateStaff = (updatedStaff: Staff) => setStaff(prev => { const newState = prev.map(s => s.id === updatedStaff.id ? updatedStaff : s); saveDataToLocalDB('staff', newState); return newState; });
    const deleteStaff = (id: number) => setStaff(prev => { const newState = prev.filter(s => s.id !== id); saveDataToLocalDB('staff', newState); return newState; });

    const addClass = (classData: Omit<Class, 'id' | 'teacherName' | 'studentCount'>) => setClasses(prev => { const newState = [...prev, { ...classData, id: Date.now(), teacherName: '', studentCount: 0 }]; saveDataToLocalDB('classes', newState); return newState; });
    const updateClass = (updatedClass: Omit<Class, 'teacherName' | 'studentCount'>) => setClasses(prev => { const newState = prev.map(c => c.id === updatedClass.id ? { ...c, ...updatedClass } : c); saveDataToLocalDB('classes', newState); return newState; });
    const deleteClass = (id: number) => setClasses(prev => { const newState = prev.filter(c => c.id !== id); saveDataToLocalDB('classes', newState); return newState; });

    const addSubject = (subject: Omit<Subject, 'id'>) => setSubjects(prev => { const newState = [...prev, { ...subject, id: Date.now() }]; saveDataToLocalDB('subjects', newState); return newState; });
    const updateSubject = (updatedSubject: Subject) => setSubjects(prev => { const newState = prev.map(s => s.id === updatedSubject.id ? updatedSubject : s); saveDataToLocalDB('subjects', newState); return newState; });
    const deleteSubject = (id: number) => setSubjects(prev => { const newState = prev.filter(s => s.id !== id); saveDataToLocalDB('subjects', newState); return newState; });

    const updateSettings = (settings: SystemSettings) => updateAndPersist('systemSettings', setSystemSettings, settings);
    
    const addUser = (user: Omit<UserAccount, 'id' | 'lastLogin'>) => setUsers(prev => { const newState = [...prev, { ...user, id: Date.now(), lastLogin: new Date().toISOString() }]; saveDataToLocalDB('users', newState); return newState; });
    const updateUser = (updatedUser: UserAccount) => setUsers(prev => { const newState = prev.map(u => u.id === updatedUser.id ? updatedUser : u); saveDataToLocalDB('users', newState); return newState; });
    const deleteUser = (id: number) => setUsers(prev => { const newState = prev.filter(u => u.id !== id); saveDataToLocalDB('users', newState); return newState; });
    
    const updateAIConfiguration = (config: AIConfiguration) => updateAndPersist('aiConfiguration', setAIConfiguration, config);
    
    const updateClassCurriculum = (classId: number, curriculum: ClassCurriculum[]) => setClassCurriculum(prev => {
        const otherClassCurriculum = prev.filter(cc => cc.classId !== classId);
        const newState = [...otherClassCurriculum, ...curriculum];
        saveDataToLocalDB('classCurriculum', newState);
        return newState;
    });

    const updateTeacherAssignments = (teacherId: number, assignments: { classId: number, subjectId: number }[]) => {
        setClassCurriculum(prev => {
            const otherTeachersAssignments = prev.filter(cc => cc.teacherId !== teacherId);
            const newAssignmentsForTeacher = assignments.map(a => ({ ...a, teacherId }));
            const newState = [...otherTeachersAssignments, ...newAssignmentsForTeacher];
            saveDataToLocalDB('classCurriculum', newState);
            return newState;
        });
    };

    const addTransaction = (transaction: Omit<Transaction, 'id'>) => setTransactions(prev => { const newState = [...prev, { ...transaction, id: Date.now() }]; saveDataToLocalDB('transactions', newState); return newState; });
    const updateTransaction = (updatedTransaction: Transaction) => setTransactions(prev => { const newState = prev.map(t => t.id === updatedTransaction.id ? updatedTransaction : t); saveDataToLocalDB('transactions', newState); return newState; });
    const deleteTransaction = (id: number) => setTransactions(prev => { const newState = prev.filter(t => t.id !== id); saveDataToLocalDB('transactions', newState); return newState; });

    const addCategory = (category: Omit<Category, 'id'>) => setCategories(prev => { const newState = [...prev, { ...category, id: Date.now() }]; saveDataToLocalDB('categories', newState); return newState; });
    const updateCategory = (updatedCategory: Category) => setCategories(prev => { const newState = prev.map(c => c.id === updatedCategory.id ? updatedCategory : c); saveDataToLocalDB('categories', newState); return newState; });
    const deleteCategory = (id: number) => setCategories(prev => { const newState = prev.filter(c => c.id !== id); saveDataToLocalDB('categories', newState); return newState; });

    const addScholarship = (scholarship: Omit<Scholarship, 'id'>) => setScholarships(prev => { const newState = [...prev, { ...scholarship, id: Date.now() }]; saveDataToLocalDB('scholarships', newState); return newState; });
    const updateScholarship = (updatedScholarship: Scholarship) => setScholarships(prev => { const newState = prev.map(s => s.id === updatedScholarship.id ? updatedScholarship : s); saveDataToLocalDB('scholarships', newState); return newState; });
    const deleteScholarship = (id: number) => setScholarships(prev => { const newState = prev.filter(s => s.id !== id); saveDataToLocalDB('scholarships', newState); return newState; });
    
    const addPaymentMethod = (method: Omit<PaymentMethod, 'id'>) => setPaymentMethods(prev => { const newState = [...prev, { ...method, id: Date.now() }]; saveDataToLocalDB('paymentMethods', newState); return newState; });
    const updatePaymentMethod = (updatedMethod: PaymentMethod) => setPaymentMethods(prev => { const newState = prev.map(m => m.id === updatedMethod.id ? updatedMethod : m); saveDataToLocalDB('paymentMethods', newState); return newState; });
    const deletePaymentMethod = (id: number) => setPaymentMethods(prev => { const newState = prev.filter(m => m.id !== id); saveDataToLocalDB('paymentMethods', newState); return newState; });

    const addMessageTemplate = (template: Omit<MessageTemplate, 'id'>) => setMessageTemplates(prev => { const newState = [...prev, { ...template, id: Date.now() }]; saveDataToLocalDB('messageTemplates', newState); return newState; });
    const updateMessageTemplate = (updatedTemplate: MessageTemplate) => setMessageTemplates(prev => { const newState = prev.map(t => t.id === updatedTemplate.id ? updatedTemplate : t); saveDataToLocalDB('messageTemplates', newState); return newState; });
    const deleteMessageTemplate = (id: number) => setMessageTemplates(prev => { const newState = prev.filter(t => t.id !== id); saveDataToLocalDB('messageTemplates', newState); return newState; });

    const addBook = (book: Omit<Book, 'id' | 'availableStock'>) => setBooks(prev => { const newState = [...prev, { ...book, id: Date.now(), availableStock: book.totalStock }]; saveDataToLocalDB('books', newState); return newState; });
    const updateBook = (updatedBook: Book) => setBooks(prev => { const newState = prev.map(b => b.id === updatedBook.id ? updatedBook : b); saveDataToLocalDB('books', newState); return newState; });
    const deleteBook = (id: number) => setBooks(prev => { const newState = prev.filter(b => b.id !== id); saveDataToLocalDB('books', newState); return newState; });

    const addLoan = (loan: Omit<BookLoan, 'id' | 'status'>) => {
        setBooks(prevBooks => {
            const bookToUpdate = prevBooks.find(b => b.id === loan.bookId);
            if (bookToUpdate && bookToUpdate.availableStock > 0) {
                const updatedBooks = prevBooks.map(b => b.id === loan.bookId ? { ...b, availableStock: b.availableStock - 1 } : b);
                saveDataToLocalDB('books', updatedBooks);
                setBookLoans(prevLoans => {
                    const newLoanState = [...prevLoans, { ...loan, id: Date.now(), status: 'Em Dia' as const }];
                    saveDataToLocalDB('bookLoans', newLoanState);
                    return newLoanState;
                });
                return updatedBooks;
            }
            return prevBooks;
        });
    };
    
    const returnLoan = (loanId: number) => {
        setBookLoans(prevLoans => {
            const loanToReturn = prevLoans.find(l => l.id === loanId);
            if (loanToReturn) {
                setBooks(prevBooks => {
                    const updatedBooks = prevBooks.map(b => b.id === loanToReturn.bookId ? { ...b, availableStock: b.availableStock + 1 } : b);
                    saveDataToLocalDB('books', updatedBooks);
                    return updatedBooks;
                });
            }
            const newLoanState = prevLoans.map(l => l.id === loanId ? { ...l, status: 'Devolvido' as const, returnDate: new Date().toISOString().split('T')[0] } : l);
            saveDataToLocalDB('bookLoans', newLoanState);
            return newLoanState;
        });
    };
    
    const updateAnnouncement = (announcement: Announcement) => setAnnouncements(prev => { const newState = prev.map(a => a.id === announcement.id ? announcement : a); saveDataToLocalDB('announcements', newState); return newState; });

    const value: DataContextType = {
        isLoading, students, teachers, staff, subjects, classes: classesWithDetails, transactions,
        categories, scholarships, announcements, books, bookLoans, lessonPlans, systemSettings,
        users, healthRecords, grades, calendarEvents, classCurriculum, studentScholarships,
        tuition, attendance, activities, aiConfiguration, messageTemplates, paymentMethods,
        addStudent, updateStudent, deleteStudent, addTeacher, updateTeacher, deleteTeacher,
        addStaff, updateStaff, deleteStaff, addClass, updateClass, deleteClass, addSubject,
        updateSubject, deleteSubject, updateSettings, addUser, updateUser, deleteUser,
        updateAIConfiguration,
        updateClassCurriculum, updateTeacherAssignments, addTransaction, updateTransaction, deleteTransaction,
        addCategory, updateCategory, deleteCategory, addScholarship, updateScholarship, deleteScholarship,
        addPaymentMethod, updatePaymentMethod, deletePaymentMethod, addMessageTemplate, updateMessageTemplate,
        deleteMessageTemplate, addBook, updateBook, deleteBook, addLoan, returnLoan, updateAnnouncement
    };

    return (
        <DataContext.Provider value={value}>
            {children}
        </DataContext.Provider>
    );
};

export const useData = () => {
    const context = useContext(DataContext);
    if (context === undefined) {
        throw new Error('useData must be used within a DataProvider');
    }
    return context;
};