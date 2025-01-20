"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import AdminPage from "@/app/admin/page";
import ManagerPage from "@/app/manager/page";
import UserPage from "@/app/user/page";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";

interface CustomJwtPayload {
  id: string;
  name: string;
  email: string;
  role: string;
}

export default function RoleBasedPage() {
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    try {
      // Get token from cookie instead of localStorage
      const getCookie = (name: string) => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop()?.split(';').shift();
      };

      const token = getCookie('authToken');
      
      if (!token) {
        setError("Authentication token not found. Please log in.");
        setLoading(false);
        return;
      }

      const decodedToken = jwtDecode<CustomJwtPayload>(token);
      const { role } = decodedToken;

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

  const handleLogout = () => {
    // Remove cookie
    document.cookie = 'authToken=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    router.push('/loginsignup');
  };

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
      <nav className="bg-gray-800 text-white p-4">
        <div className="flex justify-between">
          <div className="text-lg">Task Management App.</div>
          <div>
            <Button
              onClick={handleLogout}
            >
              Logout
            </Button>
          </div>
        </div>
      </nav>
      <div className="mt-4">
        {role === "Admin" && <AdminPage />}
        {role === "Manager" && <ManagerPage />}
        {role === "User" && <UserPage />}
      </div>
    </div>
  );
}
