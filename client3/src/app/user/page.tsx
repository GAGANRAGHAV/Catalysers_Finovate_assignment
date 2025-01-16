"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import {jwtDecode} from "jwt-decode";

interface Task {
  id: string;
  title: string;
  description: string;
  assigned_to: number;
  createdby: string;
  status: string;
}

interface CustomJwtPayload {
  id: string;
  name?: string;
  email?: string;
}

export default function UserTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [token, setToken] = useState<string | null>(null);
  const [decodedToken, setDecodedToken] = useState<CustomJwtPayload | null>(null);

  // Load the token and decode it on the client side
  useEffect(() => {
    const storedToken = localStorage.getItem("authToken");
    if (storedToken) {
      setToken(storedToken);
      try {
        const decoded = jwtDecode<CustomJwtPayload>(storedToken);
        setDecodedToken(decoded);
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
  }, []);

  // Fetch tasks for the logged-in user
  const fetchTasks = async () => {
    try {
      if (!decodedToken || !decodedToken.id) {
        console.error("Decoded token or user ID is missing.");
        setLoading(false);
        return;
      }
      const userId = decodedToken.id;
      const response = await axios.get(
        `https://catalysers-finovate-assignment.onrender.com/api/tasks?userId=${userId}`
      );
      setTasks(response.data.tasks);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      setLoading(false);
    }
  };

  // Update the task's status
  const updateStatus = async (taskId: string, status: string) => {
    try {
      const response = await axios.put("https://catalysers-finovate-assignment.onrender.com/api/tasks", {
        taskId,
        status,
      });
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === taskId ? { ...task, status: response.data.task.status } : task
        )
      );
      alert(`Task status updated to "${status}" successfully!`);
    } catch (error) {
      console.error("Error updating task status:", error);
    }
  };

  useEffect(() => {
    if (decodedToken) {
      fetchTasks();
    }
  }, [decodedToken]);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-4">My Tasks</h1>
      <div className="space-y-4">
        {loading ? (
          <p>Loading tasks...</p>
        ) : tasks.length > 0 ? (
          tasks.map((task) => (
            <div key={task.id} className="p-4 bg-white rounded shadow">
              <h2 className="text-xl font-semibold">{task.title}</h2>
              <p className="text-gray-700">{task.description}</p>
              <p className="text-gray-500">Created by: {task.createdby}</p>
              <p className="text-gray-500">Status: {task.status}</p>

              {/* Update task status */}
              <select
                value={task.status}
                onChange={(e) => updateStatus(task.id, e.target.value)}
                className="mt-2 p-2 border rounded"
              >
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
                <option value="in-progress">In Progress</option>
              </select>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No tasks assigned to you.</p>
        )}
      </div>
    </div>
  );
}
