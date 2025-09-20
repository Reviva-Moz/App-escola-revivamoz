

import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './screens/Dashboard';
import Students from './screens/Students';
import Financial from './screens/Financial';
import Login from './screens/Login';
import StudentForm from './screens/StudentForm';
import ProtectedRoute from './components/ProtectedRoute';
import Teachers from './screens/Teachers';
import TeacherForm from './screens/TeacherForm';
import Classes from './screens/Classes';
import ClassForm from './screens/ClassForm';
import ClassDetails from './screens/ClassDetails';
import Subjects from './screens/Subjects';
import SubjectForm from './screens/SubjectForm';
import Attendance from './screens/Attendance';
import Grades from './screens/Grades';
import Calendar from './screens/Calendar';
import Reports from './screens/Reports';
import ProvaCalendar from './screens/ProvaCalendar';
import ActionPlan from './screens/ActionPlan';
import StudentDashboard from './screens/dashboards/StudentDashboard';
import Communication from './screens/Communication';
import Library from './screens/Library';
import Collaborators from './screens/Collaborators';
import CollaboratorForm from './screens/CollaboratorForm';
import LessonPlan from './screens/LessonPlan';
import Settings from './screens/Settings';

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      
      {/* Rotas Protegidas */}
      <Route 
        path="/*"
        element={
          <ProtectedRoute>
            <Layout>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                
                {/* Cadastros */}
                <Route path="/alunos" element={<Students />} />
                <Route path="/alunos/novo" element={<StudentForm />} />
                <Route path="/alunos/:id/editar" element={<StudentForm />} />
                <Route path="/professores" element={<Teachers />} />
                <Route path="/professores/novo" element={<TeacherForm />} />
                <Route path="/professores/:id/editar" element={<TeacherForm />} />
                <Route path="/turmas" element={<Classes />} />
                <Route path="/turmas/novo" element={<ClassForm />} />
                <Route path="/turmas/:id/editar" element={<ClassForm />} />
                <Route path="/turmas/:id/detalhes" element={<ClassDetails />} />
                <Route path="/disciplinas" element={<Subjects />} />
                <Route path="/disciplinas/novo" element={<SubjectForm />} />
                <Route path="/disciplinas/:id/editar" element={<SubjectForm />} />
                <Route path="/colaboradores" element={<Collaborators />} />
                <Route path="/colaboradores/novo" element={<CollaboratorForm />} />
                <Route path="/colaboradores/:id/editar" element={<CollaboratorForm />} />

                {/* Portal Aluno/Responsável agora é um dashboard */}
                <Route path="/portal-aluno/:id" element={<StudentDashboard />} />

                {/* Financeiro */}
                <Route path="/financeiro" element={<Financial />} />
                
                {/* Gestão Académica */}
                <Route path="/plano-de-aula" element={<LessonPlan />} />
                <Route path="/assiduidade" element={<Attendance />} />
                <Route path="/cadernetas" element={<Grades />} />
                <Route path="/provas" element={<ProvaCalendar />} />

                {/* Operações Diárias (movidos) */}
                <Route path="/comunicacao" element={<Communication />} />

                {/* Administrativo */}
                <Route path="/biblioteca" element={<Library />} />
                <Route path="/calendario" element={<Calendar />} />
                <Route path="/relatorios" element={<Reports />} />
                <Route path="/plano-de-acao" element={<ActionPlan />} />
                <Route path="/configuracoes" element={<Settings />} />
              </Routes>
            </Layout>
          </ProtectedRoute>
        } 
      />
    </Routes>
  );
};

export default App;