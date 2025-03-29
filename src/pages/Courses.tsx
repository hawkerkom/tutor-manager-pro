
import { useState } from "react";
import PageHeader from "@/components/PageHeader";
import { useData } from "@/contexts/DataContext";
import CSVUploader from "@/components/CSVUploader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { v4 as uuidv4 } from "uuid";
import { School, Department, Course } from "@/types";

const Courses = () => {
  const { schools, importSchools } = useData();

  const handleSchoolsCSVUpload = (csvContent: string) => {
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
    
    importSchools(parsedSchools);
  };

  return (
    <div>
      <PageHeader
        title="Σχολές & Μαθήματα"
        description="Διαχείριση σχολών, τμημάτων και μαθημάτων"
      />

      <Tabs defaultValue="view" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="view">Προβολή</TabsTrigger>
          <TabsTrigger value="import">Εισαγωγή</TabsTrigger>
        </TabsList>
        
        <TabsContent value="view" className="space-y-4">
          {schools.length > 0 ? (
            <Accordion type="single" collapsible className="w-full">
              {schools.map((school) => (
                <AccordionItem key={school.id} value={school.id}>
                  <AccordionTrigger className="text-lg font-medium">
                    {school.name}
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4 pl-4">
                      {school.departments.map((department) => (
                        <div key={department.id} className="space-y-2">
                          <h3 className="text-md font-medium">{department.name}</h3>
                          <div className="flex flex-wrap gap-2 pl-4">
                            {department.courses.map((course) => (
                              <Badge key={course.id} variant="outline">
                                {course.name}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          ) : (
            <div className="text-center py-10 text-muted-foreground">
              Δεν υπάρχουν καταχωρημένες σχολές. Χρησιμοποιήστε την καρτέλα "Εισαγωγή" για να προσθέσετε σχολές.
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="import" className="space-y-6">
          <CSVUploader
            title="Εισαγωγή Σχολών και Μαθημάτων"
            description="Ανεβάστε ένα αρχείο CSV με σχολές, τμήματα και μαθήματα"
            onUpload={handleSchoolsCSVUpload}
            acceptedFormat="Μορφή: School,Department,Course (κάθε γραμμή αντιστοιχεί σε ένα μάθημα)"
          />
          
          <div className="p-4 border rounded-md bg-muted/50">
            <h3 className="font-medium mb-2">Παράδειγμα αρχείου CSV:</h3>
            <pre className="text-sm bg-background p-2 rounded">
              School,Department,Course<br />
              ΕΚΠΑ,Πληροφορικής,Αλγόριθμοι<br />
              ΕΚΠΑ,Πληροφορικής,Βάσεις Δεδομένων<br />
              ΕΚΠΑ,Μαθηματικών,Άλγεβρα<br />
              ΕΜΠ,Ηλεκτρολόγων,Κυκλώματα
            </pre>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Courses;
