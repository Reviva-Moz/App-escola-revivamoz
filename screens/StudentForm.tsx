
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PageHeader from '../components/Header';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Select } from '../components/ui/Select';
import WebcamCapture from '../components/WebcamCapture';
import { useData } from '../context/DataContext';
import { Student } from '../types';

const StudentForm: React.FC = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditing = Boolean(id);
    
    const { students, classes, addStudent, updateStudent } = useData();

    const [formState, setFormState] = useState<Omit<Student, 'id' | 'class'>>({
        name: '',
        classId: 0,
        age: 0,
        guardian: '',
        phone: '',
        status: 'Ativo',
        nuit: '',
        healthNotes: '',
        photoUrl: '',
    });

    const [loading, setLoading] = useState(true);
    const [formError, setFormError] = useState<string | null>(null);

    useEffect(() => {
        if (isEditing && id) {
            const studentData = students.find(s => s.id === parseInt(id));
            if (studentData) {
                // Omit 'class' property when setting form state
                const { class: _, ...rest } = studentData;
                setFormState(rest);
            } else {
                 setFormError("Não foi possível encontrar os dados do aluno.");
            }
        }
        setLoading(false);
    }, [id, isEditing, students]);
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { id, value } = e.target;
        setFormState(prev => ({ ...prev, [id]: value }));
    };

    const handlePhotoCapture = (imageDataUrl: string) => {
        setFormState(prev => ({ ...prev, photoUrl: imageDataUrl }));
    };

    const title = isEditing ? 'Editar Aluno' : 'Cadastrar Novo Aluno';
    const subtitle = isEditing ? 'Atualize as informações do aluno' : 'Preencha os dados para criar um novo registo';

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormError(null);

        if (!formState.name || !formState.classId) {
            setFormError("Nome e Turma são campos obrigatórios.");
            return;
        }
        
        const dataToSave = {
            ...formState,
            classId: Number(formState.classId),
            age: Number(formState.age),
        };

        if(isEditing && id) {
            updateStudent({ id: parseInt(id), ...dataToSave });
        } else {
            addStudent(dataToSave);
        }
        
        alert(`Aluno ${isEditing ? 'atualizado' : 'cadastrado'} com sucesso!`);
        navigate('/alunos');
    };

    if (loading) {
        return <div className="text-center py-8">A carregar dados do aluno...</div>;
    }
    
    return (
        <>
            <div className="flex items-center mb-4">
                 <Button variant="ghost" size="icon" onClick={() => navigate('/alunos')} className="mr-2">
                    <ArrowLeftIcon className="h-6 w-6" />
                </Button>
                <PageHeader title={title} subtitle={subtitle} />
            </div>
            
            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2">
                        <Card className="p-6">
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                <h3 className="md:col-span-2 text-xl font-semibold text-slate-800 dark:text-slate-200 border-b-2 border-reviva-green pb-2">Dados Pessoais e Académicos</h3>
                                <Input label="Nome Completo" id="name" required value={formState.name} onChange={handleChange} />
                                <Input label="Idade" id="age" type="number" value={formState.age} onChange={handleChange} />
                                <Select label="Turma Atual" id="classId" required value={formState.classId} onChange={handleChange}>
                                <option value="">Selecione a turma</option>
                                {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                </Select>
                                 <Select label="Status" id="status" required value={formState.status} onChange={handleChange}>
                                    <option value="Ativo">Ativo</option>
                                    <option value="Inativo">Inativo</option>
                                </Select>
                                <h3 className="md:col-span-2 text-xl font-semibold text-slate-800 dark:text-slate-200 border-b-2 border-reviva-green pb-2 pt-4">Dados do Encarregado e Adicionais</h3>
                                <Input label="Nome do Encarregado" id="guardian" required value={formState.guardian} onChange={handleChange} />
                                <Input label="Contacto Telefónico" id="phone" type="tel" required value={formState.phone} onChange={handleChange} />
                                <Input label="NUIT" id="nuit" type="text" value={formState.nuit} onChange={handleChange} placeholder="Opcional"/>
                                <div className="md:col-span-2">
                                    <label htmlFor="healthNotes" className="mb-1 block text-sm font-medium text-slate-600 dark:text-slate-300">Ficha de Saúde Básica (Alergias, etc.)</label>
                                    <textarea id="healthNotes" rows={4} value={formState.healthNotes} onChange={handleChange} className="w-full p-2 border border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100 rounded-lg"></textarea>
                                </div>
                            </div>
                        </Card>
                    </div>
                    <div>
                         <Card className="p-6">
                            <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200 border-b-2 border-reviva-green pb-2 mb-4">Fotografia do Aluno</h3>
                            <WebcamCapture
                                onCapture={handlePhotoCapture}
                                initialImage={formState.photoUrl}
                            />
                        </Card>
                    </div>
                </div>

                {formError && <p className="text-red-500 text-sm mt-4 text-center">{formError}</p>}
                
                <div className="flex justify-end mt-8 gap-4">
                    <Button type="button" variant="secondary" onClick={() => navigate('/alunos')}>
                        Cancelar
                    </Button>
                    <Button type="submit">
                        {isEditing ? 'Salvar Alterações' : 'Cadastrar Aluno'}
                    </Button>
                </div>
            </form>
        </>
    );
};

export default StudentForm;