import {
    CarIcon,
    GridIcon,
    ContactsIcon,
    MaintenanceIcon,
    VendorIcon,
    GasStationIcon,
    PartsIcon,
    ReportsIcon,
    ServiceIcon
} from "../icons";

type NavItem = {
    name: string;
    icon: React.ReactNode;
    path?: string;
    allowedRoles?: string[];
    subItems?: { name: string; path: string; pro?: boolean; new?: boolean; allowedRoles?: string[] }[];
};

export const AdminMenus: NavItem[] = [
    {
        icon: <GridIcon />,
        name: "Dashboard",
        path: "/",
    },
    {
        icon: <CarIcon />,
        name: "Vehicles",
        allowedRoles: ["Admin", "Manager"],
        subItems: [
            { name: "Asset List", path: "/vehicles", pro: false, allowedRoles: ["Admin", "Manager"] },
            { name: "Vehicle Assignments", path: "/vehicle-assignments", pro: false, allowedRoles: ["Admin", "Manager"] },
            { name: "Meter History", path: "/meter-history", pro: false, allowedRoles: ["Admin", "Manager"] },
            { name: "Expense History", path: "/expense-history", pro: false, allowedRoles: ["Admin", "Manager"] },
            { name: "Replacement Analysis", path: "/vehicle-replacement-analysis", pro: false, allowedRoles: ["Admin", "Manager"] },
        ],
    },
    {
        icon: <MaintenanceIcon className="svg-no-fill" />,
        name: "Maintenance",
        allowedRoles: ["Admin", "Manager"],
        subItems: [
            { name: "Work Orders", path: "/work-orders", pro: false, allowedRoles: ["Admin", "Manager"] },
            { name: "Service Reminders", path: "/service-reminders", pro: false, allowedRoles: ["Admin", "Manager"] },
            // { name: "Services", path: "/services", pro: false, allowedRoles: ["Admin", "Manager"] },
            { name: "Service Tasks", path: "/service-tasks", pro: false, allowedRoles: ["Admin", "Manager"] },
            { name: "Issues", path: "/issues", pro: false, allowedRoles: ["Admin", "Manager"] },
            { name: "Schedules", path: "/schedules", pro: false, allowedRoles: ["Admin", "Manager"] }
        ],
    },
    {
        icon: <ContactsIcon className="svg-no-fill" />,
        name: "Contacts",
        path: "/contacts",
        allowedRoles: ["Admin", "Manager"],
    },
    {
        icon: <VendorIcon className="svg-no-fill" />,
        name: "Vendors",
        path: "/vendors",
        allowedRoles: ["Admin", "Manager"],
    },
    {
        icon: <GasStationIcon className="svg-no-fill" />,
        name: "Fuel & Gas Stations",
        path: "/fuels",
        allowedRoles: ["Admin", "Manager"],
    },
    {
        icon: <PartsIcon className="svg-no-fill" />,
        name: "Parts",
        path: "/parts",
        allowedRoles: ["Admin", "Manager"],
    },
    {
        icon: <ServiceIcon/>,
        name: "Services",
        path: "/services",
        allowedRoles: ["Admin", "Manager"],
    },
    {
        icon: <ReportsIcon className="svg-no-fill" />,
        name: "Reports",
        path: "/reports",
        allowedRoles: ["Admin", "Manager"],
    }

]
