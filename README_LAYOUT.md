# Guia Completo de Design System - Escola Reviva SGE 🎨

> **Design System Reviva** - Documentação completa do sistema de design, componentes visuais e padrões de interface do Sistema de Gestão Escolar

## 📋 Visão Geral do Design System

Este documento serve como **fonte única da verdade** para todos os aspectos visuais, de layout e de experiência do usuário do Sistema de Gestão Escolar da Escola Reviva. O objetivo é garantir consistência, acessibilidade e uma experiência de usuário excepcional em toda a aplicação.

### 🎯 Objetivos do Design System

- **Consistência Visual**: Padrões uniformes em toda a aplicação
- **Eficiência de Desenvolvimento**: Componentes reutilizáveis e bem documentados
- **Acessibilidade**: Conformidade com WCAG 2.1 AA
- **Escalabilidade**: Sistema flexível para crescimento futuro
- **Manutenibilidade**: Código limpo e bem organizado

---

## 🎨 Filosofia de Design

### Princípios Fundamentais

1. **🎯 Clareza e Simplicidade**
   - Interface limpa sem elementos desnecessários
   - Hierarquia visual clara e intuitiva
   - Foco na funcionalidade essencial

2. **📱 Mobile-First & Responsivo**
   - Design otimizado primeiro para dispositivos móveis
   - Adaptação progressiva para telas maiores
   - Experiência consistente em todos os dispositivos

3. **♿ Acessibilidade Universal**
   - Contraste adequado para legibilidade
   - Navegação por teclado completa
   - Suporte a leitores de tela
   - Textos alternativos em imagens

4. **⚡ Performance e Usabilidade**
   - Carregamento rápido de componentes
   - Feedback visual imediato
   - Estados de loading e erro claros

---

## 🌈 Sistema de Cores

### Paleta Principal

#### Cores da Marca Reviva
```css
/* Definidas no tailwind.config dentro do index.html */
--reviva-green: #2d5a27;        /* Cor principal da marca */
--reviva-green-dark: #21421d;    /* Hover states, elementos ativos */
--reviva-green-light: #3c7835;   /* Destaques, modo escuro */
--reviva-dark: #1f2937;          /* Sidebar, elementos escuros */
```

**Uso das Cores da Marca:**
- `reviva-green`: Botões primários, links, logos, destaques importantes
- `reviva-green-dark`: Estados hover, elementos selecionados
- `reviva-green-light`: Variações em modo escuro, acentos suaves
- `reviva-dark`: Backgrounds da sidebar, elementos de navegação

#### Paleta Neutra (Slate)
```css
/* Sistema baseado no Slate do Tailwind CSS */
slate-50: #f8fafc;    /* Backgrounds muito claros */
slate-100: #f1f5f9;   /* Background principal (light mode) */
slate-200: #e2e8f0;   /* Bordas, divisores */
slate-300: #cbd5e1;   /* Bordas mais visíveis */
slate-400: #94a3b8;   /* Texto secundário (light) */
slate-500: #64748b;   /* Texto terciário */
slate-600: #475569;   /* Texto secundário (dark) */
slate-700: #334155;   /* Bordas (dark mode) */
slate-800: #1e293b;   /* Cards, containers (dark) */
slate-900: #0f172a;   /* Background principal (dark mode) */
```

#### Cores Semânticas
```css
/* Estados e Feedback Visual */
--success: #10b981;   /* Verde - Sucesso, Ativo, Pago */
--warning: #f59e0b;   /* Amarelo - Aviso, Pendente */
--error: #ef4444;     /* Vermelho - Erro, Atrasado, Exclusão */
--info: #3b82f6;      /* Azul - Informação, Links secundários */
```

### Aplicação das Cores

#### Modo Claro (Light Mode)
- **Background Principal**: `bg-slate-100`
- **Cards/Containers**: `bg-white`
- **Texto Principal**: `text-slate-800`
- **Texto Secundário**: `text-slate-500`
- **Bordas**: `border-slate-200`

