

import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PageHeader from '../components/Header';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Select } from '../components/ui/Select';

const StaffForm: React.FC = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditing = Boolean(id);
    const title = isEditing ? 'Editar Funcionário' : 'Adicionar Novo Funcionário';
    const subtitle = isEditing ? 'Atualize as informações do funcionário' : 'Preencha os dados para criar um novo registo';

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Form submitted');
        navigate('/recursos-humanos');
    };
    
    return (
        <>
            <div className="flex items-center mb-4">
                 <Button variant="ghost" size="icon" onClick={() => navigate('/recursos-humanos')} className="mr-2">
                    <ArrowLeftIcon className="h-6 w-6" />
                </Button>
                <PageHeader title={title} subtitle={subtitle} />
            </div>
            
            <Card>
                <form onSubmit={handleSubmit} className="p-6">
                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <Input label="Nome Completo" id="fullName" required />
                        <Input label="Cargo" id="role" required placeholder="Ex: Professor, Secretária"/>
                         <Select label="Departamento" id="department" required>
                            <option>Académico</option>
                            <option>Administrativo</option>
                            <option>Financeiro</option>
                             <option>Operações</option>
                        </Select>
                        <Input label="Email" id="email" type="email" required />
                        <Input label="Contacto Telefónico" id="phone" type="tel" required />
                        <Input label="NUIT" id="nuit" placeholder="Opcional" />
                         <Select label="Status" id="status">
                            <option>Ativo</option>
                            <option>Inativo</option>
                        </Select>
                    </div>
                    
                    <div className="flex justify-end mt-8 gap-4">
                        <Button type="button" variant="secondary" onClick={() => navigate('/recursos-humanos')}>
                            Cancelar
                        </Button>
                        <Button type="submit">
                            {isEditing ? 'Salvar Alterações' : 'Adicionar Funcionário'}
                        </Button>
                    </div>
                </form>
            </Card>
        </>
    );
};

export default StaffForm;