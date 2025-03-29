
/**
 * Parse CSV string into an array of records
 * @param csvString The CSV string to parse
 * @returns Array of objects representing the CSV data
 */
export const parseCSV = (csvString: string): Record<string, string>[] => {
  const lines = csvString.split('\n');
  const headers = lines[0].split(',').map(header => header.trim());
  
  return lines.slice(1).filter(line => line.trim() !== '').map(line => {
    const values = line.split(',').map(value => value.trim());
    const record: Record<string, string> = {};
    
    headers.forEach((header, index) => {
      record[header] = values[index] || '';
    });
    
    return record;
  });
};

/**
 * Parse CSV for schools and departments with courses
 * Expected format: School,Department,Course
 * @param csvString The CSV string to parse
 * @returns Structured school data
 */
export const parseSchoolsCSV = (csvString: string) => {
  const records = parseCSV(csvString);
  const schoolsMap = new Map();
  
  records.forEach(record => {
    const schoolName = record.School;
    const departmentName = record.Department;
    const courseName = record.Course;
    
    if (!schoolName || !departmentName || !courseName) return;
    
    if (!schoolsMap.has(schoolName)) {
      schoolsMap.set(schoolName, new Map());
    }
    
    const school = schoolsMap.get(schoolName);
    
    if (!school.has(departmentName)) {
      school.set(departmentName, new Set());
    }
    
    school.get(departmentName).add(courseName);
  });
  
  // Convert to the expected structure
  const schools = Array.from(schoolsMap.entries()).map(([schoolName, departments]) => {
    return {
      name: schoolName,
      departments: Array.from(departments.entries()).map(([departmentName, courses]) => {
        return {
          name: departmentName,
          courses: Array.from(courses).map(courseName => ({
            name: courseName
          }))
        };
      })
    };
  });
  
  return schools;
};

/**
 * Parse CSV for teacher courses
 * Expected format: TeacherId,Course
 * @param csvString The CSV string to parse
 * @returns Array of teacher course mappings
 */
export const parseTeacherCoursesCSV = (csvString: string) => {
  const records = parseCSV(csvString);
  const teacherCoursesMap = new Map();
  
  records.forEach(record => {
    const teacherId = record.TeacherId;
    const course = record.Course;
    
    if (!teacherId || !course) return;
    
    if (!teacherCoursesMap.has(teacherId)) {
      teacherCoursesMap.set(teacherId, new Set());
    }
    
    teacherCoursesMap.get(teacherId).add(course);
  });
  
  // Convert to array of objects
  return Array.from(teacherCoursesMap.entries()).map(([teacherId, courses]) => {
    return {
      teacherId,
      courses: Array.from(courses)
    };
  });
};
