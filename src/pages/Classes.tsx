import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useData } from "@/contexts/DataContext";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Trash2 } from "lucide-react";

const Classes = () => {
  const { students, classes, addClass, updateClass, deleteClass, schools, courses } = useData();
  const [studentId, setStudentId] = useState<string>("");
  const [selectedStudent, setSelectedStudent] = useState<{
    id: string;
    lastName: string;
    firstName: string;
    school: string;
    department: string;
    phone: string;
    email: string;
    interestedCourses: string[];
    createdAt: Date;
  } | null>(null);
  const [selectedCourse, setSelectedCourse] = useState<{
    id: string;
    school: string;
    department: string;
    name: string;
  } | null>(null);
  const [course, setCourse] = useState<string>("");
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [hours, setHours] = useState<number>(1);
  const [ratePerHour, setRatePerHour] = useState<number>(20);
  const [paymentStatus, setPaymentStatus] = useState<string>("pending");
  const [paymentDate, setPaymentDate] = useState<Date | undefined>();
  const [amountPaid, setAmountPaid] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState<string>("");

  useEffect(() => {
    if (studentId) {
      const foundStudent = students.find((student) => student.id === studentId);
      setSelectedStudent(foundStudent || null);
    } else {
      setSelectedStudent(null);
    }
  }, [studentId, students]);

  useEffect(() => {
    if (course) {
      const foundCourse = courses.find((c) => c.name === course);
      setSelectedCourse(foundCourse || null);
    } else {
      setSelectedCourse(null);
    }
  }, [course, courses]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!studentId || !course || !selectedDate || !hours || !ratePerHour) {
      toast.error("Παρακαλώ συμπληρώστε όλα τα υποχρεωτικά πεδία.");
      return;
    }

    const calculateTotal = hours * ratePerHour;
    const newClass = {
      studentId,
      studentName: `${selectedStudent?.lastName} ${selectedStudent?.firstName}`,
      school: selectedCourse?.school || "",
      department: selectedCourse?.department || "",
      course: selectedCourse?.name || "",
      date: selectedDate,
      hours,
      ratePerHour,
      total: calculateTotal,
      paymentStatus,
      paymentDate: paymentDate || undefined,
      amountPaid,
      balance: calculateTotal - amountPaid,
      paymentMethod: paymentMethod || undefined
    };
    addClass(newClass);

    setStudentId("");
    setCourse("");
    setSelectedDate(undefined);
    setHours(1);
    setRatePerHour(20);
    setPaymentStatus("pending");
    setPaymentDate(undefined);
    setAmountPaid(0);
    setPaymentMethod("");
  };

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>Δημιουργία Μαθήματος</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid gap-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="studentId">ID Φοιτητή</Label>
                <Input
                  type="text"
                  id="studentId"
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="course">Μάθημα</Label>
                <Input
                  type="text"
                  id="course"
                  value={course}
                  onChange={(e) => setCourse(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Ημερομηνία</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-[240px] justify-start text-left font-normal",
                        !date && "text-muted-foreground"
                      )}
                    >
                      {date ? format(date, "dd MMMM yyyy") : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      defaultMonth={date}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div>
                <Label htmlFor="hours">Ώρες</Label>
                <Input
                  type="number"
                  id="hours"
                  value={hours}
                  onChange={(e) => setHours(Number(e.target.value))}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="ratePerHour">Τιμή ανά ώρα</Label>
                <Input
                  type="number"
                  id="ratePerHour"
                  value={ratePerHour}
                  onChange={(e) => setRatePerHour(Number(e.target.value))}
                  required
                />
              </div>

              <div>
                <Label htmlFor="paymentStatus">Κατάσταση Πληρωμής</Label>
                <Select value={paymentStatus} onValueChange={setPaymentStatus}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Επιλέξτε κατάσταση" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Εκκρεμεί</SelectItem>
                    <SelectItem value="partial">Μερική</SelectItem>
                    <SelectItem value="paid">Πληρωμένο</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Ημερομηνία Πληρωμής</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-[240px] justify-start text-left font-normal",
                        !paymentDate && "text-muted-foreground"
                      )}
                    >
                      {paymentDate ? format(paymentDate, "dd MMMM yyyy") : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={paymentDate}
                      onSelect={setPaymentDate}
                      defaultMonth={paymentDate}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div>
                <Label htmlFor="amountPaid">Ποσό Πληρωμής</Label>
                <Input
                  type="number"
                  id="amountPaid"
                  value={amountPaid}
                  onChange={(e) => setAmountPaid(Number(e.target.value))}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="paymentMethod">Μέθοδος Πληρωμής</Label>
              <Input
                type="text"
                id="paymentMethod"
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
            </div>

            <Button type="submit">Δημιουργία Μαθήματος</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Classes;
