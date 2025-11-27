

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PageHeader from '@/components/Header';
import { ArrowLeftIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { useCoreData } from '@/context/CoreDataContext';
import { Teacher, Document, ClassCurriculum } from '@/types';
import WebcamCapture from '@/components/WebcamCapture';
import FileUpload from '@/components/ui/FileUpload';

const TeacherForm: React.FC = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { teachers, addTeacher, updateTeacher, classes, subjects, classCurriculum, updateTeacherAssignments } = useCoreData();
    const isEditing = Boolean(id);
    const teacherId = isEditing ? parseInt(id!) : null;

    const [formState, setFormState] = useState<Omit<Teacher, 'id'>>({
        name: '',
        email: '',
        phone: '',
        qualifications: '',
        status: 'Ativo',
        photoUrl: '',
        documents: [],
    });
    const [error, setError] = useState<string>('');
    const [assignments, setAssignments] = useState<{ classId: number; subjectId: number; }[]>([]);
    const [selectedClass, setSelectedClass] = useState('');
    const [selectedSubject, setSelectedSubject] = useState('');

    useEffect(() => {
        if (isEditing && teacherId) {
            const teacherData = teachers.find(t => t.id === teacherId);
            if (teacherData) {
                setFormState({ documents: [], ...teacherData });
                const teacherAssignments = classCurriculum
                    .filter(cc => cc.teacherId === teacherId)
                    .map(({ classId, subjectId }) => ({ classId, subjectId }));
                setAssignments(teacherAssignments);
            }
        }
    }, [id, isEditing, teachers, classCurriculum]);
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormState(prev => ({...prev, [name]: value}));
    };
    
    const handlePhotoCapture = (imageDataUrl: string) => {
        setFormState(prev => ({ ...prev, photoUrl: imageDataUrl }));
    };

    const handleFileUpload = (files: File[]) => {
        const newDocuments: Document[] = files.map(file => ({
            name: file.name,
            size: file.size,
            url: URL.createObjectURL(file),
            uploadedAt: new Date().toISOString(),
        }));
        setFormState(prev => ({ ...prev, documents: [...(prev.documents || []), ...newDocuments]}));
    };

     const removeDocument = (docToRemove: Document) => {
        setFormState(prev => ({ ...prev, documents: prev.documents?.filter(doc => doc.name !== docToRemove.name)}));
    };
    
    const handleAddAssignment = () => {
        if (!selectedClass || !selectedSubject) {
            alert("Selecione uma turma e uma disciplina.");
            return;
        }
        const newAssignment = { classId: parseInt(selectedClass), subjectId: parseInt(selectedSubject) };

        if (assignments.some(a => a.classId === newAssignment.classId && a.subjectId === newAssignment.subjectId)) {
            alert("Esta atribuição já existe.");
            return;
        }
        setAssignments(prev => [...prev, newAssignment]);
        setSelectedSubject(''); 
    };

    const handleRemoveAssignment = (index: number) => {
        setAssignments(prev => prev.filter((_, i) => i !== index));
    };
    
    // Subjects available for assignment in the selected class
    const availableSubjects = React.useMemo(() => {
        if (!selectedClass) return [];
        const classId = parseInt(selectedClass);
        const assignedSubjectsInClass = classCurriculum
            .filter(cc => cc.classId === classId && cc.teacherId !== teacherId)
            .map(cc => cc.subjectId);
            
        return subjects.filter(s => !assignedSubjectsInClass.includes(s.id));
    }, [selectedClass, classCurriculum, subjects, teacherId]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        const emailExists = teachers.some(
            teacher =>
                teacher.email.toLowerCase() === formState.email.toLowerCase() &&
                (!id || teacher.id !== parseInt(id))
        );

        if (emailExists) {
            setError('Este email já está a ser utilizado por outro professor.');
            return;
        }

        if (isEditing && teacherId) {
            updateTeacher({ id: teacherId, ...formState });
            updateTeacherAssignments(teacherId, assignments);
        } else {
            // Note: Assignment management is only available when editing
            addTeacher(formState);
        }
        navigate('/professores');
    };

    const title = isEditing ? 'Editar Professor' : 'Cadastrar Novo Professor';
    const subtitle = isEditing ? 'Atualize as informações e atribuições do professor' : 'Preencha os dados para criar um novo registo';
    
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
                    <div className="lg:col-span-2 space-y-8">
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

                        {isEditing && (
                             <Card className="p-6">
                                <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200 border-b-2 border-reviva-green pb-2 mb-6">Atribuição de Disciplinas e Turmas</h3>
                                <div className="space-y-4">
                                    {assignments.length > 0 && (
                                        <ul className="space-y-2">
                                            {assignments.map((ass, index) => (
                                                <li key={index} className="flex justify-between items-center bg-slate-100 dark:bg-slate-700 p-2 rounded">
                                                   <span>
                                                        <span className="font-bold">{subjects.find(s => s.id === ass.subjectId)?.name || 'Disciplina Inválida'}</span>
                                                        <span className="text-slate-500 dark:text-slate-400"> - {classes.find(c => c.id === ass.classId)?.name || 'Turma Inválida'}</span>
                                                   </span>
                                                    <Button type="button" variant="ghost" size="icon" className="text-red-500" onClick={() => handleRemoveAssignment(index)}><TrashIcon className="h-4 w-4"/></Button>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                    <div className="flex flex-col sm:flex-row items-end gap-2 p-3 border-t border-slate-200 dark:border-slate-600">
                                        <Select label="Turma" id="assign-class" value={selectedClass} onChange={e => {setSelectedClass(e.target.value); setSelectedSubject('')}}>
                                            <option value="">Selecione...</option>
                                            {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                        </Select>
                                        <Select label="Disciplina" id="assign-subject" value={selectedSubject} onChange={e => setSelectedSubject(e.target.value)} disabled={!selectedClass}>
                                            <option value="">Selecione...</option>
                                            {availableSubjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                                        </Select>
                                        <Button type="button" onClick={handleAddAssignment} className="w-full sm:w-auto"><PlusIcon className="h-5 w-5 mr-1"/> Adicionar</Button>
                                    </div>
                                </div>
                            </Card>
                        )}

                         <Card className="p-6">
                            <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200 border-b-2 border-reviva-green pb-2 mb-4">Documentos</h3>
                            <FileUpload onFileUpload={handleFileUpload} multiple={true} />
                            {formState.documents && formState.documents.length > 0 && (
                                <ul className="mt-4 space-y-2">
                                    {formState.documents.map(doc => (
                                        <li key={doc.name} className="flex justify-between items-center bg-slate-100 dark:bg-slate-700 p-2 rounded">
                                            <a href={doc.url} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline">{doc.name}</a>
                                            <Button type="button" variant="ghost" size="sm" className="text-red-500" onClick={() => removeDocument(doc)}>Remover</Button>
                                        </li>
                                    ))}
                                </ul>
                            )}
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
                
                {error && <p className="text-center text-red-500 mt-4">{error}</p>}
                
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