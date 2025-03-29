
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { DataProvider } from "./contexts/DataContext";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Students from "./pages/Students";
import RegisterStudent from "./pages/RegisterStudent";
import Classes from "./pages/Classes";
import Teachers from "./pages/Teachers";
import TeacherClasses from "./pages/TeacherClasses";
import Expenses from "./pages/Expenses";
import Courses from "./pages/Courses";
import Statistics from "./pages/Statistics";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <DataProvider>
        <SidebarProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Layout />}>
                <Route index element={<Dashboard />} />
                <Route path="students" element={<Students />} />
                <Route path="register-student" element={<RegisterStudent />} />
                {/* Redirect from old route to new route */}
                <Route path="register" element={<Navigate to="/register-student" replace />} />
                <Route path="classes" element={<Classes />} />
                <Route path="teachers" element={<Teachers />} />
                <Route path="teacher-classes" element={<TeacherClasses />} />
                <Route path="expenses" element={<Expenses />} />
                <Route path="courses" element={<Courses />} />
                <Route path="statistics" element={<Statistics />} />
                <Route path="settings" element={<Settings />} />
              </Route>
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </SidebarProvider>
      </DataProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
