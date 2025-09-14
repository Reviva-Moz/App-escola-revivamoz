# Guia Completo do Banco de Dados - Escola Reviva SGE 🗄️

> **Supabase Database Guide** - Documentação completa do banco de dados, configuração do Supabase e estrutura de dados do Sistema de Gestão Escolar

## 📋 Visão Geral do Sistema de Banco de Dados

Este documento serve como **referência completa** para o banco de dados do Sistema de Gestão Escolar da Escola Reviva, incluindo estrutura, configuração, relacionamentos e melhores práticas para desenvolvimento e manutenção.

### 🎯 Objetivos do Sistema de Dados

- **Integridade**: Garantir consistência e confiabilidade dos dados
- **Performance**: Otimização para consultas frequentes e relatórios
- **Segurança**: Controle de acesso granular com RLS (Row Level Security)
- **Escalabilidade**: Estrutura preparada para crescimento da instituição
- **Auditoria**: Rastreamento de mudanças e histórico de dados

---

## 🏗️ Arquitetura do Banco de Dados

### Tecnologias Utilizadas

- **Supabase**: Backend-as-a-Service baseado em PostgreSQL
- **PostgreSQL 15+**: Sistema de gerenciamento de banco de dados
- **Row Level Security (RLS)**: Controle de acesso a nível de linha
- **Real-time Subscriptions**: Atualizações em tempo real
- **Edge Functions**: Lógica de negócio no servidor

### Princípios de Design

1. **🎯 Normalização**: Estrutura normalizada para evitar redundância
2. **🔗 Relacionamentos**: Foreign keys para integridade referencial
3. **📊 Performance**: Índices estratégicos para consultas otimizadas
4. **🔒 Segurança**: RLS e políticas de acesso granular
5. **📈 Escalabilidade**: Estrutura preparada para crescimento

---

## 🚀 Guia de Configuração Rápida

Siga estes passos para ter a base de dados a funcionar em menos de 10 minutos.

### Passo 1: Criar o Projeto no Supabase

