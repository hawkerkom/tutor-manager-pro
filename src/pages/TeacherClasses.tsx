
import { useState } from "react";
import { format } from "date-fns";
import { el } from "date-fns/locale";
import { MoreHorizontal, Trash2, Edit, Calculator } from "lucide-react";
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
import { DataTable } from "@/components/DataTable";
import { DatePickerWithPresets } from "@/components/DatePickerWithPresets";
import PageHeader from "@/components/PageHeader";
import { useData } from "@/contexts/DataContext";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import type { TeacherClass } from "@/types";

// Form schema for adding a new teacher class
const formSchema = z.object({
  teacherId: z.string({
    required_error: "Παρακαλώ επιλέξτε καθηγητή.",
  }),
  course: z.string({
    required_error: "Παρακαλώ επιλέξτε μάθημα.",
  }),
  date: z.date({
    required_error: "Παρακαλώ επιλέξτε ημερομηνία.",
  }),
  hours: z.coerce.number().min(0.5, {
    message: "Οι ώρες πρέπει να είναι τουλάχιστον 0.5.",
  }),
  studentsCount: z.coerce.number().min(0, {
    message: "Ο αριθμός των φοιτητών δεν μπορεί να είναι αρνητικός.",
  }),
  calculationMethod: z.enum(["fixed", "formula"], {
    required_error: "Παρακαλώ επιλέξτε μέθοδο υπολογισμού.",
  }),
  ratePerHour: z.coerce.number().min(0).optional(),
  amountPaid: z.coerce.number().min(0, {
    message: "Το ποσό πληρωμής δεν μπορεί να είναι αρνητικό.",
  }),
});