#### Modo Escuro (Dark Mode)
- **Background Principal**: `bg-slate-900`
- **Cards/Containers**: `bg-slate-800`
- **Texto Principal**: `text-slate-200`
- **Texto Secundário**: `text-slate-400`
- **Bordas**: `border-slate-700`

---

## ✒️ Sistema Tipográfico

### Fonte Principal
**Inter** - Fonte moderna, legível e otimizada para interfaces digitais
- **Fonte**: Inter (Google Fonts)
- **Fallbacks**: system-ui, -apple-system, sans-serif
- **Carregamento**: Otimizado via Google Fonts

### Hierarquia Tipográfica

```css
/* Títulos Principais */
.text-4xl { font-size: 2.25rem; font-weight: 700; } /* Títulos de página */
.text-3xl { font-size: 1.875rem; font-weight: 700; } /* Subtítulos principais */
.text-2xl { font-size: 1.5rem; font-weight: 600; } /* Títulos de seção */
.text-xl { font-size: 1.25rem; font-weight: 600; } /* Títulos de card */
.text-lg { font-size: 1.125rem; font-weight: 500; } /* Texto destacado */

/* Texto Corpo */
.text-base { font-size: 1rem; font-weight: 400; } /* Texto padrão */
.text-sm { font-size: 0.875rem; font-weight: 400; } /* Texto secundário */
.text-xs { font-size: 0.75rem; font-weight: 400; } /* Labels, metadados */
```

### Pesos de Fonte
- **400 (Regular)**: Texto corpo, parágrafos, conteúdo geral
- **500 (Medium)**: Labels, texto de navegação, elementos interativos
- **600 (Semibold)**: Títulos de cards, badges, tabs, botões
- **700 (Bold)**: Títulos principais, valores importantes, headers

---

## 📐 Sistema de Layout

### Grid System
Baseado no CSS Grid e Flexbox do Tailwind CSS:

```css
/* Layouts Responsivos */
.grid-cols-1        /* Mobile: 1 coluna */
.md:grid-cols-2     /* Tablet: 2 colunas */
.lg:grid-cols-3     /* Desktop: 3 colunas */
.xl:grid-cols-4     /* Desktop grande: 4 colunas */
```

### Breakpoints
```css
/* Tailwind CSS Breakpoints */
sm: 640px;    /* Tablet pequeno */
md: 768px;    /* Tablet */
lg: 1024px;   /* Desktop */
xl: 1280px;   /* Desktop grande */
2xl: 1536px;  /* Desktop muito grande */
```

### Espaçamento
Sistema baseado em múltiplos de 4px (0.25rem):

```css
/* Espaçamentos Padrão */
p-1: 0.25rem (4px)    /* Espaçamento mínimo */
p-2: 0.5rem (8px)     /* Espaçamento pequeno */
p-4: 1rem (16px)      /* Espaçamento padrão */
p-6: 1.5rem (24px)    /* Espaçamento médio */
p-8: 2rem (32px)      /* Espaçamento grande */
p-12: 3rem (48px)     /* Espaçamento extra grande */
```

---

## 🧩 Biblioteca de Componentes

### Componentes Base (`/components/ui`)

#### 1. **Card Component**
```typescript
// Card.tsx - Container padrão para agrupamento de conteúdo
interface CardProps {
  children: React.ReactNode;
  className?: string;
}
```
**Características:**
- Background branco/slate-800 (modo escuro)
- Bordas arredondadas (rounded-xl)
- Sombra sutil com suporte a modo escuro
- Padding interno configurável

#### 2. **Button Component**
```typescript
// Button.tsx - Sistema completo de botões
type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'link';
type ButtonSize = 'sm' | 'default' | 'lg' | 'icon';
```
**Variantes:**
- `primary`: Verde Reviva, texto branco, para ações principais
- `secondary`: Borda, fundo transparente, para ações secundárias
- `ghost`: Sem borda, hover sutil, para ações terciárias
- `link`: Estilo de link, para navegação

#### 3. **Input & Select Components**
```typescript
// Campos de formulário padronizados
// Suporte completo a modo escuro
// Estados: default, focus, error, disabled
```

#### 4. **Badge Component**
```typescript
// Badge.tsx - Indicadores de status
type BadgeVariant = 'success' | 'warning' | 'error' | 'info';
```

