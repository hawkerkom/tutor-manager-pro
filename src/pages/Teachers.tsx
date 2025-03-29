
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Trash2, Edit, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DataTable } from "@/components/DataTable";
import PageHeader from "@/components/PageHeader";
import { useData } from "@/contexts/DataContext";
import { Badge } from "@/components/ui/badge";
import { MultiSelect } from "@/components/MultiSelect";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CSVUploader from "@/components/CSVUploader";
import { parseTeacherCoursesCSV } from "@/utils/csvUtils";
import type { Teacher } from "@/types";

// Form schema for adding a new teacher
const formSchema = z.object({
  lastName: z.string().min(2, {
    message: "Το επώνυμο πρέπει να είναι τουλάχιστον 2 χαρακτήρες.",
  }),
  firstName: z.string().min(2, {
    message: "Το όνομα πρέπει να είναι τουλάχιστον 2 χαρακτήρες.",
  }),
  contact: z.string().min(2, {
    message: "Το τηλέφωνο είναι υποχρεωτικό.",
  }),
  courses: z.array(z.string()).min(1, {
    message: "Επιλέξτε τουλάχιστον ένα μάθημα.",
  }),
  baseSalary: z.coerce.number().min(0).default(16),
  studentBonus: z.coerce.number().min(0).default(1),
});

