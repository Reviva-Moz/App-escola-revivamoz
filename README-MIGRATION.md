# Sistema de Gestão Escolar (SGE) - Escola Reviva

Bem-vindo ao repositório do Sistema de Gestão Escolar (SGE) da Escola Reviva. Este é um sistema web completo, PWA (Progressive Web App) e com funcionalidades offline, desenhado para modernizar e centralizar as operações diárias da escola, desde a gestão académica e de alunos até ao controlo financeiro avançado.

---

## 🚀 Funcionalidades Principais

O SGE está organizado em módulos para cobrir todas as necessidades da escola:

*   **Dashboard Dinâmico:** Visão geral adaptada ao perfil do utilizador (Diretoria, Secretaria, Professor) com estatísticas chave e atalhos rápidos.
*   **Gestão de Alunos, Professores e Colaboradores:** CRUD completo com formulários detalhados, incluindo captura de fotos via webcam e upload de documentos com restrição de tamanho.
*   **Sistema Financeiro Completo:**
    *   Controlo de receitas e despesas com categorias personalizáveis.
    *   Gestão de matrículas e mensalidades com cálculo de descontos (bolsas, irmãos).
    *   **Fluxo de Cobrança Kanban:** Uma interface visual para gerir o estado dos pagamentos (Pendente, Atrasado, Em Cobrança, Pago).
    *   **Comunicação Automatizada:** Envio de lembretes de cobrança (simulado, pronto para integração com APIs de WhatsApp/SMS) com modelos de mensagem personalizáveis.
    *   **Agendamento de Lembretes:** Programe o envio de lembretes para datas futuras.
*   **Gestão Académica:**
    *   **Turmas e Plano Curricular:** Criação de turmas e associação de disciplinas e professores.
    *   **Lançamento de Notas e Assiduidade:** Interfaces otimizadas para o dia a dia do professor.
    *   **Plano de Aula com Assistente de IA:** Ferramenta para professores criarem planos de aula com sugestões de uma IA treinada na metodologia da escola (Abordagem Educacional por Princípios).
*   **Módulos Administrativos:**
    *   **Mural Digital:** Sistema de comunicação interna para toda a escola.
    *   **Biblioteca:** Gestão de catálogo de livros e controlo de empréstimos.
    *   **Calendários:** Calendário escolar geral e calendário de provas.
    *   **Relatórios com IA:** Geração de relatórios padrão e uma **análise preditiva** que usa IA para identificar alunos em risco e de alto desempenho, sugerindo intervenções pedagógicas.
*   **Configuração do Sistema:** Painel de administrador para gerir utilizadores, permissões e configurações globais da aplicação, incluindo o treino do assistente de IA.
*   **Offline-First:** A aplicação funciona offline, armazenando dados localmente no IndexedDB e sincronizando quando a conexão é restabelecida.

---

## 💻 Stack Tecnológica

*   **Frontend:** React 19, TypeScript
*   **Estilização:** Tailwind CSS (com abordagem *utility-first* e theming Light/Dark)
*   **Routing:** React Router DOM v6
*   **Visualização de Dados:** Recharts
*   **Inteligência Artificial:** Google Gemini API
*   **Gestão de Estado:** React Context API
*   **Backend & Base de Dados:** Supabase (PostgreSQL)
*   **Offline Storage:** IndexedDB
*   **Ícones:** Heroicons

---

## 📂 Estrutura do Projeto

A estrutura de ficheiros foi pensada para ser modular e escalável:

