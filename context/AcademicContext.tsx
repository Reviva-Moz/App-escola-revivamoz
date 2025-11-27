
import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { 
    StudentGrades, AttendanceRecord, LessonPlan, CalendarEvent, AcademicContextType, GradeRecord 
} from '@/types';
import { 
    GRADES_DATA, ATTENDANCE_DATA, LESSON_PLANS_DATA, CALENDAR_EVENTS_DATA
} from '@/constants';
import { supabase } from '@/utils/supabase';

const AcademicContext = createContext<AcademicContextType | undefined>(undefined);

export const AcademicProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [grades, setGrades] = useState<StudentGrades[]>([]);
    const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
    const [lessonPlans, setLessonPlans] = useState<LessonPlan[]>([]);
    const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchAcademicData = async () => {
            setIsLoading(true);
            try {
                if (!supabase) {
                    console.warn("Supabase not initialized in AcademicContext. Falling back to mock data.");
                    setGrades(GRADES_DATA);
                    setAttendance(ATTENDANCE_DATA);
                    setLessonPlans(LESSON_PLANS_DATA);
                    setCalendarEvents(CALENDAR_EVENTS_DATA);
                    return;
                }

                const [
                    { data: gData, error: gError },
                    { data: aData, error: aError },
                    { data: lpData, error: lpError },
                    { data: ceData, error: ceError },
                ] = await Promise.all([
                    supabase.from('grades').select('*'),
                    supabase.from('attendance').select('*'),
                    supabase.from('lesson_plans').select('*'),
                    supabase.from('calendar_events').select('*'),
                ]);

                if (gError) console.error("Error fetching grades:", gError);
                if (gData) {
                    // Transform flat DB rows to nested StudentGrades structure
                    const gradesMap: { [studentId: number]: StudentGrades } = {};
                    
                    gData.forEach((row: any) => {
                        if (!gradesMap[row.student_id]) {
                            gradesMap[row.student_id] = {
                                studentId: row.student_id,
                                gradesBySubject: {}
                            };
                        }
                        gradesMap[row.student_id].gradesBySubject[row.subject_id] = {
                            nota1: row.nota1,
                            nota2: row.nota2,
                            finalExam: row.final_exam,
                            observations: row.observations
                        };
                    });
                    setGrades(Object.values(gradesMap));
                }

                if (aError) console.error("Error fetching attendance:", aError);
                if (aData) {
                    setAttendance(aData.map((a: any) => ({
                        id: a.id,
                        studentId: a.student_id,
                        date: a.date,
                        status: a.status,
                        subjectId: a.subject_id
                    })));
                }

                if (lpError) console.error("Error fetching lesson plans:", lpError);
                if (lpData) {
                    setLessonPlans(lpData.map((lp: any) => ({
                        id: lp.id,
                        classId: lp.class_id,
                        subjectId: lp.subject_id,
                        title: lp.title,
                        date: lp.date,
                        objectives: lp.objectives,
                        content: lp.content,
                        resources: lp.resources
                    })));
                }

                if (ceError) console.error("Error fetching calendar events:", ceError);
                if (ceData) {
                    setCalendarEvents(ceData.map((ce: any) => ({
                        id: ce.id,
                        title: ce.title,
                        date: ce.date,
                        type: ce.type,
                        description: ce.description,
                        createdAt: ce.created_at,
                        classId: ce.class_id,
                        subjectId: ce.subject_id
                    })));
                }

            } catch (err) {
                console.error("Unexpected error fetching academic data:", err);
                setGrades(GRADES_DATA);
                setAttendance(ATTENDANCE_DATA);
                setLessonPlans(LESSON_PLANS_DATA);
                setCalendarEvents(CALENDAR_EVENTS_DATA);
            } finally {
                setIsLoading(false);
            }
        };

        fetchAcademicData();
    }, []);

    // --- CRUD Operations ---

    const updateGrade = async (studentId: number, subjectId: number, field: keyof GradeRecord, value: string | number) => {
        // Optimistic Update
        setGrades(prev => {
            const newData = [...prev];
            let studentGrades = newData.find(sg => sg.studentId === studentId);
            if (!studentGrades) {
                studentGrades = { studentId, gradesBySubject: {} };
                newData.push(studentGrades);
            }
            if (!studentGrades.gradesBySubject[subjectId]) {
                studentGrades.gradesBySubject[subjectId] = { nota1: '', nota2: '', finalExam: '', observations: '' };
            }
            const record = studentGrades.gradesBySubject[subjectId];
            (record as any)[field] = value;
            return newData;
        });

        if (supabase) {
            // We need to upsert based on student_id and subject_id
            // First verify if record exists or get current values to merge
            // Supabase upsert needs all keys if we want to create new, or we can update if we have ID. 
            // Since we map by student/subject, let's construct the payload.
            
            // Fetch existing to know ID or defaults
            const { data: existing } = await supabase.from('grades')
                .select('*')
                .eq('student_id', studentId)
                .eq('subject_id', subjectId)
                .single();

            const payload: any = {
                student_id: studentId,
                subject_id: subjectId,
                [field === 'finalExam' ? 'final_exam' : field]: value
            };

            if (existing) {
                payload.id = existing.id;
            }

            const { error } = await supabase.from('grades').upsert(payload);
            if (error) console.error("Supabase grade update error:", error);
        }
    };

    const saveAttendance = async (records: Omit<AttendanceRecord, 'id'>[]) => {
        const tempIds = records.map((_, i) => Date.now() + i);
        const newRecords = records.map((r, i) => ({ ...r, id: tempIds[i] }));
        
        // Remove existing records for the same date/class/subject to avoid duplication if overwriting
        // For simplicity, we just append locally for now or filtering would be needed based on business logic (overwrite vs add)
        setAttendance(prev => {
            // Filter out existing records for same student, date and subject to simple overwrite
            const filtered = prev.filter(p => !records.some(r => r.studentId === p.studentId && r.date === p.date && r.subjectId === p.subjectId));
            return [...filtered, ...newRecords];
        });

        if (supabase) {
            // Upsert logic: delete existing for these students on this date/subject then insert
            // Or just insert if we assume clean slate. Let's use upsert logic if ID is present, but here we don't have IDs.
            // Strategy: Insert.
            const dbRecords = records.map(r => ({
                student_id: r.studentId,
                date: r.date,
                status: r.status,
                subject_id: r.subjectId
            }));

            const { error } = await supabase.from('attendance').insert(dbRecords);
            if (error) {
                console.error("Supabase attendance insert error:", error);
                alert("Erro ao salvar assiduidade.");
            }
        }
    };

    const addLessonPlan = async (plan: Omit<LessonPlan, 'id'>) => {
        const tempId = Date.now();
        setLessonPlans(prev => [...prev, { ...plan, id: tempId }]);

        if (supabase) {
            const { data, error } = await supabase.from('lesson_plans').insert({
                class_id: plan.classId,
                subject_id: plan.subjectId,
                title: plan.title,
                date: plan.date,
                objectives: plan.objectives,
                content: plan.content,
                resources: plan.resources
            }).select().single();

            if (error) {
                console.error("Supabase lesson plan error:", error);
                setLessonPlans(prev => prev.filter(p => p.id !== tempId));
            } else if (data) {
                setLessonPlans(prev => prev.map(p => p.id === tempId ? { ...p, id: data.id } : p));
            }
        }
    };

    const updateLessonPlan = async (plan: LessonPlan) => {
        setLessonPlans(prev => prev.map(p => p.id === plan.id ? plan : p));
        if (supabase) {
            const { error } = await supabase.from('lesson_plans').update({
                class_id: plan.classId,
                subject_id: plan.subjectId,
                title: plan.title,
                date: plan.date,
                objectives: plan.objectives,
                content: plan.content,
                resources: plan.resources
            }).eq('id', plan.id);
            if (error) console.error("Supabase lesson plan update error:", error);
        }
    };

    const deleteLessonPlan = async (id: number) => {
        setLessonPlans(prev => prev.filter(p => p.id !== id));
        if (supabase) {
            const { error } = await supabase.from('lesson_plans').delete().eq('id', id);
            if (error) console.error("Supabase lesson plan delete error:", error);
        }
    };

    const addEvent = async (event: Omit<CalendarEvent, 'id' | 'createdAt'>) => {
        const tempId = Date.now();
        const newEvent = { ...event, id: tempId, createdAt: new Date().toISOString() };
        setCalendarEvents(prev => [...prev, newEvent]);

        if (supabase) {
            const { data, error } = await supabase.from('calendar_events').insert({
                title: event.title,
                date: event.date,
                type: event.type,
                description: event.description,
                class_id: event.classId,
                subject_id: event.subjectId
            }).select().single();

            if (error) {
                console.error("Supabase event error:", error);
                setCalendarEvents(prev => prev.filter(e => e.id !== tempId));
            } else if (data) {
                setCalendarEvents(prev => prev.map(e => e.id === tempId ? { ...e, id: data.id } : e));
            }
        }
    };

    const updateEvent = async (event: CalendarEvent) => {
        setCalendarEvents(prev => prev.map(e => e.id === event.id ? event : e));
        if (supabase) {
            const { error } = await supabase.from('calendar_events').update({
                title: event.title,
                date: event.date,
                type: event.type,
                description: event.description,
                class_id: event.classId,
                subject_id: event.subjectId
            }).eq('id', event.id);
            if (error) console.error("Supabase event update error:", error);
        }
    };

    const deleteEvent = async (id: number) => {
        setCalendarEvents(prev => prev.filter(e => e.id !== id));
        if (supabase) {
            const { error } = await supabase.from('calendar_events').delete().eq('id', id);
            if (error) console.error("Supabase event delete error:", error);
        }
    };

    const value: AcademicContextType = {
        isLoading,
        grades,
        attendance,
        lessonPlans,
        calendarEvents,
        updateGrade,
        saveAttendance,
        addLessonPlan,
        updateLessonPlan,
        deleteLessonPlan,
        addEvent,
        updateEvent,
        deleteEvent
    };

    return (
        <AcademicContext.Provider value={value}>
            {children}
        </AcademicContext.Provider>
    );
};

export const useAcademicData = () => {
    const context = useContext(AcademicContext);
    if (context === undefined) {
        throw new Error('useAcademicData must be used within an AcademicProvider');
    }
    return context;
};
