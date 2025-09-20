import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../components/Header';
import DataTable from '../components/DataTable';
import { Subject } from '../types';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { useData } from '../context/DataContext';

const Subjects: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const { subjects, classCurriculum, deleteSubject } = useData();

  const filteredSubjects = useMemo(() => 
    subjects.filter(subject =>
      subject.name.toLowerCase().includes(searchTerm.toLowerCase())
    ), [searchTerm, subjects]
  );
  
  const handleDelete = (subject: Subject) => {
    const isUsed = classCurriculum.some(cc => cc.subjectId === subject.id);
    if(isUsed) {
        alert(`Não é possível remover a disciplina "${subject.name}" pois ela está a ser usada em uma ou mais turmas.`);
        return;
    }
    if(window.confirm(`Tem a certeza que deseja remover a disciplina ${subject.name}?`)) {
        deleteSubject(subject.id);
    }
  }

  const actionButtons = (subject: Subject) => (
    <div className="flex">
      <Button 
        variant="link"
        onClick={() => navigate(`/disciplinas/${subject.id}/editar`)}
        aria-label={`Editar ${subject.name}`}
        >
         <PencilIcon className="h-4 w-4 mr-1"/> Editar
      </Button>
       <Button 
        variant="link"
        className="text-red-500 hover:text-red-700"
        onClick={() => handleDelete(subject)}
        aria-label={`Remover ${subject.name}`}
        >
         <TrashIcon className="h-4 w-4 mr-1"/> Remover
      </Button>
    </div>
  );

  const subjectRows = filteredSubjects.map((subject: Subject) => [
    <span className="font-medium text-gray-900 dark:text-slate-100">{subject.name}</span>,
    subject.code,
    `${subject.workload} horas`,
    actionButtons(subject)
  ]);

  return (
    <>
      <PageHeader title="Gestão de Disciplinas" subtitle="Organize todas as disciplinas oferecidas pela escola">
         <div className="flex flex-col sm:flex-row items-center gap-4">
            <Input
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