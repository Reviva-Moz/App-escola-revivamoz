import { Student, Teacher, Subject, Class, FinancialCategory, Enrollment, Tuition, StudentGrades, CalendarEvent, ClassCurriculum, Category, Scholarship, StudentScholarship, Transaction, Announcement, Book, BookLoan, Staff, LessonPlan, SystemSettings, UserAccount, UserRole, HealthRecord, PaymentMethod } from './types';

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

const todayStr = new Date().toISOString().split('T')[0];

export const TRANSACTIONS_DATA: Transaction[] = [
  { id: 1, date: '2024-07-28', description: 'Mensalidade - Ana Silva', type: 'Receita', categoryId: 1, amount: 1500, paymentMethod: 'Digital' },
  { id: 2, date: todayStr, description: 'Compra de material de escritório', type: 'Despesa', categoryId: 102, amount: 250, paymentMethod: 'Dinheiro' },
  { id: 3, date: '2024-07-29', description: 'Pagamento de salário - Carlos Neto', type: 'Despesa', categoryId: 101, amount: 20000, paymentMethod: 'Transferência' },
  { id: 4, date: todayStr, description: 'Venda de Uniformes', type: 'Receita', categoryId: 3, amount: 800, paymentMethod: 'Dinheiro' },
  { id: 5, date: '2024-07-30', description: 'Pagamento conta de luz', type: 'Despesa', categoryId: 104, amount: 1200, paymentMethod: 'Digital' },
  { id: 6, date: todayStr, description: 'Matrícula - Novo Aluno', type: 'Receita', categoryId: 2, amount: 5000, paymentMethod: 'Dinheiro' },
  { id: 7, date: todayStr, description: 'Snacks para eventos', type: 'Despesa', categoryId: 103, amount: 500, paymentMethod: 'Dinheiro' },

];

export const STUDENTS_DATA: Student[] = [
  { id: 1, name: 'Ana Silva', class: '5ª Classe', classId: 1, age: 10, guardian: 'João Silva', phone: '84 123 4567', status: 'Ativo' },
  { id: 2, name: 'Bruno Costa', class: '7ª Classe', classId: 2, age: 12, guardian: 'Maria Costa', phone: '82 987 6543', status: 'Ativo' },
  { id: 3, name: 'Carla Dias', class: '3ª Classe', classId: 3, age: 8, guardian: 'Pedro Dias', phone: '86 555 1234', status: 'Ativo' },
  { id: 4, name: 'David Martins', class: '5ª Classe', classId: 1, age: 5, guardian: 'Sofia Martins', phone: '84 111 2233', status: 'Ativo' },
  { id: 5, name: 'Elisa Ferreira', class: '7ª Classe', classId: 2, age: 11, guardian: 'Rui Ferreira', phone: '82 444 5566', status: 'Ativo' },
  { id: 6, name: 'Fábio Gomes', class: '3ª Classe', classId: 3, age: 7, guardian: 'Cátia Gomes', phone: '87 777 8899', status: 'Ativo' },
  { id: 7, name: 'Pedro Silva', class: '3ª Classe', classId: 3, age: 8, guardian: 'João Silva', phone: '84 123 4567', status: 'Ativo' },
];

export const TEACHERS_DATA: Teacher[] = [
    { id: 1, name: 'Carlos Neto', email: 'carlos.neto@reviva.com', phone: '84 111 2222', qualifications: 'Licenciatura em Pedagogia', status: 'Ativo', photoUrl: 'https://i.pravatar.cc/150?u=carlos.neto' },
    { id: 2, name: 'Fernanda Alves', email: 'fernanda.alves@reviva.com', phone: '82 333 4444', qualifications: 'Mestrado em Matemática', status: 'Ativo' },
    { id: 3, name: 'Mariana Lima', email: 'mariana.lima@reviva.com', phone: '86 555 6666', qualifications: 'Licenciatura em Letras', status: 'Ativo' },
    { id: 4, name: 'Ricardo Sousa', email: 'ricardo.sousa@reviva.com', phone: '87 888 9999', qualifications: 'Doutoramento em Ciências', status: 'Inativo' },
];

