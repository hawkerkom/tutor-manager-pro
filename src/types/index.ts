
export interface Student {
  id: string;
  lastName: string;
  firstName: string;
  school: string;
  department: string;
  phone: string;
  email: string;
  interestedCourses: string[];
  createdAt: Date;
}

export interface Class {
  id: string;
  studentId: string;
  studentName: string;
  school: string;
  department: string;
  course: string;
  date: Date;
  hours: number;
  ratePerHour: number;
  total: number;
  paymentStatus: 'paid' | 'partial' | 'pending';
  paymentDate?: Date;
  amountPaid: number;
  balance: number;
  paymentMethod?: string;
}

export interface Teacher {
  id: string;
  lastName: string;
  firstName: string;
  courses: string[];
  contact: string;
}

export interface TeacherClass {
  id: string;
  teacherId: string;
  teacherName: string;
  course: string;
  date: Date;
  hours: number;
  ratePerHour: number;
  totalDue: number;
  amountPaid: number;
  balance: number;
}

export interface Expense {
  id: string;
  date: Date;
  description: string;
  category: string;
  amount: number;
  paymentMethod: string;
}

export interface Course {
  id: string;
  school: string;
  department: string;
  name: string;
}

export interface School {
  id: string;
  name: string;
  departments: Department[];
}

export interface Department {
  id: string;
  name: string;
  courses: Course[];
}

export interface StatisticsData {
  studentsCount: {
    total: number;
    bySchool: Record<string, number>;
  };
  revenue: {
    daily: number;
    monthly: number;
    yearly: number;
  };
  expenses: {
    daily: number;
    monthly: number;
    yearly: number;
  };
  studentBalances: number;
  teacherBalances: number;
}
