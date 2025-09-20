import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../components/Header';
import DataTable from '../components/DataTable';
import { Teacher } from '../types';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { Badge } from '../components/ui/Badge';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { useData } from '../context/DataContext';

const Teachers: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const { teachers, deleteTeacher } = useData();

  const filteredTeachers = useMemo(() => 
    teachers.filter(teacher =>
      teacher.name.toLowerCase().includes(searchTerm.toLowerCase())
    ), [searchTerm, teachers]
  );

  const handleDelete = (teacher: Teacher) => {
    if (window.confirm(`Tem a certeza que deseja remover o professor ${teacher.name}?`)) {
        deleteTeacher(teacher.id);
    }
  }

  const actionButtons = (teacher: Teacher) => (
    <div className="flex">
      <Button 
        variant="link"
        onClick={() => navigate(`/professores/${teacher.id}/editar`)}
        aria-label={`Editar ${teacher.name}`}
        >
         <PencilIcon className="h-4 w-4 mr-1"/> Editar
      </Button>
      <Button 
        variant="link"
        className="text-red-500 hover:text-red-700"
        onClick={() => handleDelete(teacher)}
        aria-label={`Remover ${teacher.name}`}
        >
         <TrashIcon className="h-4 w-4 mr-1"/> Remover
      </Button>
    </div>
  );

  const teacherRows = filteredTeachers.map((teacher: Teacher) => [
    <span className="font-medium text-gray-900 dark:text-slate-100">{teacher.name}</span>,
    teacher.email,
    teacher.phone,
    teacher.qualifications,
    <Badge variant={teacher.status === 'Ativo' ? 'success' : 'default'}>{teacher.status}</Badge>,
    actionButtons(teacher)
  ]);

  return (
    <>
      <PageHeader title="Gestão de Professores" subtitle="Lista completa do corpo docente da escola">
        <div className="flex flex-col sm:flex-row items-center gap-4">
            <Input
                id="search-teachers"
                type="text"
                placeholder="Pesquisar por nome..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full sm:w-64"
            />
            <Button
              onClick={() => navigate('/professores/novo')}
              className="w-full sm:w-auto"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              Cadastrar Professor
            </Button>
        </div>
      </PageHeader>

      <DataTable
        title="Corpo Docente"
        headers={['Nome', 'Email', 'Telefone', 'Qualificações', 'Status', 'Ações']}
        rows={teacherRows}
      />
    </>
  );
};

export default Teachers;