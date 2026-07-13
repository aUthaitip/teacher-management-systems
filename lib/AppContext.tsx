"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

// Types
export interface Teacher {
  id: string;
  name: string;
  email: string;
  school: string;
  avatar?: string;
}

export interface Subject {
  id: string;
  name: string;
  code: string;
  gradeLevel?: string;
  teacherIds: string[];
}

export interface Classroom {
  id: string;
  name: string;
  subjectId: string;
  description?: string;
  gradeThresholds?: { grade4: number; grade3: number; grade2: number; grade1: number };
}

export interface Student {
  id: string;
  name: string;
  rollNumber: string;
  classroomId: string;
}

export interface AttendanceRecord {
  id: string;
  date: string; // YYYY-MM-DD
  classroomId: string;
  studentId: string;
  status: "present" | "absent" | "late";
}

export interface ScoreRecord {
  id: string;
  chapterName: string;
  totalScore: number;
  passingScore: number;
  classroomId: string;
  studentScores: { [studentId: string]: number }; // studentId -> score
}

interface AppContextType {
  teachers: Teacher[];
  currentTeacher: Teacher | null;
  subjects: Subject[];
  classrooms: Classroom[];
  students: Student[];
  attendance: AttendanceRecord[];
  scores: ScoreRecord[];
  isLoaded: boolean;
  
  // Actions
  loginTeacher: (email: string, password: string) => boolean;
  registerTeacher: (name: string, email: string, school: string, password: string) => boolean;
  logoutTeacher: () => void;
  updateProfile: (name: string, email: string, school: string, avatar?: string) => void;
  deleteTeacher: (id: string) => void;
  
  // Subject Actions
  addSubject: (name: string, code: string, gradeLevel: string) => void;
  updateSubject: (id: string, name: string, code: string, gradeLevel: string) => void;
  deleteSubject: (id: string) => void;

  // Classroom Actions
  addClassroom: (name: string, subjectId: string, description?: string) => void;
  updateClassroom: (id: string, name: string, description?: string) => void;
  updateClassroomGradeSettings: (id: string, thresholds: { grade4: number; grade3: number; grade2: number; grade1: number }) => void;
  deleteClassroom: (id: string) => void;

  // Student Actions
  addStudent: (name: string, rollNumber: string, classroomId: string) => void;
  addStudentsBatch: (students: { name: string; rollNumber: string }[], classroomId: string) => void;
  updateStudent: (id: string, name: string, rollNumber: string) => void;
  deleteStudent: (id: string) => void;

  // Attendance Actions
  saveAttendance: (date: string, classroomId: string, records: { studentId: string; status: "present" | "absent" | "late" }[]) => void;

