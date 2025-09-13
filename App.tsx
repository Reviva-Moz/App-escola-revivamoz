
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
import Subjects from './screens/Subjects';
import SubjectForm from './screens/SubjectForm';
import Attendance from './screens/Attendance';
import Grades from './screens/Grades';

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
                <Route path="/financeiro" element={<Financial />} />
                
                {/* Rotas da Fase 2 */}
                <Route path="/professores" element={<Teachers />} />
                <Route path="/professores/novo" element={<TeacherForm />} />
                <Route path="/professores/:id/editar" element={<TeacherForm />} />
                <Route path="/turmas" element={<Classes />} />
                <Route path="/turmas/novo" element={<ClassForm />} />
                <Route path="/turmas/:id/editar" element={<ClassForm />} />
                <Route path="/disciplinas" element={<Subjects />} />
                <Route path="/disciplinas/novo" element={<SubjectForm />} />
                <Route path="/disciplinas/:id/editar" element={<SubjectForm />} />

                {/* Rotas da Fase 3 */}
                <Route path="/assiduidade" element={<Attendance />} />
                <Route path="/cadernetas" element={<Grades />} />

                <Route path="/periodos" element={<ComingSoon title="Calendário e Horários" />} />
                <Route path="/relatorios" element={<ComingSoon title="Relatórios Avançados" />} />
              </Routes>
            </Layout>
          </ProtectedRoute>
        } 
      />
    </Routes>
  );
};

export default App;