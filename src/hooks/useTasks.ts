import { useState } from 'react';

// Define and export the Task interface
export interface Task {
  id: string;
  title: string;
  description?: string;
  deadline?: string;
  completed: boolean;
}

interface UseTasksResult {
  tasks: Task[];
  addTask: (task: Omit<Task, 'id' | 'completed'>) => void;
  deleteTask: (id: string) => void;
  toggleTaskStatus: (id: string) => void;
}

const useTasks = (): UseTasksResult => {
  const [tasks, setTasks] = useState<Task[]>([]);

  // Додає нове завдання до списку
  const addTask = (task: Omit<Task, 'id' | 'completed'>) => {
    setTasks(prev => [
      ...prev,
      { ...task, id: Date.now().toString(), completed: false }
    ]);
  };

  // Видаляє завдання за id
  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(task => task.id !== id));
  };

  // Перемикає статус виконання завдання
  const toggleTaskStatus = (id: string) => {
    setTasks(prev =>
      prev.map(t =>
        t.id === id ? { ...t, completed: !t.completed } : t
      )
    );
  };

  return { tasks, addTask, deleteTask, toggleTaskStatus };
};

export default useTasks;
