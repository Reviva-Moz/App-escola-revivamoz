
import React, { useState, useMemo, useEffect } from 'react';
import PageHeader from '../components/Header';
import { CLASSES_DATA, STUDENTS_DATA, SUBJECTS_DATA, CLASS_CURRICULUM_DATA } from '../constants';
import { Student } from '../types';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

type AttendanceStatus = 'Presente' | 'Ausente' | 'Justificado';

const Attendance: React.FC = () => {
  const today = new Date().toISOString().split('T')[0];
  const [selectedClassId, setSelectedClassId] = useState<string>(CLASSES_DATA[0]?.id.toString() || '');
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<string>(today);
  const [attendance, setAttendance] = useState<{ [studentId: number]: AttendanceStatus }>({});

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
    // Auto-select first subject when class changes
    if (subjectsForClass.length > 0) {
      if (!subjectsForClass.some(s => s.id.toString() === selectedSubjectId)) {
        setSelectedSubjectId(subjectsForClass[0].id.toString());
      }
    } else {
      setSelectedSubjectId('');
    }
  }, [selectedClassId, subjectsForClass, selectedSubjectId]);

  useEffect(() => {
    // Reset and initialize attendance when class, subject or date changes
    const initialAttendance: { [studentId: number]: AttendanceStatus } = {};
    studentsInClass.forEach(student => {
      initialAttendance[student.id] = 'Presente';
    });
    setAttendance(initialAttendance);
  }, [studentsInClass, selectedDate, selectedSubjectId]);

  const handleStatusChange = (studentId: number, status: AttendanceStatus) => {
    setAttendance(prev => ({
      ...prev,
      [studentId]: status,
    }));
  };
  
  const handleSave = () => {
    if (!selectedSubjectId) {
        alert('Por favor, selecione uma disciplina.');
        return;
    }
    console.log('Saving attendance for', selectedDate, 'in class', selectedClassId, 'subject', selectedSubjectId, ':', attendance);
    alert('Presença salva com sucesso!');
  }

  return (
    <>
      <PageHeader title="Registro de Assiduidade" subtitle="Marque a presença dos alunos para a data e turma selecionada" />

      <Card className="mb-6">
        <div className="p-4 grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
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
          <div>
            <label htmlFor="date-select" className="block text-sm font-medium text-gray-700 mb-1">Data</label>
            <input
              type="date"
              id="date-select"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-reviva-green-light focus:border-reviva-green-light"
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
            <table className="w-full text-sm text-left text-gray-500">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                    <tr>
                        <th scope="col" className="px-6 py-3">Nome do Aluno</th>
                        <th scope="col" className="px-6 py-3 text-center">Status</th>
                    </tr>
                </thead>
                <tbody>
                    {studentsInClass.length > 0 ? studentsInClass.map((student: Student) => (
                      <tr key={student.id} className="bg-white border-b hover:bg-gray-50">
                          <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">{student.name}</td>
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
                        <td colSpan={2} className="text-center py-8 text-gray-500">Selecione uma turma para ver os alunos.</td>
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