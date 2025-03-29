
import { Student, Class, Teacher, TeacherClass, Expense, Course, School, StatisticsData } from "../types";
import { v4 as uuidv4 } from "uuid";

// Mock schools and departments data
export const schools: School[] = [
  {
    id: "1",
    name: "Πανεπιστήμιο Αθηνών",
    departments: [
      {
        id: "1-1",
        name: "Πληροφορικής & Τηλεπικοινωνιών",
        courses: [
          { id: "c1", school: "Πανεπιστήμιο Αθηνών", department: "Πληροφορικής & Τηλεπικοινωνιών", name: "Αλγόριθμοι" },
          { id: "c2", school: "Πανεπιστήμιο Αθηνών", department: "Πληροφορικής & Τηλεπικοινωνιών", name: "Δομές Δεδομένων" },
          { id: "c3", school: "Πανεπιστήμιο Αθηνών", department: "Πληροφορικής & Τηλεπικοινωνιών", name: "Βάσεις Δεδομένων" }
        ]
      },
      {
        id: "1-2",
        name: "Οικονομικών Επιστημών",
        courses: [
          { id: "c4", school: "Πανεπιστήμιο Αθηνών", department: "Οικονομικών Επιστημών", name: "Μικροοικονομία" },
          { id: "c5", school: "Πανεπιστήμιο Αθηνών", department: "Οικονομικών Επιστημών", name: "Μακροοικονομία" }
        ]
      }
    ]
  },
  {
    id: "2",
    name: "Εθνικό Μετσόβιο Πολυτεχνείο",
    departments: [
      {
        id: "2-1",
        name: "Ηλεκτρολόγων Μηχανικών",
        courses: [
          { id: "c6", school: "Εθνικό Μετσόβιο Πολυτεχνείο", department: "Ηλεκτρολόγων Μηχανικών", name: "Ηλεκτροτεχνία" },
          { id: "c7", school: "Εθνικό Μετσόβιο Πολυτεχνείο", department: "Ηλεκτρολόγων Μηχανικών", name: "Ηλεκτρονική" }
        ]
      },
      {
        id: "2-2",
        name: "Μηχανολόγων Μηχανικών",
        courses: [
          { id: "c8", school: "Εθνικό Μετσόβιο Πολυτεχνείο", department: "Μηχανολόγων Μηχανικών", name: "Μηχανική Ρευστών" },
          { id: "c9", school: "Εθνικό Μετσόβιο Πολυτεχνείο", department: "Μηχανολόγων Μηχανικών", name: "Θερμοδυναμική" }
        ]
      }
    ]
  }
];

// Extract all courses from schools
export const courses: Course[] = schools.flatMap(school => 
  school.departments.flatMap(dept => dept.courses)
);

// Mock students data
export const students: Student[] = [
  {
    id: uuidv4(),
    lastName: "Παπαδόπουλος",
    firstName: "Γιάννης",
    school: "Πανεπιστήμιο Αθηνών",
    department: "Πληροφορικής & Τηλεπικοινωνιών",
    phone: "6912345678",
    email: "gpapadopoulos@example.com",
    interestedCourses: ["Αλγόριθμοι", "Δομές Δεδομένων"],
    createdAt: new Date(2023, 8, 15)
  },
  {
    id: uuidv4(),
    lastName: "Κωνσταντίνου",
    firstName: "Μαρία",
    school: "Εθνικό Μετσόβιο Πολυτεχνείο",
    department: "Ηλεκτρολόγων Μηχανικών",
    phone: "6987654321",
    email: "mkonstantinou@example.com",
    interestedCourses: ["Ηλεκτροτεχνία"],
    createdAt: new Date(2023, 9, 3)
  },
  {
    id: uuidv4(),
    lastName: "Αντωνίου",
    firstName: "Κώστας",
    school: "Πανεπιστήμιο Αθηνών",
    department: "Οικονομικών Επιστημών",
    phone: "6955554444",
    email: "kantoniou@example.com",
    interestedCourses: ["Μικροοικονομία", "Μακροοικονομία"],
    createdAt: new Date(2023, 10, 10)
  }
];

// Mock classes data
export const classes: Class[] = [
  {
    id: uuidv4(),
    studentId: students[0].id,
    studentName: `${students[0].lastName} ${students[0].firstName}`,
    school: students[0].school,
    department: students[0].department,
    course: "Αλγόριθμοι",
    date: new Date(2023, 11, 5),
    hours: 2,
    ratePerHour: 25,
    total: 50,
    paymentStatus: "paid",
    paymentDate: new Date(2023, 11, 5),
    amountPaid: 50,
    balance: 0,
    paymentMethod: "Μετρητά"
  },
  {
    id: uuidv4(),
    studentId: students[1].id,
    studentName: `${students[1].lastName} ${students[1].firstName}`,
    school: students[1].school,
    department: students[1].department,
    course: "Ηλεκτροτεχνία",
    date: new Date(2023, 11, 6),
    hours: 3,
    ratePerHour: 30,
    total: 90,
    paymentStatus: "partial",
    paymentDate: new Date(2023, 11, 6),
    amountPaid: 50,
    balance: 40,
    paymentMethod: "Κάρτα"
  },
  {
    id: uuidv4(),
    studentId: students[2].id,
    studentName: `${students[2].lastName} ${students[2].firstName}`,
    school: students[2].school,
    department: students[2].department,
    course: "Μικροοικονομία",
    date: new Date(2023, 11, 7),
    hours: 2,
    ratePerHour: 25,
    total: 50,
    paymentStatus: "pending",
    amountPaid: 0,
    balance: 50
  }
];

