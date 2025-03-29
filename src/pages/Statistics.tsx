
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import PageHeader from "@/components/PageHeader";
import { useData } from "@/contexts/DataContext";
import {
  BarChart as BarChartIcon,
  LineChart as LineChartIcon,
  PieChart as PieChartIcon,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Users,
  GraduationCap,
} from "lucide-react";

const Statistics = () => {
  const { statistics, students, classes, teachers, expenses } = useData();

  return (
    <div>
      <PageHeader
        title="Στατιστικά"
        description="Συγκεντρωτικά στατιστικά και αναλύσεις"
      />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Συνολικοί Φοιτητές
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statistics.studentsCount.total}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Μηνιαία Έσοδα
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statistics.revenue.monthly}€</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Μηνιαία Έξοδα
            </CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statistics.expenses.monthly}€</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Καθαρό Κέρδος
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statistics.revenue.monthly - statistics.expenses.monthly}€</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Φοιτητές ανά Σχολή</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px] flex items-center justify-center">
            <PieChartIcon className="h-16 w-16 text-muted-foreground opacity-50" />
            <div className="ml-4 text-muted-foreground">
              Γράφημα φοιτητών ανά σχολή (θα υλοποιηθεί)
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Έσοδα & Έξοδα</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px] flex items-center justify-center">
            <BarChartIcon className="h-16 w-16 text-muted-foreground opacity-50" />
            <div className="ml-4 text-muted-foreground">
              Συγκριτικό γράφημα εσόδων-εξόδων (θα υλοποιηθεί)
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Εκκρεμείς Πληρωμές Φοιτητών</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{statistics.studentBalances}€</div>
            <p className="text-muted-foreground">
              Συνολικό ποσό που εκκρεμεί από μαθητές
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Οφειλές προς Καθηγητές</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{statistics.teacherBalances}€</div>
            <p className="text-muted-foreground">
              Συνολικό ποσό που οφείλεται σε καθηγητές
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Τάσεις Εσόδων</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px] flex items-center justify-center">
          <LineChartIcon className="h-16 w-16 text-muted-foreground opacity-50" />
          <div className="ml-4 text-muted-foreground">
            Γράφημα τάσης εσόδων ανά μήνα (θα υλοποιηθεί)
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Statistics;
