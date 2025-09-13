import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PageHeader from '../components/Header';
import { ArrowLeftIcon, TrashIcon, PlusIcon } from '@heroicons/react/24/outline';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { ClassCurriculum } from '../types';
import { CLASSES_DATA, SUBJECTS_DATA, TEACHERS_DATA, CLASS_CURRICULUM_DATA } from '../constants';

const ClassDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const classId = parseInt(id || '0');

    const classInfo = useMemo(() => CLASSES_DATA.find(c => c.id === classId), [classId]);

    const [curriculum, setCurriculum] = useState<ClassCurriculum[]>(
        CLASS_CURRICULUM_DATA.filter(c => c.classId === classId)
    );
    const [selectedSubject, setSelectedSubject] = useState('');
    const [selectedTeacher, setSelectedTeacher] = useState('');

    const handleAdd = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedSubject || !selectedTeacher) {
            alert('Por favor, selecione uma disciplina e um professor.');
            return;
        }

        const newEntry: ClassCurriculum = {
            classId,
            subjectId: parseInt(selectedSubject),
            teacherId: parseInt(selectedTeacher),
        };

        // Prevent adding duplicates
        if (curriculum.some(item => item.subjectId === newEntry.subjectId)) {
            alert('Esta disciplina já foi adicionada a esta turma.');
            return;
        }

        setCurriculum([...curriculum, newEntry]);
        // Reset form
        setSelectedSubject('');
        setSelectedTeacher('');
    };

    const handleRemove = (subjectIdToRemove: number) => {
        if (window.confirm('Tem a certeza que deseja remover esta disciplina do plano da turma?')) {
            setCurriculum(curriculum.filter(item => item.subjectId !== subjectIdToRemove));
        }
    };

    const availableSubjects = useMemo(() => {
        const assignedSubjectIds = curriculum.map(c => c.subjectId);
        return SUBJECTS_DATA.filter(s => !assignedSubjectIds.includes(s.id));
    }, [curriculum]);

    if (!classInfo) {
        return <div>Turma não encontrada.</div>;
    }

    const curriculumDetails = curriculum.map(item => {
        const subject = SUBJECTS_DATA.find(s => s.id === item.subjectId);
        const teacher = TEACHERS_DATA.find(t => t.id === item.teacherId);
        return { ...item, subjectName: subject?.name, teacherName: teacher?.name };
    });

    return (
        <>
            <div className="flex items-center mb-4">
                <Button variant="ghost" size="icon" onClick={() => navigate('/turmas')} className="mr-2">
                    <ArrowLeftIcon className="h-6 w-6" />
                </Button>
                <PageHeader title={`Gerir Plano da Turma: ${classInfo.name}`} subtitle="Associe disciplinas e professores a esta turma" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    <Card>
                         <div className="p-4 border-b dark:border-slate-700">
                            <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-200">Plano Curricular Atual</h3>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left text-slate-500 dark:text-slate-400">
                                <thead className="text-xs text-slate-600 dark:text-slate-400 uppercase bg-slate-50 dark:bg-slate-700/50">
                                    <tr>
                                        <th className="px-6 py-3">Disciplina</th>
                                        <th className="px-6 py-3">Professor Atribuído</th>
                                        <th className="px-6 py-3">Ações</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {curriculumDetails.map(item => (
                                        <tr key={item.subjectId} className="bg-white dark:bg-slate-800 border-b dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50">
                                            <td className="px-6 py-4 font-medium text-gray-900 dark:text-slate-100">{item.subjectName || 'Desconhecido'}</td>
                                            <td className="px-6 py-4">{item.teacherName || 'Não atribuído'}</td>
                                            <td className="px-6 py-4">
                                                <Button variant="ghost" size="icon" onClick={() => handleRemove(item.subjectId)} className="text-red-500 hover:text-red-700">
                                                    <TrashIcon className="h-5 w-5" />
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                     {curriculumDetails.length === 0 && (
                                        <tr>
                                            <td colSpan={3} className="text-center py-8 text-slate-500 dark:text-slate-400">Nenhuma disciplina adicionada.</td>
                                        </tr>
                                     )}
                                </tbody>
                            </table>
                        </div>
                    </Card>
                </div>

                <div>
                    <Card>
                        <form onSubmit={handleAdd}>
                            <div className="p-4 border-b dark:border-slate-700">
                                <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-200">Adicionar Disciplina</h3>
                            </div>
                            <div className="p-6 space-y-4">
                                <div>
                                    <label htmlFor="subject" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Disciplina</label>
                                    <select id="subject" value={selectedSubject} onChange={e => setSelectedSubject(e.target.value)} className="w-full p-2 border border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100 rounded-lg bg-white" required>
                                        <option value="">Selecione...</option>
                                        {availableSubjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label htmlFor="teacher" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Professor</label>
                                    <select id="teacher" value={selectedTeacher} onChange={e => setSelectedTeacher(e.target.value)} className="w-full p-2 border border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100 rounded-lg bg-white" required>
                                        <option value="">Selecione...</option>
                                        {TEACHERS_DATA.filter(t => t.status === 'Ativo').map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                                    </select>
                                </div>
                            </div>
                            <div className="p-4 border-t dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-right">
                                <Button type="submit">
                                    <PlusIcon className="h-5 w-5 mr-2" />
                                    Adicionar ao Plano
                                </Button>
                            </div>
                        </form>
                    </Card>
                </div>
            </div>
        </>
    );
};

export default ClassDetails;