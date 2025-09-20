

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PageHeader from '../components/Header';
import { ArrowLeftIcon, UserGroupIcon } from '@heroicons/react/24/outline';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Select } from '../components/ui/Select';
import { useData } from '../context/DataContext';

const ClassForm: React.FC = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { classes, teachers, addClass, updateClass } = useData();
    const isEditing = Boolean(id);

    const [className, setClassName] = useState('');
    const [year, setYear] = useState(new Date().getFullYear());
    const [teacherId, setTeacherId] = useState<string>('');

    useEffect(() => {
        if (isEditing && id) {
            const classData = classes.find(c => c.id === parseInt(id));
            if (classData) {
                setClassName(classData.name);
                setYear(classData.year);
                setTeacherId(classData.teacherId?.toString() || '');
            }
        }
    }, [id, isEditing, classes]);

    const title = isEditing ? 'Editar Turma' : 'Criar Nova Turma';
    const subtitle = isEditing ? 'Atualize os detalhes da turma' : 'Preencha os dados para criar uma nova turma';

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        const classData = {
            name: className,
            year,
            teacherId: teacherId ? parseInt(teacherId) : null,
        }

        if (isEditing && id) {
            updateClass({id: parseInt(id), ...classData });
        } else {
            addClass(classData);
        }
        
        navigate('/turmas');
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
                 <Button variant="ghost" size="icon" onClick={() => navigate('/turmas')} className="mr-2">
                    <ArrowLeftIcon className="h-6 w-6" />
                </Button>
                <PageHeader title={title} subtitle={subtitle} />
            </div>
            
            <Card>
                <form onSubmit={handleSubmit} className="p-6">
                    <FormSection title="Detalhes da Turma">
                        <Input label="Nome da Turma" id="className" required placeholder="Ex: 8ª Classe A" value={className} onChange={(e) => setClassName(e.target.value)} />
                        <Input label="Ano Letivo" id="year" type="number" required value={year} onChange={(e) => setYear(parseInt(e.target.value))} />
                        <Select 
                            label="Professor Principal" 
                            id="teacher" 
                            required
                            value={teacherId}
                            onChange={(e) => setTeacherId(e.target.value)}
                        >
                            <option value="">Selecione um professor</option>
                            {teachers.filter(t => t.status === 'Ativo').map(teacher => (
                                <option key={teacher.id} value={teacher.id}>{teacher.name}</option>
                            ))}
                        </Select>
                    </FormSection>

                    <div className="mb-8">
                        <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200 border-b-2 border-reviva-green pb-2 mb-4">Gerir Alunos da Turma</h3>
                        <div className="bg-slate-50 dark:bg-slate-700/50 p-4 rounded-lg text-center">
                            <UserGroupIcon className="h-12 w-12 mx-auto text-slate-400 mb-2"/>
                            <p className="text-slate-600 dark:text-slate-300">A atribuição de alunos e disciplinas a esta turma será feita após a sua criação.</p>
                            <p className="text-sm text-slate-500 dark:text-slate-400">Isto garante uma melhor organização.</p>
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