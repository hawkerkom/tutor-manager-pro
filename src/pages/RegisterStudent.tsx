
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import PageHeader from "@/components/PageHeader";
import { useData } from "@/contexts/DataContext";
import { toast } from "sonner";

const formSchema = z.object({
  lastName: z.string().min(2, {
    message: "Το επίθετο πρέπει να έχει τουλάχιστον 2 χαρακτήρες.",
  }),
  firstName: z.string().min(2, {
    message: "Το όνομα πρέπει να έχει τουλάχιστον 2 χαρακτήρες.",
  }),
  school: z.string().min(1, {
    message: "Παρακαλώ επιλέξτε μια σχολή.",
  }),
  department: z.string().min(1, {
    message: "Παρακαλώ επιλέξτε ένα τμήμα.",
  }),
  phone: z.string().min(10, {
    message: "Παρακαλώ εισάγετε ένα έγκυρο αριθμό τηλεφώνου.",
  }),
  email: z.string().email({
    message: "Παρακαλώ εισάγετε ένα έγκυρο email.",
  }),
  interestedCourses: z.array(z.string()).min(1, {
    message: "Επιλέξτε τουλάχιστον ένα μάθημα.",
  }),
});

const RegisterStudent = () => {
  const navigate = useNavigate();
  const { schools, courses, addStudent } = useData();
  const [selectedSchool, setSelectedSchool] = useState<string>("");
  const [departmentOptions, setDepartmentOptions] = useState<
    { label: string; value: string }[]
  >([]);
  const [courseOptions, setCourseOptions] = useState<
    { label: string; value: string; id: string }[]
  >([]);

  // Initialize form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      lastName: "",
      firstName: "",
      school: "",
      department: "",
      phone: "",
      email: "",
      interestedCourses: [],
    },
  });

  // Handle school selection
  const handleSchoolChange = (value: string) => {
    setSelectedSchool(value);
    form.setValue("school", value);
    form.setValue("department", ""); // Reset department
    form.setValue("interestedCourses", []); // Reset courses

    // Find school and get departments
    const school = schools.find((s) => s.name === value);
    if (school) {
      const departments = school.departments.map((dept) => ({
        label: dept.name,
        value: dept.name,
      }));
      setDepartmentOptions(departments);
    } else {
      setDepartmentOptions([]);
    }
    setCourseOptions([]);
  };

  // Handle department selection
  const handleDepartmentChange = (value: string) => {
    form.setValue("department", value);
    
    // Find school and department to get courses
    const school = schools.find((s) => s.name === selectedSchool);
    if (school) {
      const department = school.departments.find((d) => d.name === value);
      if (department) {
        const availableCourses = department.courses.map((course) => ({
          label: course.name,
          value: course.name,
          id: course.id,
        }));
        setCourseOptions(availableCourses);
      }
    }
  };

  // Handle form submission
  const onSubmit = (values: z.infer<typeof formSchema>) => {
    addStudent(values);
    toast.success("Ο φοιτητής καταχωρήθηκε επιτυχώς!");
    navigate("/students");
  };

  return (
    <div>
      <PageHeader
        title="Εγγραφή Νέου Φοιτητή"
        description="Συμπληρώστε τα στοιχεία του νέου ενδιαφερόμενου"
      />

      <div className="mx-auto max-w-2xl">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
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
                control={form.control}
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                          <SelectValue placeholder="Επιλέξτε Σχολή" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {schools.map((school) => (
                          <SelectItem key={school.id} value={school.name}>
                            {school.name}
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
                name="department"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Τμήμα</FormLabel>
                    <Select
                      onValueChange={handleDepartmentChange}
                      defaultValue={field.value}
                      disabled={!selectedSchool}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Επιλέξτε Τμήμα" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {departmentOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Τηλέφωνο</FormLabel>
                    <FormControl>
                      <Input placeholder="69XXXXXXXX" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="example@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="interestedCourses"
              render={() => (
                <FormItem>
                  <div className="mb-4">
                    <FormLabel>Ενδιαφερόμενα Μαθήματα</FormLabel>
                    <FormDescription>
                      Επιλέξτε τα μαθήματα που ενδιαφέρεται ο φοιτητής.
                    </FormDescription>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {courseOptions.map((course) => (
                      <FormField
                        key={course.id}
                        control={form.control}
                        name="interestedCourses"
                        render={({ field }) => {
                          return (
                            <FormItem
                              key={course.id}
                              className="flex flex-row items-start space-x-3 space-y-0"
                            >
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(course.value)}
                                  onCheckedChange={(checked) => {
                                    return checked
                                      ? field.onChange([...field.value, course.value])
                                      : field.onChange(
                                          field.value?.filter(
                                            (value) => value !== course.value
                                          )
                                        );
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="font-normal">
                                {course.label}
                              </FormLabel>
                            </FormItem>
                          );
                        }}
                      />
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/students")}
              >
                Ακύρωση
              </Button>
              <Button type="submit">Αποθήκευση</Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default RegisterStudent;
