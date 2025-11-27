

export type UserRole = 'ADMINISTRADOR' | 'DIRETORIA' | 'SECRETARIA' | 'RESPONSAVEL' | 'PROFESSOR' | 'ALUNO';

export interface User {
  email: string;
  role: UserRole;
}

export interface UserAccount {
  id: number;
  email: string;
  role: UserRole;
  lastLogin: string;
  password?: string;
}

export interface Document {
  name: string;
  size: number; // in bytes
  url: string; // can be a data URL or a mock URL
  uploadedAt: string; // ISO string date
}

export interface Student {
  id: number;
  name: string;
  class: string;
  classId: number;
  age: number; // Mantido para retrocompatibilidade, mas formulário usará birthDate
  birthDate?: string;
  gender?: 'Masculino' | 'Feminino' | 'Outro';
  idNumber?: string; // BI
  email?: string;
  address?: string;
  studentPhone?: string;
  guardian: string;
  phone: string; // Telefone do Encarregado
  status: 'Ativo' | 'Inativo';
  nuit?: string;
  healthNotes?: string;
  photoUrl?: string;
  documents?: Document[];
}

export interface Teacher {
    id: number;
    name: string;
    email: string;
    phone: string;
    qualifications: string;
    status: 'Ativo' | 'Inativo';
    photoUrl?: string;
    documents?: Document[];
}

export interface Staff {
    id: number;
    name: string;
    role: string;
    department: string;
    email: string;
    phone: string;
    status: 'Ativo' | 'Inativo';
    nuit?: string;
    photoUrl?: string;
    documents?: Document[];
}

export interface Subject {
    id: number;
    name: string;
    code: string;
    workload: number; // in hours
}

export interface Class {
    id: number;
    name: string;
    year: number;
    teacherId: number | null;
    teacherName: string;
    studentCount: number;
    className?: string; // Ex: "10ª Classe"
    room?: string; // Ex: "Sala 101"
    maxCapacity?: number;
}

export interface ClassCurriculum {
  classId: number;
  subjectId: number;
  teacherId: number;
}

export interface FinancialCategory {
  name:string;
  amount: number;
  color: string;
}

export interface Enrollment {
  id: number;
  studentName: string;
  date: string;
  amount: number;
  discount: number;
  status: 'Pago' | 'Pendente';
}

export interface Tuition {
    id: number;
    studentId: number; // Reference student by ID for better data relations
    studentName: string;
    month: string;
    dueDate: string;
    amount: number;
    status: 'Pago' | 'Atrasado' | 'Pendente' | 'Em Cobrança';
    reminderScheduledAt?: string; // ISO string for scheduled date and time
    reminderType?: 'whatsapp' | 'sms' | null;
}

export interface GradeRecord {
  nota1: number | string;
  nota2: number | string;
  finalExam: number | string;
  observations?: string;
}

export interface StudentGrades {
  studentId: number;
  gradesBySubject: {
    [subjectId: number]: GradeRecord;
  };
}

export interface CalendarEvent {
  id: number;
  title: string;
  date: string; // YYYY-MM-DD
  type: 'Feriado' | 'Evento' | 'Prova' | 'Prazo' | 'Plano de Aula';
  description?: string;
  createdAt: string; // ISO string date
  classId?: number;
  subjectId?: number;
}

export interface Category {
  id: number;
  name: string;
  type: 'Receita' | 'Despesa';
}

export interface Scholarship {
  id: number;
  name: string;
  type: 'Percentagem' | 'Valor Fixo';
  value: number; // The percentage or the fixed amount
}

export interface StudentScholarship {
  studentId: number;
  scholarshipId: number;
}

export interface Transaction {
  id: number;
  date: string; // YYYY-MM-DD
  description: string;
  type: 'Receita' | 'Despesa';
  categoryId: number;
  amount: number;
  paymentMethod?: 'Dinheiro' | 'Transferência' | 'Digital';
}

export type AnnouncementCategory = 'Informativo' | 'Urgente' | 'Evento';

export interface Announcement {
  id: number;
  title: string;
  content: string;
  target: 'Todos' | 'Professores' | 'Pais' | string; // string for specific class
  category: AnnouncementCategory;
  date: string; // ISO string date
  attachments?: Document[];
  readBy?: number[]; // Mock user IDs
}

export interface Book {
  id: number;
  title: string;
  author: string;
  isbn: string;
  totalStock: number;
  availableStock: number;
}

export interface BookLoan {
  id: number;
  bookId: number;
  studentId: number;
  loanDate: string; // YYYY-MM-DD
  dueDate: string; // YYYY-MM-DD
  returnDate?: string; // YYYY-MM-DD
  status: 'Em Dia' | 'Atrasado' | 'Devolvido';
}

export interface LessonPlan {
  id: number;
  classId: number;
  subjectId: number;
  title: string;
  date: string; // YYYY-MM-DD
  objectives: string;
  content: string;
  resources: string;
}

export interface SystemSettings {
  schoolName: string;
  address: string;
  phone: string;
  email: string;
  currentAcademicYear: number;
  defaultTuition: number;
}

export interface HealthRecord {
  id: number;
  studentId: number;
  date: string; // YYYY-MM-DD
  description: string;
  actionTaken: string;
  recordedBy: string; // Name of staff member
}

export interface PaymentMethod {
  id: number;
  name: string;
  type: 'Digital' | 'Físico';
  instructions: string;
  status: 'Ativo' | 'Inativo';
}