const TeacherClasses = () => {
  const { teacherClasses, teachers, addTeacherClass, deleteTeacherClass, calculateTeacherRate } = useData();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [classToDelete, setClassToDelete] = useState<TeacherClass | null>(null);
  const [selectedTeacher, setSelectedTeacher] = useState<string | null>(null);
  const [selectedTeacherCourses, setSelectedTeacherCourses] = useState<string[]>([]);
  const [useFormula, setUseFormula] = useState(true);

  // Initialize form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      teacherId: "",
      course: "",
      date: new Date(),
      hours: 1,
      studentsCount: 0,
      calculationMethod: "formula",
      amountPaid: 0,
    },
  });

  // Get the selected teacher
  const getSelectedTeacherDetails = () => {
    const teacherId = form.watch("teacherId");
    return teachers.find(t => t.id === teacherId);
  };

  // Calculate current rate based on formula or fixed value
  const calculateCurrentRate = () => {
    const teacherId = form.watch("teacherId");
    const studentsCount = form.watch("studentsCount") || 0;
    const calculationMethod = form.watch("calculationMethod");
    
    if (calculationMethod === "formula" && teacherId) {
      return calculateTeacherRate(teacherId, studentsCount);
    } else {
      return form.watch("ratePerHour") || 25;
    }
  };

  // Handle teacher selection to update available courses
  const handleTeacherChange = (value: string) => {
    setSelectedTeacher(value);
    form.setValue("teacherId", value);
    
    // Find teacher and update available courses
    const teacher = teachers.find(t => t.id === value);
    if (teacher) {
      setSelectedTeacherCourses(teacher.courses);
      form.setValue("course", ""); // Reset course selection
    } else {
      setSelectedTeacherCourses([]);
    }
  };

  // Handle calculation method change
  const handleCalculationMethodChange = (value: "fixed" | "formula") => {
    form.setValue("calculationMethod", value);
    setUseFormula(value === "formula");
    
    if (value === "formula") {
      const teacherId = form.getValues("teacherId");
      const studentsCount = form.getValues("studentsCount") || 0;
      
      if (teacherId) {
        // Calculate and set the rate based on formula
        const calculatedRate = calculateTeacherRate(teacherId, studentsCount);
        form.setValue("ratePerHour", calculatedRate);
      }
    }
  };

  // Handle students count change
  const handleStudentsCountChange = (value: number) => {
    form.setValue("studentsCount", value);
    
    if (form.watch("calculationMethod") === "formula") {
      const teacherId = form.getValues("teacherId");
      if (teacherId) {
        // Recalculate rate based on new students count
        const calculatedRate = calculateTeacherRate(teacherId, value);
        form.setValue("ratePerHour", calculatedRate);
      }
    }
  };

  // Calculate total during form changes
  const calculateTotal = () => {
    const hours = form.watch("hours") || 0;
    const rate = calculateCurrentRate();
    return hours * rate;
  };

  // Get teacher name by ID
  const getTeacherName = (id: string) => {
    const teacher = teachers.find(t => t.id === id);
    return teacher ? `${teacher.lastName} ${teacher.firstName}` : "";
  };

  // Handle form submission
  const onSubmit = (values: z.infer<typeof formSchema>) => {
    const teacherName = getTeacherName(values.teacherId);
    
    const newTeacherClass = {
      teacherId: values.teacherId,
      teacherName,
      course: values.course,
      date: values.date,
      hours: values.hours,
      studentsCount: values.studentsCount,
      calculationMethod: values.calculationMethod,
      amountPaid: values.amountPaid
    };
    
    addTeacherClass(newTeacherClass);
    setIsDialogOpen(false);
    form.reset();
  };

  // Handle delete click
  const handleDeleteClick = (classItem: TeacherClass) => {
    setClassToDelete(classItem);
    setIsDeleteDialogOpen(true);
  };

  // Confirm delete
  const confirmDelete = () => {
    if (classToDelete) {
      deleteTeacherClass(classToDelete.id);
      setIsDeleteDialogOpen(false);
    }
  };

  // Data table columns
  const columns = [
    {
      accessorKey: "date",
      header: "Ημερομηνία",
      cell: ({ row }: any) => {
        const date = new Date(row.getValue("date"));
        return format(date, "dd/MM/yyyy", { locale: el });
      },
    },
    {
      accessorKey: "teacherName",
      header: "Καθηγητής",
    },
    {
      accessorKey: "course",
      header: "Μάθημα",
    },
    {
      accessorKey: "hours",
      header: "Ώρες",
    },
    {
      accessorKey: "studentsCount",
      header: "Φοιτητές",
    },
    {
      accessorKey: "ratePerHour",
      header: "Τιμή/Ώρα",
      cell: ({ row }: any) => {
        return `${row.getValue("ratePerHour")}€`;
      },
    },
    {
      accessorKey: "totalDue",
      header: "Συνολικό Ποσό",
      cell: ({ row }: any) => {
        return `${row.getValue("totalDue")}€`;
      },
    },
    {
      accessorKey: "amountPaid",
      header: "Πληρώθηκε",
      cell: ({ row }: any) => {
        return `${row.getValue("amountPaid")}€`;
      },
    },
    {
      accessorKey: "balance",
      header: "Υπόλοιπο",
      cell: ({ row }: any) => {
        return `${row.getValue("balance")}€`;
      },
    },
    {
      id: "actions",
      cell: ({ row }: any) => {
        const classItem = row.original;
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
              <DropdownMenuItem onClick={() => console.log("Edit", classItem)}>
                <Edit className="mr-2 h-4 w-4" />
                Επεξεργασία
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleDeleteClick(classItem)}
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
        title="Διδασκαλίες Καθηγητών"
        description="Καταχώρηση και διαχείριση διδασκαλιών καθηγητών"
        action={{
          label: "Νέα Διδασκαλία",
          onClick: () => setIsDialogOpen(true),
        }}
      />

      <DataTable
        columns={columns}
        data={teacherClasses}
        searchKey="teacherName"
        searchPlaceholder="Αναζήτηση με όνομα καθηγητή..."
      />

      {/* Add TeacherClass Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Καταχώρηση Νέας Διδασκαλίας</DialogTitle>
            <DialogDescription>
              Συμπληρώστε τα στοιχεία της διδασκαλίας που πραγματοποιήθηκε.
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="teacherId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Καθηγητής</FormLabel>
                      <Select
                        onValueChange={handleTeacherChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Επιλέξτε καθηγητή" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {teachers.map((teacher) => (
                            <SelectItem key={teacher.id} value={teacher.id}>
                              {teacher.lastName} {teacher.firstName}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="course"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Μάθημα</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        disabled={!selectedTeacher || selectedTeacherCourses.length === 0}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Επιλέξτε μάθημα" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {selectedTeacherCourses.map((course) => (
                            <SelectItem key={course} value={course}>
                              {course}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Ημερομηνία</FormLabel>
                      <DatePickerWithPresets
                        date={field.value}
                        setDate={field.onChange}
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-2">
                  <FormField
                    control={form.control}
                    name="hours"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Ώρες</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="0.5"
                            min="0.5"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="studentsCount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Αρ. Φοιτητών</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            min="0" 
                            {...field} 
                            onChange={(e) => {
                              field.onChange(e);
                              handleStudentsCountChange(parseInt(e.target.value) || 0);
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                <FormField
                  control={form.control}
                  name="calculationMethod"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                      <div className="space-y-0.5">
                        <FormLabel>Υπολογισμός με Φόρμουλα</FormLabel>
                        {selectedTeacher && (
                          <div className="text-sm text-muted-foreground">
                            {getSelectedTeacherDetails()?.baseSalary || "X"}€ + {getSelectedTeacherDetails()?.studentBonus || "Y"}€ ανά φοιτητή
                          </div>
                        )}
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value === "formula"}
                          onCheckedChange={(checked) => 
                            handleCalculationMethodChange(checked ? "formula" : "fixed")
                          }
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="ratePerHour"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Τιμή/Ώρα (€)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          min="0" 
                          {...field} 
                          value={calculateCurrentRate()}
                          disabled={useFormula}
                        />
                      </FormControl>
                      {useFormula && (
                        <div className="text-sm text-muted-foreground mt-1">
                          Υπολογίζεται αυτόματα με τη φόρμουλα
                        </div>
                      )}
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="amountPaid"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ποσό Πληρωμής (€)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="0"
                        max={calculateTotal()}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="border p-3 rounded-md text-center">
                  <div className="text-sm text-muted-foreground">Συνολικό Ποσό</div>
                  <div className="text-lg font-semibold">{calculateTotal()}€</div>
                </div>
                <div className="border p-3 rounded-md text-center">
                  <div className="text-sm text-muted-foreground">Υπόλοιπο</div>
                  <div className="text-lg font-semibold">
                    {calculateTotal() - (form.watch("amountPaid") || 0)}€
                  </div>
                </div>
              </div>

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
              Είστε βέβαιοι ότι θέλετε να διαγράψετε τη διδασκαλία του 
              <span className="font-medium"> {classToDelete?.teacherName} </span> 
              στις 
              <span className="font-medium"> {classToDelete && format(new Date(classToDelete.date), "dd/MM/yyyy", { locale: el })} </span>
              για το μάθημα 
              <span className="font-medium"> {classToDelete?.course}</span>?
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

export default TeacherClasses;
