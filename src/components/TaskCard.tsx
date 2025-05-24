// TaskCard.tsx
import React from 'react';
import { Box, Typography, IconButton, Checkbox } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit'; // Added EditIcon
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import type { Task } from '../hooks/useTasks'; // Import Task type using type-only import

interface TaskCardProps {
  task: Task; // Use the imported Task type
  onDelete: (id: string) => void; // Changed id type to string
  onToggleComplete: (id: string) => void; // Changed id type to string
  onEdit: (task: Task) => void; // Added onEdit prop
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onDelete, onToggleComplete, onEdit }) => {
  return (
    <Box
      sx={{
        mb: 2,
        p: 2,
        borderRadius: 2,
        boxShadow: '0 2px 8px #e3e8f0',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        bgcolor: task.completed ? '#f0fdf4' : 'white',
        borderLeft: task.completed ? '4px solid #22c55e' : '4px solid transparent'
      }}
    >
      <Box display="flex" alignItems="flex-start" gap={1.5}>
        <Checkbox
          checked={task.completed}
          onChange={() => onToggleComplete(task.id)}
          color="success"
          sx={{ p: 0, mt: '2px' }}
        />
        <Box sx={{ flexGrow: 1, minWidth: 0 }}>
          <Typography
            variant="subtitle1"
            fontWeight={600}
            sx={{ 
              textDecoration: task.completed ? 'line-through' : 'none',
              color: task.completed ? 'text.secondary' : 'text.primary',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              maxWidth: '300px',
            }}
          >
            {task.title}
          </Typography>
          {task.deadline && (
            <Typography
              variant="caption"
              sx={{ display: 'flex', alignItems: 'center', mt: 0.5, color: task.completed ? 'text.secondary' : '#555555' }}
            >
              <CalendarMonthIcon sx={{ fontSize: 16, mr: 0.5 }} /> {task.deadline}
            </Typography>
          )}
          {task.description && (
            <Typography 
              variant="body2" 
              sx={{ 
                color: task.completed ? 'text.secondary' : '#555555', 
                mt: 0.5, 
                wordBreak: 'break-word',
                maxWidth: 'calc(100% - 40px)' // Adjust based on icon buttons width if needed
              }}
            >
              {task.description}
            </Typography>
          )}
        </Box>
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <IconButton onClick={() => onEdit(task)} color="primary" size="small">
          <EditIcon />
        </IconButton>
        <IconButton onClick={() => onDelete(task.id)} color="error" size="small">
          <DeleteIcon />
        </IconButton>
      </Box>
    </Box>
  );
};

export default TaskCard;