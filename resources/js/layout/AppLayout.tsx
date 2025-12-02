import { SidebarProvider, useSidebar } from "../context/SidebarContext";
import { Outlet } from "react-router";
import AppHeader from "./AppHeader";
import Backdrop from "./Backdrop";
import AppSidebar from "./AppSidebar";

const LayoutContent: React.FC = () => {
  const { isExpanded, isHovered, isMobileOpen } = useSidebar();

  return (
    <div className="min-h-screen xl:flex">
      <div>
        <AppSidebar />
        <Backdrop />
      </div>
      <div
        className={`flex-1 transition-all duration-300 ease-in-out ${
          isExpanded || isHovered ? "lg:ml-[290px]" : "lg:ml-[90px]"
        } ${isMobileOpen ? "ml-0" : ""} dark:border-gray-800 dark:bg-gray-900 lg:border-b`}
      >
            <AppHeader />
            <div className="p-4 mx-auto max-w-full md:p-6 dark:border-gray-800 dark:bg-gray-900 lg:border-b">
             <Outlet />
            </div>
              <div className="py-3 footer-shadow text-center">
                  <p className="text-sm text-[#8A8A8A]">© 2025 KAV Expediting. All Rights Reserved</p>
            </div>


      </div>
    </div>
  );
};

const AppLayout: React.FC = () => {
  return (
    <SidebarProvider>
      <LayoutContent />
    </SidebarProvider>
  );
};

export default AppLayout;
