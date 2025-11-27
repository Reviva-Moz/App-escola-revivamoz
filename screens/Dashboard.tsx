
import React from 'react';
import { useAuth } from '@/context/AuthContext';

// Importa os novos dashboards específicos para cada perfil
import AdminDiretoriaDashboard from './dashboards/AdminDiretoriaDashboard';
import ProfessorDashboard from './dashboards/ProfessorDashboard';
import SecretariaDashboard from './dashboards/SecretariaDashboard';
import StudentDashboard from './dashboards/StudentDashboard';
import PageHeader from '@/components/Header';
import { useParams } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const params = useParams();

  // Componente de fallback caso o perfil não seja reconhecido
  const FallbackDashboard = () => (
    <PageHeader title="Bem-vindo ao SGE" subtitle="Selecione uma opção no menu para começar." />
  );

  // Lógica para selecionar o dashboard correto com base no perfil do utilizador
  const renderDashboardByRole = () => {
    // Se a rota for /portal-aluno/:id, renderiza o StudentDashboard independentemente do user logado
    // (útil para secretaria/diretoria verem o portal de um aluno)
    if (params.id) {
      return <StudentDashboard />;
    }

    switch (user?.role) {
      case 'ADMINISTRADOR':
      case 'DIRETORIA':
        return <AdminDiretoriaDashboard />;
      
      case 'SECRETARIA':
        return <SecretariaDashboard />;
        
      case 'PROFESSOR':
        return <ProfessorDashboard />;
        
      case 'ALUNO':
      case 'RESPONSAVEL':
        // Numa app real, o ID viria do objeto `user`.
        // Para a demo, redirecionamos para um aluno fixo se nenhum ID for fornecido.
        return <StudentDashboard />;
        
      default:
        return <FallbackDashboard />;
    }
  };

  return <>{renderDashboardByRole()}</>;
};

export default Dashboard;