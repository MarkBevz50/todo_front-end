// TaskForm.tsx
import React, { useState } from 'react';
import { Box, TextField, Button, Paper, Typography, IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import CloseIcon from '@mui/icons-material/Close';
import type { Task } from '../hooks/useTasks'; // Import Task type

interface TaskFormProps {
  onAddTask: (task: Omit<Task, 'id' | 'completed'>) => void; // Changed prop name and signature
  onCancel?: () => void;
}

const TaskForm: React.FC<TaskFormProps> = ({ onAddTask, onCancel }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState('');

  const getTodayDateString = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = (today.getMonth() + 1).toString().padStart(2, '0');
    const day = today.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onAddTask({ title, description, deadline }); // Use onAddTask
    setTitle('');
    setDescription('');
    setDeadline('');
  };

  const formatDate = (date: string) => {
    if (!date) return '';
    const d = new Date(date);
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <Paper elevation={0} sx={{ p: 3, borderRadius: 2 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6" fontWeight={600}>New Task</Typography>
        {onCancel && (
          <IconButton size="small" onClick={onCancel}>
            <CloseIcon />
          </IconButton>
        )}
      </Box>
      
      <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <TextField
          label="Task Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          fullWidth
          variant="outlined"
          size="small"
          sx={{ 
            '& .MuiOutlinedInput-root': {
              borderRadius: '8px'
            }
          }}
        />
        
        <TextField
          label="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          multiline
          rows={2}
          fullWidth
          variant="outlined"
          size="small"
          sx={{ 
            '& .MuiOutlinedInput-root': {
              borderRadius: '8px'
            }
          }}
        />
        
        <Box display="flex" alignItems="center" gap={2}>
          <TextField
            label="Deadline"
            type="date"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            InputLabelProps={{
              shrink: true,
            }}
            inputProps={{
              min: getTodayDateString(), // Add min attribute
            }}
            fullWidth
            variant="outlined"
            size="small"
            sx={{ 
              '& .MuiOutlinedInput-root': {
                borderRadius: '8px'
              }
            }}
          />
          {deadline && (
            <Box display="flex" alignItems="center">
              <CalendarMonthIcon sx={{ fontSize: 18, color: 'text.secondary', mr: 0.5 }} />
              <Typography variant="caption" color="text.secondary">
                {formatDate(deadline)}
              </Typography>
            </Box>
          )}
        </Box>
        
        <Box display="flex" justifyContent="flex-end" mt={1}>
          {onCancel && (
            <Button 
              variant="outlined" 
              onClick={onCancel} 
              sx={{ mr: 1, borderRadius: '8px' }}
            >
              Cancel
            </Button>
          )}
          <Button 
            type="submit" 
            variant="contained" 
            startIcon={<AddIcon />}
            sx={{ 
              bgcolor: '#2563eb',
              borderRadius: '8px',
              textTransform: 'none'
            }}
          >
            Add Task
          </Button>
        </Box>
      </Box>
    </Paper>
  );
};

export default TaskForm;
