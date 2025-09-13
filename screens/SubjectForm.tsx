
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';

const SubjectForm: React.FC = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditing = Boolean(id);
    const title = isEditing ? 'Editar Disciplina' : 'Cadastrar Nova Disciplina';
    const subtitle = isEditing ? 'Atualize os detalhes da disciplina' : 'Preencha os dados para criar uma nova disciplina';

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Form submitted');
        navigate('/disciplinas');
    };

    return (
        <>
            <div className="flex items-center mb-4">
                 <Button variant="ghost" size="icon" onClick={() => navigate('/disciplinas')} className="mr-2">
                    <ArrowLeftIcon className="h-6 w-6" />
                </Button>
                <PageHeader title={title} subtitle={subtitle} />
            </div>
            
            <Card>
                <form onSubmit={handleSubmit} className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <Input label="Nome da Disciplina" id="subjectName" required />
                        <Input label="Código da Disciplina" id="subjectCode" required placeholder="Ex: MAT01"/>
                        <Input label="Carga Horária (horas)" id="workload" type="number" required />
                    </div>
                    
                    <div className="flex justify-end mt-8 gap-4">
                        <Button type="button" variant="secondary" onClick={() => navigate('/disciplinas')}>
                            Cancelar
                        </Button>
                        <Button type="submit">
                            {isEditing ? 'Salvar Alterações' : 'Cadastrar Disciplina'}
                        </Button>
                    </div>
                </form>
            </Card>
        </>
    );
};

export default SubjectForm;
