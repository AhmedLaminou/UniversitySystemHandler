import { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

export const RequireAuth = ({ children }: { children: ReactNode }) => {
  const { accessToken } = useAuth();
  const location = useLocation();

  if (!accessToken) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <>{children}</>;
};


