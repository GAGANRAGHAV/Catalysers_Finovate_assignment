"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import { useAuth } from "@/hooks/useAuth";

interface DecodedToken {
  id: string;
}

interface CustomJwtPayload {
  role: string;
  id: string;
}

// Define the type for user data
interface User {
  id: string;
  name: string;
  email: string;
}

interface UserPlanInfo {
  userType: string;
  taskCount: number;
  taskLimit: number;
}

export default function CreateTaskForm() {
  const { user, loading } = useAuth('Admin');
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [users, setUsers] = useState<User[]>([]); // Explicitly define type
  const [userId, setUserId] = useState<string>(""); // State to hold userId
  const router = useRouter();
  const [role, setRole] = useState<string | null>(null);
  const [planInfo, setPlanInfo] = useState<UserPlanInfo | null>(null);

  // Fetch all users for the "assigned_to" dropdown
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/auth/users"
        );
        setUsers(response.data.users);
      } catch (err) {
        console.error("Error fetching users:", err);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        router.push("/loginsignup");
        return;
      }
      const decodedToken = jwtDecode<CustomJwtPayload>(token);
      setRole(decodedToken.role);
    } catch {
      router.push("/loginsignup");
    }
  }, [router]);

  // Update token retrieval to use cookies
  useEffect(() => {
    const getCookie = (name: string) => {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop()?.split(';').shift();
    };

    const token = getCookie('authToken');
    if (token) {
      const decodedToken: DecodedToken = jwtDecode<DecodedToken>(token);
      setUserId(decodedToken?.id || "");
    }
  }, []);

  // Add this function to get the task limit based on plan
  const getTaskLimit = (userType: string): number => {
    const limits = {
      'free': 3,
      'pro': 10,
      'premium': 50
    };
    return limits[userType as keyof typeof limits] || 3;
  };

  // Add this before the useEffect
  const fetchUserPlanInfo = async () => {
    if (!userId) {
      console.error("User ID is not available.");
      return;
    }

    try {
      const typeResponse = await axios.post("http://localhost:5000/api/tasks/getusertype", {
        userId,
      });

      if (typeResponse.status === 200) {
        const { userType } = typeResponse.data;
        
        const countResponse = await axios.get(`http://localhost:5000/api/tasks/count/${userId}`);
        const taskCount = countResponse.data.count;
        
        setPlanInfo({
          userType,
          taskCount,
          taskLimit: getTaskLimit(userType)
        });
      }
    } catch (error) {
      console.error("Error fetching user plan info:", error);
    }
  };

  // Modify the useEffect to just call the function
  useEffect(() => {
    fetchUserPlanInfo();
  }, [userId]);

  const handleCreateTask = async () => {
    try {
      if (!planInfo) {
        alert("Loading plan information...");
        return;
      }

      // Check if user has reached their task limit
      if (planInfo.taskCount >= planInfo.taskLimit) {
        alert("You've reached your task limit. Please upgrade your plan to create more tasks.");
        return;
      }

      const payload = {
        title,
        description,
        assigned_to: assignedTo,
        created_by: userId,
      };

      const response = await axios.post(
        "http://localhost:5000/api/tasks",
        payload
      );

      if (response.status === 201) {
        alert("Task created successfully!");
        // Refresh the plan info after creating a task
        fetchUserPlanInfo();
      } else {
        alert(response.data.message || "Failed to create task");
      }
    } catch (err) {
      console.error("Error creating task:", err);
      alert("Error creating task. Please try again.");
    }
  };

  // const handlecheckout = async () => {
  //   try {
  //     const response = await axios.post(
  //       "http://localhost:5000/api/tasks/checkout",
  //       {
  //         items: [
  //           {
  //             id: 1,
  //             quantity: 1,
  //             price: 299,
  //             name: "Premium Plan",
  //           },
  //         ],
  //       },
  //       {
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //         withCredentials: true, // Use this if your API requires cookies or other credentials
  //       }
  //     );

  //     const { url } = response.data;
  //     window.location.href = url;
  //   } catch (err) {
  //     console.error("Error during checkout:", err);
  //   }
  // };

  const handleCheckoutRedirect = () => {
    router.push("/Payment");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Create a New Task</CardTitle>
        <CardDescription>
          {planInfo ? (
            <div className="space-y-2">
              <p>Current Plan: <span className="font-semibold capitalize">{planInfo.userType}</span></p>
              <p>Tasks Created: <span className="font-semibold">{planInfo.taskCount}</span> / {planInfo.taskLimit}</p>
              <p>Tasks Remaining: <span className="font-semibold">{Math.max(0, planInfo.taskLimit - planInfo.taskCount)}</span></p>
              {planInfo.taskCount >= planInfo.taskLimit && (
                <p className="text-red-500">
                  You've reached your task limit. Please upgrade your plan to create more tasks.
                </p>
              )}
            </div>
          ) : (
            "Loading plan information..."
          )}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="grid grid-cols-1 gap-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Task Title</Label>
              <Input
                id="title"
                placeholder="Task title"
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                rows={4}
                placeholder="Task details"
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="assignedTo">Assign To</Label>
              <Select onValueChange={setAssignedTo}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a user" />
                </SelectTrigger>
                <SelectContent>
                  {users.map((user) => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.name} ({user.email})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button type="button" onClick={handleCheckoutRedirect}>
          Upgrade to Premium
        </Button>
        <Button 
          type="submit" 
          onClick={handleCreateTask} 
          disabled={!planInfo || planInfo.taskCount >= planInfo.taskLimit}
        >
          Create Task
        </Button>
      </CardFooter>
    </Card>
  );
}
