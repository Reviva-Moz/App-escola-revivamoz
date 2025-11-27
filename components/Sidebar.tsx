

import React, { useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import Logo from './Logo';
import { 
  DashboardIcon, StudentsIcon, FinancialIcon, TeacherIcon, ClassIcon, BookIcon, 
  CalendarIcon, ReportIcon, ActionPlanIcon, CommunicationIcon, UsersGroupIcon, 
  SettingsIcon, LessonPlanIcon, IdentificationIcon, BookOpenIcon,
  ChartPieIcon, BanknotesIcon, ArrowsRightLeftIcon, TagIcon, ChatBubbleLeftEllipsisIcon,
  BuildingOffice2Icon, AcademicCapIcon, QuestionMarkCircleIcon,
  ShieldCheckIcon, CodeBracketSquareIcon, CircleStackIcon, CloudArrowUpIcon, SparklesIcon
} from './icons';
import { XMarkIcon } from '@heroicons/react/24/solid';
import { useAuth } from '@/context/AuthContext';
import { UserRole } from '@/types';

interface NavItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  disabled?: boolean;
  onClick?: () => void;
}

const NavItem: React.FC<NavItemProps> = ({ to, icon, label, disabled, onClick }) => {
  const baseClasses = "flex items-center p-3 my-1 rounded-lg transition-colors";
  const activeClasses = "bg-reviva-green text-white font-semibold";
  const inactiveClasses = "text-gray-300 hover:bg-reviva-green-light hover:text-white";
  const disabledClasses = "text-gray-500 cursor-not-allowed";

  if (disabled) {
    return (
      <div className={`${baseClasses} ${disabledClasses}`} onClick={onClick}>
        <span className="w-6 h-6 mr-3">{icon}</span>
        <span>{label}</span>
      </div>
    );
  }

  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) => `${baseClasses} ${isActive ? activeClasses : inactiveClasses}`}
    >
      <span className="w-6 h-6 mr-3">{icon}</span>
      <span>{label}</span>
    </NavLink>
  );
};

const NavGroup: React.FC<{ title: string }> = ({ title }) => (
  <p className="px-3 pt-4 pb-1 text-xs text-gray-400 font-semibold uppercase tracking-wider">{title}</p>
);

