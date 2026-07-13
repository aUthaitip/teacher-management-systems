"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

type Language = "th" | "en";

interface TranslationDictionary {
  [key: string]: {
    th: string;
    en: string;
  };
}

const translations: TranslationDictionary = {
  // Common
  save: { th: "บันทึก", en: "Save" },
  cancel: { th: "ยกเลิก", en: "Cancel" },
  edit: { th: "แก้ไข", en: "Edit" },
  delete: { th: "ลบ", en: "Delete" },
  add: { th: "เพิ่ม", en: "Add" },
  back: { th: "ย้อนกลับ", en: "Back" },
  success: { th: "สำเร็จ", en: "Success" },

  // Navbar & Landing Page
  appTitle: { th: "ระบบจัดการชั้นเรียน", en: "Classroom System" },
  login: { th: "เข้าสู่ระบบ", en: "Login" },
  register: { th: "สมัครสมาชิก", en: "Register" },
  heroSubtitle: { th: "ระบบจัดการห้องเรียนรุ่นใหม่สำหรับครูยุคดิจิทัล", en: "Next-gen classroom system for digital teachers" },
  heroTitle1: { th: "จัดการห้องเรียน &", en: "Manage Your Classrooms &" },
  heroTitle2: { th: "บันทึกคะแนนอย่างมีประสิทธิภาพ", en: "Track Grades Efficiently" },
  heroDesc: { th: "ระบบสารสนเทศเพื่อช่วยคุณครูจัดการรายวิชาสอน ห้องเรียน เช็กชื่อนักเรียนรายวัน และบันทึกคะแนนสอบพร้อมระบบประเมินผลผ่าน-ไม่ผ่านอัตโนมัติ สะดวกรวดเร็วในเว็บเดียว", en: "Information system to help teachers manage subjects, classrooms, daily student attendance, and record exam scores with automatic pass/fail evaluation in one fast web app." },
  getStarted: { th: "เริ่มใช้งานฟรี", en: "Get Started Free" },
  signInTeacher: { th: "เข้าสู่ระบบครูผู้สอน", en: "Sign In as Teacher" },
  feature1Title: { th: "เช็กชื่อเข้าเรียนรายวัน", en: "Daily Attendance Checking" },
  feature1Desc: { th: "เช็กชื่อนักเรียนแยกตามวันที่และห้องเรียนระบุ มาสาย ขาด ลา หรือเข้าเรียนปกติได้อย่างง่ายดาย", en: "Take student attendance daily by classroom with options for present, late, or absent easily." },
  feature2Title: { th: "คำนวณผ่าน-ตกอัตโนมัติ", en: "Auto Pass/Fail Evaluation" },
  feature2Desc: { th: "ระบุคะแนนเต็มและเกณฑ์ผ่าน ระบบจะวิเคราะห์และแสดงผลประเมินทันทีที่กรอกคะแนนสะสม", en: "Input total and passing score, and the system dynamically evaluates student outcomes instantly." },
  feature3Title: { th: "ข้อมูลส่วนตัวและห้องเรียน", en: "Profile & Classroom Data" },
  feature3Desc: { th: "จัดการข้อมูลประวัติครูผู้สอน จัดการรายชื่อนักเรียน เพิ่ม ลบ หรือย้ายห้องเรียนได้อย่างเป็นระเบียบ", en: "Manage teacher profile, student registers, and add, edit or delete classrooms systematically." },

  // Auth pages
  loginTitle: { th: "เข้าสู่ระบบผู้สอน", en: "Teacher Login" },
  emailLabel: { th: "อีเมลผู้ใช้งาน (Email)", en: "Email Address" },
  passwordLabel: { th: "รหัสผ่าน (Password)", en: "Password" },
  defaultPasswordNote: { th: "* บัญชีเริ่มต้นใช้รหัสผ่าน:", en: "* Default account password:" },
  noAccount: { th: "ยังไม่มีบัญชีผู้ใช้?", en: "Don't have an account?" },
  signUpHere: { th: "สมัครสมาชิกใหม่ที่นี่", en: "Sign up here" },
  registerTitle: { th: "ลงทะเบียนสมาชิกครู", en: "Teacher Registration" },
  registerSubtitle: { th: "ลงทะเบียนบัญชีครูผู้สอนเพื่อจัดการห้องเรียน", en: "Create a teacher account to manage classrooms" },
  fullNameLabel: { th: "ชื่อ-นามสกุลครูผู้สอน (Full Name)", en: "Full Name" },
  schoolLabel: { th: "โรงเรียน/สถานศึกษา (School)", en: "School / Institution" },
  alreadyHaveAccount: { th: "มีบัญชีผู้ใช้แล้ว?", en: "Already have an account?" },
  signInHere: { th: "เข้าสู่ระบบที่นี่", en: "Sign in here" },
  
  // Extra Login & Register
  loginErrorEmpty: { th: "กรุณากรอกอีเมลและรหัสผ่านให้ครบถ้วน", en: "Please fill in email and password" },
  loginErrorInvalid: { th: "อีเมลหรือรหัสผ่านไม่ถูกต้อง", en: "Invalid email or password" },
  loginSubtitle: { th: "ระบบจัดการห้องเรียนและคะแนนนักเรียน", en: "Classroom & student grade manager" },
  registerErrorName: { th: "ชื่อ-นามสกุลต้องมีอย่างน้อย 2 ตัวอักษร", en: "Name must be at least 2 characters" },
  registerErrorSchool: { th: "ชื่อโรงเรียนต้องมีอย่างน้อย 2 ตัวอักษร", en: "School name must be at least 2 characters" },
  registerErrorEmail: { th: "รูปแบบอีเมลไม่ถูกต้อง", en: "Invalid email address format" },
  registerErrorPassword: { th: "รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร", en: "Password must be at least 6 characters" },
  registerErrorExists: { th: "อีเมลนี้มีผู้สมัครใช้งานแล้ว", en: "Email already registered in this system." },
  registerSuccess: { th: "ลงทะเบียนสมาชิกสำเร็จ! กำลังพาท่านไปหน้าเข้าสู่ระบบ...", en: "Registration successful! Redirecting you to login page..." },
  registerNamePl: { th: "เช่น ครูวิทยากร ใจดี", en: "e.g. John Doe" },
  registerSchoolPl: { th: "เช่น โรงเรียนมัธยมวิทยา", en: "e.g. High School" },
  registerPasswordPl: { th: "อย่างน้อย 6 ตัวอักษร", en: "At least 6 characters" },
  processing: { th: "กำลังประมวลผล...", en: "Processing..." },

  // Sidebar
  dashboard: { th: "แดชบอร์ด", en: "Dashboard" },
  subjectsAndClasses: { th: "รายวิชาและห้องเรียน", en: "Subjects & Classes" },
  myProfile: { th: "โปรไฟล์ของฉัน", en: "My Profile" },
  logout: { th: "ออกจากระบบ", en: "Logout" },
  systemSubtitle: { th: "ระบบจัดการชั้นเรียน", en: "Classroom System" },

  // Dashboard Page
  welcomeBack: { th: "ยินดีต้อนรับกลับมา", en: "Welcome Back" },
  hello: { th: "สวัสดี", en: "Hello" },
  bannerDesc: { th: "ระบบจัดการห้องเรียนพร้อมใช้งานแล้ว วันนี้คุณอยากจัดการห้องเรียนวิชาอะไรดีครับ?", en: "Classroom management system is ready. What classroom would you like to manage today?" },
  totalSubjects: { th: "รายวิชาทั้งหมด", en: "Total Subjects" },
  subjectsTaught: { th: "วิชาที่รับผิดชอบการสอน", en: "Subjects taught" },
  totalClassrooms: { th: "ห้องเรียนทั้งหมด", en: "Total Classrooms" },
  classroomSub: { th: "ชั้นเรียน/ห้องเรียนย่อย", en: "Classrooms & sections" },
  totalStudents: { th: "จำนวนนักเรียนรวม", en: "Total Students" },
  studentsSub: { th: "นักเรียนที่ดูแลอยู่", en: "Students in care" },
  mySubjectsTitle: { th: "รายวิชาที่คุณสอน", en: "Subjects You Teach" },
  noSubjects: { th: "ยังไม่มีรายวิชาที่สอนในขณะนี้", en: "No subjects taught at the moment" },
  addFirstSubject: { th: "เพิ่มรายวิชาแรกของคุณ", en: "Add your first subject" },
  viewDetails: { th: "ดูรายละเอียด", en: "View Details" },
  noClassroomsYet: { th: "ยังไม่มีห้องเรียนในวิชานี้", en: "No classrooms in this subject yet" },
  quickMenu: { th: "เมนูลัดด่วน", en: "Quick Actions" },
  quickManageSubjects: { th: "จัดการวิชาสอน", en: "Manage Subjects" },
  quickManageSubjectsDesc: { th: "เพิ่ม ลบ หรือแก้ไขรายวิชาที่สอน", en: "Add, delete or edit taught subjects" },
  quickAttendance: { th: "เช็กชื่อเข้าเรียน", en: "Check Attendance" },
  quickAttendanceDesc: { th: "เลือกห้องเรียนเพื่อเช็กชื่อประจำวัน", en: "Select a class to take daily attendance" },
  quickScores: { th: "บันทึกคะแนนเก็บ", en: "Record Test Scores" },
  quickScoresDesc: { th: "กรอกคะแนนและคำนวณการผ่าน-ตกอัตโนมัติ", en: "Record grades and auto-evaluate pass/fail" },

  // Subjects Page
  subjectsTitle: { th: "รายวิชาและห้องเรียน", en: "Subjects & Classrooms" },
  subjectsDesc: { th: "จัดการรายวิชาหลักที่รับผิดชอบการสอน และแยกห้องเรียนย่อยในแต่ละวิชา", en: "Manage main subjects and organize sub-classrooms for each subject." },
  addSubjectBtn: { th: "เพิ่มรายวิชาสอน", en: "Add Subject" },
  noSubjectsDesc: { th: "เริ่มสร้างรายวิชาและเปิดห้องเรียนย่อยเพื่อเช็กชื่อและลงคะแนนนักเรียนของคุณ", en: "Create subjects and classrooms to start taking attendance and scoring students." },
  subjectCode: { th: "รหัสวิชา", en: "Subject Code" },
  subjectName: { th: "ชื่อวิชา", en: "Subject Name" },
  roomsInSubject: { th: "ห้องเรียนในวิชานี้", en: "Classrooms in this subject" },
  noRoomsYet: { th: "ยังไม่มีห้องเรียนในรายวิชานี้", en: "No classrooms in this subject yet" },
  enterRoom: { th: "เข้าห้องเรียน", en: "Enter Classroom" },
  openClassroom: { th: "เปิดห้องเรียน/ชั้นเรียนย่อย", en: "Open Sub-Classroom" },
  createRoomTitle: { th: "เปิดห้องเรียนย่อย", en: "Create Class Section" },
  createRoomDesc: { th: "สร้างห้องเรียนหรือชั้นเรียนสำหรับวิชานี้ เช่น ม.4/1, ม.4/2", en: "Create classroom sections for this subject, e.g. Sec 1, Sec 2" },
  classNameLabel: { th: "ชื่อห้องเรียน/ชั้นเรียน", en: "Classroom Name" },
  classDescLabel: { th: "คำอธิบายย่อ (รายละเอียดห้อง)", en: "Brief Description (Optional)" },
  editSubjectTitle: { th: "แก้ไขข้อมูลรายวิชา", en: "Edit Subject Info" },
  addSubjectTitle: { th: "เพิ่มรายวิชาใหม่", en: "Add New Subject" },
  subjectCodePl: { th: "เช่น ค31201", en: "e.g. MATH101" },
  subjectNamePl: { th: "เช่น คณิตศาสตร์เพิ่มเติม 1", en: "e.g. Calculus I" },

  // Classroom Detail Page
  classroomLabel: { th: "ห้องเรียน", en: "Classroom" },
  attendanceTab: { th: "เช็กชื่อเข้าเรียน", en: "Attendance" },
  scoresTab: { th: "บันทึกคะแนนเก็บ", en: "Scores" },
  studentsTab: { th: "จัดการรายชื่อนักเรียน", en: "Student Registers" },
  infoTab: { th: "ข้อมูลห้องเรียน", en: "Classroom Info" },
  noClassroomFound: { th: "ไม่พบข้อมูลห้องเรียนนี้", en: "Classroom not found" },
  backToMain: { th: "กลับหน้าหลัก", en: "Back to Main" },

  // Attendance Tab
  dailyAttendance: { th: "เช็กชื่อประจำวัน", en: "Daily Attendance" },
  attendanceDesc: { th: "เลือกวันที่และเลือกสถานะการมาเรียนของนักเรียนแต่ละคน", en: "Select date and mark student attendance status." },
  saveAttendance: { th: "บันทึกการเช็กชื่อ", en: "Save Attendance" },
  noStudentsAttendance: { th: "ยังไม่มีนักเรียนในห้องเรียนนี้", en: "No students registered in this class yet" },
  pleaseRegisterStudents: { th: "ไปที่แท็บ 'จัดการรายชื่อนักเรียน' เพื่อลงทะเบียนรายชื่อก่อนเช็กชื่อ", en: "Go to 'Student Registers' tab to add students before taking attendance." },
  rollNumberCol: { th: "เลขที่", en: "Roll No." },
  studentNameCol: { th: "ชื่อ-นามสกุล", en: "Student Name" },
  attendanceStatusCol: { th: "สถานะเข้าเรียน", en: "Attendance Status" },
  presentBtn: { th: "มาเรียน", en: "Present" },
  lateBtn: { th: "สาย", en: "Late" },
  absentBtn: { th: "ขาด", en: "Absent" },
  attendanceSavedAlert: { th: "บันทึกการเช็กชื่อเรียบร้อยแล้ว!", en: "Attendance records saved successfully!" },

  // Scores Tab
  chapterLabel: { th: "บทเรียน/หัวข้อทดสอบ:", en: "Unit / Chapter Test:" },
  noChaptersYet: { th: "ยังไม่มีการเพิ่มรายการสอบเก็บคะแนน", en: "No test records added yet" },
  deleteChapterBtn: { th: "ลบบทเรียนนี้", en: "Delete Chapter" },
  addChapterBtn: { th: "เพิ่มหัวข้อเก็บบันทึกคะแนน", en: "Add Chapter Test" },
  passingScoreLabel: { th: "เกณฑ์ผ่าน", en: "Passing Score" },
  totalScoreLabel: { th: "คะแนนเต็ม", en: "Total Score" },
  addChapterTitle: { th: "เพิ่มบทเรียน/การทดสอบย่อย", en: "Add Test Chapter" },
  addChapterDesc: { th: "ระบุคะแนนเต็มและเกณฑ์คะแนนที่จะถือว่านักเรียน 'ผ่าน' ในบทนั้นๆ", en: "Specify total score and pass threshold to evaluate passing students." },
  chapterNamePl: { th: "เช่น บทที่ 2: เมทริกซ์เบื้องต้น", en: "e.g. Chapter 2: Vectors" },
  passingMinLabel: { th: "เกณฑ์ผ่านการประเมิน:", en: "Pass Threshold:" },
  passingScoreMin: { th: "คะแนน", en: "pts" },
  scoreCol: { th: "กรอกคะแนนที่ได้", en: "Input Score" },
  evaluationCol: { th: "ผลการประเมิน", en: "Evaluation" },
  passedBadge: { th: "ผ่าน (Pass)", en: "Pass" },
  failedBadge: { th: "ไม่ผ่าน (Fail)", en: "Fail" },
  saveScoresBtn: { th: "บันทึกคะแนน", en: "Save Scores" },
  noStudentsScores: { th: "ยังไม่มีรายชื่อนักเรียนสำหรับกรอกคะแนน", en: "No students registered for scoring" },
  scoreLimitAlert: { th: "คะแนนต้องไม่เกิน", en: "Score cannot exceed" },
  scoresSavedAlert: { th: "บันทึกคะแนนบทเรียนเรียบร้อยแล้ว!", en: "Grades saved successfully!" },

  // Students Tab
  studentRegistersTitle: { th: "รายชื่อนักเรียนทั้งหมด", en: "Class Student List" },
  studentRegistersDesc: { th: "เพิ่ม ลบ หรือแก้ไขข้อมูลรายชื่อและเลขที่ของนักเรียน", en: "Add, edit, or remove classroom students and roll numbers." },
  addStudentBtn: { th: "เพิ่มรายชื่อนักเรียน", en: "Add Student" },
  registerStudentTitle: { th: "ลงทะเบียนนักเรียนใหม่", en: "Register Student" },
  editStudentTitle: { th: "แก้ไขข้อมูลนักเรียน", en: "Edit Student Info" },
  registerStudentDesc: { th: "กรอกข้อมูลชื่อนักเรียนและเลขที่ประจำห้องเรียนย่อยนี้", en: "Enter student name and classroom roll number." },
  rollNumberPl: { th: "เช่น 1", en: "e.g. 1" },
  studentNamePl: { th: "เช่น นายเกียรติศักดิ์ จริงใจ", en: "e.g. John Doe" },
  manageCol: { th: "การจัดการ", en: "Actions" },

  // Info Tab
  classInfoTitle: { th: "ข้อมูลรายละเอียดห้องเรียน", en: "Classroom Details" },
  classDescLabelTab: { th: "คำอธิบาย/หมายเหตุ", en: "Description / Notes" },
  statisticsTitle: { th: "สถิติโดยรวม", en: "Overall Statistics" },
  studentsCountUnit: { th: "คน", en: "students" },
  chaptersCountUnit: { th: "บทเรียน", en: "tests" },

  // Profile Page
  editProfileTitle: { th: "แก้ไขโปรไฟล์ผู้สอน", en: "Edit Profile" },
  editProfileSubtitle: { th: "ปรับปรุงข้อมูลส่วนตัวของคุณครูและข้อมูลสังกัดโรงเรียน", en: "Update teacher personal information and school affiliation." },
  saveProfileBtn: { th: "บันทึกข้อมูลโปรไฟล์", en: "Save Profile Settings" },
  saveProfileSuccess: { th: "บันทึกข้อมูลสำเร็จ!", en: "Profile saved successfully!" },
};

interface LanguageContextType {
  language: Language;
  toggleLanguage: () => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>("th");
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    if (typeof window !== "undefined") {
      const storedLang = localStorage.getItem("tms_lang") as Language;
      if (storedLang === "th" || storedLang === "en") {
        setLanguage(storedLang);
      }
    }
  }, []);

  const toggleLanguage = () => {
    const nextLang: Language = language === "th" ? "en" : "th";
    setLanguage(nextLang);
    if (typeof window !== "undefined") {
      localStorage.setItem("tms_lang", nextLang);
    }
  };

  const t = (key: string): string => {
    if (!translations[key]) {
      return key;
    }
    return translations[key][language];
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
      {isMounted ? children : <div className="invisible">{children}</div>}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
