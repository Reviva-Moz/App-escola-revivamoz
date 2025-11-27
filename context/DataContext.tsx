import React, { createContext, useState, useContext, ReactNode, useMemo, useEffect } from 'react';
import { 
    Student, Teacher, Staff, Subject, Class, ClassCurriculum, StudentScholarship, 
    Activity, CoreDataContextType
} from '@/types';

import {
    STUDENTS_DATA, TEACHERS_DATA, STAFF_DATA, SUBJECTS_DATA, CLASSES_DATA,
    CLASS_CURRICULUM_DATA, STUDENT_SCHOLARSHIPS_DATA, RECENT_ACTIVITIES_DATA
} from '@/constants';
import { saveDataToLocalDB, loadDataFromLocalDB } from '@/utils/db';

const CoreDataContext = createContext<CoreDataContextType | undefined>(undefined);

export const CoreDataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [students, setStudents] = useState<Student[]>(STUDENTS_DATA);
    const [teachers, setTeachers] = useState<Teacher[]>(TEACHERS_DATA);
    const [staff, setStaff] = useState<Staff[]>(STAFF_DATA);
    const [subjects, setSubjects] = useState<Subject[]>(SUBJECTS_DATA);
    const [classes, setClasses] = useState<Class[]>(CLASSES_DATA);
    const [classCurriculum, setClassCurriculum] = useState<ClassCurriculum[]>(CLASS_CURRICULUM_DATA);
    const [studentScholarships, setStudentScholarships] = useState<StudentScholarship[]>(STUDENT_SCHOLARSHIPS_DATA);
    const [activities, setActivities] = useState<Activity[]>(RECENT_ACTIVITIES_DATA);
    const [isLoading, setIsLoading] = useState(false); // Can be adapted for Supabase loading

    const classesWithDetails = useMemo(() => {
        return classes.map(cls => {
            const teacher = teachers.find(t => t.id === cls.teacherId);
            const studentCount = students.filter(s => s.classId === cls.id).length;
            return { ...cls, teacherName: teacher ? teacher.name : 'N/A', studentCount: studentCount };
        });
    }, [classes, teachers, students]);

    // --- CRUD Functions ---
    const addStudent = (student: Omit<Student, 'id' | 'class'>) => setStudents(prev => [...prev, { ...student, id: Date.now(), class: '' }]);
    const updateStudent = (updatedStudent: Omit<Student, 'id' | 'class'> & { id: number }) => setStudents(prev => prev.map(s => s.id === updatedStudent.id ? { ...s, ...updatedStudent } : s));
    const deleteStudent = (id: number) => setStudents(prev => prev.filter(s => s.id !== id));

    const addTeacher = (teacher: Omit<Teacher, 'id'>) => setTeachers(prev => [...prev, { ...teacher, id: Date.now() }]);
    const updateTeacher = (updatedTeacher: Teacher) => setTeachers(prev => prev.map(t => t.id === updatedTeacher.id ? updatedTeacher : t));
    const deleteTeacher = (id: number) => setTeachers(prev => prev.filter(t => t.id !== id));
    
    const addStaff = (staffMember: Omit<Staff, 'id'>) => setStaff(prev => [...prev, { ...staffMember, id: Date.now() }]);
    const updateStaff = (updatedStaff: Staff) => setStaff(prev => prev.map(s => s.id === updatedStaff.id ? updatedStaff : s));
    const deleteStaff = (id: number) => setStaff(prev => prev.filter(s => s.id !== id));

    const addClass = (classData: Omit<Class, 'id' | 'teacherName' | 'studentCount'>) => setClasses(prev => [...prev, { ...classData, id: Date.now(), teacherName: '', studentCount: 0 }]);
    const updateClass = (updatedClass: Omit<Class, 'teacherName' | 'studentCount'>) => setClasses(prev => prev.map(c => c.id === updatedClass.id ? { ...c, ...updatedClass } : c));
    const deleteClass = (id: number) => setClasses(prev => prev.filter(c => c.id !== id));

    const addSubject = (subject: Omit<Subject, 'id'>) => setSubjects(prev => [...prev, { ...subject, id: Date.now() }]);
    const updateSubject = (updatedSubject: Subject) => setSubjects(prev => prev.map(s => s.id === updatedSubject.id ? updatedSubject : s));
    const deleteSubject = (id: number) => setSubjects(prev => prev.filter(s => s.id !== id));
    
    const updateClassCurriculum = (classId: number, curriculum: ClassCurriculum[]) => setClassCurriculum(prev => {
        const otherClassCurriculum = prev.filter(cc => cc.classId !== classId);
        return [...otherClassCurriculum, ...curriculum];
    });

    const updateTeacherAssignments = (teacherId: number, assignments: { classId: number, subjectId: number }[]) => {
        setClassCurriculum(prev => {
            const otherTeachersAssignments = prev.filter(cc => cc.teacherId !== teacherId);
            const newAssignmentsForTeacher = assignments.map(a => ({ ...a, teacherId }));
            return [...otherTeachersAssignments, ...newAssignmentsForTeacher];
        });
    };

    const value: CoreDataContextType = {
        isLoading, students, teachers, staff, subjects, classes: classesWithDetails, 
        classCurriculum, studentScholarships, activities,
        addStudent, updateStudent, deleteStudent, 
        addTeacher, updateTeacher, deleteTeacher,
        addStaff, updateStaff, deleteStaff, 
        addClass, updateClass, deleteClass, 
        addSubject, updateSubject, deleteSubject,
        updateClassCurriculum, updateTeacherAssignments
    };

    return (
        <CoreDataContext.Provider value={value}>
            {children}
        </CoreDataContext.Provider>
    );
};

export const useCoreData = () => {
    const context = useContext(CoreDataContext);
    if (context === undefined) {
        throw new Error('useCoreData must be used within a CoreDataProvider');
    }
    return context;
};