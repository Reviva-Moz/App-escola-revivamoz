



import React, { useState, useMemo, useEffect } from 'react';
import PageHeader from '@/components/Header';
import { Student, AttendanceRecord } from '@/types';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useCoreData } from '@/context/CoreDataContext';
import { useAcademicData } from '@/context/AcademicContext';
import { useAuth } from '@/context/AuthContext';

type AttendanceStatus = 'Presente' | 'Ausente' | 'Justificado';

const Attendance: React.FC = () => {
  const { user } = useAuth();
  const { classes, students, subjects, classCurriculum, teachers } = useCoreData();
  const { saveAttendance } = useAcademicData();

  const today = new Date().toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState<string>(today);
  const [attendance, setAttendance] = useState<{ [studentId: number]: AttendanceStatus }>({});

  const loggedInTeacher = useMemo(() => {
    if (user?.role !== 'PROFESSOR') return null;
    return teachers.find(t => t.email.toLowerCase() === user.email.toLowerCase());
  }, [user, teachers]);

  const teacherCurriculum = useMemo(() => {
    if (!loggedInTeacher) return [];
    return classCurriculum.filter(cc => cc.teacherId === loggedInTeacher.id);
  }, [loggedInTeacher, classCurriculum]);

  const classesToDisplay = useMemo(() => {
    if (loggedInTeacher) {
      const teacherClassIds = new Set(teacherCurriculum.map(cc => cc.classId));
      return classes.filter(c => teacherClassIds.has(c.id));
    }
    return classes;
  }, [loggedInTeacher, teacherCurriculum, classes]);

  const [selectedClassId, setSelectedClassId] = useState<string>(classesToDisplay[0]?.id.toString() || '');

  const subjectsForClass = useMemo(() => {
    if (!selectedClassId) return [];
    if (loggedInTeacher) {
        const teacherSubjectIds = teacherCurriculum
            .filter(cc => cc.classId === parseInt(selectedClassId))
            .map(cc => cc.subjectId);
        return subjects.filter(subject => teacherSubjectIds.includes(subject.id));
    }
    const curriculumForClass = classCurriculum.filter(c => c.classId === parseInt(selectedClassId));
    return subjects.filter(subject =>
      curriculumForClass.some(c => c.subjectId === subject.id)
    );
  }, [selectedClassId, classCurriculum, subjects, loggedInTeacher, teacherCurriculum]);
  
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>('');
  
  const studentsInClass = useMemo(() => {
    if (!selectedClassId) return [];
    return students.filter(student => student.classId === parseInt(selectedClassId));
  }, [selectedClassId, students]);

  useEffect(() => {
    if (classesToDisplay.length > 0 && !selectedClassId) {
        setSelectedClassId(classesToDisplay[0].id.toString());
    }
  }, [classesToDisplay, selectedClassId]);

  useEffect(() => {
    if (subjectsForClass.length > 0 && !subjectsForClass.some(s => s.id.toString() === selectedSubjectId)) {
        setSelectedSubjectId(subjectsForClass[0].id.toString());
    } else if (subjectsForClass.length === 0) {
        setSelectedSubjectId('');
    }
  }, [selectedClassId, subjectsForClass, selectedSubjectId]);

  useEffect(() => {
    const initialAttendance: { [studentId: number]: AttendanceStatus } = {};
    studentsInClass.forEach(student => {
      initialAttendance[student.id] = 'Presente';
    });
    setAttendance(initialAttendance);
  }, [studentsInClass, selectedDate, selectedSubjectId]);

  const handleStatusChange = (studentId: number, status: AttendanceStatus) => {
    setAttendance(prev => ({ ...prev, [studentId]: status }));
  };
  
  const handleSave = () => {
    if (!selectedSubjectId) {
        alert('Por favor, selecione uma disciplina.');
        return;
    }
    
    const recordsToSave = Object.entries(attendance).map(([studentId, status]) => ({
        studentId: parseInt(studentId),
        date: selectedDate,
        status: status,
        subjectId: parseInt(selectedSubjectId)
    }));

    saveAttendance(recordsToSave);
    alert('Presença salva com sucesso!');
  }

  return (
    <>
      <PageHeader title="Registro de Assiduidade" subtitle="Marque a presença dos alunos para a data e turma selecionada" />

      <Card className="mb-6">
        <div className="p-4 grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <div>
            <label htmlFor="class-select" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Turma</label>
            <select
              id="class-select"
              value={selectedClassId}
              onChange={(e) => setSelectedClassId(e.target.value)}
              className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-reviva-green-light focus:border-reviva-green-light bg-white dark:bg-slate-700 dark:text-slate-100"
            >
              {classesToDisplay.map(cls => (
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
          <div>
            <label htmlFor="date-select" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Data</label>
            <input
              type="date"
              id="date-select"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-reviva-green-light focus:border-reviva-green-light dark:bg-slate-700 dark:text-slate-100"
            />
          </div>
          <Button
            onClick={handleSave}
            className="w-full"
          >
            Salvar Presença
          </Button>
        </div>
      </Card>

      <Card>
        <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-slate-500 dark:text-slate-400">
                <thead className="text-xs text-slate-600 dark:text-slate-400 uppercase bg-slate-50 dark:bg-slate-700/50">
                    <tr>
                        <th scope="col" className="px-6 py-3">Nome do Aluno</th>
                        <th scope="col" className="px-6 py-3 text-center">Status</th>
                    </tr>
                </thead>
                <tbody>
                    {studentsInClass.length > 0 ? studentsInClass.map((student: Student) => (
                      <tr key={student.id} className="bg-white dark:bg-slate-800 border-b dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50">
                          <td className="px-6 py-4 font-medium text-gray-900 dark:text-slate-100 whitespace-nowrap">{student.name}</td>
                          <td className="px-6 py-4">
                              <div className="flex flex-col sm:flex-row sm:justify-center sm:space-x-4 space-y-2 sm:space-y-0">
                                  {(['Presente', 'Ausente', 'Justificado'] as AttendanceStatus[]).map(status => (
                                      <label key={status} className="flex items-center space-x-2 cursor-pointer">
                                          <input
                                              type="radio"
                                              name={`attendance-${student.id}`}
                                              value={status}
                                              checked={attendance[student.id] === status}
                                              onChange={() => handleStatusChange(student.id, status)}
                                              className="form-radio h-4 w-4 text-reviva-green focus:ring-reviva-green-light"
                                          />
                                          <span>{status}</span>
                                      </label>
                                  ))}
                              </div>
                          </td>
                      </tr>
                    )) : (
                      <tr>
                        <td colSpan={2} className="text-center py-8 text-slate-500 dark:text-slate-400">Selecione uma turma para ver os alunos.</td>
                      </tr>
                    )}
                </tbody>
            </table>
        </div>
    </Card>
    </>
  );
};

export default Attendance;
