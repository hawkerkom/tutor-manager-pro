
import { v4 as uuidv4 } from "uuid";
import type { School, Course, Department } from "@/types";

export const parseSchoolsCSV = (csvContent: string): School[] => {
  const lines = csvContent.trim().split("\n");
  // Skip header row if it exists
  const startIndex = lines[0].includes("School,Department,Course") ? 1 : 0;
  
  // Group by schools and departments
  const schoolsMap: Record<string, Record<string, string[]>> = {};
  
  for (let i = startIndex; i < lines.length; i++) {
    const columns = lines[i].split(",");
    if (columns.length >= 3) {
      const schoolName = columns[0].trim();
      const departmentName = columns[1].trim();
      const courseName = columns[2].trim();
      
      if (!schoolsMap[schoolName]) {
        schoolsMap[schoolName] = {};
      }
      
      if (!schoolsMap[schoolName][departmentName]) {
        schoolsMap[schoolName][departmentName] = [];
      }
      
      if (courseName && !schoolsMap[schoolName][departmentName].includes(courseName)) {
        schoolsMap[schoolName][departmentName].push(courseName);
      }
    }
  }
  
  // Convert to School format
  const parsedSchools: School[] = Object.keys(schoolsMap).map(schoolName => {
    const departments: Department[] = Object.keys(schoolsMap[schoolName]).map(deptName => {
      const courses: Course[] = schoolsMap[schoolName][deptName].map(courseName => ({
        id: uuidv4(),
        name: courseName,
        school: schoolName,
        department: deptName
      }));
      
      return {
        id: uuidv4(),
        name: deptName,
        courses
      };
    });
    
    return {
      id: uuidv4(),
      name: schoolName,
      departments
    };
  });
  
  return parsedSchools;
};

export const parseTeacherCoursesCSV = (csvContent: string): Record<string, string[]> => {
  const lines = csvContent.trim().split("\n");
  // Skip header row if it exists
  const startIndex = lines[0].includes("Teacher,Course") ? 1 : 0;
  
  // Group courses by teacher
  const teachersMap: Record<string, string[]> = {};
  
  for (let i = startIndex; i < lines.length; i++) {
    const columns = lines[i].split(",");
    if (columns.length >= 2) {
      const teacherName = columns[0].trim();
      const courseName = columns[1].trim();
      
      if (!teachersMap[teacherName]) {
        teachersMap[teacherName] = [];
      }
      
      if (courseName && !teachersMap[teacherName].includes(courseName)) {
        teachersMap[teacherName].push(courseName);
      }
    }
  }
  
  return teachersMap;
};
