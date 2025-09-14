-- =====================================================================
-- ==      ARQUIVO DE PERMISSÕES DINÂMICAS - ESCOLA REVIVA SGE        ==
-- =====================================================================
--
-- Este script foi concebido para a FASE DE DESENVOLVIMENTO.
-- O seu objetivo é garantir que qualquer serviço ou agente (incluindo
-- anónimos com a 'anon key') tenha acesso total a todas as tabelas
-- no schema 'public', facilitando a prototipagem e integração.
--
-- Executar este script irá:
--   1. Ativar a Row Level Security (RLS) em TODAS as tabelas existentes.
--   2. Apagar quaisquer políticas de RLS anteriores para evitar conflitos.
--   3. Criar uma nova política chamada "Public full access" em CADA tabela,
--      que permite todas as operações (SELECT, INSERT, UPDATE, DELETE)
--      para qualquer role, incluindo 'anon' e 'authenticated'.
--
-- Criado em: $(date)
--

-- Bloco 1: Habilitar Row Level Security (RLS) dinamicamente
-- Este loop percorre todas as tabelas no schema 'public' e ativa a RLS.
-- A RLS é uma camada de segurança essencial do PostgreSQL/Supabase.
DO $$
DECLARE
  t text;
BEGIN
  FOR t IN
    SELECT tablename FROM pg_catalog.pg_tables WHERE schemaname = 'public'
  LOOP
    EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY;', t);
    RAISE NOTICE 'RLS habilitada para a tabela: %', t;
  END LOOP;
END
$$;

-- Bloco 2: Aplicar políticas de acesso total dinamicamente
-- Este loop cria uma política permissiva para cada tabela no schema 'public'.
DO $$
DECLARE
  t text;
BEGIN
  FOR t IN
    SELECT tablename FROM pg_catalog.pg_tables WHERE schemaname = 'public'
  LOOP
    -- Primeiro, remove a política se ela já existir, para garantir que o script pode ser executado várias vezes.
    EXECUTE format('DROP POLICY IF EXISTS "Public full access" ON public.%I;', t);

    -- Cria a política de acesso total. 'USING (true)' aplica-se a SELECT, UPDATE, DELETE.
    -- 'WITH CHECK (true)' aplica-se a INSERT e UPDATE. Juntos, abrem o acesso.
    EXECUTE format('
      CREATE POLICY "Public full access"
      ON public.%I
      FOR ALL
      USING (true)
      WITH CHECK (true);
    ', t, t);
    RAISE NOTICE 'Política de acesso total criada para a tabela: %', t;
  END LOOP;
END
$$;

-- FIM DO SCRIPT DE PERMISSÕES