export const STAFF_DATA: Staff[] = [
  { id: 1, name: 'Carlos Neto', role: 'Professor', department: 'Académico', email: 'carlos.neto@reviva.com', phone: '84 111 2222', status: 'Ativo', nuit: '123456789' },
  { id: 2, name: 'Fernanda Alves', role: 'Professora', department: 'Académico', email: 'fernanda.alves@reviva.com', phone: '82 333 4444', status: 'Ativo', nuit: '987654321' },
  { id: 3, name: 'Mariana Lima', role: 'Professora', department: 'Académico', email: 'mariana.lima@reviva.com', phone: '86 555 6666', status: 'Ativo' },
  { id: 4, name: 'Ricardo Sousa', role: 'Professor', department: 'Académico', email: 'ricardo.sousa@reviva.com', phone: '87 888 9999', status: 'Inativo' },
  { id: 5, name: 'Sónia Pereira', role: 'Secretária', department: 'Administrativo', email: 'sonia.p@reviva.com', phone: '84 222 3333', status: 'Ativo', nuit: '112233445' },
  { id: 6, name: 'Jorge Mendes', role: 'Segurança', department: 'Operações', email: 'jorge.m@reviva.com', phone: '82 444 5555', status: 'Ativo' },
  { id: 7, name: 'Luísa Santos', role: 'Coordenadora Pedagógica', department: 'Académico', email: 'luisa.santos@reviva.com', phone: '86 666 7777', status: 'Ativo' },
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
      1: { nota1: 15, nota2: 18, finalExam: 16, observations: 'Excelente progresso, especialmente em geometria.' },
      2: { nota1: 17, nota2: 14, finalExam: 15, observations: 'Dificuldades na interpretação de texto. Recomenda-se mais leitura.' },
    },
  },
  {
    studentId: 4, // David Martins
    gradesBySubject: {
      1: { nota1: 12, nota2: 14, finalExam: '', observations: '' },
      2: { nota1: 10, nota2: 11, finalExam: 12, observations: 'Mostrou melhoria no último teste.' },
    }
  },
  {
    studentId: 2, // Bruno Costa
    gradesBySubject: {
      1: { nota1: 19, nota2: 20, finalExam: 18, observations: 'Aluno exemplar. Raciocínio lógico muito apurado.' },
      3: { nota1: 16, nota2: 17, finalExam: 17, observations: 'Participativo e interessado nas aulas práticas.' },
    }
  },
    {
    studentId: 5, // Elisa Ferreira
    gradesBySubject: {
      1: { nota1: '', nota2: '', finalExam: '', observations: '' },
      3: { nota1: 14, nota2: 15, finalExam: '', observations: 'Necessita de apoio nos trabalhos de casa.' },
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
    { id: 7, studentId: 7, studentName: 'Pedro Silva', month: 'Julho', dueDate: '2024-07-05', amount: 1500, status: 'Pendente' },
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
    {
        id: 7,
        title: "Prova de Ciências - 7ª Classe",
        date: "2024-08-12",
        type: 'Prova',
        createdAt: "2024-08-01T10:00:00.000Z",
        classId: 2,
        subjectId: 3
    },
];

export const ANNOUNCEMENTS_DATA: Announcement[] = [
    {
        id: 1,
        title: 'Reunião de Pais e Mestres - 2º Trimestre',
        content: 'Caros pais e encarregados, a reunião para entrega de notas e discussão do desempenho dos alunos do 2º trimestre será no dia 28 de Junho, às 17h. A vossa presença é fundamental.',
        target: 'Pais',
        category: 'Evento',
        date: '2024-06-20T10:00:00.000Z',
        readBy: [1, 2, 3, 4, 5, 6]
    },
    {
        id: 2,
        title: 'Festa de Fim de Ano Letivo',
        content: 'Convidamos toda a comunidade escolar para a nossa festa de encerramento do ano letivo no dia 5 de Dezembro. Haverá apresentações dos alunos, comes e bebes, e muita diversão!',
        target: 'Todos',
        category: 'Evento',
        date: '2024-06-18T15:30:00.000Z',
        attachments: [{ name: 'Convite_Festa.pdf' }],
        readBy: [1, 2, 3, 4, 5, 6, 101, 102, 103, 104, 105, 106, 107]
    },
    {
        id: 3,
        title: 'Atualização de Pautas - 7ª Classe',
        content: 'As pautas de Matemática e Ciências da 7ª Classe já foram lançadas no sistema. Os professores devem verificar e submeter as notas finais até sexta-feira.',
        target: 'Professores',
        category: 'Informativo',
        date: '2024-06-15T09:00:00.000Z',
        readBy: [101, 102]
    },
    {
        id: 4,
        title: 'ALERTA: Interrupção no Fornecimento de Água',
        content: 'Informamos que amanhã, dia 25 de Julho, haverá uma interrupção programada no fornecimento de água para manutenção da rede pública. Pedimos que os alunos tragam uma garrafa de água extra.',
        target: 'Todos',
        category: 'Urgente',
        date: '2024-07-24T18:00:00.000Z',
        readBy: [1,2,5]
    }
];

export const BOOKS_DATA: Book[] = [
    { id: 1, title: 'O Gato Malhado e a Andorinha Sinhá', author: 'Jorge Amado', isbn: '978-972-20-3332-5', totalStock: 5, availableStock: 2 },
    { id: 2, title: 'Matemática 101', author: 'Ministério da Educação', isbn: '123-456-789-012-3', totalStock: 10, availableStock: 10 },
    { id: 3, title: 'Uma Aventura na Floresta', author: 'Ana Maria Magalhães', isbn: '978-972-21-2358-3', totalStock: 8, availableStock: 5 },
    { id: 4, title: 'História de Moçambique', author: 'Coletivo', isbn: '456-789-012-345-6', totalStock: 3, availableStock: 3 },
];

export const BOOK_LOANS_DATA: BookLoan[] = [
    { id: 1, bookId: 1, studentId: 1, loanDate: '2024-07-10', dueDate: '2024-07-24', status: 'Em Dia' },
    { id: 2, bookId: 3, studentId: 2, loanDate: '2024-07-05', dueDate: '2024-07-19', status: 'Em Dia' },
    { id: 3, bookId: 1, studentId: 3, loanDate: '2024-06-20', dueDate: '2024-07-04', status: 'Atrasado' },
    { id: 4, bookId: 3, studentId: 5, loanDate: '2024-07-15', dueDate: '2024-07-29', status: 'Em Dia' },
];

export const LESSON_PLANS_DATA: LessonPlan[] = [
    {
        id: 1,
        classId: 1,
        subjectId: 1,
        title: 'Introdução às Frações',
        date: '2024-08-05',
        objectives: '1. Compreender o conceito de fração.\n2. Identificar o numerador e o denominador.\n3. Representar frações visualmente.',
        content: 'Discussão inicial com exemplos do dia a dia (pizza, bolo). Apresentação formal. Atividades práticas com recortes de papel.',
        resources: 'Quadro, marcadores, recortes de papel em forma de círculo, livro didático pág. 45-48.'
    },
    {
        id: 2,
        classId: 1,
        subjectId: 1,
        title: 'Adição de Frações com o Mesmo Denominador',
        date: '2024-08-07',
        objectives: '1. Realizar a soma de frações com denominadores iguais.\n2. Resolver problemas práticos envolvendo adição de frações.',
        content: 'Revisão da aula anterior. Demonstração de exemplos no quadro. Resolução de exercícios em pares.',
        resources: 'Livro didático pág. 49-51, folhas de exercícios.'
    },
    {
        id: 3,
        classId: 2,
        subjectId: 3,
        title: 'O Sistema Solar',
        date: todayStr, // Set to today for professor dashboard demo
        objectives: '1. Listar os planetas do sistema solar na ordem correta.\n2. Descrever a principal característica de cada planeta.',
        content: 'Apresentação de slides com imagens e curiosidades. Vídeo educativo. Construção de um modelo do sistema solar em grupo.',
        resources: 'Projetor, computador, vídeo do YouTube, cartolina, bolas de esferovite, tintas.'
    },
    {
        id: 4,
        classId: 3,
        subjectId: 5,
        title: 'Relevo de Moçambique',
        date: '2024-08-08',
        objectives: '1. Identificar as principais formas de relevo do país.\n2. Localizar no mapa as planícies, planaltos e montanhas.',
        content: 'Apresentação de mapa físico de Moçambique. Discussão em grupo sobre as diferentes altitudes e suas características.',
        resources: 'Mapa físico de Moçambique, projetor, livro didático.'
    }
];

export const SYSTEM_SETTINGS_DATA: SystemSettings = {
    schoolName: 'Escola Reviva',
    address: 'Av. Julius Nyerere, 1234, Maputo',
    phone: '+258 84 123 4567',
    email: 'geral@reviva.mz',
    currentAcademicYear: 2024,
    defaultTuition: 1500,
};

export const ROLES: UserRole[] = ['ADMINISTRADOR', 'DIRETORIA', 'SECRETARIA', 'PROFESSOR', 'RESPONSAVEL', 'ALUNO'];

export const USER_ACCOUNTS_DATA: UserAccount[] = Object.entries({
    'admin@reviva.mz': { role: 'ADMINISTRADOR' },
    'direccao@reviva.mz': { role: 'DIRETORIA' },
    'secretaria@reviva.mz': { role: 'SECRETARIA' },
    'responsavel@reviva.mz': { role: 'RESPONSAVEL' },
    'professor@reviva.mz': { role: 'PROFESSOR' },
    'aluno@reviva.mz': { role: 'ALUNO' },
}).map(([email, { role }], index) => ({
    id: index + 1,
    email,
    role: role as UserRole,
    lastLogin: `2024-07-${20 + index}T10:00:00.000Z`,
}));

export const HEALTH_RECORDS_DATA: HealthRecord[] = [
    { id: 1, studentId: 1, date: '2024-05-10', description: 'Alergia a amendoim. Teve uma pequena reação após o lanche.', actionTaken: 'Encarregado foi contactado e buscou a aluna. Administrado anti-histamínico conforme ficha médica.', recordedBy: 'Enf. Maria' },
    { id: 2, studentId: 1, date: '2024-06-22', description: 'Queda no pátio, resultando em escoriação no joelho esquerdo.', actionTaken: 'Limpeza e curativo realizados na enfermaria.', recordedBy: 'Sónia Pereira' },
    { id: 3, studentId: 3, date: '2024-07-01', description: 'Queixa de dor de cabeça e febre (38.2°C).', actionTaken: 'Administrado paracetamol com autorização prévia. Encarregado foi notificado.', recordedBy: 'Enf. Maria' }
];

export const PAYMENT_METHODS_DATA: PaymentMethod[] = [
  { id: 1, name: 'M-Pesa', type: 'Digital', instructions: 'Pagamento via USSD. Entidade: 12345, Referência: 98765', status: 'Ativo' },
  { id: 2, name: 'e-Mola', type: 'Digital', instructions: 'Pagamento via App ou USSD. Entidade: 54321', status: 'Ativo' },
  { id: 3, name: 'Transferência Bancária', type: 'Digital', instructions: 'BCI - NIB: 000800001234567891017', status: 'Ativo' },
  { id: 4, name: 'Dinheiro (Tesouraria)', type: 'Físico', instructions: 'Pagamento presencial na secretaria da escola.', status: 'Ativo' },
];