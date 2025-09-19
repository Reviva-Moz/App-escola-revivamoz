

import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import Logo from './Logo';
import { DashboardIcon, StudentsIcon, FinancialIcon, TeacherIcon, ClassIcon, BookIcon, CalendarIcon, ReportIcon, ActionPlanIcon, PaymentIcon, CommunicationIcon, UsersGroupIcon, SettingsIcon, LessonPlanIcon } from './icons';
import { XMarkIcon, Bars3Icon } from '@heroicons/react/24/solid';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';

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

const permissions: Record<UserRole, string[]> = {
    ADMINISTRADOR: ['/', '/alunos', '/financeiro', '/professores', '/turmas', '/disciplinas', '/biblioteca', '/plano-de-aula', '/assiduidade', '/cadernetas', '/provas', '/pagamentos', '/comunicacao', '/calendario', '/relatorios', '/recursos-humanos', '/plano-de-acao', '/configuracoes'],
    DIRETORIA: ['/', '/alunos', '/financeiro', '/professores', '/turmas', '/disciplinas', '/biblioteca', '/plano-de-aula', '/assiduidade', '/cadernetas', '/provas', '/pagamentos', '/comunicacao', '/calendario', '/relatorios', '/recursos-humanos'],
    SECRETARIA: ['/', '/alunos', '/professores', '/turmas', '/disciplinas', '/biblioteca', '/assiduidade', '/cadernetas', '/provas', '/comunicacao', '/calendario', '/relatorios', '/recursos-humanos'],
    PROFESSOR: ['/turmas', '/plano-de-aula', '/assiduidade', '/cadernetas', '/provas', '/comunicacao', '/calendario'],
    RESPONSAVEL: ['/portal-aluno/1', '/pagamentos', '/comunicacao', '/calendario'], // Assumindo ID 1 para demonstração
    ALUNO: ['/portal-aluno/1', '/comunicacao', '/calendario'], // Assumindo ID 1 para demonstração
};


