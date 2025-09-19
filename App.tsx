

import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './screens/Dashboard';
import Students from './screens/Students';
import Financial from './screens/Financial';
import ComingSoon from './screens/ComingSoon';
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
import Payments from './screens/Payments';
import StudentPortal from './screens/StudentPortal';
import Communication from './screens/Communication';
import Library from './screens/Library';
import HR from './screens/HR';
import StaffForm from './screens/StaffForm';

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
                <Route path="/alunos" element={<Students />} />
                <Route path="/alunos/novo" element={<StudentForm />} />
                <Route path="/alunos/:id/editar" element={<StudentForm />} />
                <Route path="/portal-aluno/:id" element={<StudentPortal />} />
                <Route path="/financeiro" element={<Financial />} />
                
                {/* Rotas da Fase 2 */}
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
                <Route path="/biblioteca" element={<Library />} />

                {/* Rotas da Fase 3 */}
                <Route path="/assiduidade" element={<Attendance />} />
                <Route path="/cadernetas" element={<Grades />} />
                <Route path="/provas" element={<ProvaCalendar />} />
                <Route path="/pagamentos" element={<Payments />} />
                <Route path="/comunicacao" element={<Communication />} />

                <Route path="/calendario" element={<Calendar />} />
                <Route path="/relatorios" element={<Reports />} />
                <Route path="/recursos-humanos" element={<HR />} />
                <Route path="/recursos-humanos/novo" element={<StaffForm />} />
                <Route path="/recursos-humanos/:id/editar" element={<StaffForm />} />
                <Route path="/plano-de-acao" element={<ActionPlan />} />
              </Routes>
            </Layout>
          </ProtectedRoute>
        } 
      />
    </Routes>
  );
};

export default App;