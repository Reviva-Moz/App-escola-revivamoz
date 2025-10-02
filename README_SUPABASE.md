# Guia de Integração e Gestão da Base de Dados - Supabase

Este documento é o guia completo para configurar, gerir e entender a integração da base de dados Supabase com o Sistema de Gestão Escolar da Escola Reviva.

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
    
    # Chaves para APIs de Comunicação
    VITE_EVOLUTION_API_URL="URL_DA_SUA_INSTANCIA_EVOLUTION_API"
    VITE_EVOLUTION_API_KEY="A_SUA_CHAVE_DA_API_EVOLUTION"
    VITE_SMS_GATEWAY_URL="URL_DO_SEU_GATEWAY_DE_SMS"
    VITE_SMS_GATEWAY_KEY="A_SUA_CHAVE_DA_API_DE_SMS"
    ```

4.  **Reinicie a Aplicação:** Se a aplicação estiver em execução, pare e reinicie o servidor para que as novas variáveis de ambiente sejam carregadas.

A sua aplicação está agora conectada ao Supabase!

---

## 🔌 Conexão na Aplicação

*   O ficheiro `utils/supabase.ts` é responsável por inicializar o cliente Supabase usando as variáveis de ambiente.
*   **Mecanismo de Fallback:** Se as variáveis `VITE_SUPABASE_URL` ou `VITE_SUPABASE_ANON_KEY` não estiverem definidas, o cliente Supabase não é criado, e a aplicação utiliza automaticamente os dados estáticos do ficheiro `constants.ts`. Isto permite que a aplicação continue a funcionar em modo de demonstração, mesmo sem uma conexão à base de dados.

---

## 🔒 Segurança: Row Level Security (RLS)

A RLS é uma funcionalidade poderosa do PostgreSQL que permite controlar o acesso a linhas específicas de uma tabela. É **essencial** para um ambiente de produção.

### Política de Desenvolvimento (Padrão)

Para simplificar o desenvolvimento, o script `permissions.sql` aplica uma política aberta que permite acesso total a qualquer utilizador. **NÃO USE ISTO EM PRODUÇÃO.**

### Políticas para Produção (Recomendado)

Para um ambiente de produção seguro, as políticas abertas devem ser removidas e substituídas por regras granulares. O script abaixo implementa um conjunto robusto de políticas de segurança.

**Como usar:**
1.  Execute a secção "Pré-requisitos" uma única vez.
2.  Remova as políticas de desenvolvimento anteriores.
3.  Execute a secção "Políticas de Acesso" no seu SQL Editor.

---

### Script SQL para Políticas de Produção

```sql
/*********************************************************************
* PARTE 1: PRÉ-REQUISITOS (EXECUTAR UMA VEZ)
* Cria uma tabela `profiles` para mapear utilizadores do Supabase Auth
* a perfis internos da aplicação (aluno, professor, etc.).
*********************************************************************/

-- 1. Criar a tabela de perfis
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.user_role NOT NULL,
  student_id INT REFERENCES public.students(id) ON DELETE SET NULL,
  teacher_id INT REFERENCES public.teachers(id) ON DELETE SET NULL,
  staff_id INT REFERENCES public.staff(id) ON DELETE SET NULL
);
COMMENT ON TABLE public.profiles IS 'Mapeia utilizadores do sistema de autenticação a perfis internos da aplicação.';

-- 2. Função para criar um perfil quando um novo utilizador se regista
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, role)
  VALUES (new.id, new.raw_user_meta_data->>'role');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Trigger que chama a função após cada novo registo
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 4. Habilitar RLS na tabela de perfis
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 5. Políticas para a tabela de perfis
CREATE POLICY "Users can access their own profile."
ON public.profiles FOR SELECT
USING (auth.uid() = id);

