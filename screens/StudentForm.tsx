
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';

const StudentForm: React.FC = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditing = Boolean(id);
    const title = isEditing ? 'Editar Aluno' : 'Cadastrar Novo Aluno';
    const subtitle = isEditing ? 'Atualize as informações do aluno' : 'Preencha os dados para criar um novo registo';

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Handle form submission logic
        console.log('Form submitted');
        navigate('/alunos');
    };

    const FormSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
        <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-800 border-b-2 border-reviva-green pb-2 mb-4">{title}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {children}
            </div>
        </div>
    );
    
    const SelectField: React.FC<{ label: string; id: string; children: React.ReactNode; required?: boolean }> = ({ label, id, children, required }) => (
        <div className="flex flex-col">
            <label htmlFor={id} className="mb-1 text-sm font-medium text-gray-700">{label}{required && <span className="text-red-500">*</span>}</label>
            <select id={id} name={id} required={required} className="p-2 border border-gray-300 rounded-lg focus:ring-reviva-green-light focus:border-reviva-green-light bg-white">
                {children}
            </select>
        </div>
    );


    return (
        <>
            <div className="flex items-center mb-4">
                 <Button variant="ghost" size="icon" onClick={() => navigate('/alunos')} className="mr-2">
                    <ArrowLeftIcon className="h-6 w-6" />
                </Button>
                <PageHeader title={title} subtitle={subtitle} />
            </div>
            
            <Card>
                <form onSubmit={handleSubmit} className="p-6">
                    <FormSection title="Dados Pessoais">
                        <Input label="Nome Completo" id="fullName" required />
                        <Input label="Data de Nascimento" id="dob" type="date" required />
                        <SelectField label="Gênero" id="gender">
                            <option>Masculino</option>
                            <option>Feminino</option>
                        </SelectField>
                        <Input label="Nacionalidade" id="nationality" />
                        <Input label="BI / NIF" id="nif" />
                        <Input label="Morada" id="address" />
                    </FormSection>

                    <FormSection title="Informações de Matrícula">
                        <Input label="Escola Anterior" id="previousSchool" />
                        <SelectField label="Turma Atual" id="class">
                            <option>5ª Classe</option>
                            <option>6ª Classe</option>
                            <option>7ª Classe</option>
                        </SelectField>
                        <Input label="Fotografia" id="photo" type="file" />
                    </FormSection>

                    <FormSection title="Dados do Encarregado de Educação">
                        <Input label="Nome do Encarregado" id="guardianName" required />
                        <Input label="Parentesco" id="relationship" />
                        <Input label="Contacto Telefónico" id="guardianPhone" type="tel" required />
                        <Input label="Email" id="guardianEmail" type="email" />
                        <Input label="Morada do Encarregado" id="guardianAddress" />
                    </FormSection>
                    
                    <div className="flex justify-end mt-8 gap-4">
                        <Button type="button" variant="secondary" onClick={() => navigate('/alunos')}>
                            Cancelar
                        </Button>
                        <Button type="submit">
                            {isEditing ? 'Salvar Alterações' : 'Cadastrar Aluno'}
                        </Button>
                    </div>
                </form>
            </Card>
        </>
    );
};

export default StudentForm;