1.  **Crie uma Conta:** Registe-se em [Supabase.com](https://supabase.com).
2.  **Crie um Novo Projeto:** No seu dashboard, clique em **"New Project"**, defina um nome, gere uma senha segura (guarde-a!) e escolha a região do servidor.

### Passo 2: Executar os Scripts SQL

Execute os seguintes ficheiros SQL no **SQL Editor** do seu projeto Supabase, **exatamente nesta ordem**.

1.  **`sql/schema.sql`**
    *   **O que faz?** Cria toda a estrutura: tabelas, colunas, relações (`foreign keys`) e tipos `ENUM`.
    *   **Como executar?** Copie todo o conteúdo do ficheiro, cole no SQL Editor e clique em **"RUN"**.

2.  **`sql/data.sql`**
    *   **O que faz?** Popula as tabelas criadas com todos os dados de exemplo da aplicação (alunos, professores, etc.).
    *   **Como executar?** Crie uma nova query, copie todo o conteúdo do ficheiro, cole e clique em **"RUN"**.

3.  **`sql/permissions.sql`**
    *   **O que faz?** Ativa a Row Level Security (RLS) e aplica uma política de **acesso total** a todas as tabelas. **Isto é intencional para a fase de desenvolvimento**.
    *   **Como executar?** Crie uma nova query, copie o conteúdo, cole e clique em **"RUN"**.

### Passo 3: Configurar as Variáveis de Ambiente

1.  **Encontre as Suas Chaves de API:** No Supabase, vá a **Project Settings > API**.
2.  **Crie um ficheiro `.env`:** Na raiz do projeto (ao lado do `index.html`), crie um ficheiro chamado `.env`.
3.  **Adicione as Chaves:** Cole o seguinte no ficheiro `.env`, substituindo os valores pelos do seu projeto:

    ```env
    VITE_SUPABASE_URL="A_SUA_PROJECT_URL_AQUI"
    VITE_SUPABASE_ANON_KEY="A_SUA_CHAVE_ANON_PUBLIC_AQUI"
    ```

4.  **Reinicie a Aplicação:** Se a aplicação estiver em execução, pare e reinicie o servidor para que as novas variáveis de ambiente sejam carregadas.

A sua aplicação está agora conectada ao Supabase!

---

## 🗄️ Estrutura Completa do Schema

### Enums (Tipos Personalizados)

#### Status e Estados
```sql
-- Status dos Alunos
CREATE TYPE status_aluno AS ENUM (
    'ativo',        -- Aluno matriculado e frequentando
    'inativo',      -- Aluno temporariamente inativo
    'transferido',  -- Aluno transferido para outra escola
    'concluido'     -- Aluno que concluiu o curso
);

-- Status dos Professores
CREATE TYPE status_professor AS ENUM (
    'ativo',        -- Professor ativo na escola
    'inativo',      -- Professor temporariamente inativo
    'licenca'       -- Professor em licença
);

-- Tipos de Transações Financeiras
CREATE TYPE tipo_transacao AS ENUM (
    'receita',      -- Entrada de dinheiro (mensalidades, taxas)
    'despesa'       -- Saída de dinheiro (salários, materiais)
);

-- Status das Mensalidades
CREATE TYPE status_mensalidade AS ENUM (
    'pago',         -- Mensalidade quitada
    'pendente',     -- Mensalidade em aberto
    'atrasado'      -- Mensalidade em atraso
);

-- Tipos de Eventos do Calendário
CREATE TYPE tipo_evento AS ENUM (
    'aula',             -- Aula regular
    'prova',            -- Avaliação/exame
    'reuniao',          -- Reunião (pais, professores)
    'evento_especial'   -- Eventos especiais (festas, formatura)
);
```

### Entidades Principais

#### 1. **Professores** (`teachers`)
```sql
CREATE TABLE teachers (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20),
    address TEXT,
    birth_date DATE,
    hire_date DATE NOT NULL DEFAULT CURRENT_DATE,
    salary DECIMAL(10,2),
    specialization VARCHAR(255),
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### 2. **Turmas** (`classes`)
```sql
CREATE TABLE classes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    academic_year INTEGER NOT NULL,
    grade VARCHAR(50) NOT NULL,
    shift VARCHAR(20) CHECK (shift IN ('morning', 'afternoon', 'evening')),
    max_capacity INTEGER DEFAULT 30,
    teacher_id UUID REFERENCES teachers(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### 3. **Alunos** (`students`)
```sql
CREATE TABLE students (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    birth_date DATE NOT NULL,
    cpf VARCHAR(14) UNIQUE,
    rg VARCHAR(20),
    address TEXT,
    phone VARCHAR(20),
    email VARCHAR(255),
    guardian_name VARCHAR(255),
    guardian_phone VARCHAR(20),
    guardian_email VARCHAR(255),
    enrollment_date DATE DEFAULT CURRENT_DATE,
    status VARCHAR(20) DEFAULT 'active',
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### 4. **Disciplinas** (`subjects`)
```sql
CREATE TABLE subjects (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(20) UNIQUE NOT NULL,
    description TEXT,
    workload INTEGER NOT NULL,
    credits INTEGER DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### 5. **Currículo das Turmas** (`class_curriculum`)
```sql
CREATE TABLE class_curriculum (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    class_id UUID REFERENCES classes(id) ON DELETE CASCADE,
    subject_id UUID REFERENCES subjects(id) ON DELETE CASCADE,
    teacher_id UUID REFERENCES teachers(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Constraint para evitar duplicações
    UNIQUE(class_id, subject_id)
);
```

#### 6. **Transações Financeiras** (`transactions`)
```sql
CREATE TABLE transactions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    type VARCHAR(20) NOT NULL CHECK (type IN ('income', 'expense')),
    amount DECIMAL(10,2) NOT NULL CHECK (amount > 0),
    description TEXT NOT NULL,
    category VARCHAR(100),
    transaction_date DATE DEFAULT CURRENT_DATE,
    student_id UUID REFERENCES students(id), -- Para mensalidades
    teacher_id UUID REFERENCES teachers(id), -- Para salários
    receipt_url TEXT, -- URL do comprovante/recibo
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### 7. **Categorias Financeiras** (`financial_categories`)
```sql
CREATE TABLE financial_categories (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    type VARCHAR(20) NOT NULL CHECK (type IN ('income', 'expense')),
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### 8. **Bolsas de Estudo** (`scholarships`)
```sql
CREATE TABLE scholarships (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL, -- 'full', 'partial', 'merit'
    discount_percentage DECIMAL(5,2) CHECK (discount_percentage BETWEEN 0 AND 100),
    fixed_amount DECIMAL(10,2), -- Alternativa ao percentual
    description TEXT,
    requirements TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### 9. **Bolsas dos Alunos** (`student_scholarships`)
```sql
CREATE TABLE student_scholarships (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    student_id UUID REFERENCES students(id) ON DELETE CASCADE,
    scholarship_id UUID REFERENCES scholarships(id) ON DELETE CASCADE,
    start_date DATE NOT NULL,
    end_date DATE,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'cancelled')),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Constraint para evitar bolsas duplicadas
    UNIQUE(student_id, scholarship_id)
);
```

#### 10. **Notas** (`grades`)
```sql
CREATE TABLE grades (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    student_id UUID REFERENCES students(id) ON DELETE CASCADE,
    subject_id UUID REFERENCES subjects(id) ON DELETE CASCADE,
    quarter INTEGER CHECK (quarter BETWEEN 1 AND 4),
    grade DECIMAL(4,2) CHECK (grade >= 0 AND grade <= 10),
    assessment_type VARCHAR(50) DEFAULT 'exam', -- exam, assignment, participation
    assessment_date DATE DEFAULT CURRENT_DATE,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### 11. **Eventos do Calendário** (`calendar_events`)
```sql
CREATE TABLE calendar_events (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    type VARCHAR(50) NOT NULL,
    start_date TIMESTAMP WITH TIME ZONE NOT NULL,
    end_date TIMESTAMP WITH TIME ZONE,
    class_id UUID REFERENCES classes(id), -- Evento específico de uma turma
    subject_id UUID REFERENCES subjects(id), -- Evento de uma disciplina
    teacher_id UUID REFERENCES teachers(id), -- Professor responsável
    location VARCHAR(255),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

---

## 🔗 Relacionamentos e Integridade

### Diagrama de Relacionamentos

```
Teachers ──┐
           ├── Classes ──┐
           │             ├── Class_Curriculum ──┐
           │             └── Calendar_Events    │
           └── Subjects ──┐                     │
                          ├── Grades            │
                          ├── Class_Curriculum ─┘
                          └── Calendar_Events

Students ──┐
           ├── Grades
           ├── Student_Scholarships ── Scholarships
           ├── Transactions
           └── Calendar_Events
```

### Constraints de Integridade

#### Foreign Keys
```sql
-- Relacionamentos principais
ALTER TABLE classes ADD CONSTRAINT fk_class_teacher 
    FOREIGN KEY (teacher_id) REFERENCES teachers(id);

ALTER TABLE class_curriculum ADD CONSTRAINT fk_curriculum_class 
    FOREIGN KEY (class_id) REFERENCES classes(id) ON DELETE CASCADE;

ALTER TABLE class_curriculum ADD CONSTRAINT fk_curriculum_subject 
    FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE CASCADE;

ALTER TABLE class_curriculum ADD CONSTRAINT fk_curriculum_teacher 
    FOREIGN KEY (teacher_id) REFERENCES teachers(id) ON DELETE CASCADE;
```

#### Unique Constraints
```sql
-- Evitar duplicações
ALTER TABLE class_curriculum ADD CONSTRAINT uk_class_subject 
    UNIQUE(class_id, subject_id);

ALTER TABLE student_scholarships ADD CONSTRAINT uk_student_scholarship 
    UNIQUE(student_id, scholarship_id);
```

---

##  Scripts SQL Explicados

*   **`sql/schema.sql`:** O "plano" da sua base de dados. Define a estrutura e as regras de integridade dos dados. É o primeiro a ser executado e só precisa de ser executado uma vez.
*   **`sql/data.sql`:** O "conteúdo" inicial. Preenche a estrutura vazia com dados para que a aplicação possa ser usada imediatamente.
*   **`sql/permissions.sql`:** O "segurança". Este script é especial porque é **dinâmico**. Ele encontra todas as tabelas e aplica uma política aberta. Pode ser executado a qualquer momento para "resetar" as permissões para o estado de desenvolvimento aberto.

---

## 🔒 Segurança: Row Level Security (RLS)

A RLS é uma funcionalidade poderosa do PostgreSQL que permite controlar o acesso a linhas específicas de uma tabela.

### Política de Desenvolvimento (Atual)

O script `permissions.sql` implementa a seguinte política em **todas** as tabelas:

```sql
CREATE POLICY "Public full access"
ON public.nome_da_tabela
FOR ALL
USING (true)
WITH CHECK (true);
```

*   **O que significa?** Permite que **qualquer pessoa** (incluindo utilizadores não autenticados que usam a `anon key`) possa ler, criar, atualizar e apagar qualquer registo.
*   **Porquê?** Simplifica drasticamente a fase de desenvolvimento e prototipagem, permitindo que agentes de IA e programadores interajam com a base de dados sem restrições.

### Políticas para Produção (Próximos Passos)

Quando a aplicação for para produção, estas políticas **DEVEM** ser substituídas por regras mais restritivas. Exemplos:

*   **Acesso apenas a utilizadores autenticados:**
    ```sql
    -- Substituir (true) por (auth.role() = 'authenticated')
    CREATE POLICY "Permitir acesso a utilizadores logados"
    ON public.students FOR ALL
    TO authenticated
    USING (true) WITH CHECK (true);
    ```

*   **Um professor só pode ver os alunos da sua turma:**
    ```sql
    CREATE POLICY "Professores podem ver os seus próprios alunos"
    ON public.students FOR SELECT
    TO authenticated
    USING (class_id IN (SELECT class_id FROM class_curriculum WHERE teacher_id = auth.uid()));
    ```

---

## 🔌 Conexão na Aplicação

*   O ficheiro `utils/supabase.ts` é responsável por inicializar o cliente Supabase usando as variáveis de ambiente.
*   **Mecanismo de Fallback:** Se as variáveis `VITE_SUPABASE_URL` ou `VITE_SUPABASE_ANON_KEY` não estiverem definidas, o cliente Supabase não é criado, e a aplicação utiliza automaticamente os dados estáticos do ficheiro `constants.ts`. Isto permite que a aplicação continue a funcionar em modo de demonstração, mesmo sem uma conexão à base de dados.

### Configuração do Cliente Supabase

```typescript
// utils/supabase.ts
import { createClient } from '@supabase/supabase-js';
import { Database } from '../types/database.types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Verificar se as variáveis de ambiente estão configuradas
if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('⚠️ Variáveis do Supabase não configuradas. Usando dados mock.');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  },
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  }
});

// Verificar conexão
export const checkConnection = async () => {
  try {
    const { data, error } = await supabase.from('teachers').select('count').limit(1);
    return !error;
  } catch {
    return false;
  }
};
```

### Variáveis de Ambiente

```env
# .env.local
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_SUPABASE_SERVICE_ROLE_KEY=your-service-role-key # Apenas para desenvolvimento
```