```
/
├── 📄 index.html            # Ponto de entrada HTML, configuração do Tailwind e import maps.
├── 📄 index.tsx             # Ponto de entrada da aplicação React.
├── 📄 App.tsx               # Definição de todas as rotas da aplicação.
├── 📄 types.ts              # Definições de tipos TypeScript para todo o projeto.
├── 📄 constants.ts           # Dados estáticos/mock (usados como fallback offline).
│
├── 📁 components/            # Componentes React reutilizáveis.
│   ├── 📁 ui/               # Componentes de UI genéricos (Button, Card, Input, etc.).
│   ├── 📄 DataTable.tsx       # Tabela de dados responsiva (tabela em desktop, cards em mobile).
│   ├── 📄 Layout.tsx         # Estrutura principal da página (com Sidebar).
│   └── ...
│
├── 📁 context/               # Contextos React para gestão de estado global.
│   ├── 📄 AuthContext.tsx     # Gestão do estado de autenticação.
│   ├── 📄 DataContext.tsx     # Provider central de dados (lógica de negócio e CRUD).
│   └── 📄 ThemeContext.tsx    # Gestão do tema (light/dark).
│
├── 📁 screens/               # Componentes que representam páginas/ecrãs completos.
│   ├── 📁 dashboards/        # Dashboards específicos para cada perfil.
│   ├── 📄 Students.tsx       # Ecrã da lista de alunos.
│   ├── 📄 StudentForm.tsx    # Formulário para criar/editar alunos.
│   └── ...
│
├── 📁 utils/                 # Funções utilitárias.
│   ├── 📄 db.ts              # Funções de interação com o IndexedDB.
│   ├── 📄 formatters.ts      # Funções de formatação (ex: moeda).
│   └── 📄 useOnlineStatus.ts  # Hook para detetar o estado da conexão.
│
└── 📁 sql/                   # Scripts SQL para a gestão da base de dados.
    ├── 📄 schema.sql          # Cria a estrutura de todas as tabelas e relações.
    ├── 📄 data.sql           # Popula as tabelas com dados iniciais (opcional).
    └── 📄 permissions.sql     # Configura as políticas de segurança (RLS).
```

---

## 🐘 Migração para Supabase Self-Hosted numa VPS

Este guia assume que você já possui uma instância do Supabase a correr na sua VPS, geralmente configurada com Docker. O processo consiste em preparar a base de dados PostgreSQL interna do Supabase e depois conectar o frontend a ela.

### Fase 1: Pré-requisitos na sua VPS

1.  **Acesso à VPS:** Certifique-se de que tem acesso SSH à sua VPS.
2.  **Ferramentas:** Você precisará do cliente `psql` para interagir com o PostgreSQL. Se o Supabase está a correr em Docker, o cliente já está disponível dentro do container da base de dados.
3.  **Localizar Ficheiros Supabase:** Navegue até ao diretório onde os ficheiros do seu Supabase self-hosted estão localizados (geralmente onde se encontra o `docker-compose.yml`).
4.  **Obter a String de Conexão da BD:** A forma mais segura de interagir com a base de dados é a partir da própria VPS. Encontre a senha do PostgreSQL no ficheiro `.env` do seu Supabase.
    ```bash
    # Dentro do diretório do seu Supabase na VPS
    grep POSTGRES_PASSWORD .env
    ```
    Guarde esta senha. O utilizador é `postgres` e a base de dados é `postgres`, a correr na porta `5432`.

### Fase 2: Preparar a Base de Dados (Schema e Dados)

Vamos executar os scripts SQL diretamente na sua base de dados.

1.  **Copie os Ficheiros SQL:** Transfira a pasta `sql/` do seu projeto para a sua VPS (usando `scp` ou outro método).

2.  **Aceda ao Container da Base de Dados:**
    ```bash
    # Descubra o nome do seu container da base de dados
    docker ps | grep db
    
    # Aceda ao container (substitua 'supabase_db_seuprojeto' pelo nome real)
    docker exec -it supabase_db_seuprojeto bash
    ```

3.  **Execute os Scripts SQL com `psql`:** Uma vez dentro do container, você pode usar o `psql`. Os ficheiros que copiou para a VPS precisam de ser acessíveis a partir do container (pode usar `docker cp` ou volumes). A ordem de execução é **CRÍTICA**.

    ```bash
    # Conecte-se à base de dados como o superutilizador postgres
    # Ser-lhe-á pedida a senha que encontrou na Fase 1.
    psql -U postgres

    # Dentro do psql, execute os scripts:
    -- 1. Crie o schema (estrutura das tabelas)
    \i /caminho/para/seus/ficheiros/sql/schema.sql

    -- 2. (Opcional) Popule com dados de exemplo
    -- Se quiser começar com uma base de dados limpa, ignore este passo.
    \i /caminho/para/seus/ficheiros/sql/data.sql
    ```

