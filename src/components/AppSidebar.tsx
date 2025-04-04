import * as React from "react"
import {
  LayoutDashboard,
  Calendar,
  User,
  Book,
  ListChecks,
  Settings,
  Users,
  ScrollText,
  ChevronLeft
} from "lucide-react"
import { NavLink } from "react-router-dom"

import { cn } from "@/lib/utils"
import { Button } from "./ui/button"

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  isCollapsed: boolean;
}

function AppSidebar({ className, isCollapsed, ...props }: SidebarProps) {
  return (
    <div
      className={cn(
        "flex h-full flex-col border-r bg-secondary transition-all duration-300",
        isCollapsed ? "w-[70px]" : "w-[280px]",
        className
      )}
      {...props}
    >
      <div className="flex-1 space-y-1 p-2">
        <div className="flex items-center justify-between pb-2 px-3">
          {!isCollapsed && <h2 className="text-lg font-semibold">Διαχείριση</h2>}
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-7 w-7"
            onClick={() => {
              const event = new CustomEvent('toggle-sidebar');
              window.dispatchEvent(event);
            }}
          >
            <ChevronLeft className={cn("h-4 w-4", isCollapsed && "rotate-180")} />
            <span className="sr-only">Toggle Sidebar</span>
          </Button>
        </div>
        <NavLink
          to="/"
          className={({ isActive }) =>
            cn(
              "group flex items-center space-x-2 rounded-md p-2 hover:bg-accent hover:text-accent-foreground font-medium",
              isActive ? "bg-accent text-accent-foreground" : ""
            )
          }
        >
          <LayoutDashboard className="h-4 w-4" />
          {!isCollapsed && <div>Dashboard</div>}
        </NavLink>
        <NavLink
          to="/register-student"
          className={({ isActive }) =>
            cn(
              "group flex items-center space-x-2 rounded-md p-2 hover:bg-accent hover:text-accent-foreground font-medium",
              isActive ? "bg-accent text-accent-foreground" : ""
            )
          }
        >
          <User className="h-4 w-4" />
          {!isCollapsed && <div>Εγγραφή Φοιτητή</div>}
        </NavLink>
        <NavLink
          to="/classes"
          className={({ isActive }) =>
            cn(
              "group flex items-center space-x-2 rounded-md p-2 hover:bg-accent hover:text-accent-foreground font-medium",
              isActive ? "bg-accent text-accent-foreground" : ""
            )
          }
        >
          <Calendar className="h-4 w-4" />
          {!isCollapsed && <div>Μαθήματα</div>}
        </NavLink>
        <NavLink
          to="/teachers"
          className={({ isActive }) =>
            cn(
              "group flex items-center space-x-2 rounded-md p-2 hover:bg-accent hover:text-accent-foreground font-medium",
              isActive ? "bg-accent text-accent-foreground" : ""
            )
          }
        >
          <Users className="h-4 w-4" />
          {!isCollapsed && <div>Καθηγητές</div>}
        </NavLink>
        <NavLink
          to="/teacher-classes"
          className={({ isActive }) =>
            cn(
              "group flex items-center space-x-2 rounded-md p-2 hover:bg-accent hover:text-accent-foreground font-medium",
              isActive ? "bg-accent text-accent-foreground" : ""
            )
          }
        >
          <ScrollText className="h-4 w-4" />
          {!isCollapsed && <div>Διδασκαλίες</div>}
        </NavLink>
        <NavLink
          to="/courses"
          className={({ isActive }) =>
            cn(
              "group flex items-center space-x-2 rounded-md p-2 hover:bg-accent hover:text-accent-foreground font-medium",
              isActive ? "bg-accent text-accent-foreground" : ""
            )
          }
        >
          <Book className="h-4 w-4" />
          {!isCollapsed && <div>Σχολές & Μαθήματα</div>}
        </NavLink>
        <NavLink
          to="/expenses"
          className={({ isActive }) =>
            cn(
              "group flex items-center space-x-2 rounded-md p-2 hover:bg-accent hover:text-accent-foreground font-medium",
              isActive ? "bg-accent text-accent-foreground" : ""
            )
          }
        >
          <ListChecks className="h-4 w-4" />
          {!isCollapsed && <div>Έξοδα</div>}
        </NavLink>
      </div>
      <div className="border-t p-2">
        <NavLink
          to="/settings"
          className={({ isActive }) =>
            cn(
              "group flex items-center space-x-2 rounded-md p-2 hover:bg-accent hover:text-accent-foreground font-medium",
              isActive ? "bg-accent text-accent-foreground" : ""
            )
          }
        >
          <Settings className="h-4 w-4" />
          {!isCollapsed && <div>Ρυθμίσεις</div>}
        </NavLink>
      </div>
    </div>
  );
}

export default AppSidebar;
