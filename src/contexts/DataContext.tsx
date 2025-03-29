import React, { createContext, useContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { 
  Student, 
  Class, 
  Teacher, 
  TeacherClass, 
  Expense, 
  Course, 
  School,
  StatisticsData
} from '../types';
import { 
  students as initialStudents,
  classes as initialClasses,
  teachers as initialTeachers,
  teacherClasses as initialTeacherClasses,
  expenses as initialExpenses,
  schools as initialSchools,
  courses as initialCourses,
  statisticsData as initialStatisticsData,
  saveToLocalStorage,
  getFromLocalStorage,
  initializeLocalStorage
} from '../services/mockData';
import { toast } from 'sonner';

interface DataContextType {
  students: Student[];
  classes: Class[];
  teachers: Teacher[];
  teacherClasses: TeacherClass[];
  expenses: Expense[];
  schools: School[];
  courses: Course[];
  statisticsData: StatisticsData;
  addStudent: (student: Omit<Student, 'id' | 'createdAt'>) => void;
  addClass: (classItem: Omit<Class, 'id' | 'total' | 'balance'>) => void;
  addTeacher: (teacher: Omit<Teacher, 'id'>) => void;
  addTeacherClass: (teacherClass: Omit<TeacherClass, 'id' | 'totalDue' | 'balance'>) => void;
  addExpense: (expense: Omit<Expense, 'id'>) => void;
  addCourse: (course: Omit<Course, 'id'>) => void;
  updateStudent: (id: string, student: Partial<Student>) => void;
  updateClass: (id: string, classItem: Partial<Class>) => void;
  updateTeacher: (id: string, teacher: Partial<Teacher>) => void;
  updateTeacherClass: (id: string, teacherClass: Partial<TeacherClass>) => void;
  updateExpense: (id: string, expense: Partial<Expense>) => void;
  updateCourse: (id: string, course: Partial<Course>) => void;
  deleteStudent: (id: string) => void;
  deleteClass: (id: string) => void;
  deleteTeacher: (id: string) => void;
  deleteTeacherClass: (id: string) => void;
  deleteExpense: (id: string) => void;
  deleteCourse: (id: string) => void;
  uploadCourses: (csvData: string) => void;
  refreshStatistics: () => void;
  calculateTeacherRate: (teacherId: string, studentsCount: number) => number;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [students, setStudents] = useState<Student[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [teacherClasses, setTeacherClasses] = useState<TeacherClass[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [schools, setSchools] = useState<School[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [statisticsData, setStatisticsData] = useState<StatisticsData>(initialStatisticsData);

  useEffect(() => {
    initializeLocalStorage();
    setStudents(getFromLocalStorage('students', initialStudents));
    setClasses(getFromLocalStorage('classes', initialClasses));
    setTeachers(getFromLocalStorage('teachers', initialTeachers));
    setTeacherClasses(getFromLocalStorage('teacherClasses', initialTeacherClasses));
    setExpenses(getFromLocalStorage('expenses', initialExpenses));
    setSchools(getFromLocalStorage('schools', initialSchools));
    setCourses(getFromLocalStorage('courses', initialCourses));
    refreshStatistics();
  }, []);

  const refreshStatistics = () => {
    const storedStudents = getFromLocalStorage('students', initialStudents);
    const storedClasses = getFromLocalStorage('classes', initialClasses);
    const storedExpenses = getFromLocalStorage('expenses', initialExpenses);
    const storedTeacherClasses = getFromLocalStorage('teacherClasses', initialTeacherClasses);

    const schoolCounts: Record<string, number> = {};
    storedStudents.forEach(student => {
      schoolCounts[student.school] = (schoolCounts[student.school] || 0) + 1;
    });

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const firstDayOfYear = new Date(now.getFullYear(), 0, 1);

    const dailyRevenue = storedClasses
      .filter(c => new Date(c.date).getTime() >= today.getTime())
      .reduce((sum, c) => sum + c.amountPaid, 0);

    const monthlyRevenue = storedClasses
      .filter(c => new Date(c.date).getTime() >= firstDayOfMonth.getTime())
      .reduce((sum, c) => sum + c.amountPaid, 0);

    const yearlyRevenue = storedClasses
      .filter(c => new Date(c.date).getTime() >= firstDayOfYear.getTime())
      .reduce((sum, c) => sum + c.amountPaid, 0);

    const dailyExpenses = storedExpenses
      .filter(e => new Date(e.date).getTime() >= today.getTime())
      .reduce((sum, e) => sum + e.amount, 0);

    const monthlyExpenses = storedExpenses
      .filter(e => new Date(e.date).getTime() >= firstDayOfMonth.getTime())
      .reduce((sum, e) => sum + e.amount, 0);

    const yearlyExpenses = storedExpenses
      .filter(e => new Date(e.date).getTime() >= firstDayOfYear.getTime())
      .reduce((sum, e) => sum + e.amount, 0);

    const studentBalances = storedClasses.reduce((sum, c) => sum + c.balance, 0);
    const teacherBalances = storedTeacherClasses.reduce((sum, tc) => sum + tc.balance, 0);

    const newStatistics: StatisticsData = {
      studentsCount: {
        total: storedStudents.length,
        bySchool: schoolCounts
      },
      revenue: {
        daily: dailyRevenue,
        monthly: monthlyRevenue,
        yearly: yearlyRevenue
      },
      expenses: {
        daily: dailyExpenses,
        monthly: monthlyExpenses,
        yearly: yearlyExpenses
      },
      studentBalances,
      teacherBalances
    };

    setStatisticsData(newStatistics);
    saveToLocalStorage('statisticsData', newStatistics);
  };

  const calculateTeacherRate = (teacherId: string, studentsCount: number) => {
    const teacher = teachers.find(t => t.id === teacherId);
    if (!teacher) return 25;
    
    const baseSalary = teacher.baseSalary || 16;
    const studentBonus = teacher.studentBonus || 1;
    
    return baseSalary + (studentBonus * studentsCount);
  };

  const addStudent = (student: Omit<Student, 'id' | 'createdAt'>) => {
    const newStudent: Student = {
      ...student,
      id: uuidv4(),
      createdAt: new Date()
    };
    const updatedStudents = [...students, newStudent];
    setStudents(updatedStudents);
    saveToLocalStorage('students', updatedStudents);
    toast.success('Ο φοιτητής προστέθηκε επιτυχώς');
    refreshStatistics();
  };

  const updateStudent = (id: string, studentData: Partial<Student>) => {
    const updatedStudents = students.map(student => 
      student.id === id ? { ...student, ...studentData } : student
    );
    setStudents(updatedStudents);
    saveToLocalStorage('students', updatedStudents);
    toast.success('Τα στοιχεία του φοιτητή ενημερώθηκαν');
    refreshStatistics();
  };

  const deleteStudent = (id: string) => {
    const updatedStudents = students.filter(student => student.id !== id);
    setStudents(updatedStudents);
    saveToLocalStorage('students', updatedStudents);
    toast.success('Ο φοιτητής διαγράφηκε');
    refreshStatistics();
  };

  const addClass = (classItem: Omit<Class, 'id' | 'total' | 'balance'>) => {
    const total = classItem.hours * classItem.ratePerHour;
    const balance = total - classItem.amountPaid;
    const newClass: Class = {
      ...classItem,
      id: uuidv4(),
      total,
      balance
    };
    const updatedClasses = [...classes, newClass];
    setClasses(updatedClasses);
    saveToLocalStorage('classes', updatedClasses);
    toast.success('Το μάθημα καταχωρήθηκε επιτυχώς');
    refreshStatistics();
  };

  const updateClass = (id: string, classData: Partial<Class>) => {
    const updatedClasses = classes.map(classItem => {
      if (classItem.id === id) {
        const updatedItem = { ...classItem, ...classData };
        
        if (classData.hours !== undefined || classData.ratePerHour !== undefined) {
          updatedItem.total = (classData.hours || classItem.hours) * (classData.ratePerHour || classItem.ratePerHour);
        }
        
        if (classData.amountPaid !== undefined || updatedItem.total !== classItem.total) {
          updatedItem.balance = updatedItem.total - (classData.amountPaid || classItem.amountPaid);
        }
        
        return updatedItem;
      }
      return classItem;
    });
    
    setClasses(updatedClasses);
    saveToLocalStorage('classes', updatedClasses);
    toast.success('Τα στοιχεία του μαθήματος ενημερώθηκαν');
    refreshStatistics();
  };

  const deleteClass = (id: string) => {
    const updatedClasses = classes.filter(classItem => classItem.id !== id);
    setClasses(updatedClasses);
    saveToLocalStorage('classes', updatedClasses);
    toast.success('Το μάθημα διαγράφηκε');
    refreshStatistics();
  };

  const addTeacher = (teacher: Omit<Teacher, 'id'>) => {
    const newTeacher: Teacher = {
      ...teacher,
      id: uuidv4(),
      baseSalary: teacher.baseSalary || 16,
      studentBonus: teacher.studentBonus || 1
    };
    const updatedTeachers = [...teachers, newTeacher];
    setTeachers(updatedTeachers);
    saveToLocalStorage('teachers', updatedTeachers);
    toast.success('Ο καθηγητής προστέθηκε επιτυχώς');
  };

  const updateTeacher = (id: string, teacherData: Partial<Teacher>) => {
    const updatedTeachers = teachers.map(teacher => 
      teacher.id === id ? { ...teacher, ...teacherData } : teacher
    );
    setTeachers(updatedTeachers);
    saveToLocalStorage('teachers', updatedTeachers);
    toast.success('Τα στοιχεία του καθηγητή ενημερώθηκαν');
  };

  const deleteTeacher = (id: string) => {
    const updatedTeachers = teachers.filter(teacher => teacher.id !== id);
    setTeachers(updatedTeachers);
    saveToLocalStorage('teachers', updatedTeachers);
    toast.success('Ο καθηγητής διαγράφηκε');
  };

  const addTeacherClass = (teacherClass: Omit<TeacherClass, 'id' | 'totalDue' | 'balance' | 'ratePerHour'>) => {
    const ratePerHour = teacherClass.calculationMethod === 'formula' 
      ? calculateTeacherRate(teacherClass.teacherId, teacherClass.studentsCount)
      : 25;
    
    const totalDue = teacherClass.hours * ratePerHour;
    const balance = totalDue - teacherClass.amountPaid;
    
    const newTeacherClass: TeacherClass = {
      ...teacherClass,
      id: uuidv4(),
      ratePerHour,
      totalDue,
      balance
    };
    
    const updatedTeacherClasses = [...teacherClasses, newTeacherClass];
    setTeacherClasses(updatedTeacherClasses);
    saveToLocalStorage('teacherClasses', updatedTeacherClasses);
    toast.success('Η διδασκαλία καταχωρήθηκε επιτυχώς');
    refreshStatistics();
  };

  const updateTeacherClass = (id: string, teacherClassData: Partial<TeacherClass>) => {
    const updatedTeacherClasses = teacherClasses.map(teacherClass => {
      if (teacherClass.id === id) {
        const updatedItem = { ...teacherClass, ...teacherClassData };
        
        if (teacherClassData.studentsCount !== undefined || 
            teacherClassData.calculationMethod !== undefined ||
            teacherClassData.hours !== undefined ||
            teacherClassData.teacherId !== undefined) {
          
          if (teacherClassData.calculationMethod === 'formula' || 
              (updatedItem.calculationMethod === 'formula' && 
               (teacherClassData.studentsCount !== undefined || teacherClassData.teacherId !== undefined))) {
            
            updatedItem.ratePerHour = calculateTeacherRate(
              teacherClassData.teacherId || teacherClass.teacherId, 
              teacherClassData.studentsCount !== undefined ? teacherClassData.studentsCount : teacherClass.studentsCount
            );
          } else if (teacherClassData.calculationMethod === 'fixed') {
            updatedItem.ratePerHour = teacherClassData.ratePerHour || teacherClass.ratePerHour || 25;
          }
          
          updatedItem.totalDue = updatedItem.ratePerHour * (teacherClassData.hours || teacherClass.hours);
        }
        
        if (teacherClassData.amountPaid !== undefined || updatedItem.totalDue !== teacherClass.totalDue) {
          updatedItem.balance = updatedItem.totalDue - (teacherClassData.amountPaid || teacherClass.amountPaid);
        }
        
        return updatedItem;
      }
      return teacherClass;
    });
    
    setTeacherClasses(updatedTeacherClasses);
    saveToLocalStorage('teacherClasses', updatedTeacherClasses);
    toast.success('Τα στοιχεία της διδασκαλίας ενημερώθηκαν');
    refreshStatistics();
  };

  const deleteTeacherClass = (id: string) => {
    const updatedTeacherClasses = teacherClasses.filter(teacherClass => teacherClass.id !== id);
    setTeacherClasses(updatedTeacherClasses);
    saveToLocalStorage('teacherClasses', updatedTeacherClasses);
    toast.success('Η διδασκαλία διαγράφηκε');
    refreshStatistics();
  };

  const addExpense = (expense: Omit<Expense, 'id'>) => {
    const newExpense: Expense = {
      ...expense,
      id: uuidv4()
    };
    const updatedExpenses = [...expenses, newExpense];
    setExpenses(updatedExpenses);
    saveToLocalStorage('expenses', updatedExpenses);
    toast.success('Το έξοδο προστέθηκε επιτυχώς');
    refreshStatistics();
  };

  const updateExpense = (id: string, expenseData: Partial<Expense>) => {
    const updatedExpenses = expenses.map(expense => 
      expense.id === id ? { ...expense, ...expenseData } : expense
    );
    setExpenses(updatedExpenses);
    saveToLocalStorage('expenses', updatedExpenses);
    toast.success('Τα στοιχεία του εξόδου ενημερώθηκαν');
    refreshStatistics();
  };

  const deleteExpense = (id: string) => {
    const updatedExpenses = expenses.filter(expense => expense.id !== id);
    setExpenses(updatedExpenses);
    saveToLocalStorage('expenses', updatedExpenses);
    toast.success('Το έξοδο διαγράφηκε');
    refreshStatistics();
  };

  const addCourse = (course: Omit<Course, 'id'>) => {
    const newCourse: Course = {
      ...course,
      id: uuidv4()
    };
    const updatedCourses = [...courses, newCourse];
    setCourses(updatedCourses);
    saveToLocalStorage('courses', updatedCourses);
    
    const updatedSchools = [...schools];
    const schoolIndex = updatedSchools.findIndex(s => s.name === course.school);
    
    if (schoolIndex >= 0) {
      const departmentIndex = updatedSchools[schoolIndex].departments.findIndex(
        d => d.name === course.department
      );
      
      if (departmentIndex >= 0) {
        updatedSchools[schoolIndex].departments[departmentIndex].courses.push(newCourse);
      } else {
        updatedSchools[schoolIndex].departments.push({
          id: uuidv4(),
          name: course.department,
          courses: [newCourse]
        });
      }
    } else {
      updatedSchools.push({
        id: uuidv4(),
        name: course.school,
        departments: [{
          id: uuidv4(),
          name: course.department,
          courses: [newCourse]
        }]
      });
    }
    
    setSchools(updatedSchools);
    saveToLocalStorage('schools', updatedSchools);
    toast.success('Το μάθημα προστέθηκε επιτυχώς');
  };

  const updateCourse = (id: string, courseData: Partial<Course>) => {
    const updatedCourses = courses.map(course => 
      course.id === id ? { ...course, ...courseData } : course
    );
    setCourses(updatedCourses);
    saveToLocalStorage('courses', updatedCourses);
  };

  const deleteCourse = (id: string) => {
    const updatedCourses = courses.filter(course => course.id !== id);
    setCourses(updatedCourses);
    saveToLocalStorage('courses', updatedCourses);
  };

  const uploadCourses = (csvData: string) => {
    try {
      const lines = csvData.split('\n');
      const newCourses: Course[] = [];
      const updatedSchools: School[] = [...schools];
      
      const startIndex = lines[0].includes('School') || lines[0].includes('Σχολή') ? 1 : 0;
      
      for (let i = startIndex; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;
        
        const [school, department, courseName] = line.split(',').map(s => s.trim());
        
        if (school && department && courseName) {
          const newCourse: Course = {
            id: uuidv4(),
            school,
            department,
            name: courseName
          };
          
          newCourses.push(newCourse);
          
          let schoolIndex = updatedSchools.findIndex(s => s.name === school);
          
          if (schoolIndex === -1) {
            updatedSchools.push({
              id: uuidv4(),
              name: school,
              departments: []
            });
            schoolIndex = updatedSchools.length - 1;
          }
          
          let departmentIndex = updatedSchools[schoolIndex].departments.findIndex(
            d => d.name === department
          );
          
          if (departmentIndex === -1) {
            updatedSchools[schoolIndex].departments.push({
              id: uuidv4(),
              name: department,
              courses: []
            });
            departmentIndex = updatedSchools[schoolIndex].departments.length - 1;
          }
          
          updatedSchools[schoolIndex].departments[departmentIndex].courses.push(newCourse);
        }
      }
      
      const allCourses = [...courses, ...newCourses];
      setCourses(allCourses);
      setSchools(updatedSchools);
      saveToLocalStorage('courses', allCourses);
      saveToLocalStorage('schools', updatedSchools);
      
      toast.success(`${newCourses.length} μαθήματα εισήχθησαν επιτυχώς`);
    } catch (error) {
      console.error('Error parsing CSV:', error);
      toast.error('Σφάλμα κατά την εισαγωγή του αρχείου CSV');
    }
  };

  return (
    <DataContext.Provider value={{
      students,
      classes,
      teachers,
      teacherClasses,
      expenses,
      schools,
      courses,
      statisticsData,
      addStudent,
      addClass,
      addTeacher,
      addTeacherClass,
      addExpense,
      addCourse,
      updateStudent,
      updateClass,
      updateTeacher,
      updateTeacherClass,
      updateExpense,
      updateCourse,
      deleteStudent,
      deleteClass,
      deleteTeacher,
      deleteTeacherClass,
      deleteExpense,
      deleteCourse,
      uploadCourses,
      refreshStatistics,
      calculateTeacherRate
    }}>
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