CREATE POLICY "Admins can manage all profiles."
ON public.profiles FOR ALL
USING ( (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'ADMINISTRADOR' );

/*********************************************************************
* PARTE 2: POLÍTICAS DE ACESSO (REMOVER POLÍTICAS ANTIGAS PRIMEIRO)
* Aplica RLS a todas as tabelas principais da aplicação.
*********************************************************************/

-- Função auxiliar para obter o perfil do utilizador atual
CREATE OR REPLACE FUNCTION public.get_user_profile()
RETURNS public.profiles AS $$
  SELECT * FROM public.profiles WHERE id = auth.uid();
$$ LANGUAGE sql STABLE;


-- Tabela: students
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins/Secretaria can see all students." ON public.students FOR SELECT USING ( (get_user_profile()).role IN ('ADMINISTRADOR', 'DIRETORIA', 'SECRETARIA') );
CREATE POLICY "Teachers can see students in their classes." ON public.students FOR SELECT USING ( class_id IN (SELECT class_id FROM public.class_curriculum WHERE teacher_id = (get_user_profile()).teacher_id) );
CREATE POLICY "Students/Guardians can see their own profile." ON public.students FOR SELECT USING ( id = (get_user_profile()).student_id );
CREATE POLICY "Admins/Secretaria can manage students." ON public.students FOR ALL USING ( (get_user_profile()).role IN ('ADMINISTRADOR', 'SECRETARIA') );

-- Tabela: grades
ALTER TABLE public.grades ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins/Diretoria/Secretaria can see all grades." ON public.grades FOR SELECT USING ( (get_user_profile()).role IN ('ADMINISTRADOR', 'DIRETORIA', 'SECRETARIA') );
CREATE POLICY "Students can see their own grades." ON public.grades FOR SELECT USING ( student_id = (get_user_profile()).student_id );
CREATE POLICY "Teachers can manage grades for their classes." ON public.grades FOR ALL USING (
  student_id IN (SELECT id FROM public.students WHERE class_id IN (SELECT class_id FROM public.class_curriculum WHERE teacher_id = (get_user_profile()).teacher_id))
);

-- Tabela: attendance
ALTER TABLE public.attendance ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins/Diretoria/Secretaria can see all attendance." ON public.attendance FOR SELECT USING ( (get_user_profile()).role IN ('ADMINISTRADOR', 'DIRETORIA', 'SECRETARIA') );
CREATE POLICY "Students can see their own attendance." ON public.attendance FOR SELECT USING ( student_id = (get_user_profile()).student_id );
CREATE POLICY "Teachers can manage attendance for their classes." ON public.attendance FOR ALL USING (
  student_id IN (SELECT id FROM public.students WHERE class_id IN (SELECT class_id FROM public.class_curriculum WHERE teacher_id = (get_user_profile()).teacher_id))
);

-- Tabela: lesson_plans
ALTER TABLE public.lesson_plans ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Teachers can manage their own lesson plans." ON public.lesson_plans FOR ALL
USING (
  (SELECT teacher_id FROM public.class_curriculum WHERE class_curriculum.class_id = lesson_plans.class_id AND class_curriculum.subject_id = lesson_plans.subject_id) = (get_user_profile()).teacher_id
);
CREATE POLICY "Admins/Diretoria can see all lesson plans." ON public.lesson_plans FOR SELECT USING ( (get_user_profile()).role IN ('ADMINISTRADOR', 'DIRETORIA') );

-- Tabela: teachers (Permitir que todos vejam, mas apenas admins/professores editem)
ALTER TABLE public.teachers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users can see teachers." ON public.teachers FOR SELECT USING ( auth.role() = 'authenticated' );
CREATE POLICY "Teachers can update their own profile." ON public.teachers FOR UPDATE USING ( id = (get_user_profile()).teacher_id );
CREATE POLICY "Admins can manage teachers." ON public.teachers FOR ALL USING ( (get_user_profile()).role = 'ADMINISTRADOR' );

-- Aplicar uma política de "apenas leitura" para utilizadores autenticados em tabelas públicas
ALTER TABLE public.classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.calendar_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users can view public info." ON public.classes FOR SELECT USING ( auth.role() = 'authenticated' );
CREATE POLICY "Authenticated users can view public info." ON public.subjects FOR SELECT USING ( auth.role() = 'authenticated' );
CREATE POLICY "Authenticated users can view public info." ON public.calendar_events FOR SELECT USING ( auth.role() = 'authenticated' );

-- Acesso administrativo total para tabelas de configuração
ALTER TABLE public.class_curriculum ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scholarships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_scholarships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.financial_categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admin roles have full access." ON public.class_curriculum FOR ALL USING ( (get_user_profile()).role IN ('ADMINISTRADOR', 'SECRETARIA') );
CREATE POLICY "Admin roles have full access." ON public.scholarships FOR ALL USING ( (get_user_profile()).role IN ('ADMINISTRADOR', 'SECRETARIA') );
CREATE POLICY "Admin roles have full access." ON public.student_scholarships FOR ALL USING ( (get_user_profile()).role IN ('ADMINISTRADOR', 'SECRETARIA') );
CREATE POLICY "Admin roles have full access." ON public.financial_categories FOR ALL USING ( (get_user_profile()).role IN ('ADMINISTRADOR', 'SECRETARIA') );
```
