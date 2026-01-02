
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router";

// Assume these icons are imported from an icon library
import {
    ChevronDownIcon,
    HorizontaLDots,
} from "../icons";
import { useSidebar } from "../context/SidebarContext";
import { useAuth } from "../context/AuthContext";
import { AdminMenus } from "./AdminMenus";
import { ContactMenus } from "./ContactMenus";
import { OtherMenuItems } from "./OtherMenuItems";

type NavItem = {
    name: string;
    icon: React.ReactNode;
    path?: string;
    allowedRoles?: string[];
    subItems?: { name: string; path: string; pro?: boolean; new?: boolean; allowedRoles?: string[] }[];
};

const AppSidebar: React.FC = () => {

    const { isExpanded, isMobileOpen, isHovered, setIsHovered, closeMobileSidebar } = useSidebar();
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

    const isActive = useCallback((path: string) => {
        if (location.pathname === path) {
            return true;
        }
        if (path === "/") {
            return location.pathname === "/" || location.pathname === "/home";
        }
        return location.pathname.startsWith(path + "/");
    },
        [location.pathname]
    );

    const isSubItemActive = useCallback((subItemPath: string) => {
        if (location.pathname === subItemPath) {
            return true;
        }
        return location.pathname.startsWith(subItemPath + "/");
    }, [location.pathname]);

    const isMenuActive = useCallback((nav: NavItem) => {
        if (nav.path && isActive(nav.path)) {
            return true;
        }
        if (nav.subItems) {
            return nav.subItems.some((subItem) => isSubItemActive(subItem.path));
        }
        return false;
    }, [isActive, isSubItemActive]);

    const navItems = hasRole(["Admin", "Manager"]) ? AdminMenus : ContactMenus;
    const othersItems: NavItem[] = OtherMenuItems;

    useEffect(() => {
        ["main", "others"].forEach((menuType) => {
            const items = menuType === "main" ? navItems : othersItems;
            items.forEach((nav, index) => {
                if (nav.subItems) {
                    nav.subItems.forEach((subItem) => {
                        if (isSubItemActive(subItem.path)) {
                            setOpenSubmenu({
                                type: menuType as "main" | "others",
                                index,
                            });
                        }
                    });
                }
            });
        });
    }, [location.pathname, isSubItemActive, navItems, othersItems]);

    const prevPathnameRef = useRef(location.pathname);
    const isMobileOpenRef = useRef(isMobileOpen);
    
    useEffect(() => {
        isMobileOpenRef.current = isMobileOpen;
    }, [isMobileOpen]);
    
    useEffect(() => {
        if (prevPathnameRef.current !== location.pathname) {
            prevPathnameRef.current = location.pathname;
            if (window.innerWidth < 768 && isMobileOpenRef.current) {
                closeMobileSidebar();
            }
        }
    }, [location.pathname, closeMobileSidebar]);

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
            const items = menuType === "main" ? navItems : othersItems;
            const nav = items[index];

            if (nav.subItems) {
                const hasActiveSubItem = nav.subItems.some((subItem) => isSubItemActive(subItem.path));

                if (hasActiveSubItem) {
                    return { type: menuType, index };
                }
            }

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
                    const isOthersItem = nav.name === "Others";

                    return (
                        <li key={nav.name} className={isOthersItem ? "menu-item-others-wrapper" : ""}>
                            {nav.subItems ? (
                                <button
                                    type="button"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        handleSubmenuToggle(index, menuType);
                                    }}
                                    className={`menu-item group text-base font-medium text-white hover:bg-[#2C0A77] ${(openSubmenu?.type === menuType && (openSubmenu?.index) === index) || isMenuActive(nav)
                                            ? "menu-item-active bg-[#2C0A77]"
                                            : "menu-item-inactive"
                                        } cursor-pointer ${!isExpanded && !isHovered
                                            ? "lg:justify-center"
                                            : "lg:justify-start"
                                        } ${isOthersItem ? "menu-item-others" : ""}`}
                                >
                                    <span
                                        className={`menu-item-icon-size  ${(openSubmenu?.type === menuType && openSubmenu?.index === index) || isMenuActive(nav)
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
                                            className={`ml-auto w-5 h-5 transition-transform duration-200 ${openSubmenu?.type === menuType &&
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
                                        onClick={() => {
                                            if (window.innerWidth < 768) {
                                                closeMobileSidebar();
                                            }
                                        }}
                                        className={`menu-item group text-base font-medium text-white hover:bg-[#2C0A77] ${isActive(nav.path) ? "menu-item-active bg-[#2C0A77]" : "menu-item-inactive"
                                            } ${isOthersItem ? "menu-item-others hover:bg-transparent" : ""}`}
                                    >
                                        <span
                                            className={`menu-item-icon-size ${isActive(nav.path)
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
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        if (window.innerWidth < 768) {
                                                            closeMobileSidebar();
                                                        }
                                                    }}
                                                    className={`menu-dropdown-item text-sm text-white hover:bg-[#2C0A77] ${isSubItemActive(subItem.path)
                                                            ? "menu-dropdown-item-active bg-[#2C0A77]"
                                                            : "menu-dropdown-item-inactive"
                                                        }`}
                                                >
                                                    {subItem.name}
                                                    <span className="flex items-center gap-1 ml-auto">
                                                        {subItem.new && (
                                                            <span
                                                                className={`ml-auto ${isSubItemActive(subItem.path)
                                                                        ? "menu-dropdown-badge-active"
                                                                        : "menu-dropdown-badge-inactive"
                                                                    } menu-dropdown-badge`}
                                                            >
                                                                new
                                                            </span>
                                                        )}
                                                        {subItem.pro && (
                                                            <span
                                                                className={`ml-auto ${isSubItemActive(subItem.path)
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
            className={`kav-side-bar-bg fixed mt-0 max-w-[1024px]:mt-16 flex flex-col lg:mt-0 top-0 px-0 left-0 dark:bg-gray-900 dark:border-gray-800 text-gray-900 h-screen transition-all duration-300 ease-in-out z-[9999999]
        ${isExpanded || isMobileOpen
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
                className={`py-3 px-4 flex bg-white mt-[10.8px] md:mt-[13px] min-w-[1024px]:mt-5 ${!isExpanded && !isHovered ? "lg:justify-center" : "justify-start"
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
                                className={`mb-4 text-sm uppercase flex px-4 mt-4 leading-[20px] text-white ${!isExpanded && !isHovered
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
                        <div className="setting-menu">
                            <p className="px-5 border-t border-[#372372] mx-2 mt-4 py-4">

                                <span className="menu-item-text menu-item-others-text text-white opacity-70 font-normal uppercase">Others</span>
                            </p>

                            {renderMenuItems(othersItems, "others")}
                        </div>
                    </div>
                </nav>
            </div>
        </aside>
    );
};

export default AppSidebar;
