
import { Link, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { 
  BarChart3, 
  BookOpen, 
  Calendar, 
  Home, 
  PlusCircle, 
  Users, 
  GraduationCap,
  Receipt 
} from "lucide-react";

const menuItems = [
  {
    title: "Αρχική",
    url: "/",
    icon: Home,
  },
  {
    title: "Φοιτητές",
    url: "/students",
    icon: Users,
  },
  {
    title: "Εγγραφή",
    url: "/register",
    icon: PlusCircle,
  },
  {
    title: "Μαθήματα",
    url: "/classes",
    icon: Calendar,
  },
  {
    title: "Καθηγητές",
    url: "/teachers",
    icon: GraduationCap,
  },
  {
    title: "Έξοδα",
    url: "/expenses",
    icon: Receipt,
  },
  {
    title: "Σχολές & Μαθήματα",
    url: "/courses",
    icon: BookOpen,
  },
  {
    title: "Στατιστικά",
    url: "/statistics",
    icon: BarChart3,
  },
];

const AppSidebar = () => {
  const location = useLocation();

  return (
    <Sidebar>
      <SidebarHeader className="px-6 py-5">
        <h1 className="text-xl font-bold">Tutor Manager Pro</h1>
        <SidebarTrigger />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Διαχείριση</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild active={location.pathname === item.url}>
                    <Link to={item.url} className="flex items-center gap-3">
                      <item.icon className="h-5 w-5" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="px-6 py-4">
        <div className="text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} Tutor Manager Pro
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