export interface Activity {
  id: number;
  type: 'new_student' | 'new_teacher' | 'payment' | 'announcement';
  description: string;
  date: string; // ISO string date
  link?: string;
}

export interface AttendanceRecord {
  id: number;
  studentId: number;
  date: string; // YYYY-MM-DD
  status: 'Presente' | 'Ausente' | 'Justificado';
  subjectId: number;
}

export interface CustomInputField {
  id: string;
  label: string;
  placeholder: string;
  type: 'text' | 'textarea';
}

export interface AIConfiguration {
  trainingText: string;
  input_fields: CustomInputField[];
}

export interface AnalyzedStudent {
  studentId: number;
  name: string;
  class: string;
  reason: string;
  recommendation: string;
}

export interface PredictiveAnalysisResult {
  atRiskStudents: AnalyzedStudent[];
  highPerformingStudents: AnalyzedStudent[];
  generalRecommendations: string[];
}

export interface MessageTemplate {
    id: number;
    name: string;
    shortcut: string;
    content: string;
}

interface CrudFunctions<T, C, U> {
  add: (item: C) => void;
  update: (item: U) => void;
  delete: (id: number) => void;
}

export interface CoreDataContextType {
  isLoading: boolean;
  students: Student[];
  teachers: Teacher[];
  staff: Staff[];
  subjects: Subject[];
  classes: Class[];
  classCurriculum: ClassCurriculum[];
  studentScholarships: StudentScholarship[];
  activities: Activity[];

  addStudent: (student: Omit<Student, 'id' | 'class'>) => void;
  updateStudent: (student: Omit<Student, 'id' | 'class'> & { id: number }) => void;
  deleteStudent: (id: number) => void;
  addTeacher: (teacher: Omit<Teacher, 'id'>) => void;
  updateTeacher: (teacher: Teacher) => void;
  deleteTeacher: (id: number) => void;
  addStaff: (staffMember: Omit<Staff, 'id'>) => void;
  updateStaff: (staffMember: Staff) => void;
  deleteStaff: (id: number) => void;
  addClass: (classData: Omit<Class, 'id'| 'teacherName' | 'studentCount'>) => void;
  updateClass: (classData: Omit<Class, 'teacherName' | 'studentCount'> & { id: number }) => void;
  deleteClass: (id: number) => void;
  addSubject: (subject: Omit<Subject, 'id'>) => void;
  updateSubject: (subject: Subject) => void;
  deleteSubject: (id: number) => void;
  updateClassCurriculum: (classId: number, curriculum: ClassCurriculum[]) => void;
  updateTeacherAssignments: (teacherId: number, assignments: { classId: number, subjectId: number }[]) => void;
}

export interface FinancialContextType {
  transactions: Transaction[];
  categories: Category[];
  scholarships: Scholarship[];
  paymentMethods: PaymentMethod[];
  tuition: Tuition[];

  addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  updateTransaction: (transaction: Transaction) => void;
  deleteTransaction: (id: number) => void;
  addCategory: (category: Omit<Category, 'id'>) => void;
  updateCategory: (category: Category) => void;
  deleteCategory: (id: number) => void;
  addScholarship: (scholarship: Omit<Scholarship, 'id'>) => void;
  updateScholarship: (scholarship: Scholarship) => void;
  deleteScholarship: (id: number) => void;
  addPaymentMethod: (method: Omit<PaymentMethod, 'id'>) => void;
  updatePaymentMethod: (method: PaymentMethod) => void;
  deletePaymentMethod: (id: number) => void;
}

export interface AcademicContextType {
    isLoading: boolean;
    grades: StudentGrades[];
    attendance: AttendanceRecord[];
    lessonPlans: LessonPlan[];
    calendarEvents: CalendarEvent[];

    updateGrade: (studentId: number, subjectId: number, field: keyof GradeRecord, value: string | number) => void;
    saveAttendance: (records: Omit<AttendanceRecord, 'id'>[]) => void;
    addLessonPlan: (plan: Omit<LessonPlan, 'id'>) => void;
    updateLessonPlan: (plan: LessonPlan) => void;
    deleteLessonPlan: (id: number) => void;
    addEvent: (event: Omit<CalendarEvent, 'id' | 'createdAt'>) => void;
    updateEvent: (event: CalendarEvent) => void;
    deleteEvent: (id: number) => void;
}

export interface AdminContextType {
    announcements: Announcement[];
    books: Book[];
    bookLoans: BookLoan[];
    systemSettings: SystemSettings;
    users: UserAccount[];
    healthRecords: HealthRecord[];
    aiConfiguration: AIConfiguration;
    messageTemplates: MessageTemplate[];

    updateSettings: (settings: SystemSettings) => void;
    addUser: (user: Omit<UserAccount, 'id'|'lastLogin'>) => void;
    updateUser: (user: UserAccount) => void;
    deleteUser: (id: number) => void;
    updateAIConfiguration: (config: AIConfiguration) => void;
    addMessageTemplate: (template: Omit<MessageTemplate, 'id'>) => void;
    updateMessageTemplate: (template: MessageTemplate) => void;
    deleteMessageTemplate: (id: number) => void;
    addBook: (book: Omit<Book, 'id' | 'availableStock'>) => void;
    updateBook: (book: Book) => void;
    deleteBook: (id: number) => void;
    addLoan: (loan: Omit<BookLoan, 'id' | 'status'>) => void;
    returnLoan: (loanId: number) => void;
    updateAnnouncement: (announcement: Announcement) => void;
}