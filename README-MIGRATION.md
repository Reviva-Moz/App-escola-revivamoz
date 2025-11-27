# Sistema de Gestão Escolar (SGE) - Guia de Migração para Supabase

Este documento fornece um guia passo a passo para configurar a base de dados do SGE numa instância Supabase (self-hosted ou cloud) e preparar a aplicação para produção.

---

## 🚀 Guia de Configuração da Base de Dados

Siga estes passos para ter a base de dados a funcionar rapidamente. Todos os scripts necessários encontram-se na pasta `sql/`.

### Passo 1: Obter as Chaves da API Supabase

1.  **Aceda ao seu Projeto:** Navegue até ao seu projeto no dashboard do Supabase.
2.  **Encontre as Chaves:** Vá a **Project Settings > API**. Você precisará da **Project URL** e da **anon public key**.
3.  **Configure o Frontend:** Crie um ficheiro `.env` na raiz do projeto SGE e adicione as suas chaves:
    ```env
    VITE_SUPABASE_URL="A_SUA_PROJECT_URL_AQUI"
    VITE_SUPABASE_ANON_KEY="A_SUA_CHAVE_ANON_PUBLIC_AQUI"
    ```

### Passo 2: Executar os Scripts SQL

No dashboard do seu projeto Supabase, vá para o **SQL Editor**. Execute os seguintes scripts **exatamente nesta ordem**.

1.  **`sql/schema.sql`**
    *   **O que faz?** Cria toda a estrutura da base de dados: tabelas, colunas, relações e tipos personalizados.
    *   **Como executar?** Copie o conteúdo do ficheiro, cole no SQL Editor e clique em **"RUN"**.

2.  **`sql/data.sql`**
    *   **O que faz?** (Opcional) Popula as tabelas com dados de exemplo para demonstração. Ignore este passo se desejar uma base de dados limpa.
    *   **Como executar?** Crie uma nova query, copie o conteúdo do ficheiro, cole e clique em **"RUN"**.

### Passo 3: Configurar a Segurança (Row Level Security - RLS)

A RLS é **essencial** para proteger os dados em produção.

1.  **`sql/permissions.sql`**
    *   **O que faz?** Cria as funções e políticas de segurança necessárias para controlar o acesso aos dados com base no perfil do utilizador autenticado.
    *   **Como executar?** Crie uma nova query, copie o conteúdo do ficheiro, cole e clique em **"RUN"**.

### Passo 4: Configurar o Armazenamento de Ficheiros (Storage)

Esta etapa cria um local seguro para o upload de documentos e fotos.

1.  **`sql/storage.sql`**
    *   **O que faz?** Cria um *bucket* de armazenamento chamado `user_uploads` e aplica políticas de segurança que garantem que os utilizadores só podem aceder aos seus próprios ficheiros, com um limite de tamanho.
    *   **Como executar?** Crie uma nova query, copie o conteúdo do ficheiro, cole e clique em **"RUN"**.

### Passo 5: Verificação Final

1.  **Reinicie a Aplicação:** Se o seu servidor de desenvolvimento estava a correr, pare-o e inicie-o novamente para carregar as variáveis de ambiente.
2.  **Teste o Login:** Aceda à aplicação e tente fazer login com um dos utilizadores de exemplo (se tiver executado `data.sql`).
3.  **Verifique a Conexão:** Navegue pelas diferentes secções para confirmar que os dados estão a ser carregados a partir da sua instância Supabase.

A sua aplicação está agora configurada, segura e pronta para ser usada.
