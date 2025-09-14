# Guia de Integração com Supabase - Escola Reviva

Este guia detalha o processo passo a passo para configurar e conectar o sistema de gestão escolar a um banco de dados real utilizando o Supabase, incluindo a estrutura das tabelas, dados iniciais e políticas de segurança.

---

### **Passo 1: Criar o Projeto no Supabase**

Se já tem um projeto e as suas chaves, pode avançar para o **Passo 2**.

1.  **Crie uma Conta:** Se ainda não tiver uma, registe-se gratuitamente em [Supabase.com](https://supabase.com).

2.  **Crie um Novo Projeto:**
    *   No seu dashboard, clique em **"New Project"**.
    *   Dê um nome ao projeto (ex: `escola-reviva`).
    *   Gere uma senha segura para o banco de dados e guarde-a num local seguro.
    *   Escolha a região do servidor mais próxima de si para menor latência.
    *   Aguarde alguns minutos para que o seu projeto seja provisionado.

---

### **Passo 2: Configurar o Banco de Dados (Executar Scripts SQL)**

Agora, vamos criar toda a estrutura do banco de dados e populá-la com os dados de exemplo. Para isso, criámos dois ficheiros SQL que deve executar na ordem correta.

1.  **Abra o Editor SQL:**
    *   No menu lateral esquerdo do seu projeto Supabase, clique no ícone de **SQL Editor**.

2.  **Execute o Script do Schema (Estrutura):**
    *   Clique em **"+ New query"**.
    *   Abra o ficheiro `sql/schema.sql` que está no explorador de ficheiros da aplicação.
    *   Copie **TODO** o conteúdo do ficheiro.
    *   Cole o conteúdo no editor SQL do Supabase.
    *   Clique no botão verde **"RUN"** (ou use o atalho `Cmd+Enter` / `Ctrl+Enter`).
    *   Após alguns segundos, deverá ver uma mensagem de "Success". Isto criou todas as tabelas, relações e políticas de segurança.

3.  **Execute o Script de Dados (População):**
    *   Crie uma nova query clicando novamente em **"+ New query"**.
    *   Abra o ficheiro `sql/data.sql`.
    *   Copie **TODO** o conteúdo do ficheiro.
    *   Cole o conteúdo no editor SQL.
    *   Clique em **"RUN"**.
    *   Deverá ver outra mensagem de sucesso. Agora, o seu banco de dados contém todos os dados de exemplo que a aplicação utiliza.

---

### **Passo 3: Integrar o Supabase com a Aplicação**

Com o backend pronto, vamos configurar a nossa aplicação para se conectar a ele.

1.  **Encontre as Suas Chaves de API:**
    *   No menu lateral, clique no ícone de **Project Settings** (engrenagem).
    *   Vá para a secção **API**.
    *   Aqui encontrará a sua **Project URL** e a chave **anon public** key. Precisaremos delas.

2.  **Configure as Variáveis de Ambiente:**
    *   Se ainda não o fez, crie um ficheiro chamado `.env` na raiz do seu projeto (ao lado do `index.html`).
    *   Abra o ficheiro `.env` e adicione o seguinte conteúdo, substituindo os valores pelos do seu projeto:

    ```env
    # Credenciais do Projeto Supabase
    VITE_SUPABASE_URL="A_SUA_PROJECT_URL_AQUI"
    VITE_SUPABASE_ANON_KEY="A_SUA_CHAVE_ANON_PUBLIC_AQUI"
    ```
   * **Importante:** O ficheiro `.env` contém chaves secretas e **NUNCA** deve ser enviado para repositórios públicos (como o GitHub). Se estiver a usar Git, adicione `.env` ao seu ficheiro `.gitignore`.

---

### **Passo 4: Testar a Conexão**

A aplicação está configurada para ler estas variáveis de ambiente automaticamente através do ficheiro `utils/supabase.ts`.

1.  **Reinicie a Aplicação:** Se a aplicação estiver em execução, pare-a e inicie-a novamente para que ela possa carregar as novas variáveis de ambiente do ficheiro `.env`.

2.  **Verifique a Aplicação:**
    *   Faça login (admin@reviva.com / admin).
    *   Navegue para a secção **"Gestão de Alunos"**. A lista de alunos deve ser a mesma de antes, mas agora os dados vêm diretamente do seu banco de dados Supabase.
    *   **Teste:** Vá ao **"Table Editor"** no Supabase, selecione a tabela `students` e altere o nome de um aluno. Ao recarregar a página na aplicação, a alteração deverá ser refletida.

---

### **Entender a Segurança (Row Level Security - RLS)**

O script `schema.sql` já ativou a RLS para todas as tabelas. Isto significa que, por defeito, ninguém pode aceder aos dados.

Criámos uma política base para cada tabela que permite que **qualquer utilizador autenticado (logado)** possa ler, criar, atualizar e apagar dados.

```sql
-- Exemplo de política aplicada a todas as tabelas
CREATE POLICY "Allow all access to authenticated users"
ON public.students
FOR ALL
TO authenticated -- 'authenticated' é um role padrão do Supabase
USING (true)
WITH CHECK (true);
```

Isto é um ponto de partida seguro. Para uma aplicação mais complexa, poderia criar roles mais específicos (ex: 'professores', 'financeiro') e políticas que restrinjam o acesso. Por exemplo, um professor só poderia ver os alunos da sua própria turma.

Parabéns! A sua aplicação está agora conectada a um backend escalável e robusto. O próximo passo é refatorar os restantes módulos (Professores, Turmas, etc.) para usarem o Supabase, seguindo o exemplo de `screens/Students.tsx` e `screens/StudentForm.tsx`.
