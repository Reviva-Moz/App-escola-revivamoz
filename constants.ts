import { Student, Teacher, Subject, Class, FinancialCategory, Enrollment, Tuition, StudentGrades, CalendarEvent, ClassCurriculum } from './types';

export const REVIVA_LOGO_BASE64 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAABAAAAAJEAQMAAAAA9rB1AAAABlBMVEUAAAAzWik9J2uLAAADdElEQVR42u3bS4/jMBgH8P9T3T1tJ5100k6/oU7bqZN2agcdbSnv2oBN+RvJzGQ2w2yBfH/gJxtJ3pC0/okgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACAYfu9w/t4Nq3bdV1X/uX2q5/36/V6v9/vD9D0AXsA9QL2Ldp9wPqBvYJ1a+AD9gPYM7BXsA7BfoO9C/Yx2C/Yv2CvYP2CvY/2E9hPsM/BfoN9A/YY9hPsE9inYF+BvYoFEuwz2AewH8E+BvsY9jPY52CfYV+CvYd9B/Yt2Mdg/4K9C/Ys2A/Yv2APYN+BfQ/2GdgfYG+BvQP2C9hvYM+DPQn2C9iPYL+APYV9C/Yx2Kdg/4I9B/se7Ldg/YM9DPYd2C/Yj2C/gL0E9gvY72Dfgf0I9gfYf2A/gn0G9ifYf2Bfgf0G9gvsS7Dfgf0H9ifY92D/gH0B9iPYL2Bfgf0C9hfY32D/gP0J9gvsU7BfYP+AfQz2C9j3YH+CvQ/2I9jvYF+D/Q/2E9hfYF+B/Q32F9gfYX+A/Q72H9hfYL+AfQr2G9gvYJ+D/Qz2L9ivYH+C/Qr2J9gfYH+B/QL2H9gfYP+AfQD2H9gfYL+AfQ32J9iPYB+AvQT2C9gfYF+CfQP2B9hvYL+C/Qj2I9g/YL+A/Qr2I9iPYH+B/QL2L9hvYH+C/QL2E9hvYP+B/QL2F9hfYJ+C/QD2F9ifYH+C/Qr2H9ifYL+AfQr2B9gvYH+D/Qz2B9jPYJ+C/Qr2C9gfYD+A/Qb2B9gPYP+A/Qr2I9gfYD+A/QL2B9ifYJ+C/Qz2I9gfYL+AfQD2C9jPYJ+C/QD2B9ivYH+A/QL2I9gfYD+A/Qr2J9ifYH+A/Qb2I9ifYH+B/Qj2C9hvYJ+C/QD2B9h/YL+AfQr2M9ifYH+A/Qr2F9ivYH+A/QL2M9jPYH+C/QD2B9jPYB+A/Qb2M9gfYH+A/Qr2B9jPYH+A/QL2B9gvYH+C/Qj2C9ivYH+A/Qj2C9ifYH+A/Qj2J9gvYL+C/QD2M9hfYL+A/Qr2C9gfYD+A/Q72C9jPYH+C/Qr2I9gfYD+A/QD2F9gvYL+A/QD2J9h/YL+C/QL2M9gfYH+A/Q72B9gfYL+A/Qr2F9gvYJ+A/QD2M9ivYH+A/QL2J9gfYL+AfQr2C9ivYH+A/Qr2B9gfYH+A/Qb2C9hvYH+A/QD2B9gvYH+A/Qr2M9gfYH+C/QL2B9gfYL+AfQ72C9jPYJ+B/QL2M9jPYH+A/Qr2B9ifYH+A/Qr2C9hvYH+B/QD2E9ifYH+A/Qj2B9jPYH+C/Qj2B9gvYH+B/QD2I9gfYL+C/Qj2M9jPYB+A/QD2B9gvYL+A/Qj2B9ivYH+A/QD2F9h/YL+AfQr2B9gvYH+B/QL2C9hfYL+A/Qj2B9gfYL+AfQr2C9jPYH+A/Qj2B9hvYH+A/Qr2C9gfYD+A/Qj2B9gfYL+A/Qz2M9hfYH+B/QL2B9ivYH+B/QD2E9ifYJ+B/QL2B9hvYJ+B/QD2M9hfYL+AfQz2B9jPYH+C/Qr2B9jPYH+A/QD2E9gfYL+B/QD2B9jPYP+AfQr2M9hfYL+AfQD2C9jPYD+A/Qz2M9ifYH+A/QL2B9jPYB+B/QD2M9gvYH+A/QD2B9gvYJ+C/Qj2M9ivYJ+B/QL2B9ivYH+B/Qj2B9hfYL+A/Qj2B9ifYL+C/QD2B9hfYL+A/Qj2B9jPYH+C/Qj2B9ifYH+A/QD2B9jPYB+B/Qj2B9gfYD+A/QD2J9hfYH+A/QL2C9ivYJ+B/Qr2C9ifYH+B/QD2B9hfYH+C/Qj2B9jPYH+B/Qj2J9gfYH+B/Qj2B9hfYL+A/QD2B9ifYL+B/Qj2B9gfYP+AfQr2B9jPYP+AfQD2B9jPYB+B/Qj2B9gfYL+A/Qr2B9jPYH+C/Qj2B9gvYH+C/QD2B9ifYH+C/Qj2B9ifYH+A/QD2J9gfYJ+B/Qj2B9ivYH+A/QD2B9ivYJ+C/Qr2B9ifYJ+B/QD2C9gfYD+A/QD2B9hvYH+B/Qj2C9gfYD+A/Qr2B9ifYH+A/QD2E9gfYD+A/QD2B9gfYJ+A/Qj2B9jPYB+B/Qr2C9ifYJ+A/QD2B9hfYH+B/Qj2C9jPYB+B/Qj2B9hfYH+A/Qj2J9hfYH+B/QD2C9ifYH+A/Qj2M9gfYJ+A/Qj2C9hvYH+A/QD2B9hfYH+B/Qj2B9hfYH+B/Qj2B9gfYL+B/QD2M9ifYL+AfQD2E9ifYH+C/Qr2C9ifYH+C/QD2M9gfYL+A/QD2M9ifYH+B/QD2B9gfYB+A/QAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAALj+AcZ+Ew1xI9ZzAAAAAElFTkSuQmCC';