const Teachers = () => {
  const { teachers, courses, addTeacher, deleteTeacher, updateTeacher } = useData();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [teacherToDelete, setTeacherToDelete] = useState<Teacher | null>(null);

  // Get unique course names from all courses
  const allCourseNames = [...new Set(courses.map((course) => course.name))];

  // Initialize form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      lastName: "",
      firstName: "",
      contact: "",
      courses: [],
      baseSalary: 16,
      studentBonus: 1,
    },
  });

  // Handle form submission
  const onSubmit = (values: z.infer<typeof formSchema>) => {
    addTeacher(values);
    setIsDialogOpen(false);
    form.reset({
      lastName: "",
      firstName: "",
      contact: "",
      courses: [],
      baseSalary: 16,
      studentBonus: 1,
    });
  };

  // Handle delete click
  const handleDeleteClick = (teacher: Teacher) => {
    setTeacherToDelete(teacher);
    setIsDeleteDialogOpen(true);
  };

  // Confirm delete
  const confirmDelete = () => {
    if (teacherToDelete) {
      deleteTeacher(teacherToDelete.id);
      setIsDeleteDialogOpen(false);
    }
  };

  // Handle teacher courses CSV upload
  const handleTeacherCoursesCSVUpload = (csvContent: string) => {
    const teacherCourses = parseTeacherCoursesCSV(csvContent);
    
    teacherCourses.forEach(({ teacherId, courses }) => {
      const teacher = teachers.find(t => t.id === teacherId);
      if (teacher) {
        // Merge existing courses with new ones
        const updatedCourses = [...new Set([...teacher.courses, ...courses])];
        updateTeacher(teacherId, { courses: updatedCourses });
      }
    });
  };

  // Data table columns
  const columns = [
    {
      accessorKey: "lastName",
      header: "Επώνυμο",
    },
    {
      accessorKey: "firstName",
      header: "Όνομα",
    },
    {
      accessorKey: "contact",
      header: "Επικοινωνία",
    },
    {
      accessorKey: "courses",
      header: "Μαθήματα",
      cell: ({ row }: any) => {
        const courses: string[] = row.getValue("courses");
        return (
          <div className="flex flex-wrap gap-1">
            {courses.map((course) => (
              <Badge key={course} variant="outline">
                {course}
              </Badge>
            ))}
          </div>
        );
      },
    },
    {
      accessorKey: "baseSalary",
      header: "Βασικός Μισθός",
      cell: ({ row }: any) => {
        return `${row.getValue("baseSalary") || 16}€`;
      },
    },
    {
      accessorKey: "studentBonus",
      header: "Επίδομα/Φοιτητή",
      cell: ({ row }: any) => {
        return `${row.getValue("studentBonus") || 1}€`;
      },
    },
    {
      id: "actions",
      cell: ({ row }: any) => {
        const teacher = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Μενού</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Ενέργειες</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => console.log("Edit", teacher)}>
                <Edit className="mr-2 h-4 w-4" />
                Επεξεργασία
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleDeleteClick(teacher)}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Διαγραφή
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  return (
    <div>
      <PageHeader
        title="Καθηγητές"
        description="Διαχείριση καθηγητών και των μαθημάτων τους"
        action={{
          label: "Νέος Καθηγητής",
          onClick: () => setIsDialogOpen(true),
        }}
      />

      <Tabs defaultValue="list" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="list">Λίστα Καθηγητών</TabsTrigger>
          <TabsTrigger value="import">Εισαγωγή Μαθημάτων</TabsTrigger>
        </TabsList>
        
        <TabsContent value="list">
          <DataTable
            columns={columns}
            data={teachers}
            searchKey="lastName"
            searchPlaceholder="Αναζήτηση με επώνυμο..."
          />
        </TabsContent>
        
        <TabsContent value="import" className="space-y-6">
          <CSVUploader
            title="Εισαγωγή Μαθημάτων Καθηγητών"
            description="Ανεβάστε ένα αρχείο CSV με αντιστοιχίσεις καθηγητών και μαθημάτων"
            onUpload={handleTeacherCoursesCSVUpload}
            acceptedFormat="Μορφή: TeacherId,Course (κάθε γραμμή αντιστοιχεί σε ένα μάθημα ενός καθηγητή)"
          />
          
          <div className="p-4 border rounded-md bg-muted/50">
            <h3 className="font-medium mb-2">Παράδειγμα αρχείου CSV:</h3>
            <pre className="text-sm bg-background p-2 rounded">
              TeacherId,Course<br />
              {teachers.length > 0 ? `${teachers[0].id},Αλγόριθμοι` : "abc123,Αλγόριθμοι"}<br />
              {teachers.length > 0 ? `${teachers[0].id},Βάσεις Δεδομένων` : "abc123,Βάσεις Δεδομένων"}<br />
              {teachers.length > 1 ? `${teachers[1].id},Άλγεβρα` : "def456,Άλγεβρα"}
            </pre>
          </div>
        </TabsContent>
      </Tabs>

      {/* Add Teacher Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>Προσθήκη Νέου Καθηγητή</DialogTitle>
            <DialogDescription>
              Συμπληρώστε τα στοιχεία του καθηγητή και τα μαθήματα που διδάσκει.
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Επώνυμο</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Όνομα</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="contact"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Τηλέφωνο / Email</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="baseSalary"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Βασικός Μισθός (Χ)</FormLabel>
                      <FormControl>
                        <Input type="number" min="0" step="0.5" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="studentBonus"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Επίδομα/Φοιτητή (Υ)</FormLabel>
                      <FormControl>
                        <Input type="number" min="0" step="0.5" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="courses"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Μαθήματα</FormLabel>
                    <FormControl>
                      <MultiSelect
                        options={allCourseNames.map((course) => ({
                          label: course,
                          value: course,
                        }))}
                        selected={field.value}
                        onChange={field.onChange}
                        placeholder="Επιλέξτε μαθήματα..."
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Ακύρωση
                </Button>
                <Button type="submit">Αποθήκευση</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Delete confirmation dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Επιβεβαίωση Διαγραφής</DialogTitle>
            <DialogDescription>
              Είστε βέβαιοι ότι θέλετε να διαγράψετε τον καθηγητή{" "}
              <span className="font-medium">
                {teacherToDelete
                  ? `${teacherToDelete.lastName} ${teacherToDelete.firstName}`
                  : ""}
              </span>
              ?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Ακύρωση
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Διαγραφή
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Teachers;
