
import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../components/Header';
import DataTable from '../components/DataTable';
import { STAFF_DATA } from '../constants';
import { Staff } from '../types';
import { PlusIcon, PencilIcon } from '@heroicons/react/24/outline';
import { Badge } from '../components/ui/Badge';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';

const HR: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredStaff = useMemo(() => 
    STAFF_DATA.filter(staff =>
      staff.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      staff.role.toLowerCase().includes(searchTerm.toLowerCase())
    ), [searchTerm]
  );

  const actionButtons = (staffId: number) => (
    <div className="flex">
      <Button 
        variant="link"
        onClick={() => navigate(`/recursos-humanos/${staffId}/editar`)}
        aria-label={`Editar ${STAFF_DATA.find(t => t.id === staffId)?.name}`}
        >
         <PencilIcon className="h-4 w-4 mr-1"/> Editar
      </Button>
    </div>
  );

  const staffRows = filteredStaff.map((staff: Staff) => [
    <span className="font-medium text-gray-900 dark:text-slate-100">{staff.name}</span>,
    staff.role,
    staff.department,
    staff.email,
    staff.phone,
    <Badge variant={staff.status === 'Ativo' ? 'success' : 'default'}>{staff.status}</Badge>,
    actionButtons(staff.id)
  ]);

  return (
    <>
      <PageHeader title="Recursos Humanos" subtitle="Gestão completa do pessoal da escola">
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
              onClick={() => navigate('/recursos-humanos/novo')}
              className="w-full sm:w-auto"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              Adicionar Pessoal
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

export default HR;
