

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PageHeader from '../components/Header';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Select } from '../components/ui/Select';
import { useData } from '../context/DataContext';
import { Teacher } from '../types';
import WebcamCapture from '../components/WebcamCapture';

const TeacherForm: React.FC = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { teachers, addTeacher, updateTeacher } = useData();
    const isEditing = Boolean(id);

    const [formState, setFormState] = useState<Omit<Teacher, 'id'>>({
        name: '',
        email: '',
        phone: '',
        qualifications: '',
        status: 'Ativo',
        photoUrl: '',
    });

    useEffect(() => {
        if (isEditing && id) {
            const teacherData = teachers.find(t => t.id === parseInt(id));
            if (teacherData) {
                setFormState(teacherData);
            }
        }
    }, [id, isEditing, teachers]);
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormState(prev => ({...prev, [name]: value}));
    };
    
    const handlePhotoCapture = (imageDataUrl: string) => {
        setFormState(prev => ({ ...prev, photoUrl: imageDataUrl }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isEditing && id) {
            updateTeacher({ id: parseInt(id), ...formState });
        } else {
            addTeacher(formState);
        }
        navigate('/professores');
    };

    const title = isEditing ? 'Editar Professor' : 'Cadastrar Novo Professor';
    const subtitle = isEditing ? 'Atualize as informações do professor' : 'Preencha os dados para criar um novo registo';
    
    return (
        <>
            <div className="flex items-center mb-4">
                 <Button variant="ghost" size="icon" onClick={() => navigate('/professores')} className="mr-2">
                    <ArrowLeftIcon className="h-6 w-6" />
                </Button>
                <PageHeader title={title} subtitle={subtitle} />
            </div>
            
             <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2">
                        <Card className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <h3 className="md:col-span-2 text-xl font-semibold text-slate-800 dark:text-slate-200 border-b-2 border-reviva-green pb-2">Dados Pessoais e Contato</h3>
                                <Input label="Nome Completo" id="name" name="name" value={formState.name} onChange={handleChange} required />
                                <Input label="Email" id="email" name="email" type="email" value={formState.email} onChange={handleChange} required />
                                <Input label="Contacto Telefónico" id="phone" name="phone" type="tel" value={formState.phone} onChange={handleChange} required />
                                
                                <h3 className="md:col-span-2 text-xl font-semibold text-slate-800 dark:text-slate-200 border-b-2 border-reviva-green pb-2 pt-4">Informações Profissionais</h3>
                                <Input label="Qualificações" id="qualifications" name="qualifications" value={formState.qualifications} onChange={handleChange} required />
                                <Select label="Status" id="status" name="status" value={formState.status} onChange={handleChange}>
                                    <option value="Ativo">Ativo</option>
                                    <option value="Inativo">Inativo</option>
                                </Select>
                            </div>
                        </Card>
                    </div>
                    <div>
                         <Card className="p-6">
                            <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200 border-b-2 border-reviva-green pb-2 mb-4">Fotografia do Professor</h3>
                             <WebcamCapture
                                onCapture={handlePhotoCapture}
                                initialImage={formState.photoUrl}
                            />
                        </Card>
                    </div>
                </div>
                
                <div className="flex justify-end mt-8 gap-4">
                    <Button type="button" variant="secondary" onClick={() => navigate('/professores')}>
                        Cancelar
                    </Button>
                    <Button type="submit">
                        {isEditing ? 'Salvar Alterações' : 'Cadastrar Professor'}
                    </Button>
                </div>
            </form>
        </>
    );
};

export default TeacherForm;