import { Student, Class, Teacher, TeacherClass, Expense, Course, School, StatisticsData } from '../types';

// Helper function to initialize local storage with mock data
export const initializeLocalStorage = () => {
  if (!localStorage.getItem('students')) {
    localStorage.setItem('students', JSON.stringify([]));
  }
  if (!localStorage.getItem('classes')) {
    localStorage.setItem('classes', JSON.stringify([]));
  }
  if (!localStorage.getItem('teachers')) {
    localStorage.setItem('teachers', JSON.stringify([]));
  }
  if (!localStorage.getItem('teacherClasses')) {
    localStorage.setItem('teacherClasses', JSON.stringify([]));
  }
  if (!localStorage.getItem('expenses')) {
    localStorage.setItem('expenses', JSON.stringify([]));
  }
  if (!localStorage.getItem('schools')) {
    localStorage.setItem('schools', JSON.stringify([]));
  }
   if (!localStorage.getItem('courses')) {
    localStorage.setItem('courses', JSON.stringify([]));
  }
  if (!localStorage.getItem('statisticsData')) {
    localStorage.setItem('statisticsData', JSON.stringify({
      studentsCount: {
        total: 0,
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
    }));
  }
};

// Helper function to save data to local storage
export const saveToLocalStorage = (key: string, data: any) => {
  localStorage.setItem(key, JSON.stringify(data));
};

// Helper function to get data from local storage
export const getFromLocalStorage = <T>(key: string, defaultValue: T): T => {
  const storedData = localStorage.getItem(key);
  return storedData ? JSON.parse(storedData) : defaultValue;
};

// Mock students data
export const students: Student[] = [
  {
    id: "student-1",
    lastName: "Παπαδόπουλος",
    firstName: "Γιώργος",
    school: "ΕΚΠΑ",
    department: "Πληροφορικής",
    phone: "6912345678",
    email: "george.papadopoulos@example.com",
    interestedCourses: ["Μαθηματικά Ι", "Προγραμματισμός"],
    createdAt: new Date()
  },
  {
    id: "student-2",
    lastName: "Ιωάννου",
    firstName: "Μαρία",
    school: "ΑΠΘ",
    department: "Ιατρικής",
    phone: "6987654321",
    email: "maria.ioannou@example.com",
    interestedCourses: ["Βιολογία", "Χημεία"],
    createdAt: new Date()
  },
  {
    id: "student-3",
    lastName: "Δημητρίου",
    firstName: "Κωνσταντίνος",
    school: "ΠΑΔΑ",
    department: "Μηχανολογίας",
    phone: "6955555555",
    email: "konstantinos.dimitriou@example.com",
    interestedCourses: ["Μαθηματικά ΙΙ", "Φυσική Ι"],
    createdAt: new Date()
  }
];

// Mock classes data
export const classes: Class[] = [
  {
    id: "class-1",
    studentId: "student-1",
    studentName: "Παπαδόπουλος Γιώργος",
    school: "ΕΚΠΑ",
    department: "Πληροφορικής",
    course: "Μαθηματικά Ι",
    date: new Date(2023, 5, 10),
    hours: 2,
    ratePerHour: 25,
    total: 50,
    paymentStatus: "paid",
    paymentDate: new Date(2023, 5, 10),
    amountPaid: 50,
    balance: 0,
    paymentMethod: "cash"
  },
  {
    id: "class-2",
    studentId: "student-2",
    studentName: "Ιωάννου Μαρία",
    school: "ΑΠΘ",
    department: "Ιατρικής",
    course: "Βιολογία",
    date: new Date(2023, 5, 12),
    hours: 3,
    ratePerHour: 30,
    total: 90,
    paymentStatus: "pending",
    amountPaid: 0,
    balance: 90
  },
  {
    id: "class-3",
    studentId: "student-3",
    studentName: "Δημητρίου Κωνσταντίνος",
    school: "ΠΑΔΑ",
    department: "Μηχανολογίας",
    course: "Φυσική Ι",
    date: new Date(2023, 5, 15),
    hours: 4,
    ratePerHour: 20,
    total: 80,
    paymentStatus: "partial",
    paymentDate: new Date(2023, 5, 15),
    amountPaid: 40,
    balance: 40,
    paymentMethod: "card"
  }
];

// Mock teachers data with baseSalary and studentBonus
export const teachers: Teacher[] = [
  {
    id: "teacher-1",
    lastName: "Αλεξίου",
    firstName: "Κώστας",
    courses: ["Μαθηματικά Ι", "Μαθηματικά ΙΙ", "Στατιστική"],
    contact: "6944123456",
    baseSalary: 16,
    studentBonus: 1
  },
  {
    id: "teacher-2",
    lastName: "Παπαδοπούλου",
    firstName: "Ελένη",
    courses: ["Φυσική Ι", "Φυσική ΙΙ"],
    contact: "6977654321",
    baseSalary: 17,
    studentBonus: 1.5
  },
  {
    id: "teacher-3",
    lastName: "Γεωργίου",
    firstName: "Δημήτρης",
    courses: ["Προγραμματισμός", "Βάσεις Δεδομένων", "Αλγόριθμοι"],
    contact: "6955678901",
    baseSalary: 18,
    studentBonus: 2
  }
];

// Teacher classes with studentsCount field
export const teacherClasses: TeacherClass[] = [
  {
    id: "teacher-class-1",
    teacherId: "teacher-1",
    teacherName: "Αλεξίου Κώστας",
    course: "Μαθηματικά Ι",
    date: new Date(2023, 5, 15),
    hours: 2,
    studentsCount: 5, // Added studentsCount field
    ratePerHour: 21,   // 16 + 1 * 5
    totalDue: 42,
    amountPaid: 42,
    balance: 0,
    calculationMethod: "formula"
  },
  {
    id: "teacher-class-2",
    teacherId: "teacher-2",
    teacherName: "Παπαδοπούλου Ελένη",
    course: "Φυσική Ι",
    date: new Date(2023, 5, 16),
    hours: 3,
    studentsCount: 4, // Added studentsCount field
    ratePerHour: 23,   // 17 + 1.5 * 4
    totalDue: 69,
    amountPaid: 0,
    balance: 69,
    calculationMethod: "formula"
  },
  {
    id: "teacher-class-3",
    teacherId: "teacher-3",
    teacherName: "Γεωργίου Δημήτρης",
    course: "Προγραμματισμός",
    date: new Date(2023, 5, 17),
    hours: 4,
    studentsCount: 3, // Added studentsCount field
    ratePerHour: 24,   // 18 + 2 * 3
    totalDue: 96,
    amountPaid: 50,
    balance: 46,
    calculationMethod: "formula"
  }
];

// Mock expenses data
export const expenses: Expense[] = [
  {
    id: "expense-1",
    date: new Date(2023, 5, 5),
    description: "Ενοίκιο γραφείου",
    category: "Ενοίκιο",
    amount: 500,
    paymentMethod: "transfer"
  },
  {
    id: "expense-2",
    date: new Date(2023, 5, 7),
    description: "Αγορά γραφικής ύλης",
    category: "Υλικά",
    amount: 50,
    paymentMethod: "card"
  },
  {
    id: "expense-3",
    date: new Date(2023, 5, 9),
    description: "Διαφήμιση στο διαδίκτυο",
    category: "Διαφήμιση",
    amount: 200,
    paymentMethod: "card"
  }
];

// Mock courses data
export const courses: Course[] = [
  {
    id: "course-1",
    school: "ΕΚΠΑ",
    department: "Πληροφορικής",
    name: "Μαθηματικά Ι"
  },
  {
    id: "course-2",
    school: "ΑΠΘ",
    department: "Ιατρικής",
    name: "Βιολογία"
  },
  {
    id: "course-3",
    school: "ΠΑΔΑ",
    department: "Μηχανολογίας",
    name: "Φυσική Ι"
  },
  {
    id: "course-4",
    school: "ΕΚΠΑ",
    department: "Πληροφορικής",
    name: "Μαθηματικά ΙΙ"
  },
  {
    id: "course-5",
    school: "ΑΠΘ",
    department: "Ιατρικής",
    name: "Χημεία"
  },
  {
    id: "course-6",
    school: "ΠΑΔΑ",
    department: "Μηχανολογίας",
    name: "Μαθηματικά ΙΙ"
  },
  {
    id: "course-7",
    school: "ΕΚΠΑ",
    department: "Πληροφορικής",
    name: "Στατιστική"
  },
  {
    id: "course-8",
    school: "ΠΑΔΑ",
    department: "Μηχανολογίας",
    name: "Αντοχή Υλικών"
  },
  {
    id: "course-9",
    school: "ΕΚΠΑ",
    department: "Πληροφορικής",
    name: "Προγραμματισμός"
  },
    {
    id: "course-10",
    school: "ΕΚΠΑ",
    department: "Πληροφορικής",
    name: "Βάσεις Δεδομένων"
  },
  {
    id: "course-11",
    school: "ΕΚΠΑ",
    department: "Πληροφορικής",
    name: "Αλγόριθμοι"
  }
];

// Mock schools data
export const schools: School[] = [
  {
    id: "school-1",
    name: "ΕΚΠΑ",
    departments: [
      {
        id: "department-1",
        name: "Πληροφορικής",
        courses: [
          {
            id: "course-1",
            school: "ΕΚΠΑ",
            department: "Πληροφορικής",
            name: "Μαθηματικά Ι"
          },
          {
            id: "course-4",
            school: "ΕΚΠΑ",
            department: "Πληροφορικής",
            name: "Μαθηματικά ΙΙ"
          },
          {
            id: "course-7",
            school: "ΕΚΠΑ",
            department: "Πληροφορικής",
            name: "Στατιστική"
          },
           {
            id: "course-9",
            school: "ΕΚΠΑ",
            department: "Πληροφορικής",
            name: "Προγραμματισμός"
          },
          {
            id: "course-10",
            school: "ΕΚΠΑ",
            department: "Πληροφορικής",
            name: "Βάσεις Δεδομένων"
          },
          {
            id: "course-11",
            school: "ΕΚΠΑ",
            department: "Πληροφορικής",
            name: "Αλγόριθμοι"
          }
        ]
      }
    ]
  },
  {
    id: "school-2",
    name: "ΑΠΘ",
    departments: [
      {
        id: "department-2",
        name: "Ιατρικής",
        courses: [
          {
            id: "course-2",
            school: "ΑΠΘ",
            department: "Ιατρικής",
            name: "Βιολογία"
          },
          {
            id: "course-5",
            school: "ΑΠΘ",
            department: "Ιατρικής",
            name: "Χημεία"
          }
        ]
      }
    ]
  },
  {
    id: "school-3",
    name: "ΠΑΔΑ",
    departments: [
      {
        id: "department-3",
        name: "Μηχανολογίας",
        courses: [
          {
            id: "course-3",
            school: "ΠΑΔΑ",
            department: "Μηχανολογίας",
            name: "Φυσική Ι"
          },
          {
            id: "course-6",
            school: "ΠΑΔΑ",
            department: "Μηχανολογίας",
            name: "Μαθηματικά ΙΙ"
          },
          {
            id: "course-8",
            school: "ΠΑΔΑ",
            department: "Μηχανολογίας",
            name: "Αντοχή Υλικών"
          }
        ]
      }
    ]
  }
];

// Mock statistics data
export const statisticsData: StatisticsData = {
  studentsCount: {
    total: students.length,
    bySchool: {
      "ΕΚΠΑ": 1,
      "ΑΠΘ": 1,
      "ΠΑΔΑ": 1
    }
  },
  revenue: {
    daily: 100,
    monthly: 1000,
    yearly: 12000
  },
  expenses: {
    daily: 50,
    monthly: 500,
    yearly: 6000
  },
  studentBalances: 500,
  teacherBalances: 1000
};
