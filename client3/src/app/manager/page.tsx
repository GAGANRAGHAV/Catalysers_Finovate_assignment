"use client";
import { useEffect, useState } from "react";
import axios from "axios";

interface Task {
  id: string;
  title: string;
  description: string;
  assignedto: string | null; // Name of the user the task is assigned to (can be null)
  createdby: string; // Name of the user who created the task
  status: string; // Task status (e.g., "pending", "completed")
}

export default function ManagerTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Fetch all tasks for the manager
  const fetchTasks = async () => {
    try {
      const response = await axios.get("https://catalysers-finovate-assignment.onrender.com/api/tasks/manager");
      setTasks(response.data.tasks);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching tasks for manager:", error);
      setLoading(false);
    }
  };



  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-4">Manager Tasks</h1>
      <div className="space-y-4">
        {loading ? (
          <p>Loading tasks...</p>
        ) : tasks.length > 0 ? (
          tasks.map((task) => (
            <div key={task.id} className="p-4 bg-white rounded shadow">
              <h2 className="text-xl font-semibold">{task.title}</h2>
              <p className="text-gray-700">{task.description}</p>
              <p className="text-gray-500">Created by: {task.createdby}</p>
              <p className="text-gray-500">
                Assigned to: {task.assignedto || "Unassigned"}
              </p>
              <p className="text-gray-500">Status: {task.status}</p>

              
            </div>
          ))
        ) : (
          <p className="text-gray-500">No tasks available.</p>
        )}
      </div>
    </div>
  );
}
