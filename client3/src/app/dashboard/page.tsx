"use client";
import { useEffect, useState } from "react";
import {jwtDecode} from "jwt-decode";
import AdminPage from "@/app/admin/page";
import ManagerPage from "@/app/manager/page";
import UserPage from "@/app/user/page";

export default function RoleBasedPage() {
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        setError("Authentication token not found. Please log in.");
        setLoading(false);
        return;
      }

      const { role } = jwtDecode(token);
      console.log(role);
      if (!["Admin", "Manager", "User"].includes(role)) {
        setError("Invalid role in token.");
        setLoading(false);
        return;
      }

      setRole(role);
    } catch (err) {
      setError("Error decoding token. Please log in again.");
    } finally {
      setLoading(false);
    }
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {role === "Admin" && <AdminPage />}
      {role === "Manager" && <ManagerPage />}
      {role === 'User' && <UserPage />}
    </div>
  );
}
