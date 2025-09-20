
import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../components/Header';
import DataTable from '../components/DataTable';
import { Student } from '../types';
import { PlusIcon, PencilIcon, IdentificationIcon } from '@heroicons/react/24/outline';
import { Badge } from '../components/ui/Badge';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { useData } from '../context/DataContext';

const Students: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const { students, classes } = useData();

  const studentsWithClassNames = useMemo(() => {
    return students.map(student => {
      const studentClass = classes.find(c => c.id === student.classId);
      return {
        ...student,
        class: studentClass ? studentClass.name : 'N/A',
      };
    });
  }, [students, classes]);

  const filteredStudents = useMemo(() => 
    studentsWithClassNames.filter(student =>
      student.name.toLowerCase().includes(searchTerm.toLowerCase())
    ), [searchTerm, studentsWithClassNames]
  );

  const actionButtons = (studentId: number) => (
    <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
      <Button 
        variant="link"
        onClick={() => navigate(`/alunos/${studentId}/editar`)}
        aria-label={`Editar aluno`}
        >
         <PencilIcon className="h-4 w-4 mr-1"/> Editar
      </Button>
      <Button 
        variant="link" 
        className="text-reviva-green hover:text-reviva-green-dark"
        onClick={() => navigate(`/portal-aluno/${studentId}`)}
      >
        <IdentificationIcon className="h-4 w-4 mr-1"/> Ver Portal
      </Button>
    </div>
  );

  const studentRows = filteredStudents.map((student: Student) => [
    <span className="font-medium text-gray-900 dark:text-gray-200">{student.name}</span>,
    student.class,
    student.age,
    student.guardian,
    student.phone,
    <Badge variant={student.status === 'Ativo' ? 'success' : 'default'}>{student.status}</Badge>,
    actionButtons(student.id)
  ]);
  
  return (
    <>
      <PageHeader title="Gestão de Alunos" subtitle="Lista completa de todos os alunos matriculados">
        <div className="flex flex-col sm:flex-row items-center gap-4">
            <Input
                id="search-students"
                type="text"
                placeholder="Pesquisar por nome..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full sm:w-64"
            />
            <Button
              onClick={() => navigate('/alunos/novo')}
              className="w-full sm:w-auto"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              Cadastrar Aluno
            </Button>
        </div>
      </PageHeader>
      
       <DataTable
          title="Alunos Matriculados"
          headers={['Nome', 'Classe', 'Idade', 'Encarregado', 'Telefone', 'Status', 'Ações']}
          rows={studentRows}
        />
    </>
  );
};

export default Students;