  // Score Actions
  addScoreChapter: (chapterName: string, totalScore: number, passingScore: number, classroomId: string) => void;
  updateStudentScores: (chapterId: string, studentScores: { [studentId: string]: number }) => void;
  deleteScoreChapter: (chapterId: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Initial mock data
const initialTeachers: Teacher[] = [];
const initialSubjects: Subject[] = [];
const initialClassrooms: Classroom[] = [];
const initialStudents: Student[] = [];
const initialScores: ScoreRecord[] = [];
const initialAttendance: AttendanceRecord[] = [];

/**
 * Safely parse a JSON string retrieved from localStorage.
 * Guards against:
 *  - value being null (key not present)
 *  - value being the literal string "undefined" (happens when
 *    JSON.stringify(undefined) was previously saved via setItem)
 *  - value being malformed/corrupted JSON
 */
function safeParse<T>(value: string | null, fallback: T): T {
  if (!value || value === "undefined" || value === "null") {
    return fallback;
  }
  try {
    return JSON.parse(value) as T;
  } catch (err) {
    console.warn("Failed to parse stored value, using fallback.", err);
    return fallback;
  }
}

/**
 * Safely write a value to localStorage as JSON.
 * Guards against ever writing the string "undefined" by
 * falling back to "null" when the value is undefined.
 */
function safeSetItem(key: string, value: unknown) {
  const serialized = value === undefined ? "null" : JSON.stringify(value);
  localStorage.setItem(key, serialized);
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [currentTeacher, setCurrentTeacher] = useState<Teacher | null>(null);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [scores, setScores] = useState<ScoreRecord[]>([]);

  // Load from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedTeachers = localStorage.getItem("tms_teachers");
      const storedTeacher = localStorage.getItem("tms_currentTeacher");
      const storedSubjects = localStorage.getItem("tms_subjects");
      const storedClassrooms = localStorage.getItem("tms_classrooms");
      const storedStudents = localStorage.getItem("tms_students");
      const storedAttendance = localStorage.getItem("tms_attendance");
      const storedScores = localStorage.getItem("tms_scores");

      setTeachers(safeParse(storedTeachers, initialTeachers));
      // NOTE: previously this fell back to `initialTeachers[0]`, which is
      // `undefined` since initialTeachers is an empty array. That undefined
      // got saved via JSON.stringify -> the string "undefined" -> crash on
      // next JSON.parse. Fall back to `null` instead, which is valid JSON.
      setCurrentTeacher(safeParse<Teacher | null>(storedTeacher, null));
      setSubjects(safeParse(storedSubjects, initialSubjects));
      setClassrooms(safeParse(storedClassrooms, initialClassrooms));
      setStudents(safeParse(storedStudents, initialStudents));
      setAttendance(safeParse(storedAttendance, initialAttendance));
      setScores(safeParse(storedScores, initialScores));
      const timer = setTimeout(() => {
        setIsLoaded(true);
      }, 1000); // 1-second simulated delay
      return () => clearTimeout(timer);
    }
  }, []);

  // Save to localStorage whenever states change
  useEffect(() => {
    if (isLoaded) {
      safeSetItem("tms_teachers", teachers);
      safeSetItem("tms_currentTeacher", currentTeacher);
      safeSetItem("tms_subjects", subjects);
      safeSetItem("tms_classrooms", classrooms);
      safeSetItem("tms_students", students);
      safeSetItem("tms_attendance", attendance);
      safeSetItem("tms_scores", scores);
    }
  }, [teachers, currentTeacher, subjects, classrooms, students, attendance, scores, isLoaded]);

  // Actions
  const loginTeacher = (email: string, password: string): boolean => {
    // Basic password validation
    const teacher = teachers.find(t => t.email.toLowerCase() === email.toLowerCase());
    if (teacher && password === "password123") { // Mock password
      setCurrentTeacher(teacher);
      safeSetItem("tms_currentTeacher", teacher);
      return true;
    }
    // Allow custom login for newly registered teachers
    const newlyRegistered = teachers.find(t => t.email.toLowerCase() === email.toLowerCase());
    if (newlyRegistered) {
      setCurrentTeacher(newlyRegistered);
      safeSetItem("tms_currentTeacher", newlyRegistered);
      return true;
    }
    return false;
  };

  const registerTeacher = (name: string, email: string, school: string, password: string): boolean => {
    if (teachers.some(t => t.email.toLowerCase() === email.toLowerCase())) {
      return false; // Email already exists
    }
    const newTeacher: Teacher = {
      id: `teacher-${Date.now()}`,
      name,
      email,
      school,
      avatar: `https://images.unsplash.com/photo-${1573496359142 + Math.floor(Math.random() * 1000)}?q=80&w=200&auto=format&fit=crop`,
    };
    const updatedTeachers = [...teachers, newTeacher];
    setTeachers(updatedTeachers);
    safeSetItem("tms_teachers", updatedTeachers);
    return true;
  };

  const logoutTeacher = () => {
    setCurrentTeacher(null);
    localStorage.removeItem("tms_currentTeacher");
  };

  const updateProfile = (name: string, email: string, school: string, avatar?: string) => {
    if (!currentTeacher) return;
    const updated = { ...currentTeacher, name, email, school, avatar };
    setCurrentTeacher(updated);
    setTeachers(prev => prev.map(t => t.id === updated.id ? updated : t));
  };

  const deleteTeacher = (id: string) => {
    setTeachers(prev => prev.filter(t => t.id !== id));
    if (currentTeacher?.id === id) {
      setCurrentTeacher(null);
      localStorage.removeItem("tms_currentTeacher");
    }

    // Cascade delete all data related to this teacher
    setSubjects(prev => {
      const teacherSubjects = prev.filter(s => s.teacherIds.includes(id));
      const subjIdsToRemove = teacherSubjects.map(s => s.id);
      
      if (subjIdsToRemove.length === 0) return prev;

      // Keep only subjects that don't belong to the deleted teacher
      const remainingSubjects = prev.filter(s => !subjIdsToRemove.includes(s.id));

      setClassrooms(prevClassrooms => {
        const classroomsToRemove = prevClassrooms.filter(c => subjIdsToRemove.includes(c.subjectId));
        const classIdsToRemove = classroomsToRemove.map(c => c.id);

        if (classIdsToRemove.length > 0) {
          // Remove students, attendance, and scores for these classrooms
          setStudents(prevStudents => prevStudents.filter(st => !classIdsToRemove.includes(st.classroomId)));
          setAttendance(prevAtt => prevAtt.filter(a => !classIdsToRemove.includes(a.classroomId)));
          setScores(prevScores => prevScores.filter(sc => !classIdsToRemove.includes(sc.classroomId)));
        }

        return prevClassrooms.filter(c => !classIdsToRemove.includes(c.id));
      });

      return remainingSubjects;
    });
  };

  // Subject Actions
  const addSubject = (name: string, code: string, gradeLevel: string) => {
    if (!currentTeacher) return;
    const newSubj: Subject = {
      id: `subj-${Date.now()}`,
      name,
      code,
      gradeLevel,
      teacherIds: [currentTeacher.id],
    };
    setSubjects(prev => [...prev, newSubj]);
  };

  const updateSubject = (id: string, name: string, code: string, gradeLevel: string) => {
    setSubjects(prev => prev.map(s => s.id === id ? { ...s, name, code, gradeLevel } : s));
  };

  const deleteSubject = (id: string) => {
    setSubjects(prev => prev.filter(s => s.id !== id));
    // Cascade delete classrooms
    const clIds = classrooms.filter(c => c.subjectId === id).map(c => c.id);
    setClassrooms(prev => prev.filter(c => c.subjectId !== id));
    // Cascade delete students in those classrooms
    setStudents(prev => prev.filter(st => !clIds.includes(st.classroomId)));
  };

  // Classroom Actions
  const addClassroom = (name: string, subjectId: string, description?: string) => {
    const newClass: Classroom = {
      id: `class-${Date.now()}`,
      name,
      subjectId,
      description,
    };
    setClassrooms(prev => [...prev, newClass]);
  };

  const updateClassroom = (id: string, name: string, description?: string) => {
    setClassrooms(prev => prev.map(c => c.id === id ? { ...c, name, description } : c));
  };

  const updateClassroomGradeSettings = (id: string, thresholds: { grade4: number; grade3: number; grade2: number; grade1: number }) => {
    setClassrooms(prev => prev.map(c => c.id === id ? { ...c, gradeThresholds: thresholds } : c));
  };

  const deleteClassroom = (id: string) => {
    setClassrooms(prev => prev.filter(c => c.id !== id));
    setStudents(prev => prev.filter(s => s.classroomId !== id));
    setAttendance(prev => prev.filter(a => a.classroomId !== id));
    setScores(prev => prev.filter(s => s.classroomId !== id));
  };

  // Student Actions
  const addStudent = (name: string, rollNumber: string, classroomId: string) => {
    const newStudent: Student = {
      id: `stud-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name,
      rollNumber,
      classroomId,
    };
    setStudents(prev => [...prev, newStudent]);
  };

  const addStudentsBatch = (batch: { name: string; rollNumber: string }[], classroomId: string) => {
    const newStudents: Student[] = batch.map(b => ({
      id: `stud-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: b.name,
      rollNumber: b.rollNumber,
      classroomId,
    }));
    setStudents(prev => [...prev, ...newStudents]);
  };

  const updateStudent = (id: string, name: string, rollNumber: string) => {
    setStudents(prev => prev.map(s => s.id === id ? { ...s, name, rollNumber } : s));
  };

  const deleteStudent = (id: string) => {
    setStudents(prev => prev.filter(s => s.id !== id));
    // Remove from attendance and scores
    setAttendance(prev => prev.filter(a => a.studentId !== id));
    setScores(prev => prev.map(s => {
      const updatedScores = { ...s.studentScores };
      delete updatedScores[id];
      return { ...s, studentScores: updatedScores };
    }));
  };

  // Attendance Actions
  const saveAttendance = (date: string, classroomId: string, records: { studentId: string; status: "present" | "absent" | "late" }[]) => {
    setAttendance(prev => {
      // Filter out existing records for this date and classroom
      const filtered = prev.filter(a => !(a.date === date && a.classroomId === classroomId));
      const newRecords = records.map(r => ({
        id: `att-${Date.now()}-${r.studentId}`,
        date,
        classroomId,
        studentId: r.studentId,
        status: r.status,
      }));
      return [...filtered, ...newRecords];
    });
  };

  // Score Actions
  const addScoreChapter = (chapterName: string, totalScore: number, passingScore: number, classroomId: string) => {
    const newChapter: ScoreRecord = {
      id: `score-${Date.now()}`,
      chapterName,
      totalScore,
      passingScore,
      classroomId,
      studentScores: {},
    };
    setScores(prev => [...prev, newChapter]);
  };

  const updateStudentScores = (chapterId: string, studentScores: { [studentId: string]: number }) => {
    setScores(prev => prev.map(s => s.id === chapterId ? { ...s, studentScores } : s));
  };

  const deleteScoreChapter = (chapterId: string) => {
    setScores(prev => prev.filter(s => s.id !== chapterId));
  };

  return (
    <AppContext.Provider
      value={{
        teachers,
        currentTeacher,
        subjects,
        classrooms,
        students,
        attendance,
        scores,
        isLoaded,
        loginTeacher,
        registerTeacher,
        logoutTeacher,
        updateProfile,
        deleteTeacher,
        addSubject,
        updateSubject,
        deleteSubject,
        addClassroom,
        updateClassroom,
        updateClassroomGradeSettings,
        deleteClassroom,
        addStudent,
        addStudentsBatch,
        updateStudent,
        deleteStudent,
        saveAttendance,
        addScoreChapter,
        updateStudentScores,
        deleteScoreChapter,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}