# Sistema de Gestão Escolar - Escola Reviva 🎓

> **SGE Reviva** - Sistema completo de gestão escolar desenvolvido em React + TypeScript com integração Supabase

## 📋 Visão Geral

O **Sistema de Gestão Escolar da Escola Reviva** é uma aplicação web moderna e completa para administração de instituições de ensino. Desenvolvido com as mais recentes tecnologias web, oferece uma interface intuitiva e responsiva para gestão de alunos, professores, finanças, turmas e muito mais.

### ✨ Características Principais

- 🎨 **Interface Moderna**: Design limpo com tema claro/escuro
- 📱 **Totalmente Responsivo**: Funciona perfeitamente em desktop, tablet e mobile
- ⚡ **Performance Otimizada**: Construído com Vite para carregamento rápido
- 🔒 **Seguro**: Integração com Supabase e Row Level Security
- 📊 **Dashboards Interativos**: Gráficos e estatísticas em tempo real
- 🌐 **Offline-First**: Funciona com dados mock quando offline

## 🚀 Tecnologias Utilizadas

### Frontend
- **React 18** - Biblioteca principal para UI
- **TypeScript** - Tipagem estática para maior confiabilidade
- **Vite** - Build tool moderna e rápida
- **Tailwind CSS** - Framework CSS utility-first
- **React Router DOM** - Roteamento SPA
- **Recharts** - Biblioteca de gráficos interativos
- **Heroicons** - Ícones SVG otimizados

### Backend & Database
- **Supabase** - Backend-as-a-Service (PostgreSQL + Auth + Real-time)
- **PostgreSQL** - Banco de dados relacional robusto
- **Row Level Security (RLS)** - Segurança a nível de linha

### Ferramentas de Desenvolvimento
- **ESLint** - Linting de código
- **Prettier** - Formatação automática
- **Git** - Controle de versão

## 🏗️ Arquitetura do Projeto

```
App-escola-revivamoz/
├── 📁 components/          # Componentes reutilizáveis
│   ├── 📁 ui/             # Componentes de interface base
│   ├── 📁 charts/         # Componentes de gráficos
│   └── 📄 Layout.tsx      # Layout principal
├── 📁 screens/            # Telas da aplicação
├── 📁 context/            # Contextos React (Auth, Theme)
├── 📁 utils/              # Utilitários e helpers
├── 📁 sql/                # Scripts de banco de dados
├── 📄 types.ts            # Definições de tipos TypeScript
├── 📄 constants.ts        # Dados mock e constantes
└── 📄 App.tsx             # Componente raiz
```

## 🎯 Funcionalidades Implementadas

### 🏠 Dashboard Principal
- **Estatísticas Gerais**: Total de alunos (342), professores (28), taxa de aprovação (94%)
- **Gráficos Interativos**: Distribuição de alunos por classe
- **Resumo Financeiro**: Receitas, despesas e saldo atual
- **Cards Informativos**: Métricas importantes em destaque

### 👥 Gestão de Alunos
- **Listagem Completa**: Visualização em tabela (desktop) e cards (mobile)
- **Busca e Filtros**: Localização rápida de alunos
- **Dados Detalhados**: Nome, turma, idade, responsável, telefone, status
- **Status Tracking**: Ativo/Inativo com badges visuais

### 💰 Sistema Financeiro
- **Resumo Executivo**: 
  - Receitas Totais: 233.600 MZN
  - Despesas Totais: 88.900 MZN
  - Saldo Atual: 144.700 MZN
- **Categorização**: Receitas e despesas por categoria
- **Gráficos de Pizza**: Visualização das distribuições financeiras
- **Gestão de Transações**: Registro completo de movimentações
- **Sistema de Bolsas**: Gestão de descontos e auxílios

### 👨‍🏫 Gestão de Professores
- **Cadastro Completo**: Dados pessoais, qualificações, contato
- **Status Management**: Controle de professores ativos/inativos
- **Vinculação com Turmas**: Associação professor-turma-disciplina

### 🏫 Gestão de Turmas e Disciplinas
- **Organização por Classes**: 3ª, 5ª, 7ª classes
- **Currículo Escolar**: Disciplinas por turma
- **Carga Horária**: Controle de horas por disciplina

### 📅 Sistema de Calendário
- **Eventos Escolares**: Feriados, provas, reuniões
- **Prazos Importantes**: Pagamentos, matrículas
- **Calendário Acadêmico**: Organização do ano letivo

### 🎨 Interface e UX
- **Tema Claro/Escuro**: Alternância automática ou manual
- **Design Responsivo**: Mobile-first approach
- **Navegação Intuitiva**: Sidebar organizada por categorias
- **Componentes Padronizados**: Design system consistente

