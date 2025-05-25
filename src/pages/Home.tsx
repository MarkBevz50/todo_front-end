import React, { useState, useEffect } from 'react';
import useTasks from '../hooks/useTasks';
import {
  Box,
  Typography,
  Paper,
  Container,
  Button,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
} from '@mui/material';
import Calendar from '../components/Calendar';
import TaskForm from '../components/TaskForm'; 
import TaskCard from '../components/TaskCard'; 
import '../styles/main.scss';
import type { Task } from '../hooks/useTasks'; 
import { Link } from 'react-router-dom'; 
import { useAuth } from '../contexts/AuthContext'; 

const Home: React.FC = () => {
  const { tasks, addTask, deleteTask, toggleTaskStatus, updateTask } = useTasks(); 
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [showTaskForm, setShowTaskForm] = useState(false);   const [authNotification, setAuthNotification] = useState<string | null>(null);  const { isAuthenticated, user, logout, authLoading } = useAuth(); 
  const [editingTask, setEditingTask] = useState<Task | null>(null); 
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);

  
  useEffect(() => {
    console.log("Tasks updated:", tasks);
  }, [tasks]);

  const handleShowTaskForm = (taskToEdit?: Task) => {
    if (!isAuthenticated) {
      setAuthNotification("Please log in to create or edit tasks. Use the Login or Sign Up buttons at the top of the page.");
      setShowTaskForm(false);
      setEditingTask(null);
    } else {
      setAuthNotification(null);
      setEditingTask(taskToEdit || null); 
      setShowTaskForm(true);
    }
  };

  const handlePerformAddTask = async (taskData: Omit<Task, 'id' | 'completed' | 'userId'>) => {
    try {
      await addTask(taskData);
      setShowTaskForm(false);
      setEditingTask(null);
    } catch (error) {
      console.error("Failed to add task:", error);
      
    }
  };

  const handlePerformUpdateTask = async (id: string, taskData: Omit<Task, 'id' | 'completed' | 'userId'>) => {
    try {
      await updateTask(id, taskData);
      setShowTaskForm(false);
      setEditingTask(null);
    } catch (error) {
      console.error("Failed to update task:", error);
      
    }
  };

  const handleCancelForm = () => {
    setShowTaskForm(false);
    setEditingTask(null);
  };
  const handleDeleteClick = (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      setTaskToDelete(task);
      setDeleteDialogOpen(true);
    }
  };

  const handleDeleteConfirm = async () => {
    if (taskToDelete) {
      try {
        await deleteTask(taskToDelete.id);
        setDeleteDialogOpen(false);
        setTaskToDelete(null);
      } catch (error) {
        console.error("Failed to delete task:", error);
        
      }
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setTaskToDelete(null);
  };

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    console.log('Selected date:', date);
  };

  const filteredTasks = tasks.filter(task => {
    if (!selectedDate) return true; 
    if (!task.deadline) return true; 

    const taskDeadlineDate = new Date(task.deadline);
    
    return (
      taskDeadlineDate.getFullYear() === selectedDate.getFullYear() &&
      taskDeadlineDate.getMonth() === selectedDate.getMonth() &&
      taskDeadlineDate.getDate() === selectedDate.getDate()
    );
  });

  const calendarEvents = tasks
    .filter(task => task.deadline)
    .map(task => ({
      date: new Date(task.deadline!),
      title: task.title,
      color: task.completed ? '#4caf50' : '#f44336', 
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
          </Box>        </Paper>

        {authNotification && (
          <Alert 
            severity="warning" 
            sx={{ mb: 2 }} 
            onClose={() => setAuthNotification(null)}
          >
            {authNotification}
          </Alert>
        )}

        <Box sx={{ 
          mb: 3, 
          bgcolor: 'white', 
          p: 2, 
          borderRadius: 2,
          boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
        }}>
          {showTaskForm ? (
            <TaskForm 
              initialData={editingTask} // Pass the task to be edited (or null)
              onAddTask={handlePerformAddTask} 
              onUpdateTask={handlePerformUpdateTask} // Pass the update handler
              onCancel={handleCancelForm} // Pass the cancel handler
            />          ) : (
            <Button 
              variant="contained" 
              onClick={() => handleShowTaskForm()} // Call without args for new task
              sx={{ bgcolor: '#2563eb', width: '100%', py: 1.5 }}
            >
              Add New Task
            </Button>
          )}
        </Box>        {/* Task List */}
        <Box sx={{ display: 'flex', gap: 3, alignItems: 'flex-start' }}>
          <Box sx={{ 
            flex: 1, 
            maxHeight: '460px', 
            overflowY: 'auto',
            pr: 1, 
            
            '&::-webkit-scrollbar': {
              width: '8px',
            },
            '&::-webkit-scrollbar-track': {
              backgroundColor: '#ffffff',
              borderRadius: '4px',
            },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: '#2563eb',
              borderRadius: '4px',
              '&:hover': {
                backgroundColor: '#1d4ed8',
              },
            },
            '&::-webkit-scrollbar-thumb:active': {
              backgroundColor: '#1e40af',
            },
          }}>            {tasks.length === 0 ? (
              <Typography sx={{ textAlign: 'center', py: 4, color: 'text.secondary' }}>
                No tasks yet. Add your first task.
              </Typography>
            ) : (              filteredTasks.map(task => (
                <TaskCard 
                  key={task.id} 
                  task={task} 
                  onDelete={handleDeleteClick} 
                  onToggleComplete={toggleTaskStatus} 
                  onEdit={() => handleShowTaskForm(task)} 
                />
              ))
            )}
          </Box>
          {/* Calendar Component Wrapper */}
          <Box sx={{ 
            flex: '0 0 280px', 
            position: 'sticky',
            top: '20px'
          }}> 
            <Calendar 
              selectedDate={selectedDate}
              onDateSelect={handleDateSelect}
              events={calendarEvents}
            />
          </Box>
        </Box>
      </Container>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
        aria-labelledby="delete-task-dialog-title"
        aria-describedby="delete-task-dialog-description"
      >        <DialogTitle id="delete-task-dialog-title">
          Підтвердити видалення
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-task-dialog-description">
            {taskToDelete 
              ? `Are you sure you want to delete the task "${taskToDelete.title}"? This action cannot be undone.` 
              : "Are you sure you want to delete this task? This action cannot be undone."
            }
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel} color="primary">
            Скасувати
          </Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained" autoFocus>
            Видалити
          </Button>
        </DialogActions>
      </Dialog>

      {/* Footer */}
      <Box sx={{ 
        borderTop: '1px solid #eee',
        p: 2,
        textAlign: 'center',
        color: 'text.secondary',
        fontSize: '0.875rem',
        bgcolor: 'white'
      }}>
        FocusFlow © 2025 • Built for your productivity by Markiyan Bevz ^_^
      </Box>
    </Box>
  );
};

export default Home;
