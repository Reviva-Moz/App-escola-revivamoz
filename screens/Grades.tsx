import React, { useState, useMemo, useEffect, FC } from 'react';
import PageHeader from '../components/Header';
import { CLASSES_DATA, SUBJECTS_DATA, STUDENTS_DATA, GRADES_DATA, CLASS_CURRICULUM_DATA, CLASS_CURRICULUM_DATA as CLASS_CURRICULUM_DATA_1 } from '../constants';
import { StudentGrades, GradeRecord, Student, Subject } from '../types';
import { DocumentDuplicateIcon } from '@heroicons/react/24/outline';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { PencilSquareIcon } from '../components/icons';

const calculateAverage = (gradeRecord: GradeRecord | undefined): string => {
    if (!gradeRecord) return '-';
    const notes = [gradeRecord.nota1, gradeRecord.nota2, gradeRecord.finalExam];
    const validNotes = notes.map(n => parseFloat(String(n))).filter(n => !isNaN(n) && n >= 0 && n <= 20);
    
    if (validNotes.length === 0) return '-';
    
    const sum = validNotes.reduce((acc, curr) => acc + curr, 0);
    const average = sum / validNotes.length;
    return average.toFixed(2);
};

const BoletimModal: FC<{ 
    student: Student; 
    gradesData: StudentGrades[];
    onClose: () => void;
}> = ({ student, gradesData, onClose }) => {
    const studentGrades = gradesData.find(sg => sg.studentId === student.id);
    const subjectsForClass = CLASS_CURRICULUM_DATA_1
        .filter(c => c.classId === student.classId)
        .map(c => SUBJECTS_DATA.find(s => s.id === c.subjectId))
        .filter((s): s is Subject => s !== undefined);

    return (
        <Modal isOpen={true} onClose={onClose} title={`Boletim - ${student.name}`}>
            <div className="space-y-4">
                <p className="text-center text-slate-600 dark:text-slate-300">Resumo de notas para a turma <strong>{student.class}</strong>.</p>
                <div className="overflow-x-auto border rounded-lg dark:border-slate-700">
                    <table className="w-full text-sm">
                        <thead className="text-left bg-slate-50 dark:bg-slate-700/50 text-slate-600 dark:text-slate-400">
                            <tr>
                                <th className="p-3">Disciplina</th>
                                <th className="p-3 text-center">Nota 1</th>
                                <th className="p-3 text-center">Nota 2</th>
                                <th className="p-3 text-center">Exame</th>
                                <th className="p-3 text-center font-bold">Média</th>
                            </tr>
                        </thead>
                        <tbody>
                            {subjectsForClass.map(subject => {
                                const grades = studentGrades?.gradesBySubject[subject.id];
                                const average = calculateAverage(grades);
                                const avgNum = parseFloat(average);
                                const averageColor = isNaN(avgNum) ? '' : avgNum >= 10 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400';

                                return (
                                    <tr key={subject.id} className="border-t border-slate-200 dark:border-slate-700">
                                        <td className="p-3 font-medium text-slate-800 dark:text-slate-200">{subject.name}</td>
                                        <td className="p-3 text-center">{grades?.nota1 || '-'}</td>
                                        <td className="p-3 text-center">{grades?.nota2 || '-'}</td>
                                        <td className="p-3 text-center">{grades?.finalExam || '-'}</td>
                                        <td className={`p-3 text-center font-bold text-lg ${averageColor}`}>{average}</td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
                 <div className="mt-8 pt-4 border-t-2 border-dashed dark:border-slate-600 text-center">
                    <PencilSquareIcon className="h-8 w-8 mx-auto text-slate-400 mb-2" />
                    <p className="text-sm font-semibold">Assinado Digitalmente por:</p>
                    <p className="font-serif text-lg text-reviva-green dark:text-reviva-green-light">Luísa Santos</p>
                    <p className="text-xs text-slate-500">Coordenadora Pedagógica</p>
                    <p className="text-xs text-slate-400 mt-1">{new Date().toLocaleString('pt-MZ')}</p>
                </div>
                <div className="flex justify-end pt-4">
                    <Button onClick={onClose}>Fechar</Button>
                </div>
            </div>
        </Modal>
    );
};

const Grades: React.FC = () => {
    const [selectedClassId, setSelectedClassId] = useState<string>(CLASSES_DATA[0]?.id.toString() || '');
    const [selectedSubjectId, setSelectedSubjectId] = useState<string>('');
    const [gradesData, setGradesData] = useState<StudentGrades[]>(GRADES_DATA);
    const [isBoletimModalOpen, setBoletimModalOpen] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

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
        if (subjectsForClass.length > 0) {
            if (!subjectsForClass.some(s => s.id.toString() === selectedSubjectId)) {
                setSelectedSubjectId(subjectsForClass[0].id.toString());
            }
        } else {
            setSelectedSubjectId('');
        }
    }, [selectedClassId, subjectsForClass, selectedSubjectId]);

    const handleGradeChange = (studentId: number, field: keyof GradeRecord, value: string) => {
        if (!selectedSubjectId) return;

        setGradesData(prevData => {
            const newData = [...prevData];
            let studentGrades = newData.find(sg => sg.studentId === studentId);

            if (!studentGrades) {
                studentGrades = { studentId, gradesBySubject: {} };
                newData.push(studentGrades);
            }
            
            if (!studentGrades.gradesBySubject[parseInt(selectedSubjectId)]) {
                 studentGrades.gradesBySubject[parseInt(selectedSubjectId)] = { nota1: '', nota2: '', finalExam: '', observations: '' };
            }

            const subjectGrades = studentGrades.gradesBySubject[parseInt(selectedSubjectId)];
            
            if (field === 'observations') {
                subjectGrades[field] = value;
            } else {
                const processedValue = value === '' ? '' : Math.max(0, Math.min(20, parseFloat(value) || 0));
                subjectGrades[field] = processedValue as (number | string); // Ensure type correctness
            }
            
            return newData;
        });
    };
    
    const handleOpenBoletim = (studentId: number) => {
        const student = STUDENTS_DATA.find(s => s.id === studentId);
        if (student) {
            setSelectedStudent(student);
            setBoletimModalOpen(true);
        }
    };
    
    return (
        <>
            <PageHeader title="Lançamento de Notas" subtitle="Insira as notas dos alunos por turma e disciplina" />

            <Card className="mb-6">
                <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="class-select" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Turma</label>
                        <select
                            id="class-select"
                            value={selectedClassId}
                            onChange={(e) => setSelectedClassId(e.target.value)}
                            className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-reviva-green-light focus:border-reviva-green-light bg-white dark:bg-slate-700 dark:text-slate-100"
                        >
                            {CLASSES_DATA.map(cls => (
                                <option key={cls.id} value={cls.id}>{cls.name}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="subject-select" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Disciplina</label>
                        <select
                            id="subject-select"
                            value={selectedSubjectId}
                            onChange={(e) => setSelectedSubjectId(e.target.value)}
                            className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-reviva-green-light focus:border-reviva-green-light bg-white dark:bg-slate-700 dark:text-slate-100"
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
                    <table className="min-w-full w-full text-sm text-left text-slate-500 dark:text-slate-400">
                        <thead className="text-xs text-slate-600 dark:text-slate-400 uppercase bg-slate-50 dark:bg-slate-700/50">
                            <tr>
                                <th scope="col" className="px-6 py-3 sticky left-0 bg-slate-50 dark:bg-slate-700/50 z-10 w-1/4">Nome do Aluno</th>
                                <th scope="col" className="px-3 py-3 text-center">Nota 1</th>
                                <th scope="col" className="px-3 py-3 text-center">Nota 2</th>
                                <th scope="col" className="px-3 py-3 text-center">Exame Final</th>
                                <th scope="col" className="px-6 py-3 text-center font-bold">Média Final</th>
                                <th scope="col" className="px-6 py-3 w-1/3">Observações Qualitativas</th>
                                <th scope="col" className="px-6 py-3 text-center">Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {studentsInClass.map(student => {
                                const studentGrades = gradesData.find(sg => sg.studentId === student.id);
                                const currentGrades = selectedSubjectId ? studentGrades?.gradesBySubject[parseInt(selectedSubjectId)] : undefined;
                                const average = calculateAverage(currentGrades);

                                return (
                                    <tr key={student.id} className="bg-white dark:bg-slate-800 border-b dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50">
                                        <td className="px-6 py-2 font-medium text-gray-900 dark:text-slate-100 sticky left-0 bg-white dark:bg-slate-800 z-10">{student.name}</td>
                                        {(['nota1', 'nota2', 'finalExam'] as (keyof Omit<GradeRecord, 'observations'>)[]).map(field => (
                                            <td key={field} className="px-2 py-1">
                                                <input
                                                    type="number"
                                                    min="0"
                                                    max="20"
                                                    step="0.1"
                                                    placeholder="-"
                                                    value={currentGrades?.[field] ?? ''}
                                                    onChange={(e) => handleGradeChange(student.id, field, e.target.value)}
                                                    className="w-24 text-center p-1 border border-slate-300 dark:border-slate-600 rounded-md focus:ring-reviva-green-light focus:border-reviva-green-light bg-white dark:bg-slate-700 dark:text-slate-100"
                                                    disabled={!selectedSubjectId}
                                                />
                                            </td>
                                        ))}
                                        <td className="px-6 py-2 text-center font-bold text-lg text-reviva-green">
                                            {average}
                                        </td>
                                        <td className="px-2 py-1">
                                            <input
                                                type="text"
                                                placeholder="Adicionar observação..."
                                                value={currentGrades?.observations ?? ''}
                                                onChange={(e) => handleGradeChange(student.id, 'observations', e.target.value)}
                                                className="w-full text-left p-1 border border-slate-300 dark:border-slate-600 rounded-md focus:ring-reviva-green-light focus:border-reviva-green-light bg-white dark:bg-slate-700 dark:text-slate-100"
                                                disabled={!selectedSubjectId}
                                            />
                                        </td>
                                        <td className="px-6 py-2 text-center">
                                            <Button variant="link" className="text-reviva-green hover:text-reviva-green-dark mx-auto" onClick={() => handleOpenBoletim(student.id)}>
                                                <DocumentDuplicateIcon className="h-4 w-4 mr-1"/> Boletim
                                            </Button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                     {studentsInClass.length > 0 && !selectedSubjectId && (
                        <div className="p-8 text-center text-slate-500 dark:text-slate-400">
                            Por favor, selecione uma disciplina para começar a lançar as notas.
                        </div>
                    )}
                </div>
            </Card>

            {isBoletimModalOpen && selectedStudent && (
                <BoletimModal
                    student={selectedStudent}
                    gradesData={gradesData}
                    onClose={() => setBoletimModalOpen(false)}
                />
            )}
        </>
    );
};

export default Grades;