export const TOTAL_STUDENTS = 342;
export const TOTAL_TEACHERS = 28;
export const APPROVAL_RATE = 94;

export const FINANCIAL_SUMMARY = {
  totalRevenue: 233600,
  totalExpenses: 88900,
  currentBalance: 144700,
  defaults: 1500,
};

export const REVENUE_CATEGORIES: FinancialCategory[] = [
  { name: 'Matrículas', amount: 125000, color: '#10B981' },
  { name: 'Mensalidades', amount: 67500, color: '#3B82F6' },
  { name: 'Uniformes', amount: 15600, color: '#F59E0B' },
  { name: 'Doações', amount: 12000, color: '#8B5CF6' },
  { name: 'Material Escolar', amount: 8500, color: '#EC4899' },
  { name: 'Eventos', amount: 5000, color: '#6366F1' },
];

export const EXPENSE_CATEGORIES: FinancialCategory[] = [
  { name: 'Salários', amount: 63000, color: '#EF4444' },
  { name: 'Material Didático', amount: 8000, color: '#F97316' },
  { name: 'Alimentação', amount: 6500, color: '#D97706' },
  { name: 'Utilities', amount: 4700, color: '#0EA5E9' },
  { name: 'Transporte', amount: 4200, color: '#14B8A6' },
  { name: 'Manutenção', amount: 2500, color: '#6B7280' },
];

