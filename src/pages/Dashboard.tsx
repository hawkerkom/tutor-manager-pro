
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import PageHeader from "@/components/PageHeader";
import { useData } from "@/contexts/DataContext";
import { BarChart, LineChart, PieChart } from "recharts";
import { ArrowUpRight, Users, BookOpen, Receipt, GraduationCap } from "lucide-react";

const Dashboard = () => {
  const navigate = useNavigate();
  const { students, classes, teacherClasses, expenses, statistics } = useData();

  // Quick stats for the dashboard
  const totalStudents = students.length;
  const totalClasses = classes.length;
  const totalRevenue = statistics.revenue.monthly;
  const totalExpenses = statistics.expenses.monthly;
  const pendingPayments = statistics.studentBalances;
  const pendingTeacherPayments = statistics.teacherBalances;
  
  // Calculate revenue by week for the chart (mock data for now)
  const revenueData = [
    { name: "Δευ", amount: 400 },
    { name: "Τρι", amount: 300 },
    { name: "Τετ", amount: 500 },
    { name: "Πεμ", amount: 350 },
    { name: "Παρ", amount: 600 },
    { name: "Σαβ", amount: 450 },
    { name: "Κυρ", amount: 150 },
  ];

  return (
    <div>
      <PageHeader
        title="Πίνακας Ελέγχου"
        description="Επισκόπηση του φροντιστηρίου σας"
      />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Σύνολο Φοιτητών</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalStudents}</div>
            <p className="text-xs text-muted-foreground">
              Ενεργοί φοιτητές στο φροντιστήριο
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Μαθήματα (Μηνιαία)</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalClasses}</div>
            <p className="text-xs text-muted-foreground">
              Συνεδρίες που πραγματοποιήθηκαν
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Έσοδα (Μηνιαία)</CardTitle>
            <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalRevenue}€</div>
            <div className="flex items-center pt-1">
              <p className="text-xs text-muted-foreground">
                Συνολικά έσοδα το τρέχοντα μήνα
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Έξοδα (Μηνιαία)</CardTitle>
            <Receipt className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalExpenses}€</div>
            <p className="text-xs text-muted-foreground">
              Συνολικά έξοδα το τρέχοντα μήνα
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 mt-4">
        <Card>
          <CardHeader>
            <CardTitle>Εκκρεμείς Πληρωμές</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium">Οφειλές Φοιτητών</p>
                  <p className="text-xs text-muted-foreground">Ποσά προς είσπραξη</p>
                </div>
                <div className="text-xl font-bold">{pendingPayments}€</div>
              </div>
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium">Οφειλές προς Καθηγητές</p>
                  <p className="text-xs text-muted-foreground">Ποσά προς πληρωμή</p>
                </div>
                <div className="text-xl font-bold">{pendingTeacherPayments}€</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Γρήγορες Ενέργειες</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <Card className="cursor-pointer hover:bg-accent transition-colors" onClick={() => navigate('/register')}>
                <CardContent className="flex flex-col items-center justify-center p-6">
                  <Users className="h-6 w-6 mb-2" />
                  <p className="text-sm font-medium text-center">Νέος Φοιτητής</p>
                </CardContent>
              </Card>
              <Card className="cursor-pointer hover:bg-accent transition-colors" onClick={() => navigate('/classes')}>
                <CardContent className="flex flex-col items-center justify-center p-6">
                  <BookOpen className="h-6 w-6 mb-2" />
                  <p className="text-sm font-medium text-center">Νέο Μάθημα</p>
                </CardContent>
              </Card>
              <Card className="cursor-pointer hover:bg-accent transition-colors" onClick={() => navigate('/teachers')}>
                <CardContent className="flex flex-col items-center justify-center p-6">
                  <GraduationCap className="h-6 w-6 mb-2" />
                  <p className="text-sm font-medium text-center">Διαχείριση Καθηγητών</p>
                </CardContent>
              </Card>
              <Card className="cursor-pointer hover:bg-accent transition-colors" onClick={() => navigate('/expenses')}>
                <CardContent className="flex flex-col items-center justify-center p-6">
                  <Receipt className="h-6 w-6 mb-2" />
                  <p className="text-sm font-medium text-center">Καταχώρηση Εξόδων</p>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-4">
        <Card>
          <CardHeader>
            <CardTitle>Εβδομαδιαία Έσοδα</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[250px] w-full">
              {/* Placeholder for chart - we will use recharts */}
              <div className="flex items-center justify-center h-full text-muted-foreground">
                <p>Οπτικοποίηση εβδομαδιαίων εσόδων</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
