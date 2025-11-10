import React from "react";
import { usePermission } from "../../hooks/usePermission";

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles?: string[];
  requiredPermission?: string;
  fallback?: React.ReactNode;
}

const RoleGuard: React.FC<RoleGuardProps> = ({
  children,
  allowedRoles,
  requiredPermission,
  fallback = null,
}) => {
  const { hasRole, canAccess } = usePermission();

  if (allowedRoles && !hasRole(allowedRoles)) {
    return <>{fallback}</>;
  }

  if (requiredPermission && !canAccess(requiredPermission)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};

export default RoleGuard;