### Fase 3: Configurar a Segurança (Row Level Security - RLS)

Esta é a parte **mais importante** para uma migração segura. O script `permissions.sql` do projeto pode ser uma versão de desenvolvimento. **Para produção, utilize políticas de segurança restritas.**

1.  **Crie um Ficheiro de Permissões para Produção:** Na sua máquina local, crie um ficheiro `prod_permissions.sql` e cole o conteúdo da secção **"Script SQL para Políticas de Produção"** que se encontra no final deste README. Este script cria perfis de utilizador e regras de acesso detalhadas.

2.  **Copie e Execute o Script de Segurança:**
    *   Transfira o `prod_permissions.sql` para a sua VPS.
    *   Aceda novamente ao container da base de dados com `docker exec`.
    *   Execute o script com `psql`:
    ```bash
    # Dentro do container
    psql -U postgres

    # Dentro do psql
    \i /caminho/para/seus/ficheiros/prod_permissions.sql
    ```
    Isto ativará a RLS e garantirá que os utilizadores só podem aceder aos dados que lhes são permitidos.

### Fase 4: Conectar a Aplicação Frontend

Agora, aponte a sua aplicação SGE para a sua nova instância Supabase.

1.  **Encontre as Suas Chaves de API Self-Hosted:**
    *   **URL do Supabase:** É o endereço IP ou domínio da sua VPS, seguido da porta do Kong Gateway (por defeito, `8000`). Ex: `http://SEU_IP_DA_VPS:8000`.
    *   **Chave Anónima (anon key):** Encontre-a no ficheiro `.env` do seu Supabase na VPS:
        ```bash
        # Dentro do diretório do seu Supabase na VPS
        grep ANON_KEY .env
        ```

2.  **Configure o Ficheiro `.env` do seu Frontend:**
    No ficheiro `.env` do seu projeto SGE, atualize as seguintes variáveis:
    ```env
    VITE_SUPABASE_URL="http://SEU_IP_DA_VPS:8000"
    VITE_SUPABASE_ANON_KEY="SUA_CHAVE_ANON_AQUI"
    ```

3.  **Reinicie a Aplicação:** Pare e reinicie o servidor de desenvolvimento para que as novas variáveis de ambiente sejam carregadas.

### Fase 5: Verificação Final

1.  Abra a aplicação no seu navegador.
2.  Tente fazer login com um dos utilizadores de exemplo.
3.  Abra as ferramentas de desenvolvedor (F12) e vá para o separador "Rede" (Network). Verifique se os pedidos à API estão a ser feitos para o endereço da sua VPS.
4.  Navegue pela aplicação para confirmar que os dados estão a ser lidos corretamente da sua nova base de dados.

Parabéns! Você migrou com sucesso e de forma segura a sua aplicação para uma instância Supabase auto-hospedada.

---

## 🔒 Script SQL para Políticas de Produção (RLS)

Este script implementa a segurança a nível de linha (RLS) para um ambiente de produção.

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
CREATE POLICY "Users can access their own profile." ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Admins can manage all profiles." ON public.profiles FOR ALL USING ( (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'ADMINISTRADOR' );

/*********************************************************************
* PARTE 2: POLÍTICAS DE ACESSO
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

-- Aplicar políticas semelhantes para outras tabelas como grades, attendance, etc.
-- Exemplo para a tabela de notas (grades):
-- ALTER TABLE public.grades ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY "Students can see their own grades." ON public.grades FOR SELECT USING ( student_id = (get_user_profile()).student_id );
-- CREATE POLICY "Teachers can manage grades for their subjects." ON public.grades FOR ALL USING ( (SELECT teacher_id FROM public.class_curriculum cc WHERE cc.class_id = (SELECT class_id FROM students s WHERE s.id = grades.student_id) AND cc.subject_id = grades.subject_id) = (get_user_profile()).teacher_id);
-- CREATE POLICY "Admins/Diretoria can see all grades." ON public.grades FOR SELECT USING ( (get_user_profile()).role IN ('ADMINISTRADOR', 'DIRETORIA') );
```