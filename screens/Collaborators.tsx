
import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../components/Header';
import DataTable from '../components/DataTable';
import { Staff } from '../types';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { Badge } from '../components/ui/Badge';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { useData } from '../context/DataContext';

const Collaborators: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const { staff, deleteStaff } = useData();

  const filteredStaff = useMemo(() => 
    staff.filter(s =>
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.role.toLowerCase().includes(searchTerm.toLowerCase())
    ), [searchTerm, staff]
  );
  
  const handleDelete = (staffMember: Staff) => {
    if (window.confirm(`Tem a certeza que deseja remover ${staffMember.name}?`)) {
        deleteStaff(staffMember.id);
    }
  }

  const actionButtons = (staffMember: Staff) => (
    <div className="flex">
      <Button 
        variant="link"
        onClick={() => navigate(`/colaboradores/${staffMember.id}/editar`)}
        aria-label={`Editar ${staffMember.name}`}
        >
         <PencilIcon className="h-4 w-4 mr-1"/> Editar
      </Button>
       <Button 
        variant="link"
        className="text-red-500 hover:text-red-700"
        onClick={() => handleDelete(staffMember)}
        aria-label={`Remover ${staffMember.name}`}
        >
         <TrashIcon className="h-4 w-4 mr-1"/> Remover
      </Button>
    </div>
  );

  const staffRows = filteredStaff.map((staffMember: Staff) => [
    <span className="font-medium text-gray-900 dark:text-slate-100">{staffMember.name}</span>,
    staffMember.role,
    staffMember.department,
    staffMember.email,
    staffMember.phone,
    <Badge variant={staffMember.status === 'Ativo' ? 'success' : 'default'}>{staffMember.status}</Badge>,
    actionButtons(staffMember)
  ]);

  return (
    <>
      <PageHeader title="Gestão de Colaboradores" subtitle="Gestão completa do pessoal da escola">
        <div className="flex flex-col sm:flex-row items-center gap-4">
            <Input
                id="search-staff"
                type="text"
                placeholder="Pesquisar por nome ou cargo..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full sm:w-64"
            />
            <Button
              onClick={() => navigate('/colaboradores/novo')}
              className="w-full sm:w-auto"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              Adicionar Colaborador
            </Button>
        </div>
      </PageHeader>

      <DataTable
        title="Quadro de Pessoal"
        headers={['Nome', 'Cargo', 'Departamento', 'Email', 'Telefone', 'Status', 'Ações']}
        rows={staffRows}
      />
    </>
  );
};

export default Collaborators;