export const STUDENTS_DATA: Student[] = [
  { id: 1, name: 'Ana Silva', class: '5ª Classe', classId: 1, age: 10, guardian: 'João Silva', phone: '84 123 4567', status: 'Ativo' },
  { id: 2, name: 'Bruno Costa', class: '7ª Classe', classId: 2, age: 12, guardian: 'Maria Costa', phone: '82 987 6543', status: 'Ativo' },
  { id: 3, name: 'Carla Dias', class: '3ª Classe', classId: 3, age: 8, guardian: 'Pedro Dias', phone: '86 555 1234', status: 'Ativo' },
  { id: 4, name: 'David Martins', class: '5ª Classe', classId: 1, age: 5, guardian: 'Sofia Martins', phone: '84 111 2233', status: 'Ativo' },
  { id: 5, name: 'Elisa Ferreira', class: '7ª Classe', classId: 2, age: 11, guardian: 'Rui Ferreira', phone: '82 444 5566', status: 'Ativo' },
  { id: 6, name: 'Fábio Gomes', class: '3ª Classe', classId: 3, age: 7, guardian: 'Cátia Gomes', phone: '87 777 8899', status: 'Ativo' },
];

export const TEACHERS_DATA: Teacher[] = [
    { id: 1, name: 'Carlos Neto', email: 'carlos.neto@reviva.com', phone: '84 111 2222', qualifications: 'Licenciatura em Pedagogia', status: 'Ativo' },
    { id: 2, name: 'Fernanda Alves', email: 'fernanda.alves@reviva.com', phone: '82 333 4444', qualifications: 'Mestrado em Matemática', status: 'Ativo' },
    { id: 3, name: 'Mariana Lima', email: 'mariana.lima@reviva.com', phone: '86 555 6666', qualifications: 'Licenciatura em Letras', status: 'Ativo' },
    { id: 4, name: 'Ricardo Sousa', email: 'ricardo.sousa@reviva.com', phone: '87 888 9999', qualifications: 'Doutoramento em Ciências', status: 'Inativo' },
];

export const SUBJECTS_DATA: Subject[] = [
    { id: 1, name: 'Matemática', code: 'MAT01', workload: 80 },
    { id: 2, name: 'Língua Portuguesa', code: 'LP01', workload: 100 },
    { id: 3, name: 'Ciências Naturais', code: 'CN01', workload: 60 },
    { id: 4, name: 'História', code: 'HIS01', workload: 50 },
    { id: 5, name: 'Geografia', code: 'GEO01', workload: 50 },
];

export const CLASSES_DATA: Class[] = [
    { id: 1, name: '5ª Classe A', year: 2024, teacherId: 2, teacherName: 'Fernanda Alves', studentCount: 25 },
    { id: 2, name: '7ª Classe B', year: 2024, teacherId: 4, teacherName: 'Ricardo Sousa', studentCount: 22 },
    { id: 3, name: '3ª Classe Única', year: 2024, teacherId: 3, teacherName: 'Mariana Lima', studentCount: 30 },
];

export const CLASS_CURRICULUM_DATA: ClassCurriculum[] = [
  // Class 1: 5ª Classe A
  { classId: 1, subjectId: 1, teacherId: 2 }, // Matemática, Fernanda Alves
  { classId: 1, subjectId: 2, teacherId: 3 }, // Língua Portuguesa, Mariana Lima
  
  // Class 2: 7ª Classe B
  { classId: 2, subjectId: 1, teacherId: 2 }, // Matemática, Fernanda Alves
  { classId: 2, subjectId: 3, teacherId: 1 }, // Ciências Naturais, Carlos Neto
  { classId: 2, subjectId: 4, teacherId: 1 }, // História, Carlos Neto
  
  // Class 3: 3ª Classe Única
  { classId: 3, subjectId: 2, teacherId: 3 }, // Língua Portuguesa, Mariana Lima
  { classId: 3, subjectId: 5, teacherId: 1 }, // Geografia, Carlos Neto
];

export const GRADES_DATA: StudentGrades[] = [
  {
    studentId: 1, // Ana Silva
    gradesBySubject: {
      1: { nota1: 15, nota2: 18, finalExam: 16 }, // Math
      2: { nota1: 17, nota2: 14, finalExam: 15 }, // Portuguese
    },
  },
  {
    studentId: 4, // David Martins
    gradesBySubject: {
      1: { nota1: 12, nota2: 14, finalExam: '' }, // Math
      2: { nota1: 10, nota2: 11, finalExam: 12 }, // Portuguese
    }
  },
  {
    studentId: 2, // Bruno Costa
    gradesBySubject: {
      1: { nota1: 19, nota2: 20, finalExam: 18 }, // Math
      3: { nota1: 16, nota2: 17, finalExam: 17 }, // Science
    }
  },
    {
    studentId: 5, // Elisa Ferreira
    gradesBySubject: {
      1: { nota1: '', nota2: '', finalExam: '' }, // Math
      3: { nota1: 14, nota2: 15, finalExam: '' }, // Science
    }
  },
];


