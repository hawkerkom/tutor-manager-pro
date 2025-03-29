import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useData } from "@/contexts/DataContext";
import { Plus, Edit, Trash } from "lucide-react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Course, Teacher } from "@/types";

const formSchema = z.object({
  lastName: z.string().min(2, {
    message: "Lastname must be at least 2 characters.",
  }),
  firstName: z.string().min(2, {
    message: "Firstname must be at least 2 characters.",
  }),
  courses: z.array(z.string()).nonempty({
    message: "Please select at least one course.",
  }),
  contact: z.string().min(10, {
    message: "Contact must be at least 10 characters.",
  }),
  baseSalary: z.string().refine((value) => !isNaN(parseFloat(value)), {
    message: "Base Salary must be a number.",
  }),
  studentBonus: z.string().refine((value) => !isNaN(parseFloat(value)), {
    message: "Student Bonus must be a number.",
  }),
});

const Teachers = () => {
  const { teachers, addTeacher, updateTeacher, deleteTeacher, courses } = useData();
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedTeacherId, setSelectedTeacherId] = useState<string | null>(null);
  const [selectedCourses, setSelectedCourses] = useState<string[]>([]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      lastName: "",
      firstName: "",
      courses: [],
      contact: "",
      baseSalary: "",
      studentBonus: "",
    },
  });

  useEffect(() => {
    if (selectedTeacherId) {
      const teacher = teachers.find((t) => t.id === selectedTeacherId);
      if (teacher) {
        form.setValue("lastName", teacher.lastName);
        form.setValue("firstName", teacher.firstName);
        form.setValue("courses", teacher.courses);
        form.setValue("contact", teacher.contact);
        form.setValue("baseSalary", teacher.baseSalary.toString());
        form.setValue("studentBonus", teacher.studentBonus.toString());
        setSelectedCourses(teacher.courses);
      }
    } else {
      form.reset();
      setSelectedCourses([]);
    }
  }, [selectedTeacherId, teachers, form]);

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    if (editMode && selectedTeacherId) {
      // Update existing teacher
      updateTeacher(selectedTeacherId, {
        ...values,
        baseSalary: parseFloat(values.baseSalary),
        studentBonus: parseFloat(values.studentBonus),
      });
      toast.success("Teacher updated successfully!");
    } else {
      // Create new teacher
      const newTeacher = {
        lastName: values.lastName || "", // Ensure required property has a value (even if empty string)
        firstName: values.firstName || "", // Ensure required property has a value
        courses: values.courses || [], // Ensure required property has a value
        contact: values.contact || "", // Ensure required property has a value
        baseSalary: parseFloat(values.baseSalary) || 0, // Ensure required property has a value
        studentBonus: parseFloat(values.studentBonus) || 0 // Ensure required property has a value
      };
      addTeacher(newTeacher);
      toast.success("Teacher created successfully!");
    }
    setOpen(false);
    setEditMode(false);
    setSelectedTeacherId(null);
    form.reset();
    setSelectedCourses([]);
  };

  const handleEdit = (teacherId: string) => {
    setSelectedTeacherId(teacherId);
    setEditMode(true);
    setOpen(true);
  };

  const handleDelete = (teacherId: string) => {
    deleteTeacher(teacherId);
    toast.success("Teacher deleted successfully!");
  };

  const courseOptions = courses.map((course) => ({
    label: course.name,
    value: course.id,
  }));

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>Διαχείριση Καθηγητών</CardTitle>
          <CardDescription>
            Διαχειριστείτε τους καθηγητές του φροντιστηρίου σας.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={() => {
            setOpen(true);
            setEditMode(false);
            setSelectedTeacherId(null);
            form.reset();
            setSelectedCourses([]);
          }}>
            <Plus className="mr-2 h-4 w-4" />
            Προσθήκη Καθηγητή
          </Button>

          <Table className="mt-4">
            <TableHeader>
              <TableRow>
                <TableHead>Όνομα</TableHead>
                <TableHead>Επώνυμο</TableHead>
                <TableHead>Μαθήματα</TableHead>
                <TableHead>Επικοινωνία</TableHead>
                <TableHead>Βασικός Μισθός</TableHead>
                <TableHead>Μπόνους Φοιτητή</TableHead>
                <TableHead className="text-right">Ενέργειες</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {teachers.map((teacher) => (
                <TableRow key={teacher.id}>
                  <TableCell>{teacher.firstName}</TableCell>
                  <TableCell>{teacher.lastName}</TableCell>
                  <TableCell>{teacher.courses.join(", ")}</TableCell>
                  <TableCell>{teacher.contact}</TableCell>
                  <TableCell>{teacher.baseSalary}</TableCell>
                  <TableCell>{teacher.studentBonus}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(teacher.id)}
                    >
                      <Edit className="mr-2 h-4 w-4" />
                      Επεξεργασία
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="sm" className="text-red-500">
                          <Trash className="mr-2 h-4 w-4" />
                          Διαγραφή
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Είστε σίγουρος/η?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Αυτή η ενέργεια είναι μη αναστρέψιμη.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Ακύρωση</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDelete(teacher.id)}>
                            Διαγραφή
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{editMode ? "Επεξεργασία Καθηγητή" : "Προσθήκη Καθηγητή"}</AlertDialogTitle>
            <AlertDialogDescription>
              {editMode
                ? "Επεξεργαστείτε τα στοιχεία του καθηγητή."
                : "Εισάγετε τα στοιχεία του νέου καθηγητή."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Όνομα</FormLabel>
                    <FormControl>
                      <Input placeholder="Όνομα" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Επώνυμο</FormLabel>
                    <FormControl>
                      <Input placeholder="Επώνυμο" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="courses"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Μαθήματα</FormLabel>
                    <Select
                      multiple
                      onValueChange={(value) => {
                        field.onChange(value);
                        setSelectedCourses(value);
                      }}
                      defaultValue={selectedCourses}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Επιλέξτε μαθήματα" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {courses.map((course) => (
                          <SelectItem key={course.id} value={course.id}>
                            {course.name}
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
                name="contact"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Επικοινωνία</FormLabel>
                    <FormControl>
                      <Input placeholder="Τηλέφωνο" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="baseSalary"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Βασικός Μισθός</FormLabel>
                    <FormControl>
                      <Input placeholder="Βασικός Μισθός" type="number" {...field} />
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
                    <FormLabel>Μπόνους Φοιτητή</FormLabel>
                    <FormControl>
                      <Input placeholder="Μπόνους Φοιτητή" type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <AlertDialogFooter>
                <AlertDialogCancel>Ακύρωση</AlertDialogCancel>
                <Button type="submit">{editMode ? "Ενημέρωση" : "Αποθήκευση"}</Button>
              </AlertDialogFooter>
            </form>
          </Form>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Teachers;
