
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PageHeader from '../components/Header';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Select } from '../components/ui/Select';
import { useData } from '../context/DataContext';
import { Staff } from '../types';

const CollaboratorForm: React.FC = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { staff, addStaff, updateStaff } = useData();
    const isEditing = Boolean(id);

    const [formState, setFormState] = useState<Omit<Staff, 'id'>>({
        name: '',
        role: '',
        department: 'Académico',
        email: '',
        phone: '',
        status: 'Ativo',
        nuit: ''
    });

    useEffect(() => {
        if(isEditing && id) {
            const staffMember = staff.find(s => s.id === parseInt(id));
            if(staffMember) {
                setFormState(staffMember);
            }
        }
    }, [id, isEditing, staff]);
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormState(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isEditing && id) {
            updateStaff({ id: parseInt(id), ...formState });
        } else {
            addStaff(formState);
        }
        navigate('/colaboradores');
    };
    
    const title = isEditing ? 'Editar Colaborador' : 'Adicionar Novo Colaborador';
    const subtitle = isEditing ? 'Atualize as informações do colaborador' : 'Preencha os dados para criar um novo registo';

    return (
        <>
            <div className="flex items-center mb-4">
                 <Button variant="ghost" size="icon" onClick={() => navigate('/colaboradores')} className="mr-2">
                    <ArrowLeftIcon className="h-6 w-6" />
                </Button>
                <PageHeader title={title} subtitle={subtitle} />
            </div>
            
            <Card>
                <form onSubmit={handleSubmit} className="p-6">
                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <Input label="Nome Completo" id="name" name="name" value={formState.name} onChange={handleChange} required />
                        <Input label="Cargo" id="role" name="role" value={formState.role} onChange={handleChange} required placeholder="Ex: Professor, Secretária"/>
                         <Select label="Departamento" id="department" name="department" value={formState.department} onChange={handleChange} required>
                            <option>Académico</option>
                            <option>Administrativo</option>
                            <option>Financeiro</option>
                             <option>Operações</option>
                        </Select>
                        <Input label="Email" id="email" name="email" type="email" value={formState.email} onChange={handleChange} required />
                        <Input label="Contacto Telefónico" id="phone" name="phone" type="tel" value={formState.phone} onChange={handleChange} required />
                        <Input label="NUIT" id="nuit" name="nuit" value={formState.nuit || ''} onChange={handleChange} placeholder="Opcional" />
                         <Select label="Status" id="status" name="status" value={formState.status} onChange={handleChange}>
                            <option value="Ativo">Ativo</option>
                            <option value="Inativo">Inativo</option>
                        </Select>
                    </div>
                    
                    <div className="flex justify-end mt-8 gap-4">
                        <Button type="button" variant="secondary" onClick={() => navigate('/colaboradores')}>
                            Cancelar
                        </Button>
                        <Button type="submit">
                            {isEditing ? 'Salvar Alterações' : 'Adicionar Colaborador'}
                        </Button>
                    </div>
                </form>
            </Card>
        </>
    );
};

export default CollaboratorForm;
