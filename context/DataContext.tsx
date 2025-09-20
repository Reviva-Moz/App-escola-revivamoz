import React, { createContext, useState, useContext, ReactNode, useMemo } from 'react';
import { 
    Student, Teacher, Staff, Subject, Class, Transaction, Category, Scholarship, Announcement, 
    Book, BookLoan, LessonPlan, SystemSettings, UserAccount, HealthRecord, StudentGrades, 
    CalendarEvent, DataContextType, ClassCurriculum, StudentScholarship, Tuition
} from '../types';

import {
    STUDENTS_DATA, TEACHERS_DATA, STAFF_DATA, SUBJECTS_DATA, CLASSES_DATA, TRANSACTIONS_DATA,
    CATEGORIES_DATA, SCHOLARSHIPS_DATA, ANNOUNCEMENTS_DATA, BOOKS_DATA, BOOK_LOANS_DATA,
    LESSON_PLANS_DATA, SYSTEM_SETTINGS_DATA, USER_ACCOUNTS_DATA, HEALTH_RECORDS_DATA, GRADES_DATA,
    CALENDAR_EVENTS_DATA, CLASS_CURRICULUM_DATA, STUDENT_SCHOLARSHIPS_DATA, TUITION_DATA
} from '../constants';

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [students, setStudents] = useState<Student[]>(STUDENTS_DATA);
    const [teachers, setTeachers] = useState<Teacher[]>(TEACHERS_DATA);
    const [staff, setStaff] = useState<Staff[]>(STAFF_DATA);
    const [subjects, setSubjects] = useState<Subject[]>(SUBJECTS_DATA);
    const [classes, setClasses] = useState<Class[]>(CLASSES_DATA);
    const [transactions, setTransactions] = useState<Transaction[]>(TRANSACTIONS_DATA);
    const [categories, setCategories] = useState<Category[]>(CATEGORIES_DATA);
    const [scholarships, setScholarships] = useState<Scholarship[]>(SCHOLARSHIPS_DATA);
    const [announcements, setAnnouncements] = useState<Announcement[]>(ANNOUNCEMENTS_DATA);
    const [books, setBooks] = useState<Book[]>(BOOKS_DATA);
    const [bookLoans, setBookLoans] = useState<BookLoan[]>(BOOK_LOANS_DATA);
    const [lessonPlans, setLessonPlans] = useState<LessonPlan[]>(LESSON_PLANS_DATA);
    const [systemSettings, setSystemSettings] = useState<SystemSettings>(SYSTEM_SETTINGS_DATA);
    const [users, setUsers] = useState<UserAccount[]>(USER_ACCOUNTS_DATA);
    const [healthRecords, setHealthRecords] = useState<HealthRecord[]>(HEALTH_RECORDS_DATA);
    const [grades, setGrades] = useState<StudentGrades[]>(GRADES_DATA);
    const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>(CALENDAR_EVENTS_DATA);
    const [classCurriculum, setClassCurriculum] = useState<ClassCurriculum[]>(CLASS_CURRICULUM_DATA);
    const [studentScholarships, setStudentScholarships] = useState<StudentScholarship[]>(STUDENT_SCHOLARSHIPS_DATA);
    const [tuition, setTuition] = useState<Tuition[]>(TUITION_DATA);

    // Memoize classes with details to avoid recalculation on every render
    const classesWithDetails = useMemo(() => {
        return classes.map(cls => {
            const teacher = teachers.find(t => t.id === cls.teacherId);
            const studentCount = students.filter(s => s.classId === cls.id).length;
            return {
                ...cls,
                teacherName: teacher ? teacher.name : 'N/A',
                studentCount: studentCount,
            };
        });
    }, [classes, teachers, students]);


    // --- CRUD Functions ---

    // Teachers
    const addTeacher = (teacher: Omit<Teacher, 'id'>) => setTeachers(prev => [...prev, { ...teacher, id: Date.now() }]);
    const updateTeacher = (updatedTeacher: Teacher) => setTeachers(prev => prev.map(t => t.id === updatedTeacher.id ? updatedTeacher : t));
    const deleteTeacher = (id: number) => setTeachers(prev => prev.filter(t => t.id !== id));
    
    // Staff
    const addStaff = (staffMember: Omit<Staff, 'id'>) => setStaff(prev => [...prev, { ...staffMember, id: Date.now() }]);
    const updateStaff = (updatedStaff: Staff) => setStaff(prev => prev.map(s => s.id === updatedStaff.id ? updatedStaff : s));
    const deleteStaff = (id: number) => setStaff(prev => prev.filter(s => s.id !== id));

    // Classes
    const addClass = (classData: Omit<Class, 'id' | 'teacherName' | 'studentCount'>) => setClasses(prev => [...prev, { ...classData, id: Date.now(), teacherName: '', studentCount: 0 }]);
    const updateClass = (updatedClass: Omit<Class, 'teacherName' | 'studentCount'>) => setClasses(prev => prev.map(c => c.id === updatedClass.id ? { ...c, ...updatedClass } : c));
    const deleteClass = (id: number) => setClasses(prev => prev.filter(c => c.id !== id));

    // Subjects
    const addSubject = (subject: Omit<Subject, 'id'>) => setSubjects(prev => [...prev, { ...subject, id: Date.now() }]);
    const updateSubject = (updatedSubject: Subject) => setSubjects(prev => prev.map(s => s.id === updatedSubject.id ? updatedSubject : s));
    const deleteSubject = (id: number) => setSubjects(prev => prev.filter(s => s.id !== id));

    // Settings
    const updateSettings = (settings: SystemSettings) => setSystemSettings(settings);
    
    // Users
    const addUser = (user: Omit<UserAccount, 'id' | 'lastLogin'>) => setUsers(prev => [...prev, { ...user, id: Date.now(), lastLogin: new Date().toISOString() }]);
    const updateUser = (updatedUser: UserAccount) => setUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
    const deleteUser = (id: number) => setUsers(prev => prev.filter(u => u.id !== id));

    const value: DataContextType = {
        students,
        teachers,
        staff,
        subjects,
        classes: classesWithDetails, // Provide the enriched data
        transactions,
        categories,
        scholarships,
        announcements,
        books,
        bookLoans,
        lessonPlans,
        systemSettings,
        users,
        healthRecords,
        grades,
        calendarEvents,
        classCurriculum,
        studentScholarships,
        tuition,
        // CRUD Functions
        addTeacher,
        updateTeacher,
        deleteTeacher,
        addStaff,
        updateStaff,
        deleteStaff,
        addClass,
        updateClass,
        deleteClass,
        addSubject,
        updateSubject,
        deleteSubject,
        updateSettings,
        addUser,
        updateUser,
        deleteUser,
    };

    return (
        <DataContext.Provider value={value}>
            {children}
        </DataContext.Provider>
    );
};

export const useData = () => {
    const context = useContext(DataContext);
    if (context === undefined) {
        throw new Error('useData must be used within a DataProvider');
    }
    return context;
};
