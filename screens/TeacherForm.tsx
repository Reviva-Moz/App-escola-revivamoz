
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PageHeader from '../components/Header';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Select } from '../components/ui/Select';

const TeacherForm: React.FC = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditing = Boolean(id);
    const title = isEditing ? 'Editar Professor' : 'Cadastrar Novo Professor';
    const subtitle = isEditing ? 'Atualize as informações do professor' : 'Preencha os dados para criar um novo registo';

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Form submitted');
        navigate('/professores');
    };

    const FormSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
        <div className="mb-8">
            <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200 border-b-2 border-reviva-green pb-2 mb-4">{title}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {children}
            </div>
        </div>
    );
    
    return (
        <>
            <div className="flex items-center mb-4">
                 <Button variant="ghost" size="icon" onClick={() => navigate('/professores')} className="mr-2">
                    <ArrowLeftIcon className="h-6 w-6" />
                </Button>
                <PageHeader title={title} subtitle={subtitle} />
            </div>
            
            <Card>
                <form onSubmit={handleSubmit} className="p-6">
                    <FormSection title="Dados Pessoais e Contato">
                        <Input label="Nome Completo" id="fullName" required />
                        <Input label="Email" id="email" type="email" required />
                        <Input label="Contacto Telefónico" id="phone" type="tel" required />
                    </FormSection>

                    <FormSection title="Informações Profissionais">
                        <Input label="Qualificações" id="qualifications" required />
                        <Select label="Status" id="status">
                            <option>Ativo</option>
                            <option>Inativo</option>
                        </Select>
                    </FormSection>
                    
                    <div className="flex justify-end mt-8 gap-4">
                        <Button type="button" variant="secondary" onClick={() => navigate('/professores')}>
                            Cancelar
                        </Button>
                        <Button type="submit">
                            {isEditing ? 'Salvar Alterações' : 'Cadastrar Professor'}
                        </Button>
                    </div>
                </form>
            </Card>
        </>
    );
};

export default TeacherForm;