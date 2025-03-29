
import { useState } from "react";
import { format } from "date-fns";
import { el } from "date-fns/locale";
import { MoreHorizontal, Trash2, Edit, Receipt } from "lucide-react";
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
  DialogTrigger,
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
import type { Class } from "@/types";

// Form schema for adding a new class
const formSchema = z.object({
  studentId: z.string({
    required_error: "Παρακαλώ επιλέξτε φοιτητή.",
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
  ratePerHour: z.coerce.number().min(1, {
    message: "Η τιμή ανά ώρα πρέπει να είναι τουλάχιστον 1€.",
  }),
  paymentStatus: z.enum(["paid", "partial", "pending"], {
    required_error: "Παρακαλώ επιλέξτε κατάσταση πληρωμής.",
  }),
  amountPaid: z.coerce.number().min(0, {
    message: "Το ποσό πληρωμής δεν μπορεί να είναι αρνητικό.",
  }),
  paymentMethod: z.string().optional(),
  paymentDate: z.date().optional(),
});

const Classes = () => {
  const { classes, students, addClass, deleteClass } = useData();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [classToDelete, setClassToDelete] = useState<Class | null>(null);
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null);
  const [availableCourses, setAvailableCourses] = useState<string[]>([]);

  // Initialize form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      studentId: "",
      course: "",
      date: new Date(),
      hours: 1,
      ratePerHour: 25,
      paymentStatus: "pending",
      amountPaid: 0,
    },
  });

  // Handle student selection to update available courses
  const handleStudentChange = (value: string) => {
    setSelectedStudent(value);
    form.setValue("studentId", value);
    
    // Find student and update available courses
    const student = students.find(s => s.id === value);
    if (student) {
      setAvailableCourses(student.interestedCourses);
      form.setValue("course", ""); // Reset course selection
    } else {
      setAvailableCourses([]);
    }
  };

  // Handle payment status change
  const handlePaymentStatusChange = (value: "paid" | "partial" | "pending") => {
    form.setValue("paymentStatus", value);
    
    // Auto-fill paymentDate for paid status
    if (value === "paid" || value === "partial") {
      if (!form.getValues("paymentDate")) {
        form.setValue("paymentDate", new Date());
      }
    } else {
      form.setValue("paymentDate", undefined);
    }
    
    // For paid status, set amountPaid equal to total
    if (value === "paid") {
      const hours = form.getValues("hours");
      const rate = form.getValues("ratePerHour");
      form.setValue("amountPaid", hours * rate);
    }
  };

  // Calculate total during form changes
  const calculateTotal = () => {
    const hours = form.watch("hours") || 0;
    const rate = form.watch("ratePerHour") || 0;
    return hours * rate;
  };

  // Handle form submission
  const onSubmit = (values: z.infer<typeof formSchema>) => {
    // Find student to get school/department and name
    const student = students.find(s => s.id === values.studentId);
    if (student) {
      const newClass = {
        studentId: values.studentId,
        studentName: `${student.lastName} ${student.firstName}`,
        school: student.school,
        department: student.department,
        course: values.course,
        date: values.date,
        hours: values.hours,
        ratePerHour: values.ratePerHour,
        paymentStatus: values.paymentStatus,
        paymentDate: values.paymentDate,
        amountPaid: values.amountPaid,
        paymentMethod: values.paymentMethod,
      };
      
      addClass(newClass);
      setIsDialogOpen(false);
      form.reset();
    }
  };

  // Handle delete click
  const handleDeleteClick = (classItem: Class) => {
    setClassToDelete(classItem);
    setIsDeleteDialogOpen(true);
  };

  // Confirm delete
  const confirmDelete = () => {
    if (classToDelete) {
      deleteClass(classToDelete.id);
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
      accessorKey: "studentName",
      header: "Φοιτητής",
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
      accessorKey: "total",
      header: "Συνολικό Ποσό",
      cell: ({ row }: any) => {
        return `${row.getValue("total")}€`;
      },
    },
    {
      accessorKey: "paymentStatus",
      header: "Κατάσταση",
      cell: ({ row }: any) => {
        const status = row.getValue("paymentStatus");
        
        if (status === "paid") {
          return <Badge className="bg-green-500">Εξοφλημένο</Badge>;
        } else if (status === "partial") {
          return <Badge className="bg-yellow-500">Μερική Πληρωμή</Badge>;
        } else {
          return <Badge className="bg-red-500">Εκκρεμεί</Badge>;
        }
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
              <DropdownMenuItem onClick={() => console.log("Receipt", classItem)}>
                <Receipt className="mr-2 h-4 w-4" />
                Απόδειξη
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
        title="Μαθήματα"
        description="Καταχώρηση και διαχείριση μαθημάτων"
        action={{
          label: "Νέο Μάθημα",
          onClick: () => setIsDialogOpen(true),
        }}
      />

      <DataTable
        columns={columns}
        data={classes}
        searchKey="studentName"
        searchPlaceholder="Αναζήτηση με όνομα φοιτητή..."
      />

      {/* Add Class Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Καταχώρηση Νέου Μαθήματος</DialogTitle>
            <DialogDescription>
              Συμπληρώστε τα στοιχεία του μαθήματος που πραγματοποιήθηκε.
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="studentId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Φοιτητής</FormLabel>
                      <Select
                        onValueChange={handleStudentChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Επιλέξτε φοιτητή" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {students.map((student) => (
                            <SelectItem key={student.id} value={student.id}>
                              {student.lastName} {student.firstName}
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
                        disabled={!selectedStudent || availableCourses.length === 0}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Επιλέξτε μάθημα" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {availableCourses.map((course) => (
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
                    name="ratePerHour"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Τιμή/Ώρα (€)</FormLabel>
                        <FormControl>
                          <Input type="number" min="1" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                <FormField
                  control={form.control}
                  name="paymentStatus"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Κατάσταση Πληρωμής</FormLabel>
                      <Select
                        onValueChange={(value: "paid" | "partial" | "pending") =>
                          handlePaymentStatusChange(value)
                        }
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Επιλέξτε κατάσταση" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="paid">Εξοφλημένο</SelectItem>
                          <SelectItem value="partial">Μερική Πληρωμή</SelectItem>
                          <SelectItem value="pending">Εκκρεμεί</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

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

                <FormField
                  control={form.control}
                  name="paymentMethod"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Τρόπος Πληρωμής</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        disabled={form.watch("paymentStatus") === "pending"}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Επιλέξτε τρόπο" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="cash">Μετρητά</SelectItem>
                          <SelectItem value="card">Κάρτα</SelectItem>
                          <SelectItem value="transfer">Τραπεζική Μεταφορά</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

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
              Είστε βέβαιοι ότι θέλετε να διαγράψετε το μάθημα του 
              <span className="font-medium"> {classToDelete?.studentName} </span> 
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

export default Classes;
