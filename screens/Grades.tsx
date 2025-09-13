
import React, { useState, useMemo, useEffect } from 'react';
import PageHeader from '../components/Header';
import { CLASSES_DATA, SUBJECTS_DATA, STUDENTS_DATA, GRADES_DATA, CLASS_CURRICULUM_DATA } from '../constants';
import { StudentGrades, GradeRecord } from '../types';
import { DocumentDuplicateIcon } from '@heroicons/react/24/outline';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

const Grades: React.FC = () => {
    const [selectedClassId, setSelectedClassId] = useState<string>(CLASSES_DATA[0]?.id.toString() || '');
    const [selectedSubjectId, setSelectedSubjectId] = useState<string>('');
    const [gradesData, setGradesData] = useState<StudentGrades[]>(GRADES_DATA);

    const studentsInClass = useMemo(() => {
        if (!selectedClassId) return [];
        return STUDENTS_DATA.filter(student => student.classId === parseInt(selectedClassId));
    }, [selectedClassId]);

    const subjectsForClass = useMemo(() => {
        if (!selectedClassId) return [];
        const curriculumForClass = CLASS_CURRICULUM_DATA.filter(c => c.classId === parseInt(selectedClassId));
        return SUBJECTS_DATA.filter(subject =>
            curriculumForClass.some(c => c.subjectId === subject.id)
        );
    }, [selectedClassId]);

    useEffect(() => {
        // Auto-select first subject when class changes or when subjects load for the first time
        if (subjectsForClass.length > 0) {
            // Check if the current selection is valid, if not, update it
            if (!subjectsForClass.some(s => s.id.toString() === selectedSubjectId)) {
                setSelectedSubjectId(subjectsForClass[0].id.toString());
            }
        } else {
            setSelectedSubjectId('');
        }
    }, [selectedClassId, subjectsForClass, selectedSubjectId]);

    const calculateAverage = (gradeRecord: GradeRecord | undefined): string => {
        if (!gradeRecord) return 'N/A';
        const notes = [gradeRecord.nota1, gradeRecord.nota2, gradeRecord.finalExam];
        const validNotes = notes.map(n => parseFloat(String(n))).filter(n => !isNaN(n) && n >= 0 && n <= 20);
        
        if (validNotes.length === 0) return '0.00';
        
        const sum = validNotes.reduce((acc, curr) => acc + curr, 0);
        const average = sum / validNotes.length;
        return average.toFixed(2);
    };

    const handleGradeChange = (studentId: number, field: keyof GradeRecord, value: string) => {
        if (!selectedSubjectId) return;
        const numericValue = value === '' ? '' : Math.max(0, Math.min(20, parseFloat(value) || 0));

        setGradesData(prevData => {
            const newData = [...prevData];
            let studentGrades = newData.find(sg => sg.studentId === studentId);

            if (!studentGrades) {
                studentGrades = { studentId, gradesBySubject: {} };
                newData.push(studentGrades);
            }
            
            if (!studentGrades.gradesBySubject[parseInt(selectedSubjectId)]) {
                 studentGrades.gradesBySubject[parseInt(selectedSubjectId)] = { nota1: '', nota2: '', finalExam: '' };
            }

            studentGrades.gradesBySubject[parseInt(selectedSubjectId)][field] = numericValue;
            
            return newData;
        });
    };
    
    return (
        <>
            <PageHeader title="Lançamento de Notas" subtitle="Insira as notas dos alunos por turma e disciplina" />

            <Card className="mb-6">
                <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="class-select" className="block text-sm font-medium text-gray-700 mb-1">Turma</label>
                        <select
                            id="class-select"
                            value={selectedClassId}
                            onChange={(e) => setSelectedClassId(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-reviva-green-light focus:border-reviva-green-light bg-white"
                        >
                            {CLASSES_DATA.map(cls => (
                                <option key={cls.id} value={cls.id}>{cls.name}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="subject-select" className="block text-sm font-medium text-gray-700 mb-1">Disciplina</label>
                        <select
                            id="subject-select"
                            value={selectedSubjectId}
                            onChange={(e) => setSelectedSubjectId(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-reviva-green-light focus:border-reviva-green-light bg-white"
                            disabled={subjectsForClass.length === 0}
                        >
                            {subjectsForClass.length > 0 ? (
                                subjectsForClass.map(sub => (
                                    <option key={sub.id} value={sub.id}>{sub.name}</option>
                                ))
                            ) : (
                                <option>Nenhuma disciplina para esta turma</option>
                            )}
                        </select>
                    </div>
                </div>
            </Card>

            <Card>
                <div className="overflow-x-auto">
                    <table className="min-w-full w-full text-sm text-left text-gray-500">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 sticky left-0 bg-gray-50 z-10">Nome do Aluno</th>
                                <th scope="col" className="px-3 py-3 text-center">Nota 1</th>
                                <th scope="col" className="px-3 py-3 text-center">Nota 2</th>
                                <th scope="col" className="px-3 py-3 text-center">Exame Final</th>
                                <th scope="col" className="px-6 py-3 text-center font-bold">Média Final</th>
                                <th scope="col" className="px-6 py-3 text-center">Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {studentsInClass.map(student => {
                                const studentGrades = gradesData.find(sg => sg.studentId === student.id);
                                const currentGrades = selectedSubjectId ? studentGrades?.gradesBySubject[parseInt(selectedSubjectId)] : undefined;

                                return (
                                    <tr key={student.id} className="bg-white border-b hover:bg-gray-50">
                                        <td className="px-6 py-2 font-medium text-gray-900 sticky left-0 bg-white z-10">{student.name}</td>
                                        {(['nota1', 'nota2', 'finalExam'] as (keyof GradeRecord)[]).map(field => (
                                            <td key={field} className="px-2 py-1">
                                                <input
                                                    type="number"
                                                    min="0"
                                                    max="20"
                                                    step="0.1"
                                                    placeholder="-"
                                                    value={currentGrades?.[field] ?? ''}
                                                    onChange={(e) => handleGradeChange(student.id, field, e.target.value)}
                                                    className="w-24 text-center p-1 border border-gray-300 rounded-md focus:ring-reviva-green-light focus:border-reviva-green-light"
                                                    disabled={!selectedSubjectId}
                                                />
                                            </td>
                                        ))}
                                        <td className="px-6 py-2 text-center font-bold text-lg text-reviva-green">
                                            {calculateAverage(currentGrades)}
                                        </td>
                                        <td className="px-6 py-2 text-center">
                                            <Button variant="link" className="text-reviva-green hover:text-reviva-green-dark mx-auto">
                                                <DocumentDuplicateIcon className="h-4 w-4 mr-1"/> Boletim
                                            </Button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                     {studentsInClass.length > 0 && !selectedSubjectId && (
                        <div className="p-8 text-center text-gray-500">
                            Por favor, selecione uma disciplina para começar a lançar as notas.
                        </div>
                    )}
                </div>
            </Card>
        </>
    );
};

export default Grades;