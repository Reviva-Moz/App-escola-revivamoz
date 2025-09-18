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
    ```

4.  **Reinicie a Aplicação:** Se a aplicação estiver em execução, pare e reinicie o servidor para que as novas variáveis de ambiente sejam carregadas.

A sua aplicação está agora conectada ao Supabase!

---

## 🗂️ Visão Geral do Schema da Base de Dados

O `schema.sql` cria as seguintes tabelas principais:

*   `students`: Armazena os dados dos alunos.
*   `teachers`: Armazena os dados dos professores.
*   `classes`: Define as turmas do ano letivo e o seu professor principal.
*   `subjects`: Lista de todas as disciplinas.
*   `class_curriculum`: Tabela de ligação que associa disciplinas e professores a cada turma.
*   `transactions`: O livro-razão, regista todas as transações financeiras.
*   `financial_categories`: Categorias para as transações (ex: Mensalidades, Salários).
*   `scholarships`: Define os tipos de bolsas de estudo.
*   `student_scholarships`: Tabela de ligação que atribui bolsas a alunos.
*   `grades`: Armazena as notas dos alunos por disciplina.
*   `calendar_events`: Regista todos os eventos do calendário.
*   ... entre outras.

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