export const ENROLLMENTS_DATA: Enrollment[] = [
    { id: 1, studentName: 'Ana Silva', date: '2024-01-10', amount: 5000, discount: 0, status: 'Pago' },
    { id: 2, studentName: 'Bruno Costa', date: '2024-01-11', amount: 5000, discount: 500, status: 'Pago' },
    { id: 3, studentName: 'Carla Dias', date: '2024-01-12', amount: 5000, discount: 0, status: 'Pago' },
    { id: 4, studentName: 'Novo Aluno', date: '2024-07-20', amount: 5000, discount: 0, status: 'Pendente' },
];

export const TUITION_DATA: Tuition[] = [
    { id: 1, studentName: 'Ana Silva', month: 'Julho', dueDate: '2024-07-05', amount: 1500, status: 'Pago' },
    { id: 2, studentName: 'Bruno Costa', month: 'Julho', dueDate: '2024-07-05', amount: 1500, status: 'Pago' },
    { id: 3, studentName: 'Carla Dias', month: 'Junho', dueDate: '2024-06-05', amount: 1500, status: 'Atrasado' },
    { id: 4, studentName: 'David Martins', month: 'Julho', dueDate: '2024-07-05', amount: 1500, status: 'Pendente' },
    { id: 5, studentName: 'Elisa Ferreira', month: 'Julho', dueDate: '2024-07-05', amount: 1500, status: 'Pago' },
];

export const CLASS_DISTRIBUTION_DATA = [
    { name: 'Jardim', Alunos: 60 },
    { name: '1ª Classe', Alunos: 55 },
    { name: '2ª Classe', Alunos: 52 },
    { name: '3ª Classe', Alunos: 48 },
    { name: '4ª Classe', Alunos: 45 },
    { name: '5ª Classe', Alunos: 42 },
    { name: '6ª Classe', Alunos: 25 },
    { name: '7ª Classe', Alunos: 15 },
];

export const CALENDAR_EVENTS_DATA: CalendarEvent[] = [
    {
        id: 1,
        title: "Início do 2º Trimestre",
        date: "2024-04-15",
        type: 'Evento',
        description: "Marca o começo do segundo trimestre letivo.",
        createdAt: "2024-01-10T10:00:00.000Z",
    },
    {
        id: 2,
        title: "Dia da Paz",
        date: "2024-04-04",
        type: 'Feriado',
        description: "Feriado nacional. Não haverá aulas.",
        createdAt: "2024-01-10T10:00:00.000Z",
    },
    {
        id: 3,
        title: "Prova de Matemática - 7ª Classe",
        date: "2024-05-20",
        type: 'Prova',
        createdAt: "2024-05-01T14:30:00.000Z",
    },
    {
        id: 4,
        title: "Prazo Pagamento Mensalidade",
        date: "2024-05-05",
        type: 'Prazo',
        description: "Data limite para o pagamento da mensalidade de Maio sem multa.",
        createdAt: "2024-04-01T09:00:00.000Z",
    },
     {
        id: 5,
        title: "Prazo Pagamento Mensalidade",
        date: "2024-06-05",
        type: 'Prazo',
        description: "Data limite para o pagamento da mensalidade de Junho sem multa.",
        createdAt: "2024-05-01T09:00:00.000Z",
    },
    {
        id: 6,
        title: "Reunião de Pais e Mestres",
        date: "2024-06-28",
        type: 'Evento',
        description: "Reunião para entrega de notas e discussão do desempenho dos alunos.",
        createdAt: "2024-06-10T11:00:00.000Z",
    },
];