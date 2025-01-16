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

interface DecodedToken {
  id: string;
}

// Define the type for user data
interface User {
  id: string;
  name: string;
  email: string;
}

export default function CreateTaskForm() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [users, setUsers] = useState<User[]>([]); // Explicitly define type
  const [isPremium, setIsPremium] = useState(false);
  const [userId, setUserId] = useState<string>(""); // State to hold userId
  const router = useRouter();

  // Fetch all users for the "assigned_to" dropdown
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(
          "https://catalysers-finovate-assignment.onrender.com/api/auth/users"
        );
        setUsers(response.data.users);
      } catch (err) {
        console.error("Error fetching users:", err);
      }
    };

    fetchUsers();
  }, []);

  // Fetch the token and decode it only on the client side
  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("authToken");
      const decodedToken: DecodedToken | null = token ? jwtDecode<DecodedToken>(token) : null;
      setUserId(decodedToken?.id || "");
    }
  }, []);

  useEffect(() => {
    const fetchUserType = async () => {
      if (!userId) {
        console.error("User ID is not available.");
        return;
      }

      try {
        const response = await axios.post("https://catalysers-finovate-assignment.onrender.com/api/tasks/getusertype", {
          userId,
        });

        if (response.status === 200) {
          const { userType } = response.data;
          if (userType === "premium") {
            setIsPremium(true);
          } else {
            setIsPremium(false);
          }
        } else {
          console.error("Error:", response.data.error);
        }
      } catch (error) {
        console.error("Error fetching user type:", error);
      }
    };

    fetchUserType();
  }, [userId]);

  const handleCreateTask = async () => {
    try {
      if (!isPremium) {
        alert("Upgrade to premium to create unlimited tasks.");
        return;
      }

      const payload = {
        title,
        description,
        assigned_to: assignedTo,
        created_by: userId,
      };

      const response = await axios.post(
        "https://catalysers-finovate-assignment.onrender.com/api/tasks",
        payload
      );

      if (response.status === 201) {
        alert("Task created successfully!");
      } else {
        alert(response.data.message || "Failed to create task");
      }
    } catch (err) {
      console.error("Error creating task:", err);
      alert("Error creating task. Please try again.");
    }
  };

  const handlecheckout = async () => {
    try {
      const response = await axios.post(
        "https://catalysers-finovate-assignment.onrender.com/api/tasks/checkout",
        {
          items: [
            {
              id: 1,
              quantity: 1,
              price: 299,
              name: "Premium Plan",
            },
          ],
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true, // Use this if your API requires cookies or other credentials
        }
      );

      const { url } = response.data;
      window.location.href = url;
    } catch (err) {
      console.error("Error during checkout:", err);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Create a New Task</CardTitle>
        <CardDescription>
          Assign a task to a user. Upgrade to premium to create unlimited tasks.
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
        <Button type="button" onClick={handlecheckout} disabled={isPremium}>
          Upgrade to Premium
        </Button>
        <Button type="submit" onClick={handleCreateTask} disabled={!isPremium}>
          Create Task
        </Button>
      </CardFooter>
    </Card>
  );
}
