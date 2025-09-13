
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import { ArrowLeftIcon, UserGroupIcon } from '@heroicons/react/24/outline';
import { TEACHERS_DATA } from '../constants';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';

const ClassForm: React.FC = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditing = Boolean(id);
    const title = isEditing ? 'Editar Turma' : 'Criar Nova Turma';
    const subtitle = isEditing ? 'Atualize os detalhes da turma' : 'Preencha os dados para criar uma nova turma';

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Form submitted');
        navigate('/turmas');
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
                 <Button variant="ghost" size="icon" onClick={() => navigate('/turmas')} className="mr-2">
                    <ArrowLeftIcon className="h-6 w-6" />
                </Button>
                <PageHeader title={title} subtitle={subtitle} />
            </div>
            
            <Card>
                <form onSubmit={handleSubmit} className="p-6">
                    <FormSection title="Detalhes da Turma">
                        <Input label="Nome da Turma" id="className" required placeholder="Ex: 8ª Classe A" />
                        <Input label="Ano Letivo" id="year" type="number" required defaultValue={new Date().getFullYear()} />
                        <SelectField label="Professor Principal" id="teacher" required>
                            <option value="">Selecione um professor</option>
                            {TEACHERS_DATA.map(teacher => (
                                <option key={teacher.id} value={teacher.id}>{teacher.name}</option>
                            ))}
                        </SelectField>
                    </FormSection>

                    <div className="mb-8">
                        <h3 className="text-xl font-semibold text-gray-800 border-b-2 border-reviva-green pb-2 mb-4">Gerir Alunos da Turma</h3>
                        <div className="bg-gray-50 p-4 rounded-lg text-center">
                            <UserGroupIcon className="h-12 w-12 mx-auto text-gray-400 mb-2"/>
                            <p className="text-gray-600">A atribuição de alunos e disciplinas a esta turma será feita após a sua criação.</p>
                            <p className="text-sm text-gray-500">Isto garante uma melhor organização.</p>
                        </div>
                    </div>

                    <div className="flex justify-end mt-8 gap-4">
                        <Button type="button" variant="secondary" onClick={() => navigate('/turmas')}>
                            Cancelar
                        </Button>
                        <Button type="submit">
                            {isEditing ? 'Salvar Alterações' : 'Criar Turma'}
                        </Button>
                    </div>
                </form>
            </Card>
        </>
    );
};

export default ClassForm;
