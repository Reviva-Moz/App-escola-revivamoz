import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PageHeader from '../components/Header';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Select } from '../components/ui/Select';
import { supabase } from '../utils/supabase';
import { Class } from '../types';
import { CLASSES_DATA, STUDENTS_DATA } from '../constants';
import WebcamCapture from '../components/WebcamCapture';

const StudentForm: React.FC = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditing = Boolean(id);
    
    // Form state
    const [name, setName] = useState('');
    const [classId, setClassId] = useState('');
    const [age, setAge] = useState('');
    const [guardian, setGuardian] = useState('');
    const [phone, setPhone] = useState('');
    const [status, setStatus] = useState('Ativo');
    const [nuit, setNuit] = useState('');
    const [healthNotes, setHealthNotes] = useState('');
    const [photoDataUrl, setPhotoDataUrl] = useState<string | null>(null);

    const [classes, setClasses] = useState<Pick<Class, 'id' | 'name'>[]>([]);
    const [loading, setLoading] = useState(true);
    const [formError, setFormError] = useState<string | null>(null);

    useEffect(() => {
        // Fetch classes for the dropdown
        const fetchClasses = async () => {
            if (supabase) {
                const { data, error } = await supabase.from('classes').select('id, name');
                if (error) {
                    console.error("Error fetching classes", error);
                    setClasses(CLASSES_DATA); // Fallback on error
                } else {
                    setClasses(data as any);
                }
            } else {
                setClasses(CLASSES_DATA); // Fallback if supabase is not configured
            }
        };

        const fetchStudentData = async () => {
            if (isEditing && id) {
                setLoading(true);
                if (supabase) {
                    const { data, error } = await supabase
                        .from('students')
                        .select('*')
                        .eq('id', id)
                        .single();

                    if (error) {
                        console.error('Error fetching student data:', error);
                        setFormError("Não foi possível carregar os dados do aluno.");
                    } else if (data) {
                        setName(data.name);
                        setClassId(data.class_id?.toString() || '');
                        setAge(data.age?.toString() || '');
                        setGuardian(data.guardian || '');
                        setPhone(data.phone || '');
                        setStatus(data.status || 'Ativo');
                        setNuit(data.nuit || '');
                        setHealthNotes(data.health_notes || '');
                        setPhotoDataUrl(data.photo_url || null);
                    }
                } else {
                    // Fallback for student data
                    const mockStudent = STUDENTS_DATA.find(s => s.id === parseInt(id));
                    if (mockStudent) {
                         setName(mockStudent.name);
                         setClassId(mockStudent.classId.toString());
                         setAge(mockStudent.age.toString());
                         setGuardian(mockStudent.guardian);
                         setPhone(mockStudent.phone);
                         setStatus(mockStudent.status);
                         setNuit(mockStudent.nuit || '');
                         setHealthNotes(mockStudent.healthNotes || '');
                         setPhotoDataUrl(mockStudent.photoUrl || null);
                    }
                }
                setLoading(false);
            } else {
                setLoading(false);
            }
        };

        fetchClasses();
        fetchStudentData();

    }, [id, isEditing]);

    const title = isEditing ? 'Editar Aluno' : 'Cadastrar Novo Aluno';
    const subtitle = isEditing ? 'Atualize as informações do aluno' : 'Preencha os dados para criar um novo registo';

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormError(null);

        if (!name || !classId) {
            setFormError("Nome e Turma são campos obrigatórios.");
            return;
        }

        if (supabase) {
            const studentData = {
                name,
                class_id: parseInt(classId),
                age: age ? parseInt(age) : null,
                guardian,
                phone,
                status,
                nuit: nuit || null,
                health_notes: healthNotes || null,
                // In a real app, you would upload the photoDataUrl to Supabase Storage
                // and save the returned URL here. For now, we save a placeholder.
                photo_url: photoDataUrl ? (isEditing && id && photoDataUrl.startsWith('http') ? photoDataUrl : `photos/student_${id || Date.now()}.jpg`) : null,
            };

            if (photoDataUrl && !photoDataUrl.startsWith('http')) {
              console.log("Simulando upload da foto para o Supabase Storage...");
              // Here you would implement the actual upload logic.
            }

            const { error } = isEditing
                ? await supabase.from('students').update(studentData).eq('id', id)
                : await supabase.from('students').insert([studentData]);

            if (error) {
                console.error('Error saving student:', error);
                setFormError(`Erro ao salvar: ${error.message}`);
            } else {
                navigate('/alunos');
            }
        } else {
            console.warn("Supabase not configured. Simulating save.");
            console.log("Submitted Data:", { name, classId, age, guardian, phone, status, nuit, healthNotes, photoDataUrl });
            navigate('/alunos');
        }
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
                                <Input label="Nome Completo" id="fullName" required value={name} onChange={e => setName(e.target.value)} />
                                <Input label="Idade" id="age" type="number" value={age} onChange={e => setAge(e.target.value)} />
                                <Select label="Turma Atual" id="class" required value={classId} onChange={e => setClassId(e.target.value)}>
                                <option value="">Selecione a turma</option>
                                {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                </Select>
                                 <Select label="Status" id="status" required value={status} onChange={e => setStatus(e.target.value)}>
                                    <option value="Ativo">Ativo</option>
                                    <option value="Inativo">Inativo</option>
                                </Select>
                                <h3 className="md:col-span-2 text-xl font-semibold text-slate-800 dark:text-slate-200 border-b-2 border-reviva-green pb-2 pt-4">Dados do Encarregado e Adicionais</h3>
                                <Input label="Nome do Encarregado" id="guardianName" required value={guardian} onChange={e => setGuardian(e.target.value)} />
                                <Input label="Contacto Telefónico" id="guardianPhone" type="tel" required value={phone} onChange={e => setPhone(e.target.value)} />
                                <Input label="NUIT" id="nuit" type="text" value={nuit} onChange={e => setNuit(e.target.value)} placeholder="Opcional"/>
                                <div className="md:col-span-2">
                                    <label htmlFor="healthNotes" className="mb-1 block text-sm font-medium text-slate-600 dark:text-slate-300">Ficha de Saúde Básica (Alergias, etc.)</label>
                                    <textarea id="healthNotes" rows={4} value={healthNotes} onChange={e => setHealthNotes(e.target.value)} className="w-full p-2 border border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100 rounded-lg"></textarea>
                                </div>
                            </div>
                        </Card>
                    </div>
                    <div>
                         <Card className="p-6">
                            <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200 border-b-2 border-reviva-green pb-2 mb-4">Fotografia do Aluno</h3>
                            <WebcamCapture
                                onCapture={setPhotoDataUrl}
                                initialImage={photoDataUrl}
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