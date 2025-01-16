"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

interface Task {
  id: string;
  title: string;
  description: string;
  assigned_to: number; // Assuming `assigned_to` is a user ID
  createdBy: string; // Username of the user who created the task
  status: string; // Task status (e.g., "pending", "completed")
}

export default function UserTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const token = localStorage.getItem("authToken");

  // Fetch tasks for the logged-in user
  const fetchTasks = async () => {
    try {
      const userId = jwtDecode(token).id; // Ensure it's a string if needed
      const response = await axios.get(
        `http://localhost:5000/api/tasks?userId=${userId}`
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
      const response = await axios.put("http://localhost:5000/api/tasks", {
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
    fetchTasks();
  }, []);

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
