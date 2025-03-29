
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { el } from "date-fns/locale";
import { Edit, Eye, MoreHorizontal, Trash2 } from "lucide-react";
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
import { DataTable } from "@/components/DataTable";
import PageHeader from "@/components/PageHeader";
import { useData } from "@/contexts/DataContext";
import type { Student } from "@/types";

const Students = () => {
  const navigate = useNavigate();
  const { students, deleteStudent } = useData();
  const [studentToDelete, setStudentToDelete] = useState<Student | null>(null);
  const [viewingStudent, setViewingStudent] = useState<Student | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);

  const handleAddStudent = () => {
    navigate("/register");
  };

  const handleViewStudent = (student: Student) => {
    setViewingStudent(student);
    setIsViewDialogOpen(true);
  };

  const handleEditStudent = (student: Student) => {
    // TODO: Implement edit functionality
    console.log("Edit student:", student);
  };

  const handleDeleteClick = (student: Student) => {
    setStudentToDelete(student);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (studentToDelete) {
      deleteStudent(studentToDelete.id);
      setIsDeleteDialogOpen(false);
      setStudentToDelete(null);
    }
  };

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
      accessorKey: "school",
      header: "Σχολή",
    },
    {
      accessorKey: "department",
      header: "Τμήμα",
    },
    {
      accessorKey: "phone",
      header: "Τηλέφωνο",
    },
    {
      accessorKey: "createdAt",
      header: "Ημ/νία Εγγραφής",
      cell: ({ row }: any) => {
        const date = new Date(row.original.createdAt);
        return format(date, "dd/MM/yyyy", { locale: el });
      },
    },
    {
      id: "actions",
      cell: ({ row }: any) => {
        const student = row.original;
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
              <DropdownMenuItem onClick={() => handleViewStudent(student)}>
                <Eye className="mr-2 h-4 w-4" />
                Προβολή
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleEditStudent(student)}>
                <Edit className="mr-2 h-4 w-4" />
                Επεξεργασία
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleDeleteClick(student)}
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
        title="Φοιτητές"
        description="Διαχείριση καταχωρημένων φοιτητών"
        action={{
          label: "Νέος Φοιτητής",
          onClick: handleAddStudent,
        }}
      />

      <DataTable
        columns={columns}
        data={students}
        searchKey="lastName"
        searchPlaceholder="Αναζήτηση με επίθετο..."
      />

      {/* Delete confirmation dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Επιβεβαίωση Διαγραφής</DialogTitle>
            <DialogDescription>
              Είστε βέβαιοι ότι θέλετε να διαγράψετε τον φοιτητή:{" "}
              <span className="font-medium">
                {studentToDelete?.lastName} {studentToDelete?.firstName}
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

      {/* View student dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {viewingStudent?.lastName} {viewingStudent?.firstName}
            </DialogTitle>
            <DialogDescription>
              Προβολή πλήρων στοιχείων φοιτητή
            </DialogDescription>
          </DialogHeader>

          {viewingStudent && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold text-sm">Προσωπικά Στοιχεία</h3>
                <div className="mt-2 space-y-2">
                  <div>
                    <span className="text-muted-foreground text-sm">Επίθετο:</span>{" "}
                    {viewingStudent.lastName}
                  </div>
                  <div>
                    <span className="text-muted-foreground text-sm">Όνομα:</span>{" "}
                    {viewingStudent.firstName}
                  </div>
                  <div>
                    <span className="text-muted-foreground text-sm">Τηλέφωνο:</span>{" "}
                    {viewingStudent.phone}
                  </div>
                  <div>
                    <span className="text-muted-foreground text-sm">Email:</span>{" "}
                    {viewingStudent.email}
                  </div>
                  <div>
                    <span className="text-muted-foreground text-sm">
                      Ημερομηνία Εγγραφής:
                    </span>{" "}
                    {format(new Date(viewingStudent.createdAt), "dd/MM/yyyy", {
                      locale: el,
                    })}
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-sm">Ακαδημαϊκά Στοιχεία</h3>
                <div className="mt-2 space-y-2">
                  <div>
                    <span className="text-muted-foreground text-sm">Σχολή:</span>{" "}
                    {viewingStudent.school}
                  </div>
                  <div>
                    <span className="text-muted-foreground text-sm">Τμήμα:</span>{" "}
                    {viewingStudent.department}
                  </div>
                </div>
              </div>

              <div className="md:col-span-2">
                <h3 className="font-semibold text-sm">Μαθήματα Ενδιαφέροντος</h3>
                <div className="mt-2">
                  {viewingStudent.interestedCourses.length > 0 ? (
                    <ul className="list-disc list-inside space-y-1">
                      {viewingStudent.interestedCourses.map((course, index) => (
                        <li key={index}>{course}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-muted-foreground text-sm">
                      Δεν έχουν καταχωρηθεί μαθήματα ενδιαφέροντος.
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
              Κλείσιμο
            </Button>
            <Button
              onClick={() => {
                if (viewingStudent) {
                  handleEditStudent(viewingStudent);
                  setIsViewDialogOpen(false);
                }
              }}
            >
              Επεξεργασία
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Students;
