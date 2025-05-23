import React, { useState } from 'react';
import useTasks from '../hooks/useTasks';
import {
  Box,
  Typography,
  Paper,
  Container,
  Button,
} from '@mui/material';
import Calendar from '../components/Calendar';
import TaskForm from '../components/TaskForm'; 
import TaskCard from '../components/TaskCard'; 
import '../styles/main.scss';
import type { Task } from '../hooks/useTasks'; 
import { Link } from 'react-router-dom'; // Removed useNavigate
import { useAuth } from '../contexts/AuthContext'; // Import useAuth

const Home: React.FC = () => {
  const { tasks, addTask, deleteTask, toggleTaskStatus } = useTasks(); 
  const [selectedDate, setSelectedDate] = useState<Date>(new Date(2025, 5, 20)); 
  const [showTaskForm, setShowTaskForm] = useState(false); 
  const { isAuthenticated, user, logout, authLoading } = useAuth(); // Get auth state and functions
  // const navigate = useNavigate(); // Removed useNavigate as it's unused

  const handleAddTask = async (taskData: Omit<Task, 'id' | 'completed'>) => { // Made async
    // addTask(taskData); // This will be handled by the hook now
    try {
      await addTask(taskData); // Call the async addTask from the hook
      setShowTaskForm(false);
    } catch (error) {
      console.error("Failed to add task:", error);
      // Optionally, show an error message to the user
    }
  };

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    console.log('Selected date:', date);
    // todo: додати логіку для фільтрування завдань за обраною датою
  };

  const calendarEvents = tasks
    .filter(task => task.deadline)
    .map(task => ({
      date: new Date(task.deadline!),
      title: task.title,
      color: task.completed ? '#4caf50' : '#f44336', // Example: green for completed, red for pending
    }));

  if (authLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <Typography>Loading...</Typography> {/* Or a spinner component */}
      </Box>
    );
  }

  return (
    <Box sx={{ 
      bgcolor: '#f6f8fb', 
      minHeight: '100vh', 
      minWidth: '100vw',
      width: '100%',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Header */}
      <Box sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '16px 24px',
        borderBottom: '1px solid #eee',
        backgroundColor: 'white'
      }}>
        <Typography variant="h6" color="#2563eb" fontWeight="bold">
          FocusFlow
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}> 
          {isAuthenticated ? (
            <>
              {user && <Typography sx={{ color: '#333333', alignSelf: 'center' }}>{user.email}</Typography>}
              <Button sx={{ color: '#333333' }} onClick={logout}>Logout</Button>
            </>
          ) : (
            <>
              <Button component={Link} to="/login" sx={{ color: '#333333' }}>Login</Button>
              <Button component={Link} to="/signup" variant="outlined" color="primary">Sign Up</Button>
            </>
          )}
          <Button sx={{ color: '#333333' }}>About Us</Button>
        </Box>
      </Box>

      <Container maxWidth="lg" sx={{ pt: 4, pb: 8, flex: 1 }}>
        {/* Welcome Card */}
        <Paper sx={{ 
          p: 4, 
          mb: 4, 
          display: 'flex', 
          borderRadius: 2,
          bgcolor: 'white'
        }}>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h4" color="#2563eb" fontWeight="bold" gutterBottom>
              Welcome back, stay productive today!
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Organize your to-dos, set deadlines, and achieve more with FocusFlow.
            </Typography>
          </Box>
        </Paper>

      
        <Box sx={{ 
          mb: 3, 
          bgcolor: 'white', 
          p: 2, 
          borderRadius: 2,
          boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
        }}>
          {showTaskForm ? (
            <TaskForm 
              onAddTask={handleAddTask} 
              onCancel={() => setShowTaskForm(false)} 
            />
          ) : (
            <Button 
              variant="contained" 
              onClick={() => setShowTaskForm(true)}
              sx={{ bgcolor: '#2563eb', width: '100%', py: 1.5 }}
            >
              Add New Task
            </Button>
          )}
        </Box>

        {/* Task List */}
        <Box sx={{ display: 'flex', gap: 3 }}>
          <Box sx={{ flex: 2 }}>
            {tasks.length === 0 ? (
              <Typography sx={{ textAlign: 'center', py: 4, color: 'text.secondary' }}>
                No tasks yet. Add your first task.
              </Typography>
            ) : (
              tasks.map(task => (
                <TaskCard 
                  key={task.id} 
                  task={task} 
                  onDelete={deleteTask} 
                  onToggleComplete={toggleTaskStatus} 
                />
              ))
            )}
          </Box>
          {/* Calendar Component Wrapper */}
          <Box sx={{ flex: 1, maxWidth: '300px' }}> 
            <Calendar 
              selectedDate={selectedDate}
              onDateSelect={handleDateSelect}
              events={calendarEvents}
            />
          </Box>
        </Box>
      </Container>

      {/* Footer */}
      <Box sx={{ 
        borderTop: '1px solid #eee',
        p: 2,
        textAlign: 'center',
        color: 'text.secondary',
        fontSize: '0.875rem',
        bgcolor: 'white'
      }}>
        FocusFlow © 2024 • Built for your productivity by Markiyan Bevz ^_^
      </Box>
    </Box>
  );
};

export default Home;
