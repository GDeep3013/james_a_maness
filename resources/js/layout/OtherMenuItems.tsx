import {  SettingsIcon } from "../icons";

type NavItem = {
    name: string;
    icon: React.ReactNode;
    path?: string;
    allowedRoles?: string[];
    subItems?: { name: string; path: string; pro?: boolean; new?: boolean; allowedRoles?: string[] }[];
};

export const OtherMenuItems : NavItem[] = [
    {
      icon: <SettingsIcon className="svg-no-fill"/>,
      name: "Settings",
      path: "/settings",
      allowedRoles: ["Admin", "Manager"],
    }
]
