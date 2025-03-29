
import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import AppSidebar from "./AppSidebar";

const Layout = () => {
  const [isCollapsed, setIsCollapsed] = useState(() => {
    // Get from localStorage or default to false
    const savedState = localStorage.getItem("sidebar-collapsed");
    return savedState ? JSON.parse(savedState) : false;
  });
  
  // Toggle sidebar
  const toggleSidebar = () => {
    const newState = !isCollapsed;
    setIsCollapsed(newState);
    localStorage.setItem("sidebar-collapsed", JSON.stringify(newState));
  };
  
  // Listen for toggle events
  useEffect(() => {
    const handleToggle = () => {
      toggleSidebar();
    };
    
    window.addEventListener("toggle-sidebar", handleToggle);
    return () => {
      window.removeEventListener("toggle-sidebar", handleToggle);
    };
  }, [isCollapsed]);
  
  return (
    <div className="min-h-screen flex w-full">
      <AppSidebar isCollapsed={isCollapsed} />
      <main className="flex-1 p-6 md:p-10 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
