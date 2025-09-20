
import React from 'react';
import { useAuth } from '../context/AuthContext';

// Importa os novos dashboards específicos para cada perfil
import AdminDiretoriaDashboard from './dashboards/AdminDiretoriaDashboard';
import ProfessorDashboard from './dashboards/ProfessorDashboard';
import SecretariaDashboard from './dashboards/SecretariaDashboard';
import StudentDashboard from './dashboards/StudentDashboard';
import PageHeader from '../components/Header';

const Dashboard: React.FC = () => {
  const { user } = useAuth();

  // Componente de fallback caso o perfil não seja reconhecido
  const FallbackDashboard = () => (
    <PageHeader title="Bem-vindo ao SGE" subtitle="Selecione uma opção no menu para começar." />
  );

  // Lógica para selecionar o dashboard correto com base no perfil do utilizador
  const renderDashboardByRole = () => {
    switch (user?.role) {
      case 'ADMINISTRADOR':
      case 'DIRETORIA':
        return <AdminDiretoriaDashboard />;
      
      case 'SECRETARIA':
        return <SecretariaDashboard />;
        
      case 'PROFESSOR':
        // Assumindo que o email do professor está no contexto de autenticação
        // e pode ser usado para encontrar o seu ID.
        // Para a demo, o componente ProfessorDashboard fará a correspondência.
        return <ProfessorDashboard />;
        
      case 'ALUNO':
      case 'RESPONSAVEL':
        // A rota para o portal do aluno agora aponta para este componente
        // O ID do aluno viria do contexto do utilizador numa aplicação real
        // Para a demo, o StudentDashboard usará um ID fixo.
        return <StudentDashboard />;
        
      default:
        return <FallbackDashboard />;
    }
  };

  return <>{renderDashboardByRole()}</>;
};

export default Dashboard;