#### 5. **Modal Component**
```typescript
// Modal.tsx - Sobreposições e diálogos
// Backdrop com blur
// Animações de entrada/saída
// Fechamento por ESC ou clique fora
```

### Componentes Complexos

#### **DataTable Component**
**Funcionalidade Adaptativa:**
- **Desktop**: Tabela tradicional com colunas
- **Mobile**: Lista de cards empilhados
- **Recursos**: Busca, filtros, paginação, ordenação

#### **StatCard Component**
**Métricas Visuais:**
- Valor principal em destaque
- Ícone temático
- Descrição contextual
- Variações de cor por tipo

---

## 🌓 Sistema de Temas

### Implementação Técnica
```typescript
// ThemeContext.tsx - Gerenciamento de tema
type Theme = 'light' | 'dark' | 'system';

// Persistência no localStorage
// Detecção automática de preferência do sistema
// Alternância suave entre temas
```

### Classes de Modo Escuro
```css
/* Padrão Tailwind Dark Mode */
.bg-white.dark:bg-slate-800     /* Backgrounds */
.text-slate-800.dark:text-slate-200  /* Textos */
.border-slate-200.dark:border-slate-700  /* Bordas */
```

### Transições de Tema
```css
/* Transições suaves entre temas */
.transition-colors { transition: color 0.2s ease; }
.transition-all { transition: all 0.2s ease; }
```

---

## 📱 Design Responsivo

### Estratégia Mobile-First

1. **Base (Mobile)**: Design otimizado para 320px+
2. **Tablet (md:)**: Adaptações para 768px+
3. **Desktop (lg:)**: Layout completo para 1024px+
4. **Desktop Grande (xl:)**: Otimizações para 1280px+

### Padrões Responsivos

#### Navegação
- **Mobile**: Sidebar off-canvas com overlay
- **Desktop**: Sidebar fixa lateral

#### Tabelas/Listas
- **Mobile**: Cards empilhados verticalmente
- **Desktop**: Tabelas tradicionais com colunas

#### Formulários
- **Mobile**: Campos em coluna única
- **Desktop**: Layout em múltiplas colunas

#### Gráficos
- **Mobile**: Versões simplificadas e compactas
- **Desktop**: Gráficos completos com legendas

---

## 🎭 Estados e Interações

### Estados de Componentes

#### Botões
```css
/* Estados visuais */
:default    /* Estado padrão */
:hover      /* Mouse sobre o elemento */
:focus      /* Foco por teclado */
:active     /* Clique/toque ativo */
:disabled   /* Estado desabilitado */
:loading    /* Estado de carregamento */
```

#### Campos de Formulário
```css
/* Estados de input */
:default    /* Estado normal */
:focus      /* Campo ativo */
:error      /* Erro de validação */
:success    /* Validação bem-sucedida */
:disabled   /* Campo desabilitado */
```

### Animações e Transições

#### Micro-interações
```css
/* Transições padrão */
transition-colors: 150ms ease;  /* Mudanças de cor */
transition-transform: 200ms ease; /* Transformações */
transition-opacity: 300ms ease;   /* Fade in/out */
```

#### Animações de Loading
- **Skeleton Loading**: Para conteúdo em carregamento
- **Spinner**: Para ações em processamento
- **Progress Bar**: Para uploads/downloads

---

## 🔧 Implementação Técnica

### Estrutura de Arquivos
```
components/
├── ui/                 # Componentes base reutilizáveis
│   ├── Button.tsx     # Sistema de botões
│   ├── Card.tsx       # Container padrão
│   ├── Input.tsx      # Campos de entrada
│   ├── Modal.tsx      # Modais e overlays
│   └── Badge.tsx      # Indicadores de status
├── charts/            # Componentes de gráficos
├── Layout.tsx         # Layout principal
├── Sidebar.tsx        # Navegação lateral
└── Header.tsx         # Cabeçalho das páginas
```

### Configuração Tailwind
```javascript
// tailwind.config.js (dentro do index.html)
module.exports = {
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'reviva-green': '#2d5a27',
        'reviva-green-dark': '#21421d',
        'reviva-green-light': '#3c7835',
        'reviva-dark': '#1f2937'
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif']
      }
    }
  }
}
```

