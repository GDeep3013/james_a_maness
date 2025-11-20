import { IssuesIcon } from "../icons";

type NavItem = {
    name: string;
    icon: React.ReactNode;
    path?: string;
    allowedRoles?: string[];
    subItems?: { name: string; path: string; pro?: boolean; new?: boolean; allowedRoles?: string[] }[];
};


export const ContactMenus : NavItem[] =[
    {
      icon: <IssuesIcon />,
      name: "Issues",
      path: "/issues",
      allowedRoles: ["Contact"],
    }
]