import { Student, Teacher, Subject, Class, FinancialCategory, Enrollment, Tuition, StudentGrades, CalendarEvent, ClassCurriculum, Category, Scholarship, StudentScholarship, Transaction } from './types';

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

export const CATEGORIES_DATA: Category[] = [
  // Receitas
  { id: 1, name: 'Mensalidades', type: 'Receita' },
  { id: 2, name: 'Matrículas', type: 'Receita' },
  { id: 3, name: 'Uniformes', type: 'Receita' },
  { id: 4, name: 'Material Escolar', type: 'Receita' },
  { id: 5, name: 'Eventos', type: 'Receita' },
  { id: 6, name: 'Doações', type: 'Receita' },
  // Despesas
  { id: 101, name: 'Salários', type: 'Despesa' },
  { id: 102, name: 'Material Didático', type: 'Despesa' },
  { id: 103, name: 'Alimentação', type: 'Despesa' },
  { id: 104, name: 'Utilities (Água, Luz, Internet)', type: 'Despesa' },
  { id: 105, name: 'Transporte', type: 'Despesa' },
  { id: 106, name: 'Manutenção e Reparos', type: 'Despesa' },
];

export const SCHOLARSHIPS_DATA: Scholarship[] = [
  { id: 1, name: 'Bolsa de Mérito Académico', type: 'Percentagem', value: 25 }, // 25%
  { id: 2, name: 'Apoio Social', type: 'Valor Fixo', value: 500 }, // 500 MZN
  { id: 3, name: 'Bolsa de Desporto', type: 'Percentagem', value: 15 }, // 15%
];

export const STUDENT_SCHOLARSHIPS_DATA: StudentScholarship[] = [
  { studentId: 2, scholarshipId: 1 }, // Bruno Costa has a 25% scholarship
  { studentId: 6, scholarshipId: 2 }, // Fábio Gomes has a fixed 500 MZN discount
];

export const TRANSACTIONS_DATA: Transaction[] = [
  { id: 1, date: '2024-07-01', description: 'Mensalidade - Ana Silva', type: 'Receita', categoryId: 1, amount: 1500 },
  { id: 2, date: '2024-07-02', description: 'Compra de material de escritório', type: 'Despesa', categoryId: 102, amount: 250 },
  { id: 3, date: '2024-07-05', description: 'Pagamento de salário - Carlos Neto', type: 'Despesa', categoryId: 101, amount: 20000 },
  { id: 4, date: '2024-07-10', description: 'Venda de Uniformes', type: 'Receita', categoryId: 3, amount: 800 },
  { id: 5, date: '2024-07-12', description: 'Pagamento conta de luz', type: 'Despesa', categoryId: 104, amount: 1200 },
  { id: 6, date: '2024-07-15', description: 'Matrícula - Novo Aluno', type: 'Receita', categoryId: 2, amount: 5000 },
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
    { id: 1, studentId: 1, studentName: 'Ana Silva', month: 'Julho', dueDate: '2024-07-05', amount: 1500, status: 'Pago' },
    { id: 2, studentId: 2, studentName: 'Bruno Costa', month: 'Julho', dueDate: '2024-07-05', amount: 1500, status: 'Pago' },
    { id: 3, studentId: 3, studentName: 'Carla Dias', month: 'Junho', dueDate: '2024-06-05', amount: 1500, status: 'Atrasado' },
    { id: 4, studentId: 4, studentName: 'David Martins', month: 'Julho', dueDate: '2024-07-05', amount: 1500, status: 'Pendente' },
    { id: 5, studentId: 5, studentName: 'Elisa Ferreira', month: 'Julho', dueDate: '2024-07-05', amount: 1500, status: 'Pago' },
    { id: 6, studentId: 6, studentName: 'Fábio Gomes', month: 'Julho', dueDate: '2024-07-05', amount: 1500, status: 'Pendente' },
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
        classId: 2,
        subjectId: 1
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
