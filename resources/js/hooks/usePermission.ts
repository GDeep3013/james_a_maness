import { useAuth } from "../context/AuthContext";

export const usePermission = () => {
  const { user, permissions, hasRole, checkPermission } = useAuth();

  const canAccess = (permission: string): boolean => {
    return checkPermission(permission);
  };

  const isAdmin = (): boolean => {
    return hasRole(["Admin"]);
  };

  const isManager = (): boolean => {
    return hasRole(["Manager"]);
  };

  const isDriver = (): boolean => {
    return hasRole(["Driver"]);
  };

  const isAdminOrManager = (): boolean => {
    return hasRole(["Admin", "Manager"]);
  };

  const canAccessDrivers = (): boolean => {
    return hasRole(["Admin", "Manager"]);
  };

  const canAccessVehicles = (): boolean => {
    return hasRole(["Admin", "Manager"]);
  };

  return {
    user,
    permissions,
    canAccess,
    isAdmin,
    isManager,
    isDriver,
    isAdminOrManager,
    canAccessDrivers,
    canAccessVehicles,
  };
};
