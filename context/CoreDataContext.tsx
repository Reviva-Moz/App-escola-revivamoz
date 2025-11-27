import React, { createContext, useState, useContext, ReactNode, useMemo, useEffect } from 'react';
import { 
    Student, Teacher, Staff, Subject, Class, ClassCurriculum, StudentScholarship, 
    Activity, CoreDataContextType
} from '@/types';

import {
    STUDENTS_DATA, TEACHERS_DATA, STAFF_DATA, SUBJECTS_DATA, CLASSES_DATA,
    CLASS_CURRICULUM_DATA, STUDENT_SCHOLARSHIPS_DATA, RECENT_ACTIVITIES_DATA
} from '@/constants';
import { supabase } from '@/utils/supabase';

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
    const [isLoading, setIsLoading] = useState(false);

    // Fetch data from Supabase on mount
    useEffect(() => {
        if (!supabase) return;

        const fetchCoreData = async () => {
            setIsLoading(true);
            try {
                const [
                    { data: sData, error: sError },
                    { data: tData, error: tError },
                    { data: stData, error: stError },
                    { data: subData, error: subError },
                    { data: cData, error: cError },
                    { data: ccData, error: ccError }
                ] = await Promise.all([
                    supabase.from('students').select('*'),
                    supabase.from('teachers').select('*'),
                    supabase.from('staff').select('*'),
                    supabase.from('subjects').select('*'),
                    supabase.from('classes').select('*'),
                    supabase.from('class_curriculum').select('*')
                ]);

                if (sError) console.error("Error fetching students:", sError);
                if (sData) {
                    setStudents(sData.map((s: any) => ({
                        id: s.id,
                        name: s.name,
                        classId: s.class_id,
                        class: '', // Calculated in useMemo
                        age: s.age, // Could be calculated from birth_date
                        birthDate: s.birth_date,
                        gender: s.gender,
                        guardian: s.guardian_name,
                        phone: s.contact_phone,
                        email: s.email,
                        address: s.address,
                        status: s.status,
                        nuit: s.nuit,
                        photoUrl: s.photo_url,
                        healthNotes: s.health_notes
                    })));
                }

                if (tError) console.error("Error fetching teachers:", tError);
                if (tData) {
                    setTeachers(tData.map((t: any) => ({
                        id: t.id,
                        name: t.name,
                        email: t.email,
                        phone: t.phone,
                        qualifications: t.qualifications,
                        status: t.status,
                        photoUrl: t.photo_url
                    })));
                }

                if (stError) console.error("Error fetching staff:", stError);
                if (stData) {
                    setStaff(stData.map((s: any) => ({
                        id: s.id,
                        name: s.name,
                        role: s.role,
                        department: s.department,
                        email: s.email,
                        phone: s.phone,
                        status: s.status,
                        nuit: s.nuit,
                        photoUrl: s.photo_url
                    })));
                }

                if (subError) console.error("Error fetching subjects:", subError);
                if (subData) {
                    setSubjects(subData.map((s: any) => ({
                        id: s.id,
                        name: s.name,
                        code: s.code,
                        workload: s.workload
                    })));
                }

                if (cError) console.error("Error fetching classes:", cError);
                if (cData) {
                    setClasses(cData.map((c: any) => ({
                        id: c.id,
                        name: c.name,
                        year: c.year,
                        teacherId: c.teacher_id,
                        teacherName: '', // Calculated in useMemo
                        studentCount: 0, // Calculated in useMemo
                        className: c.class_name,
                        room: c.room,
                        maxCapacity: c.max_capacity
                    })));
                }

                if (ccError) console.error("Error fetching curriculum:", ccError);
                if (ccData) {
                    setClassCurriculum(ccData.map((cc: any) => ({
                        classId: cc.class_id,
                        subjectId: cc.subject_id,
                        teacherId: cc.teacher_id
                    })));
                }

            } catch (err) {
                console.error("Unexpected error fetching core data:", err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchCoreData();
    }, []);

    const classesWithDetails = useMemo(() => {
        return classes.map(cls => {
            const teacher = teachers.find(t => t.id === cls.teacherId);
            const studentCount = students.filter(s => s.classId === cls.id).length;
            return { ...cls, teacherName: teacher ? teacher.name : 'N/A', studentCount: studentCount };
        });
    }, [classes, teachers, students]);

    // --- CRUD Functions ---

    const addStudent = async (student: Omit<Student, 'id' | 'class'>) => {
        // Optimistic UI update
        const tempId = Date.now();
        const newStudent = { ...student, id: tempId, class: '' };
        setStudents(prev => [...prev, newStudent]);

        if (supabase) {
            const { data, error } = await supabase.from('students').insert({
                name: student.name,
                class_id: student.classId,
                birth_date: student.birthDate,
                age: student.age, // Legacy/Fallback
                guardian_name: student.guardian,
                contact_phone: student.phone,
                status: student.status,
                nuit: student.nuit,
                health_notes: student.healthNotes,
                photo_url: student.photoUrl,
                email: student.email
            }).select().single();

            if (error) {
                console.error("Supabase insert error:", error);
                alert("Erro ao salvar no servidor. Os dados estão apenas locais.");
            } else if (data) {
                // Replace temp ID with real ID
                setStudents(prev => prev.map(s => s.id === tempId ? { ...s, id: data.id } : s));
            }
        }
    };

    const updateStudent = async (updatedStudent: Omit<Student, 'id' | 'class'> & { id: number }) => {
        setStudents(prev => prev.map(s => s.id === updatedStudent.id ? { ...s, ...updatedStudent } : s));

        if (supabase) {
            const { error } = await supabase.from('students').update({
                name: updatedStudent.name,
                class_id: updatedStudent.classId,
                birth_date: updatedStudent.birthDate,
                age: updatedStudent.age,
                guardian_name: updatedStudent.guardian,
                contact_phone: updatedStudent.phone,
                status: updatedStudent.status,
                nuit: updatedStudent.nuit,
                health_notes: updatedStudent.healthNotes,
                photo_url: updatedStudent.photoUrl,
                email: updatedStudent.email
            }).eq('id', updatedStudent.id);

            if (error) console.error("Supabase update error:", error);
        }
    };

    const deleteStudent = async (id: number) => {
        setStudents(prev => prev.filter(s => s.id !== id));
        if (supabase) {
            const { error } = await supabase.from('students').delete().eq('id', id);
            if (error) console.error("Supabase delete error:", error);
        }
    };

    const addTeacher = async (teacher: Omit<Teacher, 'id'>) => {
        const tempId = Date.now();
        setTeachers(prev => [...prev, { ...teacher, id: tempId }]);

        if (supabase) {
            const { data, error } = await supabase.from('teachers').insert({
                name: teacher.name,
                email: teacher.email,
                phone: teacher.phone,
                qualifications: teacher.qualifications,
                status: teacher.status,
                photo_url: teacher.photoUrl
            }).select().single();

            if (error) console.error("Supabase insert error:", error);
            else if (data) {
                setTeachers(prev => prev.map(t => t.id === tempId ? { ...t, id: data.id } : t));
            }
        }
    };

    const updateTeacher = async (updatedTeacher: Teacher) => {
        setTeachers(prev => prev.map(t => t.id === updatedTeacher.id ? updatedTeacher : t));
        if (supabase) {
            const { error } = await supabase.from('teachers').update({
                name: updatedTeacher.name,
                email: updatedTeacher.email,
                phone: updatedTeacher.phone,
                qualifications: updatedTeacher.qualifications,
                status: updatedTeacher.status,
                photo_url: updatedTeacher.photoUrl
            }).eq('id', updatedTeacher.id);
            if (error) console.error("Supabase update error:", error);
        }
    };

    const deleteTeacher = async (id: number) => {
        setTeachers(prev => prev.filter(t => t.id !== id));
        if (supabase) {
            const { error } = await supabase.from('teachers').delete().eq('id', id);
            if (error) console.error("Supabase delete error:", error);
        }
    };
    
    const addStaff = async (staffMember: Omit<Staff, 'id'>) => {
        const tempId = Date.now();
        setStaff(prev => [...prev, { ...staffMember, id: tempId }]);
        if (supabase) {
            const { data, error } = await supabase.from('staff').insert({
                name: staffMember.name,
                role: staffMember.role,
                department: staffMember.department,
                email: staffMember.email,
                phone: staffMember.phone,
                status: staffMember.status,
                nuit: staffMember.nuit,
                photo_url: staffMember.photoUrl
            }).select().single();
            
            if(error) console.error("Supabase insert error:", error);
            else if(data) setStaff(prev => prev.map(s => s.id === tempId ? { ...s, id: data.id } : s));
        }
    };

    const updateStaff = async (updatedStaff: Staff) => {
        setStaff(prev => prev.map(s => s.id === updatedStaff.id ? updatedStaff : s));
        if (supabase) {
            const { error } = await supabase.from('staff').update({
                name: updatedStaff.name,
                role: updatedStaff.role,
                department: updatedStaff.department,
                email: updatedStaff.email,
                phone: updatedStaff.phone,
                status: updatedStaff.status,
                nuit: updatedStaff.nuit,
                photo_url: updatedStaff.photoUrl
            }).eq('id', updatedStaff.id);
            if(error) console.error("Supabase update error:", error);
        }
    };

    const deleteStaff = async (id: number) => {
        setStaff(prev => prev.filter(s => s.id !== id));
        if(supabase) await supabase.from('staff').delete().eq('id', id);
    };

    const addClass = async (classData: Omit<Class, 'id' | 'teacherName' | 'studentCount'>) => {
        const tempId = Date.now();
        setClasses(prev => [...prev, { ...classData, id: tempId, teacherName: '', studentCount: 0 }]);
        if (supabase) {
            const { data, error } = await supabase.from('classes').insert({
                name: classData.name,
                year: classData.year,
                teacher_id: classData.teacherId,
                class_name: classData.className,
                room: classData.room,
                max_capacity: classData.maxCapacity
            }).select().single();
            if (error) console.error("Supabase insert error:", error);
            else if (data) setClasses(prev => prev.map(c => c.id === tempId ? { ...c, id: data.id } : c));
        }
    };

    const updateClass = async (updatedClass: Omit<Class, 'teacherName' | 'studentCount'> & { id: number }) => {
        setClasses(prev => prev.map(c => c.id === updatedClass.id ? { ...c, ...updatedClass } : c));
        if (supabase) {
            const { error } = await supabase.from('classes').update({
                name: updatedClass.name,
                year: updatedClass.year,
                teacher_id: updatedClass.teacherId,
                class_name: updatedClass.className,
                room: updatedClass.room,
                max_capacity: updatedClass.maxCapacity
            }).eq('id', updatedClass.id);
            if (error) console.error("Supabase update error:", error);
        }
    };

    const deleteClass = async (id: number) => {
        setClasses(prev => prev.filter(c => c.id !== id));
        if(supabase) await supabase.from('classes').delete().eq('id', id);
    };

    const addSubject = async (subject: Omit<Subject, 'id'>) => {
        const tempId = Date.now();
        setSubjects(prev => [...prev, { ...subject, id: tempId }]);
        if (supabase) {
            const { data, error } = await supabase.from('subjects').insert(subject).select().single();
            if (error) console.error("Supabase insert error:", error);
            else if (data) setSubjects(prev => prev.map(s => s.id === tempId ? { ...s, id: data.id } : s));
        }
    };

    const updateSubject = async (updatedSubject: Subject) => {
        setSubjects(prev => prev.map(s => s.id === updatedSubject.id ? updatedSubject : s));
        if (supabase) {
            const { error } = await supabase.from('subjects').update({
                name: updatedSubject.name,
                code: updatedSubject.code,
                workload: updatedSubject.workload
            }).eq('id', updatedSubject.id);
            if (error) console.error("Supabase update error:", error);
        }
    };

    const deleteSubject = async (id: number) => {
        setSubjects(prev => prev.filter(s => s.id !== id));
        if (supabase) await supabase.from('subjects').delete().eq('id', id);
    };
    
    const updateClassCurriculum = async (classId: number, curriculum: ClassCurriculum[]) => {
        setClassCurriculum(prev => {
            const otherClassCurriculum = prev.filter(cc => cc.classId !== classId);
            return [...otherClassCurriculum, ...curriculum];
        });

        if (supabase) {
            // This is complex: best way is delete all for class and re-insert
            const { error: delError } = await supabase.from('class_curriculum').delete().eq('class_id', classId);
            if (!delError) {
                const rows = curriculum.map(c => ({
                    class_id: c.classId,
                    subject_id: c.subjectId,
                    teacher_id: c.teacherId
                }));
                if (rows.length > 0) {
                    await supabase.from('class_curriculum').insert(rows);
                }
            } else {
                console.error("Supabase update curriculum error:", delError);
            }
        }
    };

    const updateTeacherAssignments = async (teacherId: number, assignments: { classId: number, subjectId: number }[]) => {
        setClassCurriculum(prev => {
            const otherTeachersAssignments = prev.filter(cc => cc.teacherId !== teacherId);
            const newAssignmentsForTeacher = assignments.map(a => ({ ...a, teacherId }));
            return [...otherTeachersAssignments, ...newAssignmentsForTeacher];
        });

        if (supabase) {
            // Similarly, delete teacher's assignments and re-insert
            // Note: This deletes assignments where this teacher is assigned.
            // It assumes assignments are uniquely identified by (class_id, subject_id) which should have one teacher.
            // A safer SQL approach would be needed for robust concurrent editing, but for now:
            const { error: delError } = await supabase.from('class_curriculum').delete().eq('teacher_id', teacherId);
            if (!delError) {
                const rows = assignments.map(a => ({
                    class_id: a.classId,
                    subject_id: a.subjectId,
                    teacher_id: teacherId
                }));
                if (rows.length > 0) {
                    await supabase.from('class_curriculum').insert(rows);
                }
            }
        }
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