import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../components/Header';
import DataTable from '../components/DataTable';
import { SUBJECTS_DATA } from '../constants';
import { Subject } from '../types';
import { PlusIcon, PencilIcon } from '@heroicons/react/24/outline';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';

const Subjects: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredSubjects = useMemo(() => 
    SUBJECTS_DATA.filter(subject =>
      subject.name.toLowerCase().includes(searchTerm.toLowerCase())
    ), [searchTerm]
  );

  const actionButtons = (subjectId: number) => (
    <div className="flex">
      <Button 
        variant="link"
        onClick={() => navigate(`/disciplinas/${subjectId}/editar`)}
        aria-label={`Editar ${SUBJECTS_DATA.find(s => s.id === subjectId)?.name}`}
        >
         <PencilIcon className="h-4 w-4 mr-1"/> Editar
      </Button>
    </div>
  );

  const subjectRows = filteredSubjects.map((subject: Subject) => [
    <span className="font-medium text-gray-900">{subject.name}</span>,
    subject.code,
    `${subject.workload} horas`,
    actionButtons(subject.id)
  ]);

  return (
    <>
      <PageHeader title="Gestão de Disciplinas" subtitle="Organize todas as disciplinas oferecidas pela escola">
         <div className="flex flex-col sm:flex-row items-center gap-4">
            <Input
                // FIX: Added id prop to satisfy InputProps interface.
                id="search-subjects"
                type="text"
                placeholder="Pesquisar por disciplina..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full sm:w-64"
            />
            <Button
              onClick={() => navigate('/disciplinas/novo')}
              className="w-full sm:w-auto"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              Cadastrar Disciplina
            </Button>
        </div>
      </PageHeader>

      <DataTable
        title="Disciplinas Cadastradas"
        headers={['Nome da Disciplina', 'Código', 'Carga Horária', 'Ações']}
        rows={subjectRows}
      />
    </>
  );
};

export default Subjects;