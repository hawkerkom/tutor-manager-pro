
import { useState, useRef } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Trash2, Edit, MoreHorizontal, Upload, Plus } from "lucide-react";
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
import { toast } from "sonner";
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
  const { teachers, courses, addTeacher, deleteTeacher, uploadTeacherCourses } = useData();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [teacherToDelete, setTeacherToDelete] = useState<Teacher | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [csvContent, setCsvContent] = useState<string>("");

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
    // Διόρθωση του σφάλματος προσθέτοντας όλα τα απαιτούμενα πεδία
    const teacherData: Omit<Teacher, "id"> = {
      lastName: values.lastName,
      firstName: values.firstName,
      contact: values.contact,
      courses: values.courses,
      baseSalary: values.baseSalary,
      studentBonus: values.studentBonus
    };
    
    addTeacher(teacherData);
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

  // Handle CSV file upload
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        setCsvContent(content);
      };
      reader.readAsText(file);
    }
  };

  // Handle CSV data upload
  const handleCsvUpload = () => {
    if (csvContent) {
      uploadTeacherCourses(csvContent);
      setIsUploadDialogOpen(false);
      setCsvContent("");
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } else {
      toast.error("Παρακαλώ επιλέξτε ένα αρχείο CSV πρώτα.");
    }
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
      />

      <div className="flex justify-end space-x-2 mb-4">
        <Button variant="outline" onClick={() => setIsUploadDialogOpen(true)}>
          <Upload className="mr-2 h-4 w-4" />
          Εισαγωγή από CSV
        </Button>
        <Button onClick={() => setIsDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Νέος Καθηγητής
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={teachers}
        searchKey="lastName"
        searchPlaceholder="Αναζήτηση με επώνυμο..."
      />

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
                      <FormLabel>Βασικός Μισθός (Χ) σε €</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          min="0" 
                          step="0.5"
                          {...field} 
                        />
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
                      <FormLabel>Επίδομα ανά Φοιτητή (Υ) σε €</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          min="0" 
                          step="0.25"
                          {...field} 
                        />
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
                        options={allCourseNames.map((name) => ({
                          value: name,
                          label: name,
                        }))}
                        selected={field.value}
                        onChange={field.onChange}
                        placeholder="Επιλέξτε μαθήματα"
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

      {/* Upload CSV Dialog */}
      <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>Εισαγωγή Καθηγητών και Μαθημάτων από CSV</DialogTitle>
            <DialogDescription>
              Ανεβάστε ένα αρχείο CSV με τους καθηγητές και τα μαθήματά τους. Το αρχείο πρέπει να έχει την εξής μορφή:
              Επώνυμο, Όνομα, Μάθημα1, Μάθημα2, Μάθημα3, ...
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="border rounded-md p-4">
              <input
                type="file"
                accept=".csv"
                onChange={handleFileUpload}
                ref={fileInputRef}
                className="w-full"
              />
            </div>

            {csvContent && (
              <div className="border rounded-md p-4 max-h-[200px] overflow-y-auto">
                <h3 className="font-semibold mb-2">Προεπισκόπηση:</h3>
                <pre className="text-xs whitespace-pre-wrap">
                  {csvContent}
                </pre>
              </div>
            )}

            <div className="text-sm text-muted-foreground">
              <p>Παράδειγμα CSV αρχείου:</p>
              <code className="text-xs">
                Παπαδόπουλος, Γιώργος, Αλγόριθμοι, Δομές Δεδομένων, Προγραμματισμός<br />
                Αντωνίου, Μαρία, Βάσεις Δεδομένων, Δίκτυα<br />
                Γεωργίου, Νίκος, Μαθηματικά, Φυσική
              </code>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsUploadDialogOpen(false)}
              >
                Ακύρωση
              </Button>
              <Button onClick={handleCsvUpload} disabled={!csvContent}>
                Εισαγωγή
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete confirmation dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Επιβεβαίωση Διαγραφής</DialogTitle>
            <DialogDescription>
              Είστε βέβαιοι ότι θέλετε να διαγράψετε τον/την καθηγητή/τρια{" "}
              <span className="font-medium">
                {teacherToDelete?.lastName} {teacherToDelete?.firstName}
              </span>
              ?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
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
