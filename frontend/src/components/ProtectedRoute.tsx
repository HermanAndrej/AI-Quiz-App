import { Navigate } from "react-router-dom";
import React from "react";
import { isTokenValid } from "@/lib/auth";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const token = localStorage.getItem("token");
  if (!token || !isTokenValid()) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
} 