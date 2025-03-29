
import { useState } from "react";
import { MoreHorizontal, Trash2, Edit, Calendar as CalendarIcon } from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { DataTable } from "@/components/DataTable";
import PageHeader from "@/components/PageHeader";
import { useData } from "@/contexts/DataContext";
import type { Expense } from "@/types";
import { toast } from "sonner";

// Form schema for adding a new expense
const formSchema = z.object({
  date: z.date({
    required_error: "Απαιτείται ημερομηνία.",
  }),
  description: z.string().min(2, {
    message: "Η περιγραφή πρέπει να έχει τουλάχιστον 2 χαρακτήρες.",
  }),
  category: z.string().min(1, {
    message: "Παρακαλώ επιλέξτε κατηγορία.",
  }),
  amount: z.coerce.number().gt(0, {
    message: "Το ποσό πρέπει να είναι μεγαλύτερο από 0.",
  }),
  paymentMethod: z.string().min(1, {
    message: "Παρακαλώ επιλέξτε μέθοδο πληρωμής.",
  }),
});

const Expenses = () => {
  const { expenses, addExpense, deleteExpense } = useData();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [expenseToDelete, setExpenseToDelete] = useState<Expense | null>(null);

  // Initialize form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      date: new Date(),
      description: "",
      category: "",
      amount: 0,
      paymentMethod: "",
    },
  });

  // Handle form submission
  const onSubmit = (values: z.infer<typeof formSchema>) => {
    // Διορθώνουμε το πρόβλημα τύπων εδώ - βεβαιωνόμαστε ότι όλα τα απαιτούμενα πεδία υπάρχουν
    const expenseData: Omit<Expense, "id"> = {
      date: values.date,
      paymentMethod: values.paymentMethod,
      description: values.description,
      category: values.category,
      amount: values.amount
    };
    
    addExpense(expenseData);
    setIsDialogOpen(false);
    form.reset();
  };

  // Handle delete click
  const handleDeleteClick = (expense: Expense) => {
    setExpenseToDelete(expense);
    setIsDeleteDialogOpen(true);
  };

  // Confirm delete
  const confirmDelete = () => {
    if (expenseToDelete) {
      deleteExpense(expenseToDelete.id);
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
        return format(date, "dd/MM/yyyy");
      },
    },
    {
      accessorKey: "description",
      header: "Περιγραφή",
    },
    {
      accessorKey: "category",
      header: "Κατηγορία",
    },
    {
      accessorKey: "amount",
      header: "Ποσό",
      cell: ({ row }: any) => {
        return `${row.getValue("amount")} €`;
      },
    },
    {
      accessorKey: "paymentMethod",
      header: "Μέθοδος Πληρωμής",
    },
    {
      id: "actions",
      cell: ({ row }: any) => {
        const expense = row.original;
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
              <DropdownMenuItem onClick={() => console.log("Edit", expense)}>
                <Edit className="mr-2 h-4 w-4" />
                Επεξεργασία
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleDeleteClick(expense)}
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
      <PageHeader title="Έξοδα" description="Καταγραφή εξόδων" />

      <div className="flex justify-end mb-4">
        <Button onClick={() => setIsDialogOpen(true)}>
          Προσθήκη Εξόδου
        </Button>
      </div>

      <DataTable columns={columns} data={expenses} searchKey="description" searchPlaceholder="Αναζήτηση περιγραφής..." />

      {/* Add Expense Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Προσθήκη Νέου Εξόδου</DialogTitle>
            <DialogDescription>
              Συμπληρώστε τα στοιχεία του εξόδου.
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Ημερομηνία</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-[240px] pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "dd/MM/yyyy")
                            ) : (
                              <span>Επιλέξτε ημερομηνία</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date > new Date()
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Περιγραφή</FormLabel>
                    <FormControl>
                      <Input placeholder="π.χ. Ενοίκιο" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Κατηγορία</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Επιλέξτε κατηγορία" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="rent">Ενοίκιο</SelectItem>
                        <SelectItem value="utilities">Λογαριασμοί</SelectItem>
                        <SelectItem value="supplies">Προμήθειες</SelectItem>
                        <SelectItem value="other">Άλλο</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ποσό</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="0.00" {...field} />
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
                    <FormLabel>Μέθοδος Πληρωμής</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Επιλέξτε μέθοδο πληρωμής" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="cash">Μετρητά</SelectItem>
                        <SelectItem value="bankTransfer">Τραπεζική Μεταφορά</SelectItem>
                        <SelectItem value="creditCard">Πιστωτική Κάρτα</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                >
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
              Είστε βέβαιοι ότι θέλετε να διαγράψετε το έξοδο με περιγραφή{" "}
              <span className="font-medium">
                {expenseToDelete?.description}
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

export default Expenses;
