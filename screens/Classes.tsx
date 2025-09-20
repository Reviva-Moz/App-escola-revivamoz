import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../components/Header';
import DataTable from '../components/DataTable';
import { Class } from '../types';
import { PlusIcon, PencilIcon, ClipboardDocumentListIcon, TrashIcon } from '@heroicons/react/24/outline';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { useData } from '../context/DataContext';

const Classes: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const { classes, teachers, students, deleteClass } = useData();

  const classesWithDetails = useMemo(() => {
    return classes.map(cls => {
        const teacher = teachers.find(t => t.id === cls.teacherId);
        const studentCount = students.filter(s => s.classId === cls.id).length;
        return {
            ...cls,
            teacherName: teacher ? teacher.name : 'N/A',
            studentCount: studentCount,
        };
    });
  }, [classes, teachers, students]);


  const filteredClasses = useMemo(() => 
    classesWithDetails.filter(cls =>
      cls.name.toLowerCase().includes(searchTerm.toLowerCase())
    ), [searchTerm, classesWithDetails]
  );

  const handleDelete = (cls: Class) => {
      if (cls.studentCount > 0) {
          alert(`Não é possível remover a turma "${cls.name}" pois ela possui ${cls.studentCount} alunos associados.`);
          return;
      }
      if(window.confirm(`Tem a certeza que deseja remover a turma ${cls.name}?`)) {
          deleteClass(cls.id);
      }
  }

  const actionButtons = (cls: Class) => (
    <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
      <Button 
        variant="link"
        onClick={() => navigate(`/turmas/${cls.id}/editar`)}
        aria-label={`Editar ${cls.name}`}
        >
         <PencilIcon className="h-4 w-4 mr-1"/> Editar
      </Button>
      <Button 
        variant="link"
        className="text-reviva-green hover:text-reviva-green-dark"
        onClick={() => navigate(`/turmas/${cls.id}/detalhes`)}
        aria-label={`Gerir plano da turma ${cls.name}`}
        >
         <ClipboardDocumentListIcon className="h-4 w-4 mr-1"/> Gerir Plano
      </Button>
       <Button 
        variant="link"
        className="text-red-500 hover:text-red-700"
        onClick={() => handleDelete(cls)}
        aria-label={`Remover ${cls.name}`}
        >
         <TrashIcon className="h-4 w-4 mr-1"/> Remover
      </Button>
    </div>
  );

  const classRows = filteredClasses.map((cls) => [
    <span className="font-medium text-gray-900 dark:text-slate-100">{cls.name}</span>,
    cls.year,
    cls.teacherName,
    cls.studentCount,
    actionButtons(cls)
  ]);

  return (
    <>
      <PageHeader title="Gestão de Turmas" subtitle="Crie e organize as turmas do ano letivo">
         <div className="flex flex-col sm:flex-row items-center gap-4">
            <Input
                id="search-classes"
                type="text"
                placeholder="Pesquisar por turma..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full sm:w-64"
            />
            <Button
              onClick={() => navigate('/turmas/novo')}
              className="w-full sm:w-auto"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              Criar Nova Turma
            </Button>
        </div>
      </PageHeader>

      <DataTable
        title="Turmas Atuais"
        headers={['Nome da Turma', 'Ano Letivo', 'Professor Principal', 'Nº de Alunos', 'Ações']}
        rows={classRows}
      />
    </>
  );
};

export default Classes;