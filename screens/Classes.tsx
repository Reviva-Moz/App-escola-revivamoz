import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../components/Header';
import DataTable from '../components/DataTable';
import { CLASSES_DATA } from '../constants';
import { Class } from '../types';
import { PlusIcon, PencilIcon, ClipboardDocumentListIcon } from '@heroicons/react/24/outline';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';

const Classes: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredClasses = useMemo(() => 
    CLASSES_DATA.filter(cls =>
      cls.name.toLowerCase().includes(searchTerm.toLowerCase())
    ), [searchTerm]
  );

  const actionButtons = (classId: number) => (
    <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
      <Button 
        variant="link"
        onClick={() => navigate(`/turmas/${classId}/editar`)}
        aria-label={`Editar ${CLASSES_DATA.find(c => c.id === classId)?.name}`}
        >
         <PencilIcon className="h-4 w-4 mr-1"/> Editar
      </Button>
      <Button 
        variant="link"
        className="text-reviva-green hover:text-reviva-green-dark"
        onClick={() => navigate(`/turmas/${classId}/detalhes`)}
        aria-label={`Gerir plano da turma ${CLASSES_DATA.find(c => c.id === classId)?.name}`}
        >
         <ClipboardDocumentListIcon className="h-4 w-4 mr-1"/> Gerir Plano
      </Button>
    </div>
  );

  const classRows = filteredClasses.map((cls: Class) => [
    <span className="font-medium text-gray-900 dark:text-slate-100">{cls.name}</span>,
    cls.year,
    cls.teacherName,
    cls.studentCount,
    actionButtons(cls.id)
  ]);

  return (
    <>
      <PageHeader title="Gestão de Turmas" subtitle="Crie e organize as turmas do ano letivo">
         <div className="flex flex-col sm:flex-row items-center gap-4">
            <Input
                // FIX: Added id prop to satisfy InputProps interface.
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