const Sidebar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuth();
  const userPermissions = user ? permissions[user.role] : [];

  const hasAccess = (path: string) => userPermissions.includes(path);

  const closeSidebar = () => setIsOpen(false);

  return (
    <>
      {/* Mobile Header */}
      <div className="md:hidden flex justify-between items-center bg-reviva-dark text-white p-4 w-full fixed top-0 left-0 z-30 shadow-lg">
         <h1 className="text-lg font-bold">Escola Reviva</h1>
         <button onClick={() => setIsOpen(!isOpen)} className="text-white focus:outline-none z-40">
            {isOpen ? <XMarkIcon className="w-6 h-6" /> : <Bars3Icon className="w-6 h-6" />}
         </button>
      </div>

      {/* Sidebar */}
      <aside className={`bg-reviva-dark text-white flex-shrink-0 flex flex-col fixed md:relative h-full z-20 transform
                       transition-transform duration-300 ease-in-out w-64
                       ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>
         <div className="flex-shrink-0">
           <Logo />
         </div>
         <nav className="flex-1 px-4 pb-4 overflow-y-auto">
          { (hasAccess('/') || hasAccess('/alunos') || hasAccess('/financeiro')) &&
            <p className="px-3 pt-2 pb-1 text-xs text-gray-400 font-semibold uppercase">Principal</p>
          }
          { hasAccess('/') && <NavItem to="/" icon={<DashboardIcon />} label="Dashboard Principal" onClick={closeSidebar} /> }
          { hasAccess('/alunos') && <NavItem to="/alunos" icon={<StudentsIcon />} label="Gestão de Alunos" onClick={closeSidebar} /> }
          {/* Rota especial para Responsável/Aluno */}
          { (hasAccess('/portal-aluno/1')) && <NavItem to="/portal-aluno/1" icon={<StudentsIcon />} label="Portal do Aluno" onClick={closeSidebar} /> }
          { hasAccess('/financeiro') && <NavItem to="/financeiro" icon={<FinancialIcon />} label="Sistema Financeiro" onClick={closeSidebar} /> }
          
          { (hasAccess('/professores') || hasAccess('/turmas') || hasAccess('/disciplinas') || hasAccess('/biblioteca') || hasAccess('/plano-de-aula')) &&
            <p className="px-3 pt-4 pb-1 text-xs text-gray-400 font-semibold uppercase">Gestão Acadêmica</p>
          }
          { hasAccess('/professores') && <NavItem to="/professores" icon={<TeacherIcon />} label="Professores" onClick={closeSidebar} /> }
          { hasAccess('/turmas') && <NavItem to="/turmas" icon={<ClassIcon />} label="Turmas" onClick={closeSidebar} /> }
          { hasAccess('/disciplinas') && <NavItem to="/disciplinas" icon={<BookIcon />} label="Disciplinas" onClick={closeSidebar} /> }
          { hasAccess('/plano-de-aula') && <NavItem to="/plano-de-aula" icon={<LessonPlanIcon />} label="Plano de Aula" onClick={closeSidebar} /> }
          { hasAccess('/biblioteca') && <NavItem to="/biblioteca" icon={<BookIcon />} label="Biblioteca" onClick={closeSidebar} /> }

          { (hasAccess('/assiduidade') || hasAccess('/cadernetas') || hasAccess('/provas') || hasAccess('/pagamentos') || hasAccess('/comunicacao')) &&
            <p className="px-3 pt-4 pb-1 text-xs text-gray-400 font-semibold uppercase">Operações Diárias</p>
          }
          { hasAccess('/assiduidade') && <NavItem to="/assiduidade" icon={<CalendarIcon />} label="Assiduidade" onClick={closeSidebar} /> }
          { hasAccess('/cadernetas') && <NavItem to="/cadernetas" icon={<BookIcon />} label="Lançamento de Notas" onClick={closeSidebar} /> }
          { hasAccess('/provas') && <NavItem to="/provas" icon={<CalendarIcon />} label="Calendário de Provas" onClick={closeSidebar} /> }
          { hasAccess('/pagamentos') && <NavItem to="/pagamentos" icon={<PaymentIcon />} label="Pagamentos" onClick={closeSidebar} /> }
          { hasAccess('/comunicacao') && <NavItem to="/comunicacao" icon={<CommunicationIcon />} label="Comunicação" onClick={closeSidebar} /> }

          { (hasAccess('/calendario') || hasAccess('/relatorios') || hasAccess('/recursos-humanos') || hasAccess('/plano-de-acao') || hasAccess('/configuracoes')) &&
            <p className="px-3 pt-4 pb-1 text-xs text-gray-400 font-semibold uppercase">Administrativo</p>
          }
          { hasAccess('/calendario') && <NavItem to="/calendario" icon={<CalendarIcon />} label="Calendário Escolar" onClick={closeSidebar} /> }
          { hasAccess('/relatorios') && <NavItem to="/relatorios" icon={<ReportIcon />} label="Relatórios" onClick={closeSidebar} /> }
          { hasAccess('/recursos-humanos') && <NavItem to="/recursos-humanos" icon={<UsersGroupIcon />} label="Recursos Humanos" onClick={closeSidebar} /> }
          { hasAccess('/configuracoes') && <NavItem to="/configuracoes" icon={<SettingsIcon />} label="Configurações" onClick={closeSidebar} /> }
          { hasAccess('/plano-de-acao') && <NavItem to="/plano-de-acao" icon={<ActionPlanIcon />} label="Plano de Ação" onClick={closeSidebar} /> }
        </nav>
      </aside>
       {/* Overlay for mobile */}
       {isOpen && <div className="fixed inset-0 bg-black opacity-50 z-10 md:hidden" onClick={closeSidebar}></div>}
       {/* Spacer for mobile view */}
       <div className="md:hidden h-16 w-full flex-shrink-0"></div>
    </>
  );
};

export default Sidebar;