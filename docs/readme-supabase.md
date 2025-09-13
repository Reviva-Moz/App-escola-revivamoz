# Guia de Integração com Supabase - Escola Reviva

Este guia detalha o processo passo a passo para conectar o sistema de gestão escolar a um banco de dados real utilizando o Supabase.

---

### **Passo 1: Criar o Projeto no Supabase**

Se já seguiu estes passos e tem as suas chaves, pode avançar para o **Passo 2**.

1.  **Crie uma Conta:** Se ainda não tiver uma, registe-se gratuitamente em [Supabase.com](https://supabase.com).

2.  **Crie um Novo Projeto:**
    *   No seu dashboard, clique em **"New Project"**.
    *   Dê um nome ao projeto (ex: `escola-reviva`).
    *   Gere uma senha segura para o banco de dados e guarde-a num local seguro.
    *   Escolha a região do servidor mais próxima de si para menor latência.
    *   Aguarde alguns minutos para que o seu projeto seja provisionado.

---

### **Passo 2: Configurar o Banco de Dados**

Vamos agora criar a estrutura de tabelas e inserir os dados iniciais.

1.  **Abra o Editor SQL:**
    *   No menu lateral esquerdo do seu projeto Supabase, clique no ícone de **Editor SQL** (um ícone de base de dados com "SQL").

2.  **Crie as Tabelas (Schema):**
    *   Clique em **"+ New query"**.
    *   Abra o ficheiro `sql/schema.sql` que está no explorador de ficheiros da aplicação.
    *   Copie **TODO** o conteúdo do ficheiro `sql/schema.sql`.
    *   Cole o conteúdo no editor SQL do Supabase.
    *   Clique no botão verde **"RUN"** (ou use o atalho `Cmd+Enter` / `Ctrl+Enter`).
    *   Após alguns segundos, deverá ver uma mensagem de "Success. No rows returned". As suas tabelas estão criadas!

3.  **Popule as Tabelas com Dados Iniciais:**
    *   Crie uma nova query clicando novamente em **"+ New query"**.
    *   Abra o ficheiro `sql/data.sql`.
    *   Copie **TODO** o conteúdo do ficheiro `sql/data.sql`.
    *   Cole o conteúdo no editor SQL.
    *   Clique em **"RUN"**.
    *   Deverá ver outra mensagem de sucesso. Agora, o seu banco de dados contém todos os dados de exemplo que usávamos localmente.

---

### **Passo 3: Integrar o Supabase com a Aplicação**

Com o backend pronto, vamos configurar a nossa aplicação para se conectar a ele.

1.  **Crie um Ficheiro de Ambiente:**
    *   Na pasta raiz do seu projeto (ao lado do `index.html`), crie um novo ficheiro chamado `.env`.
    *   **Importante:** Este ficheiro contém chaves secretas e **NUNCA** deve ser enviado para repositórios públicos (como o GitHub). Se estiver a usar Git, adicione `.env` ao seu ficheiro `.gitignore`.

2.  **Adicione as Suas Chaves ao Ficheiro `.env`:**
    *   Abra o ficheiro `.env` e adicione o seguinte conteúdo. **Eu já preenchi com os dados que me forneceu**:

    ```env
    # Credenciais do Projeto Supabase - Escola Reviva
    VITE_SUPABASE_URL="https://sygcsxklrqrsxuilavxc.supabase.co"
    VITE_SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN5Z2NzeGtscnFyc3h1aWxhdnhjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU5MjQ4MTYsImV4cCI6MjA3MTUwMDgxNn0.xxONtQfrC48jzvCWC76N6phDuXGIoDMg0Cj_To9EPGQ"
    ```

---

### **Passo 4: Testar a Conexão**

A aplicação já está configurada para ler estas variáveis de ambiente automaticamente através do ficheiro `utils/supabase.ts`.

1.  **Reinicie a Aplicação:** Se a aplicação estiver em execução, pare-a e inicie-a novamente para que ela possa carregar as novas variáveis de ambiente do ficheiro `.env`.

2.  **Verifique a Página de Alunos:**
    *   Navegue para a secção **"Gestão de Alunos"**.
    *   A lista de alunos que vê agora deve ser exatamente a mesma de antes, mas desta vez, os dados estão a ser carregados diretamente do seu banco de dados Supabase!
    *   Pode confirmar isto indo ao **"Table Editor"** no Supabase, selecionando a tabela `students` e alterando o nome de um aluno. Ao recarregar a página na aplicação, a alteração deverá ser refletida.

### **Passo 5: Próximos Passos e Refatoração**

A integração está funcional! O próximo passo é aplicar o mesmo padrão de carregamento de dados e submissão de formulários às outras funcionalidades do sistema.

*   **Modelo de Refatoração:** Use os ficheiros `screens/Students.tsx` e `screens/StudentForm.tsx` como o exemplo perfeito de como refatorar os outros módulos (Professores, Turmas, Disciplinas, etc.).

*   **JOINs em Queries:** Note que na query em `Students.tsx`, usamos `.select('*, classes(name)')` para buscar o nome da turma relacionada. Este é um padrão poderoso do Supabase para buscar dados de tabelas relacionadas numa única chamada.

*   **Autenticação:** O sistema de login atual é uma simulação. O próximo grande passo seria integrar o **Supabase Auth** para uma gestão de utilizadores real e segura.

*   **Segurança (RLS):** Após configurar a autenticação, explore a **Row Level Security (RLS)** do Supabase para criar regras de acesso, garantindo que os utilizadores só possam ver e modificar os dados que lhes são permitidos.

Parabéns! A sua aplicação está agora conectada a um backend escalável e robusto.
