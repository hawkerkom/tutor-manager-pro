
import { useState } from "react";
import { MoreHorizontal, Trash2, Edit, Plus } from "lucide-react";
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
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { DataTable } from "@/components/DataTable";
import PageHeader from "@/components/PageHeader";
import { useData } from "@/contexts/DataContext";
import type { Teacher } from "@/types";

// Form schema for adding/editing teachers
const formSchema = z.object({
  lastName: z.string().min(2, {
    message: "Το επίθετο πρέπει να έχει τουλάχιστον 2 χαρακτήρες.",
  }),
  firstName: z.string().min(2, {
    message: "Το όνομα πρέπει να έχει τουλάχιστον 2 χαρακτήρες.",
  }),
  contact: z.string().min(10, {
    message: "Παρακαλώ εισάγετε ένα έγκυρο αριθμό τηλεφώνου.",
  }),
  courses: z.array(z.string()).min(1, {
    message: "Επιλέξτε τουλάχιστον ένα μάθημα.",
  }),
});

const Teachers = () => {
  const { teachers, courses, addTeacher, updateTeacher, deleteTeacher } = useData();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);

  // Group courses by school and department
  const groupedCourses: Record<string, Record<string, string[]>> = {};
  courses.forEach(course => {
    if (!groupedCourses[course.school]) {
      groupedCourses[course.school] = {};
    }
    if (!groupedCourses[course.school][course.department]) {
      groupedCourses[course.school][course.department] = [];
    }
    groupedCourses[course.school][course.department].push(course.name);
  });

  // Initialize add form
  const addForm = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      lastName: "",
      firstName: "",
      contact: "",
      courses: [],
    },
  });

  // Initialize edit form
  const editForm = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      lastName: "",
      firstName: "",
      contact: "",
      courses: [],
    },
  });

  // Handle add form submission
  const onAddSubmit = (values: z.infer<typeof formSchema>) => {
    addTeacher(values);
    setIsAddDialogOpen(false);
    addForm.reset();
  };

  // Handle edit form submission
  const onEditSubmit = (values: z.infer<typeof formSchema>) => {
    if (selectedTeacher) {
      updateTeacher(selectedTeacher.id, values);
      setIsEditDialogOpen(false);
    }
  };

  // Handle edit click
  const handleEditClick = (teacher: Teacher) => {
    setSelectedTeacher(teacher);
    
    // Populate edit form with teacher data
    editForm.reset({
      lastName: teacher.lastName,
      firstName: teacher.firstName,
      contact: teacher.contact,
      courses: teacher.courses,
    });
    
    setIsEditDialogOpen(true);
  };

  // Handle delete click
  const handleDeleteClick = (teacher: Teacher) => {
    setSelectedTeacher(teacher);
    setIsDeleteDialogOpen(true);
  };

  // Confirm delete
  const confirmDelete = () => {
    if (selectedTeacher) {
      deleteTeacher(selectedTeacher.id);
      setIsDeleteDialogOpen(false);
    }
  };

  // Extract all unique course names
  const allCourses = Array.from(new Set(courses.map(course => course.name)));

  // Data table columns
  const columns = [
    {
      accessorKey: "lastName",
      header: "Επίθετο",
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
        const coursesList = row.getValue("courses") as string[];
        return (
          <div className="max-w-[200px] truncate">
            {coursesList.join(", ")}
          </div>
        );
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
              <DropdownMenuItem onClick={() => handleEditClick(teacher)}>
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
        description="Διαχείριση καταχωρημένων καθηγητών"
        action={{
          label: "Νέος Καθηγητής",
          onClick: () => setIsAddDialogOpen(true),
        }}
      />

      <DataTable
        columns={columns}
        data={teachers}
        searchKey="lastName"
        searchPlaceholder="Αναζήτηση με επίθετο..."
      />

      {/* Add Teacher Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Προσθήκη Νέου Καθηγητή</DialogTitle>
            <DialogDescription>
              Συμπληρώστε τα στοιχεία του νέου καθηγητή.
            </DialogDescription>
          </DialogHeader>

          <Form {...addForm}>
            <form onSubmit={addForm.handleSubmit(onAddSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={addForm.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Επίθετο</FormLabel>
                      <FormControl>
                        <Input placeholder="Παπαδόπουλος" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={addForm.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Όνομα</FormLabel>
                      <FormControl>
                        <Input placeholder="Γιώργος" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={addForm.control}
                name="contact"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Τηλέφωνο Επικοινωνίας</FormLabel>
                    <FormControl>
                      <Input placeholder="69XXXXXXXX" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={addForm.control}
                name="courses"
                render={() => (
                  <FormItem>
                    <div className="mb-4">
                      <FormLabel>Μαθήματα Διδασκαλίας</FormLabel>
                    </div>
                    <div className="max-h-[200px] overflow-y-auto border rounded-md p-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {allCourses.map((course) => (
                          <FormField
                            key={course}
                            control={addForm.control}
                            name="courses"
                            render={({ field }) => {
                              return (
                                <FormItem
                                  key={course}
                                  className="flex flex-row items-start space-x-3 space-y-0"
                                >
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value?.includes(course)}
                                      onCheckedChange={(checked) => {
                                        return checked
                                          ? field.onChange([...field.value, course])
                                          : field.onChange(
                                              field.value?.filter(
                                                (value) => value !== course
                                              )
                                            );
                                      }}
                                    />
                                  </FormControl>
                                  <FormLabel className="font-normal">
                                    {course}
                                  </FormLabel>
                                </FormItem>
                              );
                            }}
                          />
                        ))}
                      </div>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Ακύρωση
                </Button>
                <Button type="submit">Αποθήκευση</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Edit Teacher Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Επεξεργασία Καθηγητή</DialogTitle>
            <DialogDescription>
              Τροποποιήστε τα στοιχεία του καθηγητή.
            </DialogDescription>
          </DialogHeader>

          <Form {...editForm}>
            <form onSubmit={editForm.handleSubmit(onEditSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={editForm.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Επίθετο</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={editForm.control}
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
                control={editForm.control}
                name="contact"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Τηλέφωνο Επικοινωνίας</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={editForm.control}
                name="courses"
                render={() => (
                  <FormItem>
                    <div className="mb-4">
                      <FormLabel>Μαθήματα Διδασκαλίας</FormLabel>
                    </div>
                    <div className="max-h-[200px] overflow-y-auto border rounded-md p-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {allCourses.map((course) => (
                          <FormField
                            key={course}
                            control={editForm.control}
                            name="courses"
                            render={({ field }) => {
                              return (
                                <FormItem
                                  key={course}
                                  className="flex flex-row items-start space-x-3 space-y-0"
                                >
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value?.includes(course)}
                                      onCheckedChange={(checked) => {
                                        return checked
                                          ? field.onChange([...field.value, course])
                                          : field.onChange(
                                              field.value?.filter(
                                                (value) => value !== course
                                              )
                                            );
                                      }}
                                    />
                                  </FormControl>
                                  <FormLabel className="font-normal">
                                    {course}
                                  </FormLabel>
                                </FormItem>
                              );
                            }}
                          />
                        ))}
                      </div>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
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
              Είστε βέβαιοι ότι θέλετε να διαγράψετε τον καθηγητή:{" "}
              <span className="font-medium">
                {selectedTeacher?.lastName} {selectedTeacher?.firstName}
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
