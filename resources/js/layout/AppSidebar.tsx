
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router";

// Assume these icons are imported from an icon library
import {
  CarIcon,
  ChevronDownIcon,
  GridIcon,
  HorizontaLDots,
  ContactsIcon,
  MaintenanceIcon,
  VendorIcon,
  GasStationIcon,
  PartsIcon,
  ReportsIcon
} from "../icons";
import { useSidebar } from "../context/SidebarContext";
import { useAuth } from "../context/AuthContext";

type NavItem = {
  name: string;
  icon: React.ReactNode;
  path?: string;
  allowedRoles?: string[];
  subItems?: { name: string; path: string; pro?: boolean; new?: boolean; allowedRoles?: string[] }[];
};

const navItems: NavItem[] = [
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
      { name: "Replacement Analysis", path: "/replacement-analysis", pro: false, allowedRoles: ["Admin", "Manager"] },
    ],
  },
  {
    icon: <MaintenanceIcon className="svg-no-fill"/>,
    name: "Maintenance",
    path: "/maintenance",
    allowedRoles: ["Admin", "Manager"],
    subItems: [
      { name: "Work Orders", path: "/maintenance-orders", pro: false, allowedRoles: ["Admin", "Manager"] },
      { name: "Service Reminders", path: "/maintenance-reminders", pro: false, allowedRoles: ["Admin", "Manager"] },
      { name: "Services", path: "/maintenance-services", pro: false, allowedRoles: ["Admin", "Manager"] },
      { name: "Issues", path: "/maintenance-issues", pro: false, allowedRoles: ["Admin", "Manager"] },
      { name: "Schedules", path: "/maintenance-schedules", pro: false, allowedRoles: ["Admin", "Manager"] },
    ],
  },
  {
    icon: <ContactsIcon className="svg-no-fill"/>,
    name: "Contacts",
    path: "/contacts",
    allowedRoles: ["Admin", "Manager"],
  },
  {
    icon: <VendorIcon className="svg-no-fill"/>,
    name: "Vendors",
    path: "/vendors",
    allowedRoles: ["Admin", "Manager"],
  },
    {
      icon: <GasStationIcon className="svg-no-fill"/>,
      name: "Fuel & Gas Stations",
      path: "/fuel",
      allowedRoles: ["Admin", "Manager"],
    },
    {
      icon: <PartsIcon className="svg-no-fill"/>,
      name: "Parts",
      path: "/parts",
      allowedRoles: ["Admin", "Manager"],
    },
    {
      icon: <ReportsIcon className="svg-no-fill"/>,
      name: "Reports",
      path: "/reports",
      allowedRoles: ["Admin", "Manager"],
    },
    {
      icon:'',
      name: "Others",
      path: "/others",
      allowedRoles: ["Admin", "Manager"],
    },
];

const othersItems: NavItem[] = [
  // {
  //   icon: <PieChartIcon />,
  //   name: "Charts",
  //   subItems: [
  //     { name: "Line Chart", path: "/line-chart", pro: false },
  //     { name: "Bar Chart", path: "/bar-chart", pro: false },
  //   ],
  // },
  // {
  //   icon: <BoxCubeIcon />,
  //   name: "UI Elements",
  //   subItems: [
  //     { name: "Alerts", path: "/alerts", pro: false },
  //     { name: "Avatar", path: "/avatars", pro: false },
  //     { name: "Badge", path: "/badge", pro: false },
  //     { name: "Buttons", path: "/buttons", pro: false },
  //     { name: "Images", path: "/images", pro: false },
  //     { name: "Videos", path: "/videos", pro: false },
  //   ],
  // },
  // {
  //   icon: <PlugInIcon />,
  //   name: "Authentication",
  //   subItems: [
  //     { name: "Sign In", path: "/signin", pro: false },
  //     { name: "Sign Up", path: "/signup", pro: false },
  //   ],
  // },
];

