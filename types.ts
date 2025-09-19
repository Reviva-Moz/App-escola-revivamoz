

export type UserRole = 'ADMINISTRADOR' | 'DIRETORIA' | 'SECRETARIA' | 'RESPONSAVEL' | 'PROFESSOR' | 'ALUNO';

export interface User {
  email: string;
  role: UserRole;
}

export interface Student {
  id: number;
  name: string;
  class: string;
  classId: number;
  age: number;
  guardian: string;
  phone: string;
  status: 'Ativo' | 'Inativo';
  nuit?: string;
  healthNotes?: string;
  photoUrl?: string;
}

export interface Teacher {
    id: number;
    name: string;
    email: string;
    phone: string;
    qualifications: string;
    status: 'Ativo' | 'Inativo';
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
}

export interface ClassCurriculum {
  classId: number;
  subjectId: number;
  teacherId: number;
}

export interface FinancialCategory {
  name: string;
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
    status: 'Pago' | 'Atrasado' | 'Pendente';
}

export interface GradeRecord {
  nota1: number | string;
  nota2: number | string;
  finalExam: number | string;
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
  type: 'Feriado' | 'Evento' | 'Prova' | 'Prazo';
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

export interface Announcement {
  id: number;
  title: string;
  content: string;
  target: 'Todos' | 'Professores' | 'Pais' | string; // string for specific class
  date: string; // ISO string date
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