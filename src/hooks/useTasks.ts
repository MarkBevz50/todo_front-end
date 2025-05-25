import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext'; 

const API_BASE_URL = 'http://localhost:5134/api';


export interface Task {
  id: string;
  title: string;
  description?: string;
  deadline?: string;
  completed: boolean;
  userId?: string; 
}

interface UseTasksResult {
  tasks: Task[];
  addTask: (taskData: Omit<Task, 'id' | 'completed' | 'userId'>) => Promise<void>; 
  deleteTask: (id: string) => Promise<void>; 
  toggleTaskStatus: (id: string) => Promise<void>; 
  updateTask: (id: string, taskData: Omit<Task, 'id' | 'userId' | 'completed'>) => Promise<void>; 
  fetchTasks: () => Promise<void>; 
  loading: boolean;
  error: string | null;
}

const useTasks = (): UseTasksResult => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { token, isAuthenticated } = useAuth(); 
  
  const fetchTasks = async () => {
    if (!isAuthenticated || !token) {
      setTasks([]); 
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${API_BASE_URL}/tasks`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      
      const mappedTasks = response.data.map((task: any) => ({
        ...task,
        completed: task.isCompleted 
      }));
      setTasks(mappedTasks);
    } catch (err) {
      console.error('Failed to fetch tasks:', err);
      setError('Failed to load tasks.');
      setTasks([]); 
    } finally {
      setLoading(false);
    }
  };

  
  useEffect(() => {
    fetchTasks();
  }, [isAuthenticated, token]); 

  
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
      
      
      await fetchTasks(); 
    } catch (err: any) {
      console.error('Failed to add task:', err);
      let errorMessage = 'Failed to add task.';
      if (axios.isAxiosError(err) && err.response && err.response.data) {
        
        errorMessage = err.response.data.message || err.response.data.title || JSON.stringify(err.response.data);
      }
      setError(errorMessage);
      throw new Error(errorMessage); 
    } finally {
      setLoading(false);
    }
  };

  
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
      await fetchTasks(); 
    } catch (err: any) {
      console.error('Failed to update task:', err);
      let errorMessage = 'Failed to update task.';
      if (axios.isAxiosError(err) && err.response && err.response.data) {
        errorMessage = err.response.data.message || err.response.data.title || JSON.stringify(err.response.data);
      }
      setError(errorMessage);
      throw new Error(errorMessage); 
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
      await fetchTasks(); 
    } catch (err: any) {
      console.error('Failed to delete task:', err);
      let errorMessage = 'Failed to delete task.';
      if (axios.isAxiosError(err) && err.response && err.response.data) {
        errorMessage = err.response.data.message || err.response.data.title || JSON.stringify(err.response.data);
      }
      setError(errorMessage);
      throw new Error(errorMessage); 
    } finally {
      setLoading(false);
    }
  };
  
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
        newCompletedStatus, 
        {
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
        }
      );
      await fetchTasks(); 
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
