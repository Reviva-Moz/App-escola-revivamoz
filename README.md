# Sistema de Gestão Escolar (SGE) - Escola Reviva

Bem-vindo ao repositório do Sistema de Gestão Escolar (SGE) da Escola Reviva. Este é um sistema web completo, desenhado para modernizar e centralizar as operações diárias da escola, desde a gestão académica e de alunos até ao controlo financeiro.

---

## 🚀 Funcionalidades Principais

O SGE está organizado em módulos para cobrir todas as necessidades da escola:

*   **Dashboard Principal:** Visão geral com estatísticas chave, como número de alunos, professores, taxa de aprovação e um resumo financeiro.
*   **Gestão de Alunos:** Cadastro, edição e visualização da lista completa de alunos, incluindo informações pessoais e de contacto dos encarregados.
*   **Sistema Financeiro:** Um módulo completo para controlo de receitas e despesas, gestão de matrículas, mensalidades, bolsas de estudo e categorias financeiras.
*   **Gestão Académica:**
    *   **Professores:** Gestão do corpo docente.
    *   **Turmas:** Criação e organização das turmas do ano letivo, incluindo a gestão do plano curricular (disciplinas e professores por turma).
    *   **Disciplinas:** Cadastro de todas as disciplinas oferecidas.
*   **Operações Diárias:**
    *   **Assiduidade:** Lançamento de presenças por turma e disciplina.
    *   **Lançamento de Notas:** Cadastro de notas trimestrais e exames.
    *   **Calendário de Provas:** Visualização e agendamento de avaliações.
*   **Administrativo:**
    *   **Calendário Escolar:** Gestão de eventos, feriados e prazos.
    *   **Relatórios:** Geração de relatórios de alunos, professores e financeiros.

---

## 💻 Stack Tecnológica

*   **Frontend:** React 19, TypeScript
*   **Estilização:** Tailwind CSS (com abordagem *utility-first*)
*   **Routing:** React Router DOM
*   **Visualização de Dados:** Recharts
*   **Backend & Base de Dados:** Supabase (PostgreSQL)
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
├── 📄 constants.ts           # Dados estáticos/mock (usados como fallback).
├── 📄 metadata.json          # Metadados da aplicação.
│
├── 📁 components/            # Componentes React reutilizáveis.
│   ├── 📁 charts/            # Componentes de gráficos (ex: CategoryPieChart).
│   ├── 📁 ui/               # Componentes de UI genéricos (Button, Card, Input, etc.).
│   ├── 📄 DataTable.tsx       # Tabela de dados responsiva.
│   ├── 📄 Header.tsx         # Cabeçalho padrão das páginas.
│   ├── 📄 Layout.tsx         # Estrutura principal da página (com Sidebar).
│   ├── 📄 Sidebar.tsx        # Barra de navegação lateral.
│   └── ...
│
├── 📁 context/               # Contextos React para gestão de estado global.
│   ├── 📄 AuthContext.tsx     # Gestão do estado de autenticação.
│   ├── 📄 ThemeContext.tsx    # Gestão do tema (light/dark).
│
├── 📁 screens/               # Componentes que representam páginas/ecrãs completos.
│   ├── 📄 Dashboard.tsx      # Ecrã do dashboard principal.
│   ├── 📄 Students.tsx       # Ecrã da lista de alunos.
│   ├── 📄 StudentForm.tsx    # Formulário para criar/editar alunos.
│   └── ...
│
├── 📁 utils/                 # Funções utilitárias.
│   ├── 📄 formatters.ts      # Funções de formatação (ex: moeda).
│   ├── 📄 supabase.ts        # Configuração e inicialização do cliente Supabase.
│
├── 📁 sql/                   # Scripts SQL para a gestão da base de dados.
│   ├── 📄 schema.sql          # Cria a estrutura de todas as tabelas e relações.
│   ├── 📄 data.sql           # Popula as tabelas com dados iniciais.
│   ├── 📄 permissions.sql     # Configura as políticas de segurança (RLS).
│
└── 📁 docs/                   # Documentação (removido, ver READMEs na raiz).
```

---

## 🏁 Como Começar

Para executar este projeto e conectá-lo a uma base de dados real, siga as instruções detalhadas no ficheiro **`README_SUPABASE.md`**.
