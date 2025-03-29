import React, { createContext, useContext, useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { toast } from "sonner";
import { mockStudents, mockClasses, mockTeachers, mockTeacherClasses, mockExpenses, mockSchools } from "@/services/mockData";
import type { Student, Class, Teacher, TeacherClass, Expense, Course, School, StatisticsData } from "@/types";

interface DataContextType {
  students: Student[];
  classes: Class[];
  teachers: Teacher[];
  teacherClasses: TeacherClass[];
  expenses: Expense[];
  schools: School[];
  courses: Course[];
  statistics: StatisticsData;
  addStudent: (student: Omit<Student, "id" | "createdAt">) => void;
  updateStudent: (id: string, student: Partial<Student>) => void;
  deleteStudent: (id: string) => void;
  addClass: (classItem: Omit<Class, "id">) => void;
  updateClass: (id: string, classItem: Partial<Class>) => void;
  deleteClass: (id: string) => void;
  addTeacher: (teacher: Omit<Teacher, "id">) => void;
  updateTeacher: (id: string, teacher: Partial<Teacher>) => void;
  deleteTeacher: (id: string) => void;
  addTeacherClass: (teacherClass: Omit<TeacherClass, "id" | "totalDue" | "balance" | "ratePerHour">) => void;
  updateTeacherClass: (id: string, teacherClass: Partial<TeacherClass>) => void;
  deleteTeacherClass: (id: string) => void;
  addExpense: (expense: Omit<Expense, "id">) => void;
  updateExpense: (id: string, expense: Partial<Expense>) => void;
  deleteExpense: (id: string) => void;
  importSchools: (schools: Partial<School>[]) => void;
  calculateTeacherRate: (teacherId: string, studentsCount: number) => number;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [students, setStudents] = useState<Student[]>(() => {
    const storedStudents = localStorage.getItem('students');
    return storedStudents ? JSON.parse(storedStudents) : mockStudents;
  });
  const [classes, setClasses] = useState<Class[]>(() => {
    const storedClasses = localStorage.getItem('classes');
    return storedClasses ? JSON.parse(storedClasses) : mockClasses;
  });
  const [teachers, setTeachers] = useState<Teacher[]>(() => {
    const storedTeachers = localStorage.getItem('teachers');
    return storedTeachers ? JSON.parse(storedTeachers) : mockTeachers;
  });
  const [teacherClasses, setTeacherClasses] = useState<TeacherClass[]>(() => {
    const storedTeacherClasses = localStorage.getItem('teacherClasses');
    return storedTeacherClasses ? JSON.parse(storedTeacherClasses) : mockTeacherClasses;
  });
  const [expenses, setExpenses] = useState<Expense[]>(() => {
    const storedExpenses = localStorage.getItem('expenses');
    return storedExpenses ? JSON.parse(storedExpenses) : mockExpenses;
  });
  const [schools, setSchools] = useState<School[]>(() => {
    const storedSchools = localStorage.getItem('schools');
    return storedSchools ? JSON.parse(storedSchools) : mockSchools;
  });
  const [courses, setCourses] = useState<Course[]>(() => {
    const storedCourses = localStorage.getItem('courses');
    return storedCourses ? JSON.parse(storedCourses) : schools.flatMap(school =>
      school.departments.flatMap(department =>
        department.courses.map(course => ({
          id: course.id,
          school: school.name,
          department: department.name,
          name: course.name
        }))
      )
    );
  });
  const [statistics, setStatistics] = useState<StatisticsData>({
    studentsCount: {
      total: mockStudents.length,
      bySchool: {}
    },
    revenue: {
      daily: 0,
      monthly: 0,
      yearly: 0
    },
    expenses: {
      daily: 0,
      monthly: 0,
      yearly: 0
    },
    studentBalances: 0,
    teacherBalances: 0
  });

  useEffect(() => {
    localStorage.setItem('students', JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    localStorage.setItem('classes', JSON.stringify(classes));
  }, [classes]);

  useEffect(() => {
    localStorage.setItem('teachers', JSON.stringify(teachers));
  }, [teachers]);

  useEffect(() => {
    localStorage.setItem('teacherClasses', JSON.stringify(teacherClasses));
  }, [teacherClasses]);

  useEffect(() => {
    localStorage.setItem('expenses', JSON.stringify(expenses));
  }, [expenses]);

  useEffect(() => {
    localStorage.setItem('schools', JSON.stringify(schools));
  }, [schools]);

  useEffect(() => {
    localStorage.setItem('courses', JSON.stringify(courses));
  }, [courses]);

  const saveToLocalStorage = (key: string, data: any) => {
    localStorage.setItem(key, JSON.stringify(data));
  };

  const addStudent = (student: Omit<Student, "id" | "createdAt">) => {
    const newStudent: Student = {
      id: uuidv4(),
      ...student,
      createdAt: new Date()
    };
    setStudents([...students, newStudent]);
    saveToLocalStorage('students', [...students, newStudent]);
    setStatistics(prev => ({
      ...prev,
      studentsCount: {
        ...prev.studentsCount,
        total: prev.studentsCount.total + 1
      }
    }));
    toast.success("Ο φοιτητής καταχωρήθηκε επιτυχώς!");
  };

  const updateStudent = (id: string, student: Partial<Student>) => {
    const updatedStudents = students.map(s => s.id === id ? { ...s, ...student } : s);
    setStudents(updatedStudents);
    saveToLocalStorage('students', updatedStudents);
    toast.success("Τα στοιχεία του φοιτητή ανανεώθηκαν επιτυχώς!");
  };

  const deleteStudent = (id: string) => {
    setStudents(students.filter(s => s.id !== id));
    saveToLocalStorage('students', students.filter(s => s.id !== id));
    setStatistics(prev => ({
      ...prev,
      studentsCount: {
        ...prev.studentsCount,
        total: prev.studentsCount.total - 1
      }
    }));
    toast.success("Ο φοιτητής διαγράφηκε επιτυχώς!");
  };

  const addClass = (classItem: Omit<Class, "id">) => {
    const newClass: Class = {
      id: uuidv4(),
      ...classItem
    };
    setClasses([...classes, newClass]);
    saveToLocalStorage('classes', [...classes, newClass]);
    toast.success("Το μάθημα καταχωρήθηκε επιτυχώς!");
  };

  const updateClass = (id: string, classItem: Partial<Class>) => {
    const updatedClasses = classes.map(c => c.id === id ? { ...c, ...classItem } : c);
    setClasses(updatedClasses);
    saveToLocalStorage('classes', updatedClasses);
    toast.success("Τα στοιχεία του μαθήματος ανανεώθηκαν επιτυχώς!");
  };

  const deleteClass = (id: string) => {
    setClasses(classes.filter(c => c.id !== id));
    saveToLocalStorage('classes', classes.filter(c => c.id !== id));
    toast.success("Το μάθημα διαγράφηκε επιτυχώς!");
  };

  const addTeacher = (teacher: Omit<Teacher, "id">) => {
    const newTeacher: Teacher = {
      id: uuidv4(),
      ...teacher
    };
    setTeachers([...teachers, newTeacher]);
    saveToLocalStorage('teachers', [...teachers, newTeacher]);
    toast.success("Ο καθηγητής καταχωρήθηκε επιτυχώς!");
  };

  const updateTeacher = (id: string, teacher: Partial<Teacher>) => {
    const updatedTeachers = teachers.map(t => t.id === id ? { ...t, ...teacher } : t);
    setTeachers(updatedTeachers);
    saveToLocalStorage('teachers', updatedTeachers);
    toast.success("Τα στοιχεία του καθηγητή ανανεώθηκαν επιτυχώς!");
  };

  const deleteTeacher = (id: string) => {
    setTeachers(teachers.filter(t => t.id !== id));
    saveToLocalStorage('teachers', teachers.filter(t => t.id !== id));
    toast.success("Ο καθηγητής διαγράφηκε επιτυχώς!");
  };

  const addTeacherClass = (teacherClass: Omit<TeacherClass, "id" | "totalDue" | "balance" | "ratePerHour">) => {
    const teacher = teachers.find(t => t.id === teacherClass.teacherId);
    if (!teacher) {
      toast.error("Δεν βρέθηκε ο καθηγητής!");
      return;
    }

    const ratePerHour = calculateTeacherRate(teacher.id, teacherClass.studentsCount);
    const totalDue = teacherClass.hours * ratePerHour;
    const newTeacherClass: TeacherClass = {
      id: uuidv4(),
      ...teacherClass,
      teacherName: `${teacher.firstName} ${teacher.lastName}`,
      ratePerHour: ratePerHour,
      totalDue: totalDue,
      amountPaid: 0,
      balance: totalDue
    };
    setTeacherClasses([...teacherClasses, newTeacherClass]);
    saveToLocalStorage('teacherClasses', [...teacherClasses, newTeacherClass]);
    toast.success("Η διδασκαλία καταχωρήθηκε επιτυχώς!");
  };

  const updateTeacherClass = (id: string, teacherClass: Partial<TeacherClass>) => {
    const updatedTeacherClasses = teacherClasses.map(tc => tc.id === id ? { ...tc, ...teacherClass } : tc);
    setTeacherClasses(updatedTeacherClasses);
    saveToLocalStorage('teacherClasses', updatedTeacherClasses);
    toast.success("Τα στοιχεία της διδασκαλίας ανανεώθηκαν επιτυχώς!");
  };

  const deleteTeacherClass = (id: string) => {
    setTeacherClasses(teacherClasses.filter(tc => tc.id !== id));
    saveToLocalStorage('teacherClasses', teacherClasses.filter(tc => tc.id !== id));
    toast.success("Η διδασκαλία διαγράφηκε επιτυχώς!");
  };

  const addExpense = (expense: Omit<Expense, "id">) => {
    const newExpense: Expense = {
      id: uuidv4(),
      ...expense,
    };
    setExpenses([...expenses, newExpense]);
    saveToLocalStorage('expenses', [...expenses, newExpense]);
    toast.success("Το έξοδο καταχωρήθηκε επιτυχώς!");
  };

  const updateExpense = (id: string, expense: Partial<Expense>) => {
    const updatedExpenses = expenses.map(e => e.id === id ? { ...e, ...expense } : e);
    setExpenses(updatedExpenses);
    saveToLocalStorage('expenses', updatedExpenses);
    toast.success("Τα στοιχεία του εξόδου ανανεώθηκαν επιτυχώς!");
  };

  const deleteExpense = (id: string) => {
    setExpenses(expenses.filter(e => e.id !== id));
    saveToLocalStorage('expenses', expenses.filter(e => e.id !== id));
    toast.success("Το έξοδο διαγράφηκε επιτυχώς!");
  };

  const importSchools = (importedSchools: Partial<School>[]) => {
    const newSchools = importedSchools.map(importedSchool => {
      const existingSchool = schools.find(s => s.name === importedSchool.name);
      
      if (existingSchool) {
        const updatedDepartments = [...existingSchool.departments];
        
        importedSchool.departments?.forEach(importedDept => {
          const existingDeptIndex = updatedDepartments.findIndex(d => d.name === importedDept.name);
          
          if (existingDeptIndex >= 0) {
            const existingCourses = updatedDepartments[existingDeptIndex].courses;
            const importedCourses = importedDept.courses || [];
            
            importedCourses.forEach(importedCourse => {
              if (!existingCourses.some(c => c.name === importedCourse.name)) {
                existingCourses.push({
                  id: uuidv4(),
                  ...importedCourse
                });
              }
            });
          } else {
            updatedDepartments.push({
              id: uuidv4(),
              name: importedDept.name || "",
              courses: (importedDept.courses || []).map(course => ({
                id: uuidv4(),
                ...course
              }))
            });
          }
        });
        
        return {
          ...existingSchool,
          departments: updatedDepartments
        };
      } else {
        return {
          id: uuidv4(),
          name: importedSchool.name || "",
          departments: (importedSchool.departments || []).map(dept => ({
            id: uuidv4(),
            name: dept.name || "",
            courses: (dept.courses || []).map(course => ({
              id: uuidv4(),
              ...course
            }))
          }))
        };
      }
    });
    
    const mergedSchools = [
      ...schools.filter(school => !newSchools.some(newSchool => newSchool.name === school.name)),
      ...newSchools
    ];
    
    setSchools(mergedSchools);
    saveToLocalStorage('schools', mergedSchools);
    
    const allCourses = extractCoursesFromSchools(mergedSchools);
    setCourses(allCourses);
    saveToLocalStorage('courses', allCourses);
    
    toast.success('Οι σχολές και τα μαθήματα εισήχθησαν επιτυχώς');
  };

  const extractCoursesFromSchools = (schools: School[]): Course[] => {
    const coursesArray: Course[] = [];
    
    schools.forEach(school => {
      school.departments.forEach(department => {
        department.courses.forEach(course => {
          coursesArray.push({
            id: course.id,
            school: school.name,
            department: department.name,
            name: course.name
          });
        });
      });
    });
    
    return coursesArray;
  };

  const calculateTeacherRate = (teacherId: string, studentsCount: number): number => {
    const teacher = teachers.find(t => t.id === teacherId);
    if (!teacher) {
      return 0;
    }

    return teacher.baseSalary + (teacher.studentBonus * studentsCount);
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
      statistics,
      addStudent,
      updateStudent,
      deleteStudent,
      addClass,
      updateClass,
      deleteClass,
      addTeacher,
      updateTeacher,
      deleteTeacher,
      addTeacherClass,
      updateTeacherClass,
      deleteTeacherClass,
      addExpense,
      updateExpense,
      deleteExpense,
      importSchools,
      calculateTeacherRate
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
};