// Mock teachers data
export const teachers: Teacher[] = [
  {
    id: uuidv4(),
    lastName: "Δημητρίου",
    firstName: "Νίκος",
    courses: ["Αλγόριθμοι", "Δομές Δεδομένων"],
    contact: "6911223344"
  },
  {
    id: uuidv4(),
    lastName: "Γεωργίου",
    firstName: "Ελένη",
    courses: ["Ηλεκτροτεχνία", "Ηλεκτρονική"],
    contact: "6933445566"
  },
  {
    id: uuidv4(),
    lastName: "Αλεξίου",
    firstName: "Δημήτρης",
    courses: ["Μικροοικονομία", "Μακροοικονομία"],
    contact: "6922334455"
  }
];

// Mock teacher classes data
export const teacherClasses: TeacherClass[] = [
  {
    id: uuidv4(),
    teacherId: teachers[0].id,
    teacherName: `${teachers[0].lastName} ${teachers[0].firstName}`,
    course: "Αλγόριθμοι",
    date: new Date(2023, 11, 5),
    hours: 2,
    ratePerHour: 15,
    totalDue: 30,
    amountPaid: 30,
    balance: 0
  },
  {
    id: uuidv4(),
    teacherId: teachers[1].id,
    teacherName: `${teachers[1].lastName} ${teachers[1].firstName}`,
    course: "Ηλεκτροτεχνία",
    date: new Date(2023, 11, 6),
    hours: 3,
    ratePerHour: 18,
    totalDue: 54,
    amountPaid: 40,
    balance: 14
  },
  {
    id: uuidv4(),
    teacherId: teachers[2].id,
    teacherName: `${teachers[2].lastName} ${teachers[2].firstName}`,
    course: "Μικροοικονομία",
    date: new Date(2023, 11, 7),
    hours: 2,
    ratePerHour: 17,
    totalDue: 34,
    amountPaid: 0,
    balance: 34
  }
];

// Mock expenses data
export const expenses: Expense[] = [
  {
    id: uuidv4(),
    date: new Date(2023, 11, 1),
    description: "Ενοίκιο Δεκεμβρίου",
    category: "Ενοίκιο",
    amount: 800,
    paymentMethod: "Τραπεζική Μεταφορά"
  },
  {
    id: uuidv4(),
    date: new Date(2023, 11, 3),
    description: "Λογαριασμός ΔΕΗ",
    category: "Λογαριασμοί",
    amount: 150,
    paymentMethod: "Τραπεζική Μεταφορά"
  },
  {
    id: uuidv4(),
    date: new Date(2023, 11, 5),
    description: "Γραφική Ύλη",
    category: "Υλικά",
    amount: 85,
    paymentMethod: "Μετρητά"
  }
];

// Mock statistics data
export const statisticsData: StatisticsData = {
  studentsCount: {
    total: students.length,
    bySchool: {
      "Πανεπιστήμιο Αθηνών": 2,
      "Εθνικό Μετσόβιο Πολυτεχνείο": 1
    }
  },
  revenue: {
    daily: 50,
    monthly: 450,
    yearly: 5400
  },
  expenses: {
    daily: 35,
    monthly: 1035,
    yearly: 12420
  },
  studentBalances: 90,
  teacherBalances: 48
};

// Local storage service to mimic a database
export const saveToLocalStorage = <T>(key: string, data: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error(`Error saving to localStorage: ${error}`);
  }
};

export const getFromLocalStorage = <T>(key: string, defaultValue: T): T => {
  try {
    const storedData = localStorage.getItem(key);
    return storedData ? (JSON.parse(storedData) as T) : defaultValue;
  } catch (error) {
    console.error(`Error reading from localStorage: ${error}`);
    return defaultValue;
  }
};

// Initialize local storage with mock data
export const initializeLocalStorage = (): void => {
  if (!localStorage.getItem('students')) {
    saveToLocalStorage('students', students);
  }
  if (!localStorage.getItem('classes')) {
    saveToLocalStorage('classes', classes);
  }
  if (!localStorage.getItem('teachers')) {
    saveToLocalStorage('teachers', teachers);
  }
  if (!localStorage.getItem('teacherClasses')) {
    saveToLocalStorage('teacherClasses', teacherClasses);
  }
  if (!localStorage.getItem('expenses')) {
    saveToLocalStorage('expenses', expenses);
  }
  if (!localStorage.getItem('schools')) {
    saveToLocalStorage('schools', schools);
  }
  if (!localStorage.getItem('courses')) {
    saveToLocalStorage('courses', courses);
  }
};
