-- Inserir Professores
INSERT INTO public.teachers (id, name, email, phone, qualifications, status) VALUES
(1, 'Carlos Neto', 'carlos.neto@reviva.com', '84 111 2222', 'Licenciatura em Pedagogia', 'Ativo'),
(2, 'Fernanda Alves', 'fernanda.alves@reviva.com', '82 333 4444', 'Mestrado em Matemática', 'Ativo'),
(3, 'Mariana Lima', 'mariana.lima@reviva.com', '86 555 6666', 'Licenciatura em Letras', 'Ativo'),
(4, 'Ricardo Sousa', 'ricardo.sousa@reviva.com', '87 888 9999', 'Doutoramento em Ciências', 'Inativo');

-- Inserir Turmas
INSERT INTO public.classes (id, name, year, teacher_id) VALUES
(1, '5ª Classe A', 2024, 2),
(2, '7ª Classe B', 2024, 4),
(3, '3ª Classe Única', 2024, 3);

-- Inserir Alunos
INSERT INTO public.students (id, name, class_id, age, guardian, phone, status) VALUES
(1, 'Ana Silva', 1, 10, 'João Silva', '84 123 4567', 'Ativo'),
(2, 'Bruno Costa', 2, 12, 'Maria Costa', '82 987 6543', 'Ativo'),
(3, 'Carla Dias', 3, 8, 'Pedro Dias', '86 555 1234', 'Ativo'),
(4, 'David Martins', 1, 10, 'Sofia Martins', '84 111 2233', 'Ativo'), -- Corrected age from 5 to 10 for 5th grade
(5, 'Elisa Ferreira', 2, 11, 'Rui Ferreira', '82 444 5566', 'Ativo'),
(6, 'Fábio Gomes', 3, 7, 'Cátia Gomes', '87 777 8899', 'Ativo');

-- Inserir Disciplinas
INSERT INTO public.subjects (id, name, code, workload) VALUES
(1, 'Matemática', 'MAT01', 80),
(2, 'Língua Portuguesa', 'LP01', 100),
(3, 'Ciências Naturais', 'CN01', 60),
(4, 'História', 'HIS01', 50),
(5, 'Geografia', 'GEO01', 50);

-- Inserir Plano Curricular
INSERT INTO public.class_curriculum (class_id, subject_id, teacher_id) VALUES
(1, 1, 2),
(1, 2, 3),
(2, 1, 2),
(2, 3, 1),
(2, 4, 1),
(3, 2, 3),
(3, 5, 1);

-- Inserir Categorias Financeiras
INSERT INTO public.financial_categories (id, name, type) VALUES
(1, 'Mensalidades', 'Receita'),
(2, 'Matrículas', 'Receita'),
(3, 'Uniformes', 'Receita'),
(4, 'Material Escolar', 'Receita'),
(5, 'Eventos', 'Receita'),
(6, 'Doações', 'Receita'),
(101, 'Salários', 'Despesa'),
(102, 'Material Didático', 'Despesa'),
(103, 'Alimentação', 'Despesa'),
(104, 'Utilities (Água, Luz, Internet)', 'Despesa'),
(105, 'Transporte', 'Despesa'),
(106, 'Manutenção e Reparos', 'Despesa');

-- Inserir Transações
INSERT INTO public.transactions (id, date, description, type, category_id, amount) VALUES
(1, '2024-07-01', 'Mensalidade - Ana Silva', 'Receita', 1, 1500),
(2, '2024-07-02', 'Compra de material de escritório', 'Despesa', 102, 250),
(3, '2024-07-05', 'Pagamento de salário - Carlos Neto', 'Despesa', 101, 20000),
(4, '2024-07-10', 'Venda de Uniformes', 'Receita', 3, 800),
(5, '2024-07-12', 'Pagamento conta de luz', 'Despesa', 104, 1200),
(6, '2024-07-15', 'Matrícula - Novo Aluno', 'Receita', 2, 5000);

-- Inserir Bolsas
INSERT INTO public.scholarships (id, name, type, value) VALUES
(1, 'Bolsa de Mérito Académico', 'Percentagem', 25),
(2, 'Apoio Social', 'Valor Fixo', 500),
(3, 'Bolsa de Desporto', 'Percentagem', 15);

-- Atribuir Bolsas a Alunos
INSERT INTO public.student_scholarships (student_id, scholarship_id) VALUES
(2, 1),
(6, 2);

-- Inserir Matrículas
INSERT INTO public.enrollments (id, student_name, date, amount, discount, status) VALUES
(1, 'Ana Silva', '2024-01-10', 5000, 0, 'Pago'),
(2, 'Bruno Costa', '2024-01-11', 5000, 500, 'Pago'),
(3, 'Carla Dias', '2024-01-12', 5000, 0, 'Pago'),
(4, 'Novo Aluno', '2024-07-20', 5000, 0, 'Pendente');

-- Inserir Mensalidades
INSERT INTO public.tuition_fees (id, student_id, month, due_date, amount, status) VALUES
(1, 1, 'Julho', '2024-07-05', 1500, 'Pago'),
(2, 2, 'Julho', '2024-07-05', 1500, 'Pago'),
(3, 3, 'Junho', '2024-06-05', 1500, 'Atrasado'),
(4, 4, 'Julho', '2024-07-05', 1500, 'Pendente'),
(5, 5, 'Julho', '2024-07-05', 1500, 'Pago'),
(6, 6, 'Julho', '2024-07-05', 1500, 'Pendente');

-- Inserir Notas
INSERT INTO public.grades (student_id, subject_id, nota1, nota2, final_exam) VALUES
-- Ana Silva (ID 1)
(1, 1, 15, 18, 16), -- Matemática
(1, 2, 17, 14, 15), -- Português
-- David Martins (ID 4)
(4, 1, 12, 14, NULL), -- Matemática
(4, 2, 10, 11, 12),  -- Português
-- Bruno Costa (ID 2)
(2, 1, 19, 20, 18), -- Matemática
(2, 3, 16, 17, 17),  -- Ciências
-- Elisa Ferreira (ID 5)
(5, 3, 14, 15, NULL); -- Ciências

-- Inserir Eventos do Calendário
INSERT INTO public.calendar_events (id, title, date, type, description, created_at, class_id, subject_id) VALUES
(1, 'Início do 2º Trimestre', '2024-04-15', 'Evento', 'Marca o começo do segundo trimestre letivo.', '2024-01-10T10:00:00.000Z', NULL, NULL),
(2, 'Dia da Paz', '2024-04-04', 'Feriado', 'Feriado nacional. Não haverá aulas.', '2024-01-10T10:00:00.000Z', NULL, NULL),
(3, 'Prova de Matemática - 7ª Classe', '2024-05-20', 'Prova', NULL, '2024-05-01T14:30:00.000Z', 2, 1),
(4, 'Prazo Pagamento Mensalidade', '2024-05-05', 'Prazo', 'Data limite para o pagamento da mensalidade de Maio sem multa.', '2024-04-01T09:00:00.000Z', NULL, NULL),
(5, 'Prazo Pagamento Mensalidade', '2024-06-05', 'Prazo', 'Data limite para o pagamento da mensalidade de Junho sem multa.', '2024-05-01T09:00:00.000Z', NULL, NULL),
(6, 'Reunião de Pais e Mestres', '2024-06-28', 'Evento', 'Reunião para entrega de notas e discussão do desempenho dos alunos.', '2024-06-10T11:00:00.000Z', NULL, NULL);