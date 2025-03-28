"use client";

import { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function AuthPage() {
  const [isLoginForm, setIsLoginForm] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("User"); // Default role
  const [loading, setLoading] = useState(false); // Loading state
  const router = useRouter();
  const [error, setError] = useState("");

  const handleRegister = async () => {
    setLoading(true); // Start loading
    try {
      const payload = { name, email, password, role };
      console.log(payload);
      const response = await axios.post(
        "http://localhost:5000/api/auth/register",
        payload
      );
      console.log("User registered:", response.data);
      alert("Registration successful. Please log in.");
      setIsLoginForm(true);
    } catch (err) {
      console.error("Error registering user:", err);
      setError("Registration failed. Please try again.");
    } finally {
      setLoading(false); // Stop loading regardless of outcome
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); // Start loading
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        email,
        password,
      });

      if (response.data.token) {
        // Store token in cookie instead of localStorage
        document.cookie = `authToken=${response.data.token}; path=/; max-age=86400`; // 24 hours
        router.push('/dashboard');
      }
    } catch (error) {
      setError('Invalid credentials');
    } finally {
      setLoading(false); // Stop loading regardless of outcome
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>{isLoginForm ? "Login" : "Sign Up"}</CardTitle>
          <CardDescription>
            {isLoginForm
              ? "Enter your credentials to log in"
              : "Create a new account"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="mb-4 p-2 bg-red-100 text-red-600 rounded">
              {error}
            </div>
          )}
          {isLoginForm ? (
            <>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
              />
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
              />
              <Button
                className="mt-4 w-full"
                onClick={handleLogin}
                disabled={loading}
              >
                {loading ? (
                  <span className="flex justify-center items-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-white mr-2"></div>
                    Logging in...
                  </span>
                ) : (
                  "Login"
                )}
              </Button>
              <Button
                variant="link"
                onClick={() => setIsLoginForm(false)}
                className="mt-2"
                disabled={loading}
              >
                Create an account
              </Button>
            </>
          ) : (
            <>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="Enter your name"
                onChange={(e) => setName(e.target.value)}
                disabled={loading}
              />
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
              />
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
              />
              <Label htmlFor="role">Role</Label>
              <select
                id="role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full p-2 border rounded"
                disabled={loading}
              >
                <option value="User">User</option>
                <option value="Admin">Admin</option>
                <option value="Manager">Manager</option>
              </select>
              <Button
                className="mt-4 w-full"
                onClick={handleRegister}
                disabled={loading}
              >
                {loading ? (
                  <span className="flex justify-center items-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-white mr-2"></div>
                    Signing up...
                  </span>
                ) : (
                  "Sign Up"
                )}
              </Button>
              <Button
                variant="link"
                onClick={() => setIsLoginForm(true)}
                className="mt-2"
                disabled={loading}
              >
                Already have an account? Log in
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
