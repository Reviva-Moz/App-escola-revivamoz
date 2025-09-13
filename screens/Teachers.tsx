import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../components/Header';
import DataTable from '../components/DataTable';
import { TEACHERS_DATA } from '../constants';
import { Teacher } from '../types';
import { PlusIcon, PencilIcon } from '@heroicons/react/24/outline';
import { Badge } from '../components/ui/Badge';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';

const Teachers: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredTeachers = useMemo(() => 
    TEACHERS_DATA.filter(teacher =>
      teacher.name.toLowerCase().includes(searchTerm.toLowerCase())
    ), [searchTerm]
  );

  const actionButtons = (teacherId: number) => (
    <div className="flex">
      <Button 
        variant="link"
        onClick={() => navigate(`/professores/${teacherId}/editar`)}
        aria-label={`Editar ${TEACHERS_DATA.find(t => t.id === teacherId)?.name}`}
        >
         <PencilIcon className="h-4 w-4 mr-1"/> Editar
      </Button>
    </div>
  );

  const teacherRows = filteredTeachers.map((teacher: Teacher) => [
    <span className="font-medium text-gray-900 dark:text-slate-100">{teacher.name}</span>,
    teacher.email,
    teacher.phone,
    teacher.qualifications,
    <Badge variant={teacher.status === 'Ativo' ? 'success' : 'default'}>{teacher.status}</Badge>,
    actionButtons(teacher.id)
  ]);

  return (
    <>
      <PageHeader title="Gestão de Professores" subtitle="Lista completa do corpo docente da escola">
        <div className="flex flex-col sm:flex-row items-center gap-4">
            <Input
                // FIX: Added id prop to satisfy InputProps interface.
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