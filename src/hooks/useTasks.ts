import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext'; // Import useAuth

const API_BASE_URL = 'http://localhost:5134/api';

// Define and export the Task interface
export interface Task {
  id: string;
  title: string;
  description?: string;
  deadline?: string;
  completed: boolean;
  userId?: string; // Optional: if your backend associates tasks with users
}

interface UseTasksResult {
  tasks: Task[];
  addTask: (taskData: Omit<Task, 'id' | 'completed' | 'userId'>) => Promise<void>; // Modified to be async
  deleteTask: (id: string) => Promise<void>; // Will be async
  toggleTaskStatus: (id: string) => Promise<void>; // Will be async
  updateTask: (id: string, taskData: Omit<Task, 'id' | 'userId' | 'completed'>) => Promise<void>; // Added updateTask
  fetchTasks: () => Promise<void>; // Added fetchTasks
  loading: boolean;
  error: string | null;
}

const useTasks = (): UseTasksResult => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { token, isAuthenticated } = useAuth(); // Get token and isAuthenticated
  // Fetch tasks from backend
  const fetchTasks = async () => {
    if (!isAuthenticated || !token) {
      setTasks([]); // Clear tasks if not authenticated
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${API_BASE_URL}/tasks`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      // Map backend response to frontend Task interface
      const mappedTasks = response.data.map((task: any) => ({
        ...task,
        completed: task.isCompleted // Map isCompleted from backend to completed for frontend
      }));
      setTasks(mappedTasks);
    } catch (err) {
      console.error('Failed to fetch tasks:', err);
      setError('Failed to load tasks.');
      setTasks([]); // Clear tasks on error
    } finally {
      setLoading(false);
    }
  };

  // Effect to fetch tasks when component mounts or auth state changes
  useEffect(() => {
    fetchTasks();
  }, [isAuthenticated, token]); // Re-fetch if auth state changes

  // Adds a new task to the backend and then updates local state
  const addTask = async (taskData: Omit<Task, 'id' | 'completed' | 'userId'>) => {
    if (!token) {
      setError('Authentication token not found. Please log in.');
      throw new Error('Authentication token not found. Please log in.');
    }
    setLoading(true);
    setError(null);
    try {
      await axios.post(`${API_BASE_URL}/tasks`, 
        taskData, 
        {
          headers: { 'Authorization': `Bearer ${token}` },
        }
      );
      // Assuming the backend returns the created task with its ID
      // setTasks(prev => [...prev, response.data]); // Option 1: Add directly if backend returns full task
      await fetchTasks(); // Option 2: Re-fetch all tasks to ensure consistency
    } catch (err: any) {
      console.error('Failed to add task:', err);
      let errorMessage = 'Failed to add task.';
      if (axios.isAxiosError(err) && err.response && err.response.data) {
        // Try to get a more specific error message from backend
        errorMessage = err.response.data.message || err.response.data.title || JSON.stringify(err.response.data);
      }
      setError(errorMessage);
      throw new Error(errorMessage); // Re-throw to be caught by the calling component
    } finally {
      setLoading(false);
    }
  };

  // Updates an existing task on the backend and then updates local state
  const updateTask = async (id: string, taskData: Omit<Task, 'id' | 'userId' | 'completed'>) => {
    if (!token) {
      setError('Authentication token not found. Please log in.');
      throw new Error('Authentication token not found. Please log in.');
    }
    setLoading(true);
    setError(null);
    try {
      await axios.put(`${API_BASE_URL}/tasks/${id}`, 
        taskData, 
        {
          headers: { 'Authorization': `Bearer ${token}` },
        }
      );
      await fetchTasks(); // Re-fetch all tasks to ensure consistency
    } catch (err: any) {
      console.error('Failed to update task:', err);
      let errorMessage = 'Failed to update task.';
      if (axios.isAxiosError(err) && err.response && err.response.data) {
        errorMessage = err.response.data.message || err.response.data.title || JSON.stringify(err.response.data);
      }
      setError(errorMessage);
      throw new Error(errorMessage); // Re-throw to be caught by the calling component
    } finally {
      setLoading(false);
    }
  };

  // Deletes a task by id
  const deleteTask = async (id: string) => {
    if (!token) {
      setError('Authentication token not found. Please log in.');
      throw new Error('Authentication token not found. Please log in.');
    }
    setLoading(true);
    setError(null);
    try {
      await axios.delete(`${API_BASE_URL}/tasks/${id}`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      await fetchTasks(); // Re-fetch all tasks to ensure consistency
    } catch (err: any) {
      console.error('Failed to delete task:', err);
      let errorMessage = 'Failed to delete task.';
      if (axios.isAxiosError(err) && err.response && err.response.data) {
        errorMessage = err.response.data.message || err.response.data.title || JSON.stringify(err.response.data);
      }
      setError(errorMessage);
      throw new Error(errorMessage); // Re-throw to be caught by the calling component
    } finally {
      setLoading(false);
    }
  };
  // Toggles the completion status of a task
  const toggleTaskStatus = async (id: string) => {
    if (!token) {
      setError('Authentication token not found. Please log in.');
      throw new Error('Authentication token not found. Please log in.');
    }

    const taskToToggle = tasks.find(t => t.id === id);
    if (!taskToToggle) {
      setError('Task not found.');
      throw new Error('Task not found.');
    }

    const newCompletedStatus = !taskToToggle.completed;

    setLoading(true);
    setError(null);
    try {
      await axios.patch(`${API_BASE_URL}/tasks/${id}`, 
        newCompletedStatus, // Send the boolean value directly
        {
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
        }
      );
      await fetchTasks(); // Re-fetch all tasks to ensure consistency with server state
    } catch (err: any) {
      console.error('Failed to toggle task status:', err);
      let errorMessage = 'Failed to toggle task status.';
      if (axios.isAxiosError(err) && err.response && err.response.data) {
        errorMessage = err.response.data.message || err.response.data.title || JSON.stringify(err.response.data);
      }
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return { tasks, addTask, deleteTask, toggleTaskStatus, updateTask, fetchTasks, loading, error };
};

export default useTasks;
