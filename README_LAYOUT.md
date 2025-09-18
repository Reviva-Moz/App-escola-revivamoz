# Guia de Estilo e Layout - Escola Reviva SGE

Este documento serve como guia de referência para todos os aspetos visuais e de layout do Sistema de Gestão Escolar. O objetivo é manter uma interface de utilizador (UI) consistente, moderna e intuitiva em toda a aplicação.

---

## 🎨 Filosofia de Design

*   **Limpo e Funcional:** A interface deve ser organizada e sem distrações, focando-se na funcionalidade e na fácil apresentação dos dados.
*   **Consistente:** Componentes, cores e espaçamentos devem seguir um padrão definido para criar uma experiência de utilizador coesa.
*   **Responsivo:** A aplicação deve ser perfeitamente utilizável em qualquer dispositivo, desde telemóveis a monitores de desktop. A abordagem é **Mobile-First**.
*   **Acessível:** Cores com contraste adequado e uso semântico de elementos HTML para garantir a acessibilidade.

---

## 🌈 Paleta de Cores

A paleta de cores foi definida no `tailwind.config` dentro do `index.html`.

### Cores Primárias
*   **Verde Reviva (`reviva-green`):** `#2d5a27`
    *   Uso: Cor principal para branding, botões primários, links e destaques importantes.
*   **Verde Reviva Escuro (`reviva-green-dark`):** `#21421d`
    *   Uso: Efeito `hover` em botões primários.
*   **Verde Reviva Claro (`reviva-green-light`):** `#3c7835`
    *   Uso: Destaques em modo escuro e alguns efeitos `hover`.
*   **Escuro Reviva (`reviva-dark`):** `#1f2937`
    *   Uso: Cor de fundo principal da `Sidebar`.

### Cores de UI (Baseadas no Slate do Tailwind)
*   **Fundos:** `slate-100` (Light Mode), `slate-900` (Dark Mode).
*   **Cards/Containers:** `white` / `slate-800`.
*   **Texto Principal:** `slate-800` / `slate-200`.
*   **Texto Secundário:** `slate-500` / `slate-400`.
*   **Bordas:** `slate-200` / `slate-700`.

### Cores Semânticas (para feedback ao utilizador)
*   **Sucesso (Verde):** Usado em badges de "Ativo" ou "Pago".
*   **Aviso (Amarelo):** Usado em badges de "Pendente".
*   **Destrutivo (Vermelho):** Usado para ações de remoção, erros e badges de "Atrasado".
*   **Informação (Azul):** Usado em alguns gráficos e destaques informativos.

---

## ✒️ Tipografia

*   **Fonte Principal:** `Inter` (importada do Google Fonts no `index.html`).
*   **Pesos Utilizados:**
    *   `400` (Regular): Texto principal, parágrafos.
    *   `500` (Medium): Texto secundário, labels.
    *   `600` (Semibold): Títulos de cards, badges, tabs.
    *   `700` (Bold): Títulos de página (`PageHeader`), valores em `StatCard`.

---

## 📐 Sistema de Layout e Componentes

A aplicação utiliza **Tailwind CSS** para uma abordagem *utility-first*, o que permite construir layouts complexos de forma rápida e consistente.

### Estrutura Principal (`Layout.tsx`)
*   Usa Flexbox para criar a disposição `Sidebar` + `Conteúdo Principal`.
*   A `Sidebar` é fixa em desktop e `off-canvas` (desliza para fora) em mobile.

### Responsividade
*   A abordagem é **Mobile-First**. O layout base é para ecrãs pequenos.
*   As classes de breakpoint do Tailwind (`sm:`, `md:`, `lg:`) são usadas para adaptar o layout a ecrãs maiores.
*   **Exemplo:** Um formulário com uma coluna em mobile (`grid-cols-1`) e duas colunas em desktop (`md:grid-cols-2`).

### Componentes de UI (`/components/ui`)
Uma biblioteca de componentes reutilizáveis foi criada para manter a consistência:
*   `Card.tsx`: O container padrão para agrupar conteúdo.
*   `Button.tsx`: Variações para ações primárias, secundárias e links.
*   `Input.tsx` & `Select.tsx`: Campos de formulário padronizados.
*   `Badge.tsx`: Para exibir status (ex: Ativo, Pago, Pendente).
*   `Modal.tsx`: Para exibir formulários ou informações sobrepostas.
*   `DataTable.tsx`: Componente crucial que exibe uma tabela em desktop e uma lista de cards em mobile, garantindo a usabilidade em qualquer ecrã.

---

## 🌓 Theming (Light/Dark Mode)

*   **Implementação:** Usa o modo de classe do Tailwind CSS (`darkMode: 'class'`).
*   **Contexto:** O `ThemeContext` (`/context/ThemeContext.tsx`) gere o estado atual do tema.
*   **Persistência:** A escolha do tema é guardada no `localStorage` do navegador.
*   **Estilização:** As classes de modo escuro são aplicadas com o prefixo `dark:`.
    *   Exemplo: `bg-white dark:bg-slate-800`.