const permissions: Record<UserRole, string[]> = {
    ADMINISTRADOR: ['/', '/alunos', '/professores', '/turmas', '/disciplinas', '/colaboradores', '/financeiro', '/plano-de-aula', '/assiduidade', '/cadernetas', '/provas', '/biblioteca', '/comunicacao', '/calendario', '/relatorios', '/plano-de-acao', '/configuracoes', '/configuracoes/assistente-ia', '/faq', '/sac', '/configuracoes/perfis-acesso', '/configuracoes/integracoes', '/configuracoes/backup', '/configuracoes/atualizacoes'],
    DIRETORIA: ['/', '/alunos', '/professores', '/turmas', '/disciplinas', '/colaboradores', '/financeiro', '/plano-de-aula', '/assiduidade', '/cadernetas', '/provas', '/biblioteca', '/comunicacao', '/calendario', '/relatorios', '/configuracoes', '/faq', '/sac', '/configuracoes/perfis-acesso', '/configuracoes/integracoes', '/configuracoes/backup', '/configuracoes/atualizacoes'],
    SECRETARIA: ['/', '/alunos', '/professores', '/turmas', '/disciplinas', '/colaboradores', '/assiduidade', '/cadernetas', '/biblioteca', '/comunicacao', '/calendario', '/relatorios', '/faq', '/sac'],
    PROFESSOR: ['/', '/turmas', '/plano-de-aula', '/assiduidade', '/cadernetas', '/provas', '/comunicacao', '/calendario', '/faq', '/sac'],
    RESPONSAVEL: ['/', '/calendario', '/faq', '/sac', '/comunicacao'],
    ALUNO: ['/', '/calendario', '/faq', '/sac', '/comunicacao'],
};

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, setIsOpen }) => {
  const { user } = useAuth();
  const userPermissions = user ? permissions[user.role] : [];
  
  const mainDashboardPath = user?.role === 'ALUNO' || user?.role === 'RESPONSAVEL' ? '/' : '/';

  const hasAccess = (path: string) => userPermissions.includes(path);
  const hasSectionAccess = (paths: string[]) => paths.some(path => hasAccess(path));

  const closeSidebar = () => setIsOpen(false);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === 'Escape') {
            closeSidebar();
        }
    };
    if (isOpen) document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  return (
    <>
      <div 
        className={`fixed inset-0 bg-black z-40 md:hidden transition-opacity duration-300 ${isOpen ? 'opacity-50' : 'opacity-0 pointer-events-none'}`}
        onClick={closeSidebar}
        aria-hidden="true"
      ></div>
      <aside 
        className={`bg-reviva-dark text-white flex-shrink-0 flex flex-col fixed md:relative h-full z-50
                       transition-transform duration-300 ease-in-out w-72 shadow-2xl md:shadow-none
                       ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}
        role={isOpen ? "dialog" : undefined}
        aria-modal={isOpen ? "true" : undefined}
      >
        <div className="flex-shrink-0 flex items-center justify-between">
          <Logo />
           <button onClick={closeSidebar} className="md:hidden text-white focus:outline-none p-4" aria-label="Fechar menu">
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>
         <nav className="flex-1 px-4 pb-4 overflow-y-auto">
          
          <NavGroup title="Dashboard Geral" />
          {hasAccess('/') && <NavItem to={mainDashboardPath} icon={<DashboardIcon />} label="Visão Geral" onClick={closeSidebar} />}
          
          {hasSectionAccess(['/financeiro']) && (
            <>
              <NavGroup title="Financeiro" />
              {hasAccess('/financeiro') && <NavItem to="/financeiro?tab=dashboard" icon={<ChartPieIcon />} label="Dashboard" onClick={closeSidebar} />}
              {hasAccess('/financeiro') && <NavItem to="/financeiro?tab=cashier" icon={<BanknotesIcon />} label="Caixa Diário" onClick={closeSidebar} />}
              {hasAccess('/financeiro') && <NavItem to="/financeiro?tab=transactions" icon={<ArrowsRightLeftIcon />} label="Transações" onClick={closeSidebar} />}
              {hasAccess('/financeiro') && <NavItem to="/financeiro?tab=kanban" icon={<TagIcon />} label="Cobranças" onClick={closeSidebar} />}
              {hasAccess('/financeiro') && <NavItem to="/financeiro?tab=messageTemplates" icon={<ChatBubbleLeftEllipsisIcon />} label="Comunicação" onClick={closeSidebar} />}
              {hasAccess('/relatorios') && <NavItem to="/relatorios" icon={<ReportIcon />} label="Relatórios Financeiros" onClick={closeSidebar} />}
            </>
          )}

          {hasSectionAccess(['/alunos', '/professores', '/turmas', '/colaboradores', '/biblioteca', '/comunicacao', '/relatorios']) && user?.role !== 'PROFESSOR' && (
            <>
              <NavGroup title="Secretaria" />
              {hasAccess('/alunos') && <NavItem to="/alunos" icon={<StudentsIcon />} label="Alunos" onClick={closeSidebar} />}
              {hasAccess('/professores') && <NavItem to="/professores" icon={<TeacherIcon />} label="Professores" onClick={closeSidebar} />}
              {hasAccess('/turmas') && <NavItem to="/turmas" icon={<ClassIcon />} label="Turmas" onClick={closeSidebar} />}
              {hasAccess('/colaboradores') && <NavItem to="/colaboradores" icon={<UsersGroupIcon />} label="Colaboradores" onClick={closeSidebar} />}
              {hasAccess('/biblioteca') && <NavItem to="/biblioteca" icon={<BookIcon />} label="Biblioteca" onClick={closeSidebar} />}
              {hasAccess('/comunicacao') && <NavItem to="/comunicacao" icon={<CommunicationIcon />} label="Comunicação Geral" onClick={closeSidebar} />}
              {hasAccess('/relatorios') && <NavItem to="/relatorios" icon={<ReportIcon />} label="Relatórios Académicos" onClick={closeSidebar} />}
            </>
          )}

          {hasSectionAccess(['/assiduidade', '/cadernetas', '/provas', '/plano-de-aula', '/turmas']) && (
            <>
              <NavGroup title="Gestão Académica" />
              {user?.role === 'PROFESSOR' && hasAccess('/turmas') && <NavItem to="/turmas" icon={<ClassIcon />} label="Minhas Turmas" onClick={closeSidebar} />}
              {hasAccess('/assiduidade') && <NavItem to="/assiduidade" icon={<CalendarIcon />} label="Assiduidade" onClick={closeSidebar} />}
              {hasAccess('/cadernetas') && <NavItem to="/cadernetas" icon={<IdentificationIcon />} label="Lançamento de Notas" onClick={closeSidebar} />}
              {hasAccess('/provas') && <NavItem to="/provas" icon={<AcademicCapIcon />} label="Calendário de Provas" onClick={closeSidebar} />}
              <NavItem to="/curriculo-escolar" icon={<BookOpenIcon />} label="Currículo Escolar" onClick={closeSidebar} />
              {hasAccess('/plano-de-aula') && <NavItem to="/plano-de-aula" icon={<LessonPlanIcon />} label="Plano de Aula (AEP)" onClick={closeSidebar} />}
            </>
          )}
          
          <NavGroup title="Recursos Comuns" />
          {hasAccess('/calendario') && <NavItem to="/calendario" icon={<CalendarIcon />} label="Calendário Escolar" onClick={closeSidebar} />}
          {hasAccess('/faq') && <NavItem to="/faq" icon={<QuestionMarkCircleIcon />} label="FAQ & Políticas" onClick={closeSidebar} />}
          {hasAccess('/sac') && <NavItem to="/sac" icon={<BuildingOffice2Icon />} label="Comunicação por Setor" onClick={closeSidebar} />}
          {hasAccess('/comunicacao') && user?.role === 'PROFESSOR' && <NavItem to="/comunicacao" icon={<CommunicationIcon />} label="Comunicação Geral" onClick={closeSidebar} />}

          {hasSectionAccess(['/configuracoes', '/plano-de-acao']) && (
            <>
              <NavGroup title="Configurações" />
              {hasAccess('/configuracoes') && <NavItem to="/configuracoes" icon={<SettingsIcon />} label="Informações da Escola" onClick={closeSidebar} />}
              {hasAccess('/financeiro') && <NavItem to="/financeiro?tab=scholarships" icon={<FinancialIcon />} label="Bolsas de Estudo" onClick={closeSidebar} />}
              {hasAccess('/configuracoes/perfis-acesso') && <NavItem to="/configuracoes/perfis-acesso" icon={<ShieldCheckIcon />} label="Perfis de Acesso" onClick={closeSidebar} />}
              {hasAccess('/configuracoes/assistente-ia') && <NavItem to="/configuracoes/assistente-ia" icon={<SparklesIcon />} label="IA e Assistentes" onClick={closeSidebar} />}
              {hasAccess('/configuracoes/integracoes') && <NavItem to="/configuracoes/integracoes" icon={<CodeBracketSquareIcon />} label="APIs e Integrações" onClick={closeSidebar} />}
              {hasAccess('/configuracoes/backup') && <NavItem to="/configuracoes/backup" icon={<CircleStackIcon />} label="Backup do Sistema" onClick={closeSidebar} />}
              {hasAccess('/configuracoes/atualizacoes') && <NavItem to="/configuracoes/atualizacoes" icon={<CloudArrowUpIcon />} label="Atualizações" onClick={closeSidebar} />}
              {hasAccess('/plano-de-acao') && <NavItem to="/plano-de-acao" icon={<ActionPlanIcon />} label="Roadmap e Melhorias" onClick={closeSidebar} />}
            </>
          )}
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;