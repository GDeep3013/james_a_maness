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
                className={`flex-1 transition-all duration-300 ease-in-out overflow-x-hidden ${isExpanded || isHovered ? "lg:ml-[290px]" : "lg:ml-[90px]"
                    } ${isMobileOpen ? "ml-0" : ""} dark:border-gray-800 dark:bg-gray-900 lg:border-b`}
            >
                <AppHeader />
                <div className="mx-auto max-w-full relative overflow-x-hidden">
                    <div className="p-4 md:p-6 overflow-hidden overflow-y-auto screen-height">
                        <Outlet />
                    </div>
                    <div className="py-3 footer-shadow text-center w-full absolute bottom-0 bg-white">
                        <p className="text-sm text-[#8A8A8A]">© 2025 KAV Expediting. All Rights Reserved</p>
                    </div>
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
