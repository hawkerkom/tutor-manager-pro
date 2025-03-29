
import { useState, useRef } from "react";
import { MoreHorizontal, Trash2, Edit, Upload, Plus } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DataTable } from "@/components/DataTable";
import PageHeader from "@/components/PageHeader";
import { useData } from "@/contexts/DataContext";
import { toast } from "sonner";
import type { Course } from "@/types";

// Form schema for adding a new course
const formSchema = z.object({
  school: z.string().min(1, {
    message: "Παρακαλώ επιλέξτε ή εισάγετε σχολή.",
  }),
  department: z.string().min(1, {
    message: "Παρακαλώ επιλέξτε ή εισάγετε τμήμα.",
  }),
  name: z.string().min(2, {
    message: "Το όνομα του μαθήματος πρέπει να έχει τουλάχιστον 2 χαρακτήρες.",
  }),
});

const Courses = () => {
  const { schools, courses, addCourse, deleteCourse, uploadCourses } = useData();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState<Course | null>(null);
  const [activeTab, setActiveTab] = useState<string>("all");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [csvContent, setCsvContent] = useState<string>("");
  
  // Initialize add form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      school: "",
      department: "",
      name: "",
    },
  });

  // Extract all unique schools and departments
  const uniqueSchools = Array.from(new Set(courses.map(course => course.school)));
  
  // Get departments for selected school
  const getDepartmentsForSchool = (selectedSchool: string) => {
    const foundSchool = schools.find(school => school.name === selectedSchool);
    if (foundSchool) {
      return foundSchool.departments.map(dept => dept.name);
    }
    return [];
  };

  // Handle school selection
  const handleSchoolChange = (value: string) => {
    form.setValue("school", value);
    form.setValue("department", ""); // Reset department when school changes
  };

  // Handle add form submission
  const onSubmit = (values: z.infer<typeof formSchema>) => {
    // Διορθώνουμε το πρόβλημα τύπων εδώ - βεβαιωνόμαστε ότι όλα τα απαιτούμενα πεδία υπάρχουν
    const courseData: Omit<Course, "id"> = {
      school: values.school,
      department: values.department,
      name: values.name
    };
    
    addCourse(courseData);
    setIsAddDialogOpen(false);
    form.reset();
  };

  // Handle delete click
  const handleDeleteClick = (course: Course) => {
    setCourseToDelete(course);
    setIsDeleteDialogOpen(true);
  };

  // Confirm delete
  const confirmDelete = () => {
    if (courseToDelete) {
      deleteCourse(courseToDelete.id);
      setIsDeleteDialogOpen(false);
    }
  };

  // Handle file upload
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

  // Handle CSV upload
  const handleCsvUpload = () => {
    if (csvContent) {
      uploadCourses(csvContent);
      setIsUploadDialogOpen(false);
      setCsvContent("");
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } else {
      toast.error("Παρακαλώ επιλέξτε ένα αρχείο CSV πρώτα.");
    }
  };

  // Get filtered courses based on active tab
  const getFilteredCourses = () => {
    if (activeTab === "all") {
      return courses;
    }
    return courses.filter(course => course.school === activeTab);
  };

  // Data table columns
  const columns = [
    {
      accessorKey: "school",
      header: "Σχολή",
    },
    {
      accessorKey: "department",
      header: "Τμήμα",
    },
    {
      accessorKey: "name",
      header: "Μάθημα",
    },
    {
      id: "actions",
      cell: ({ row }: any) => {
        const course = row.original;
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
              <DropdownMenuItem
                onClick={() => handleDeleteClick(course)}
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
        title="Σχολές & Μαθήματα"
        description="Διαχείριση διαθέσιμων μαθημάτων ανά σχολή"
      />

      <div className="flex justify-end space-x-2 mb-4">
        <Button variant="outline" onClick={() => setIsUploadDialogOpen(true)}>
          <Upload className="mr-2 h-4 w-4" />
          Εισαγωγή από CSV
        </Button>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Νέο Μάθημα
        </Button>
      </div>

      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4 flex flex-wrap">
          <TabsTrigger value="all">Όλα</TabsTrigger>
          {uniqueSchools.map((school) => (
            <TabsTrigger key={school} value={school}>
              {school}
            </TabsTrigger>
          ))}
        </TabsList>
        <TabsContent value={activeTab}>
          <DataTable
            columns={columns}
            data={getFilteredCourses()}
            searchKey="name"
            searchPlaceholder="Αναζήτηση μαθήματος..."
          />
        </TabsContent>
      </Tabs>

      {/* Add Course Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Προσθήκη Νέου Μαθήματος</DialogTitle>
            <DialogDescription>
              Συμπληρώστε τα στοιχεία του νέου μαθήματος.
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="school"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Σχολή</FormLabel>
                    <Select
                      onValueChange={handleSchoolChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Επιλέξτε ή εισάγετε σχολή" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {uniqueSchools.map((school) => (
                          <SelectItem key={school} value={school}>
                            {school}
                          </SelectItem>
                        ))}
                        <SelectItem value="new">+ Νέα Σχολή</SelectItem>
                      </SelectContent>
                    </Select>
                    {field.value === "new" && (
                      <Input
                        className="mt-2"
                        placeholder="Εισάγετε όνομα νέας σχολής"
                        onChange={(e) => form.setValue("school", e.target.value)}
                      />
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="department"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Τμήμα</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={!form.watch("school") || form.watch("school") === "new"}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Επιλέξτε ή εισάγετε τμήμα" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {getDepartmentsForSchool(form.watch("school")).map((dept) => (
                          <SelectItem key={dept} value={dept}>
                            {dept}
                          </SelectItem>
                        ))}
                        <SelectItem value="new">+ Νέο Τμήμα</SelectItem>
                      </SelectContent>
                    </Select>
                    {field.value === "new" && (
                      <Input
                        className="mt-2"
                        placeholder="Εισάγετε όνομα νέου τμήματος"
                        onChange={(e) => form.setValue("department", e.target.value)}
                      />
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Όνομα Μαθήματος</FormLabel>
                    <FormControl>
                      <Input placeholder="π.χ. Αλγόριθμοι" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsAddDialogOpen(false)}
                >
                  Ακύρωση
                </Button>
                <Button type="submit">Προσθήκη</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Upload CSV Dialog */}
      <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Εισαγωγή Μαθημάτων από CSV</DialogTitle>
            <DialogDescription>
              Ανεβάστε ένα αρχείο CSV με τα μαθήματα. Το αρχείο πρέπει να έχει την εξής μορφή:
              Σχολή, Τμήμα, Μάθημα
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
                Πανεπιστήμιο Αθηνών, Πληροφορικής, Αλγόριθμοι<br />
                Πανεπιστήμιο Αθηνών, Πληροφορικής, Βάσεις Δεδομένων<br />
                ΕΜΠ, Ηλεκτρολόγων, Ηλεκτροτεχνία
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
              Είστε βέβαιοι ότι θέλετε να διαγράψετε το μάθημα:{" "}
              <span className="font-medium">
                {courseToDelete?.name}
              </span>{" "}
              από το τμήμα{" "}
              <span className="font-medium">
                {courseToDelete?.department}
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

export default Courses;