### Padrões de Código

#### Nomenclatura de Classes
```typescript
// Padrão para classes CSS
const baseClasses = "flex items-center p-3 rounded-lg transition-colors";
const variantClasses = {
  primary: "bg-reviva-green text-white hover:bg-reviva-green-dark",
  secondary: "border border-slate-300 hover:bg-slate-50"
};
```

#### Componentes Tipados
```typescript
// Interfaces bem definidas
interface ComponentProps {
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  children: React.ReactNode;
  className?: string;
}
```

---

## ♿ Acessibilidade

### Diretrizes WCAG 2.1

#### Contraste de Cores
- **AA Normal**: Mínimo 4.5:1 para texto normal
- **AA Grande**: Mínimo 3:1 para texto grande (18px+)
- **AAA**: Mínimo 7:1 para conformidade máxima

#### Navegação por Teclado
```typescript
// Suporte completo a navegação por teclado
// Tab order lógico
// Focus visible em todos os elementos interativos
// Atalhos de teclado para ações principais
```

#### Leitores de Tela
```html
<!-- Atributos ARIA apropriados -->
<button aria-label="Fechar modal" aria-describedby="modal-description">
<div role="dialog" aria-modal="true">
<img alt="Descrição da imagem" src="...">
```

### Testes de Acessibilidade
- **Ferramentas**: axe-core, Lighthouse, WAVE
- **Testes Manuais**: Navegação por teclado, leitores de tela
- **Validação**: HTML semântico, contraste de cores

---

## 📊 Métricas e Performance

### Otimizações de Performance

#### CSS
- **Purge CSS**: Remoção de classes não utilizadas
- **Critical CSS**: Carregamento prioritário de estilos essenciais
- **Lazy Loading**: Carregamento sob demanda de componentes

#### Imagens e Ícones
- **SVG**: Ícones vetoriais otimizados
- **WebP**: Formato de imagem otimizado
- **Lazy Loading**: Carregamento progressivo de imagens

### Métricas de Qualidade
- **Lighthouse Score**: 90+ em todas as categorias
- **Bundle Size**: < 500KB gzipped
- **First Paint**: < 1.5s
- **Time to Interactive**: < 3s

---

## 🚀 Roadmap do Design System

### Próximas Implementações

#### Componentes
- [ ] **Tooltip Component**: Dicas contextuais
- [ ] **Dropdown Menu**: Menus suspensos
- [ ] **Tabs Component**: Navegação por abas
- [ ] **Accordion**: Conteúdo expansível
- [ ] **Breadcrumb**: Navegação hierárquica

#### Funcionalidades
- [ ] **Tema Personalizado**: Cores customizáveis
- [ ] **Modo Alto Contraste**: Acessibilidade aprimorada
- [ ] **Animações Avançadas**: Micro-interações sofisticadas
- [ ] **Componentes de Dados**: Tabelas avançadas, filtros

#### Ferramentas
- [ ] **Storybook**: Documentação interativa de componentes
- [ ] **Design Tokens**: Sistema de tokens de design
- [ ] **Figma Integration**: Sincronização com design
- [ ] **Automated Testing**: Testes visuais automatizados

---

## 📚 Recursos e Referências

### Documentação Técnica
- **Tailwind CSS**: [https://tailwindcss.com/docs](https://tailwindcss.com/docs)
- **React**: [https://react.dev](https://react.dev)
- **TypeScript**: [https://www.typescriptlang.org/docs](https://www.typescriptlang.org/docs)

### Design e UX
- **Material Design**: Princípios de design
- **Human Interface Guidelines**: Diretrizes da Apple
- **WCAG 2.1**: Diretrizes de acessibilidade

### Ferramentas
- **Figma**: Design e prototipagem
- **Contrast Checker**: Verificação de contraste
- **axe DevTools**: Testes de acessibilidade

---

**Mantido pela equipe de desenvolvimento da Escola Reviva**

*Última atualização: Dezembro 2024*
*Versão do Design System: 1.0.0*
