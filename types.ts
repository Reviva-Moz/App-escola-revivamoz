
export interface Student {
  id: number;
  name: string;
  class: string;
  classId: number;
  age: number;
  guardian: string;
  phone: string;
  status: 'Ativo' | 'Inativo';
}

export interface Teacher {
    id: number;
    name: string;
    email: string;
    phone: string;
    qualifications: string;
    status: 'Ativo' | 'Inativo';
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
    teacherName: string;
    studentCount: number;
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
