
import React from 'react';
import { Box, Typography, IconButton, Checkbox } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit'; 
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import type { Task } from '../hooks/useTasks'; 

interface TaskCardProps {
  task: Task; 
  onDelete: (id: string) => void; 
  onToggleComplete: (id: string) => void; 
  onEdit: (task: Task) => void; 
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onDelete, onToggleComplete, onEdit }) => {
  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) {
      return text;
    }
    return text.substring(0, maxLength) + '...';
  };

  const formatDate = (dateString: string) => {
    return dateString.split('T')[0];
  };

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
        borderLeft: task.completed ? '4px solid #22c55e' : '4px solid transparent',
      }}
    >
      {/* Group 1: Checkbox and Text. This group should grow and shrink. */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'flex-start', 
          gap: 1.5, 
          flexGrow: 1, 
          minWidth: 0, 
        }}
      >
        <Checkbox
          checked={task.completed}
          onChange={() => onToggleComplete(task.id)}
          color="success"
          sx={{ p: 0, mt: '2px' }} 
        />
        {/* Text content container. */}
        <Box sx={{ flexGrow: 1, minWidth: 0 }}>
          <Typography
            variant="subtitle1"
            fontWeight={600}
            sx={{
              textDecoration: task.completed ? 'line-through' : 'none',
              color: task.completed ? 'text.secondary' : 'text.primary',
              wordBreak: 'break-word',
            }}
          >
            {truncateText(task.title, 100)}
          </Typography>
          {task.deadline && (
            <Typography
              variant="caption"
              sx={{ display: 'flex', alignItems: 'center', mt: 0.5, color: task.completed ? 'text.secondary' : '#555555' }}
            >
              <CalendarMonthIcon sx={{ fontSize: 16, mr: 0.5 }} /> {formatDate(task.deadline)}
            </Typography>
          )}
          {task.description && (
            <Typography
              variant="body2"
              sx={{
                color: task.completed ? 'text.secondary' : '#555555',
                wordBreak: 'break-word',
                mt: 0.5, 
              }}
            >
              {truncateText(task.description, 150)}
            </Typography>
          )}
        </Box>
      </Box>

      {/* Group 2: Icons. This group should not shrink. */}
      <Box sx={{ display: 'flex', alignItems: 'center', flexShrink: 0, ml: 1 }}>
        <IconButton onClick={() => onEdit(task)} color="primary" sx={{ p: 0.5 }}>
          <EditIcon />
        </IconButton>
        <IconButton onClick={() => onDelete(task.id)} color="error" sx={{ p: 0.5 }}>
          <DeleteIcon />
        </IconButton>
      </Box>
    </Box>
  );
};

export default TaskCard;