## 🛠️ Instalação e Configuração

### Pré-requisitos
- Node.js 18+ 
- npm ou yarn
- Conta no Supabase (opcional)

### 1. Clone o Repositório
```bash
git clone https://github.com/seu-usuario/App-escola-revivamoz.git
cd App-escola-revivamoz
```

### 2. Instale as Dependências
```bash
npm install
# ou
yarn install
```

### 3. Configuração do Ambiente

#### Opção A: Com Supabase (Recomendado)
1. Crie um projeto no [Supabase](https://supabase.com)
2. Execute os scripts SQL na ordem:
   - `sql/schema.sql` (estrutura)
   - `sql/dados.sql` (dados iniciais)
   - `sql/permissions.sql` (permissões)
3. Crie o arquivo `.env`:
```env
VITE_SUPABASE_URL=sua_url_do_supabase
VITE_SUPABASE_ANON_KEY=sua_chave_anonima
```

#### Opção B: Modo Demo (Dados Mock)
Sem configuração adicional - a aplicação funcionará com dados de exemplo.

### 4. Execute a Aplicação
```bash
npm run dev
# ou
yarn dev
```

Acesse: `http://localhost:5173`

## 🔐 Autenticação

**Credenciais de Teste:**
- **Email:** admin@reviva.com
- **Senha:** admin

## 📊 Estrutura de Dados

### Entidades Principais

| Entidade | Descrição | Campos Principais |
|----------|-----------|-------------------|
| **students** | Dados dos alunos | name, class_id, age, guardian, phone, status |
| **teachers** | Dados dos professores | name, email, phone, qualifications, status |
| **classes** | Turmas escolares | name, year, teacher_id |
| **subjects** | Disciplinas | name, code, workload |
| **transactions** | Movimentações financeiras | date, description, type, amount, category_id |
| **scholarships** | Bolsas de estudo | name, type, value |
| **calendar_events** | Eventos do calendário | title, date, type, description |

### Relacionamentos
- Alunos ↔ Turmas (many-to-one)
- Professores ↔ Turmas (one-to-many)
- Turmas ↔ Disciplinas (many-to-many via class_curriculum)
- Alunos ↔ Bolsas (many-to-many via student_scholarships)

## 🎨 Design System

### Paleta de Cores
- **Primary**: Verde Reviva (#2d5a27)
- **Secondary**: Slate (100-900)
- **Success**: Verde (#10B981)
- **Warning**: Amarelo (#F59E0B)
- **Error**: Vermelho (#EF4444)

### Tipografia
- **Fonte**: Inter (Google Fonts)
- **Pesos**: 400, 500, 600, 700

## 📱 Responsividade

- **Mobile First**: Design otimizado para dispositivos móveis
- **Breakpoints**: sm (640px), md (768px), lg (1024px), xl (1280px)
- **Componentes Adaptativos**: Tabelas se transformam em cards no mobile

## 🔧 Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev          # Inicia servidor de desenvolvimento

# Build
npm run build        # Gera build de produção
npm run preview      # Preview do build

# Linting
npm run lint         # Executa ESLint
```

## 📈 Métricas do Sistema

### Dados Atuais (Demo)
- **👥 Alunos**: 342 estudantes ativos
- **👨‍🏫 Professores**: 28 educadores
- **📊 Taxa de Aprovação**: 94%
- **💰 Receita Mensal**: ~19.500 MZN
- **🏫 Turmas**: 8 classes ativas

## 🚀 Roadmap

### Próximas Funcionalidades
- [ ] **Sistema de Notas**: Lançamento e consulta de notas
- [ ] **Controle de Frequência**: Registro de presença
- [ ] **Relatórios Avançados**: Exportação em PDF/Excel
- [ ] **Comunicação**: Sistema de mensagens pais-escola
- [ ] **App Mobile**: Aplicativo nativo
- [ ] **API REST**: Endpoints para integrações

### Melhorias Técnicas
- [ ] **Testes Automatizados**: Jest + Testing Library
- [ ] **CI/CD**: Pipeline de deploy automático
- [ ] **PWA**: Progressive Web App
- [ ] **Internacionalização**: Suporte multi-idioma

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 📞 Suporte

- **Documentação**: Consulte os arquivos README específicos
- **Issues**: Reporte bugs via GitHub Issues
- **Email**: suporte@reviva.com

## 🙏 Agradecimentos

- Equipe da Escola Reviva
- Comunidade React/TypeScript
- Supabase pela excelente plataforma
- Tailwind CSS pelo framework incrível

---

**Desenvolvido com ❤️ para a educação moçambicana**

*Última atualização: Dezembro 2024*