"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";

interface Task {
  id: string;
  title: string;
  description: string;
  assignedto: string | null; // Name of the user the task is assigned to (can be null)
  createdby: string; // Name of the user who created the task
  status: string; // Task status (e.g., "pending", "completed")
}

export default function ManagerTasks() {
  const { user, loading: authLoading } = useAuth('Manager');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const router = useRouter();

  // Request notification permission on component mount
  useEffect(() => {
    if ("Notification" in window) {
      Notification.requestPermission();
    }
  }, []);

  // Function to show notification
  const showNotification = (title: string, body: string) => {
    // Browser notification
    if ("Notification" in window && Notification.permission === "granted") {
      new Notification(title, {
        body: body,
        icon: "/favicon.ico" // You can add your own icon
      });
    }

    // Toast notification
    toast.info(body, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  };

  // Fetch all tasks for the manager
  const fetchTasks = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/tasks/manager"
      );
      setTasks(response.data.tasks);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching tasks for manager:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/loginsignup');
      return;
    }
    
    fetchTasks();

    // WebSocket connection setup
    const ws = new WebSocket('ws://localhost:5000');
    
    ws.onopen = () => {
      console.log('WebSocket connected');
      setSocket(ws);
    };

    ws.onmessage = (event) => {
      const update = JSON.parse(event.data);
      if (update.type === 'TASK_UPDATE') {
        setTasks(prevTasks =>
          prevTasks.map(task =>
            task.id === update.payload.id ? { ...task, ...update.payload } : task
          )
        );

        // Show notification for task update
        const updatedTask = update.payload;
        const notificationTitle = "Task Update";
        const notificationBody = `Task "${updatedTask.title}" status changed to ${updatedTask.status}`;
        showNotification(notificationTitle, notificationBody);
      }
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    ws.onclose = () => {
      console.log('WebSocket disconnected');
    };

    return () => {
      if (ws) {
        ws.close();
      }
    };
  }, [authLoading, user]);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Add ToastContainer at the top level of your component */}
      <ToastContainer />
      
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
