
import { useState } from "react";
import { format } from "date-fns";
import { el } from "date-fns/locale";
import { MoreHorizontal, Trash2, Edit } from "lucide-react";
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
import { Textarea } from "@/components/ui/textarea";
import { DataTable } from "@/components/DataTable";
import { DatePickerWithPresets } from "@/components/DatePickerWithPresets";
import PageHeader from "@/components/PageHeader";
import { useData } from "@/contexts/DataContext";
import type { Expense } from "@/types";

// Form schema for adding/editing expenses
const formSchema = z.object({
  date: z.date({
    required_error: "Παρακαλώ επιλέξτε ημερομηνία.",
  }),
  description: z.string().min(2, {
    message: "Η περιγραφή πρέπει να έχει τουλάχιστον 2 χαρακτήρες.",
  }),
  category: z.string({
    required_error: "Παρακαλώ επιλέξτε κατηγορία.",
  }),
  amount: z.coerce.number().min(0.01, {
    message: "Το ποσό πρέπει να είναι μεγαλύτερο από 0.",
  }),
  paymentMethod: z.string({
    required_error: "Παρακαλώ επιλέξτε τρόπο πληρωμής.",
  }),
});

const Expenses = () => {
  const { expenses, addExpense, updateExpense, deleteExpense } = useData();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);

  // Expense categories
  const categories = [
    { value: "rent", label: "Ενοίκιο" },
    { value: "utilities", label: "Λογαριασμοί" },
    { value: "supplies", label: "Υλικά" },
    { value: "salaries", label: "Μισθοδοσία" },
    { value: "marketing", label: "Διαφήμιση" },
    { value: "maintenance", label: "Συντήρηση" },
    { value: "taxes", label: "Φόροι" },
    { value: "other", label: "Άλλο" },
  ];

  // Payment methods
  const paymentMethods = [
    { value: "cash", label: "Μετρητά" },
    { value: "card", label: "Κάρτα" },
    { value: "transfer", label: "Τραπεζική Μεταφορά" },
    { value: "check", label: "Επιταγή" },
  ];

  // Initialize add form
  const addForm = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      date: new Date(),
      description: "",
      category: "",
      amount: 0,
      paymentMethod: "",
    },
  });

  // Initialize edit form
  const editForm = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      date: new Date(),
      description: "",
      category: "",
      amount: 0,
      paymentMethod: "",
    },
  });

  // Handle add form submission
  const onAddSubmit = (values: z.infer<typeof formSchema>) => {
    addExpense(values);
    setIsAddDialogOpen(false);
    addForm.reset();
  };

  // Handle edit form submission
  const onEditSubmit = (values: z.infer<typeof formSchema>) => {
    if (selectedExpense) {
      updateExpense(selectedExpense.id, values);
      setIsEditDialogOpen(false);
    }
  };

  // Handle edit click
  const handleEditClick = (expense: Expense) => {
    setSelectedExpense(expense);
    
    // Populate edit form with expense data
    editForm.reset({
      date: new Date(expense.date),
      description: expense.description,
      category: expense.category,
      amount: expense.amount,
      paymentMethod: expense.paymentMethod,
    });
    
    setIsEditDialogOpen(true);
  };

  // Handle delete click
  const handleDeleteClick = (expense: Expense) => {
    setSelectedExpense(expense);
    setIsDeleteDialogOpen(true);
  };

  // Confirm delete
  const confirmDelete = () => {
    if (selectedExpense) {
      deleteExpense(selectedExpense.id);
      setIsDeleteDialogOpen(false);
    }
  };

  // Get category label by value
  const getCategoryLabel = (value: string) => {
    const category = categories.find(cat => cat.value === value);
    return category ? category.label : value;
  };

  // Get payment method label by value
  const getPaymentMethodLabel = (value: string) => {
    const method = paymentMethods.find(m => m.value === value);
    return method ? method.label : value;
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
      accessorKey: "description",
      header: "Περιγραφή",
    },
    {
      accessorKey: "category",
      header: "Κατηγορία",
      cell: ({ row }: any) => {
        return getCategoryLabel(row.getValue("category"));
      },
    },
    {
      accessorKey: "amount",
      header: "Ποσό",
      cell: ({ row }: any) => {
        return `${row.getValue("amount")}€`;
      },
    },
    {
      accessorKey: "paymentMethod",
      header: "Τρόπος Πληρωμής",
      cell: ({ row }: any) => {
        return getPaymentMethodLabel(row.getValue("paymentMethod"));
      },
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
              <DropdownMenuItem onClick={() => handleEditClick(expense)}>
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
      <PageHeader
        title="Έξοδα"
        description="Καταχώρηση και διαχείριση εξόδων του φροντιστηρίου"
        action={{
          label: "Νέο Έξοδο",
          onClick: () => setIsAddDialogOpen(true),
        }}
      />

      <DataTable
        columns={columns}
        data={expenses}
        searchKey="description"
        searchPlaceholder="Αναζήτηση με περιγραφή..."
      />

      {/* Add Expense Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>Καταχώρηση Νέου Εξόδου</DialogTitle>
            <DialogDescription>
              Συμπληρώστε τα στοιχεία του νέου εξόδου.
            </DialogDescription>
          </DialogHeader>

          <Form {...addForm}>
            <form onSubmit={addForm.handleSubmit(onAddSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={addForm.control}
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

                <FormField
                  control={addForm.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Κατηγορία</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Επιλέξτε κατηγορία" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category.value} value={category.value}>
                              {category.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={addForm.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Περιγραφή</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Περιγραφή εξόδου..."
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={addForm.control}
                  name="amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ποσό (€)</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.01" min="0.01" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={addForm.control}
                  name="paymentMethod"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Τρόπος Πληρωμής</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Επιλέξτε τρόπο" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {paymentMethods.map((method) => (
                            <SelectItem key={method.value} value={method.value}>
                              {method.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

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

      {/* Edit Expense Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>Επεξεργασία Εξόδου</DialogTitle>
            <DialogDescription>
              Τροποποιήστε τα στοιχεία του εξόδου.
            </DialogDescription>
          </DialogHeader>

          <Form {...editForm}>
            <form onSubmit={editForm.handleSubmit(onEditSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={editForm.control}
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

                <FormField
                  control={editForm.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Κατηγορία</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Επιλέξτε κατηγορία" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category.value} value={category.value}>
                              {category.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={editForm.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Περιγραφή</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Περιγραφή εξόδου..."
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={editForm.control}
                  name="amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ποσό (€)</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.01" min="0.01" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={editForm.control}
                  name="paymentMethod"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Τρόπος Πληρωμής</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Επιλέξτε τρόπο" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {paymentMethods.map((method) => (
                            <SelectItem key={method.value} value={method.value}>
                              {method.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

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
              Είστε βέβαιοι ότι θέλετε να διαγράψετε το έξοδο:{" "}
              <span className="font-medium">
                {selectedExpense?.description}
              </span>{" "}
              με ποσό{" "}
              <span className="font-medium">
                {selectedExpense?.amount}€
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
