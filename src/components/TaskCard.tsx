// TaskCard.tsx
import React from 'react';
import { Box, Typography, IconButton, Checkbox } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import type { Task } from '../hooks/useTasks'; // Import Task type using type-only import

interface TaskCardProps {
  task: Task; // Use the imported Task type
  onDelete: (id: string) => void; // Changed id type to string
  onToggleComplete: (id: string) => void; // Changed id type to string
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onDelete, onToggleComplete }) => {
  return (
    <Box
      sx={{
        mb: 2,
        p: 2,
        borderRadius: 2,
        boxShadow: '0 2px 8px #e3e8f0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        bgcolor: task.completed ? '#f0fdf4' : 'white',
        borderLeft: task.completed ? '4px solid #22c55e' : '4px solid transparent'
      }}
    >
      <Box display="flex" alignItems="center" gap={2}>
        <Checkbox
          checked={task.completed}
          onChange={() => onToggleComplete(task.id)}
          color="success"
        />
        <Box>
          <Typography
            variant="subtitle1"
            fontWeight={600}
            sx={{ 
              textDecoration: task.completed ? 'line-through' : 'none',
              color: task.completed ? 'text.secondary' : 'text.primary' // Darken title if not completed
            }}
          >
            {task.title}
          </Typography>
          {task.deadline && (
            <Typography
              variant="caption"
              sx={{ display: 'flex', alignItems: 'center', mt: 0.5, color: task.completed ? 'text.secondary' : '#555555' }} // Darken deadline
            >
              <CalendarMonthIcon sx={{ fontSize: 16, mr: 0.5 }} /> {task.deadline}
            </Typography>
          )}
          {task.description && (
            <Typography variant="body2" sx={{ color: task.completed ? 'text.secondary' : '#555555' }}> {/* Darken description */}
              {task.description}
            </Typography>
          )}
        </Box>
      </Box>
      <IconButton onClick={() => onDelete(task.id)} color="error">
        <DeleteIcon />
      </IconButton>
    </Box>
  );
};

export default TaskCard;