const AppSidebar: React.FC = () => {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  const location = useLocation();
  const { hasRole } = useAuth();

  const [openSubmenu, setOpenSubmenu] = useState<{
    type: "main" | "others";
    index: number;
  } | null>(null);
  const [subMenuHeight, setSubMenuHeight] = useState<Record<string, number>>(
    {}
  );
  const subMenuRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // const isActive = (path: string) => location.pathname === path;
  const isActive = useCallback(
    (path: string) => location.pathname === path,
    [location.pathname]
  );

  useEffect(() => {
    let submenuMatched = false;
    ["main", "others"].forEach((menuType) => {
      const items = menuType === "main" ? navItems : othersItems;
      items.forEach((nav, index) => {
        if (nav.subItems) {
          nav.subItems.forEach((subItem) => {
            if (isActive(subItem.path)) {
              setOpenSubmenu({
                type: menuType as "main" | "others",
                index,
              });
              submenuMatched = true;
            }
          });
        }
      });
    });

    if (!submenuMatched) {
      setOpenSubmenu(null);
    }
  }, [location, isActive]);

  useEffect(() => {
    if (openSubmenu !== null) {
      const key = `${openSubmenu.type}-${openSubmenu.index}`;
      if (subMenuRefs.current[key]) {
        setSubMenuHeight((prevHeights) => ({
          ...prevHeights,
          [key]: subMenuRefs.current[key]?.scrollHeight || 0,
        }));
      }
    }
  }, [openSubmenu]);

  const handleSubmenuToggle = (index: number, menuType: "main" | "others") => {
    setOpenSubmenu((prevOpenSubmenu) => {
      if (
        prevOpenSubmenu &&
        prevOpenSubmenu.type === menuType &&
        prevOpenSubmenu.index === index
      ) {
        return null;
      }
      return { type: menuType, index };
    });
  };

  const filterMenuItems = (items: NavItem[]): NavItem[] => {
    return items.filter((item) => {
      if (!item.allowedRoles || item.allowedRoles.length === 0) {
        return true;
      }
      return hasRole(item.allowedRoles);
    }).map((item) => {
      if (item.subItems) {
        return {
          ...item,
          subItems: item.subItems.filter((subItem) => {
            if (!subItem.allowedRoles || subItem.allowedRoles.length === 0) {
              return true;
            }
            return hasRole(subItem.allowedRoles);
          }),
        };
      }
      return item;
    });
  };

  const renderMenuItems = (items: NavItem[], menuType: "main" | "others") => {
    const filteredItems = filterMenuItems(items);
    return (
    <ul className="flex flex-col gap-4 px-4">
      {filteredItems.map((nav, index) => {
        const isLastItem = index === filteredItems.length - 1;
        const isOthersItem = nav.name === "Others";
        
        return (
        <li key={nav.name} className={isOthersItem ? "menu-item-others-wrapper" : ""}>
          {nav.subItems ? (
            <button
              onClick={() => handleSubmenuToggle(index, menuType)}
              className={`menu-item group text-base font-medium text-white hover:bg-[#2C0A77] ${
                openSubmenu?.type === menuType && openSubmenu?.index === index
                  ? "menu-item-active bg-[#2C0A77]"
                  : "menu-item-inactive"
              } cursor-pointer ${
                !isExpanded && !isHovered
                  ? "lg:justify-center"
                  : "lg:justify-start"
              } ${isOthersItem ? "menu-item-others" : ""}`}
            >
              <span
                className={`menu-item-icon-size  ${
                  openSubmenu?.type === menuType && openSubmenu?.index === index
                    ? "menu-item-icon-active"
                    : "menu-item-icon-inactive"
                } ${isOthersItem ? "menu-item-others-icon" : ""}`}
              >
                {nav.icon}
              </span>
              {(isExpanded || isHovered || isMobileOpen) && (
                <span className={`menu-item-text ${isOthersItem ? "menu-item-others-text" : ""}`}>{nav.name}</span>
              )}
              {(isExpanded || isHovered || isMobileOpen) && (
                <ChevronDownIcon
                  className={`ml-auto w-5 h-5 transition-transform duration-200 ${
                    openSubmenu?.type === menuType &&
                    openSubmenu?.index === index
                      ? "rotate-180 text-white"
                      : ""
                  }`}
                />
              )}
            </button>
          ) : (
            nav.path && (
              <Link
                to={nav.path}
                className={`menu-item group text-base font-medium text-white hover:bg-[#2C0A77] ${
                  isActive(nav.path) ? "menu-item-active bg-[#2C0A77]" : "menu-item-inactive"
                } ${isOthersItem ? "menu-item-others hover:bg-transparent" : ""}`}
              >
                <span
                  className={`menu-item-icon-size ${
                    isActive(nav.path)
                      ? "menu-item-icon-active"
                      : "menu-item-icon-inactive"
                  } ${isOthersItem ? "menu-item-others-icon" : ""}`}
                >
                  {nav.icon}
                </span>
                {(isExpanded || isHovered || isMobileOpen) && (
                  <span className={`menu-item-text ${isOthersItem ? "menu-item-others-text text-white opacity-70 font-normal uppercase" : ""}`}>{nav.name}</span>
                )}
              </Link>
            )
          )}
          {nav.subItems && (isExpanded || isHovered || isMobileOpen) && (
            <div
              ref={(el) => {
                subMenuRefs.current[`${menuType}-${index}`] = el;
              }}
              className="overflow-hidden transition-all duration-300"
              style={{
                height:
                  openSubmenu?.type === menuType && openSubmenu?.index === index
                    ? `${subMenuHeight[`${menuType}-${index}`]}px`
                    : "0px",
              }}
            >
              <ul className="mt-2 space-y-1 ml-9">
                {nav.subItems.map((subItem) => (
                  <li key={subItem.name}>
                    <Link
                      to={subItem.path}
                      className={`menu-dropdown-item text-sm text-white hover:bg-[#2C0A77] ${
                        isActive(subItem.path)
                          ? "menu-dropdown-item-active bg-[#2C0A77]"
                          : "menu-dropdown-item-inactive"
                      }`}
                    >
                      {subItem.name}
                      <span className="flex items-center gap-1 ml-auto">
                        {subItem.new && (
                          <span
                            className={`ml-auto ${
                              isActive(subItem.path)
                                ? "menu-dropdown-badge-active"
                                : "menu-dropdown-badge-inactive"
                            } menu-dropdown-badge`}
                          >
                            new
                          </span>
                        )}
                        {subItem.pro && (
                          <span
                            className={`ml-auto ${
                              isActive(subItem.path)
                                ? "menu-dropdown-badge-active"
                                : "menu-dropdown-badge-inactive"
                            } menu-dropdown-badge`}
                          >
                            pro
                          </span>
                        )}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </li>
        );
      })}
    </ul>
    );
  };

  return (
    <aside
      className={`kav-side-bar-bg fixed mt-0 md:mt-16 flex flex-col lg:mt-0 top-0 px-0 left-0 dark:bg-gray-900 dark:border-gray-800 text-gray-900 h-screen transition-all duration-300 ease-in-out z-[9999999]
        ${
          isExpanded || isMobileOpen
            ? "w-[290px]"
            : isHovered
            ? "w-[290px]"
            : "w-[90px]"
        }
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0`}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={`py-3 px-4 flex bg-white mt-[13.8px] md:mt-5 ${
          !isExpanded && !isHovered ? "lg:justify-center" : "justify-start"
        }`}
      >
        <Link to="/">
          {isExpanded || isHovered || isMobileOpen ? (
            <>
              <img
                className="dark:hidden"
                src="/images/logo.png"
                alt="Logo"
                width={87}
              />
              <img
                className="hidden dark:block"
                src="/images/logo.png"
                alt="Logo"
                width={87}
              />
            </>
          ) : (
            <img
              src="/images/logo.png"
              alt="Logo"
              width={32}
              height={32}
            />
          )}
        </Link>
      </div>
      <div className="flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar">
        <nav className="mb-6">
          <div className="flex flex-col gap-4">
            <div>
              <h2
                className={`mb-4 text-sm uppercase flex px-4 mt-4 leading-[20px] text-white ${
                  !isExpanded && !isHovered
                    ? "lg:justify-center"
                    : "justify-start"
                }`}
              >
                {isExpanded || isHovered || isMobileOpen ? (
                  "Menu"
                ) : (
                  <HorizontaLDots className="size-6" />
                )}
              </h2>
              {renderMenuItems(navItems, "main")}
            </div>
            <div className="">
              {/* <h2
                className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${
                  !isExpanded && !isHovered
                    ? "lg:justify-center"
                    : "justify-start"
                }`}
              >
                {isExpanded || isHovered || isMobileOpen ? (
                  ""
                ) : (
                  <HorizontaLDots />
                )}
              </h2> */}
              {/* {renderMenuItems(othersItems, "others")} */}
            </div>
          </div>
        </nav>
      </div>
    </aside>
  );
};

export default AppSidebar;
