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
    <Box // Main Card Container
      sx={{
        mb: 2,
        p: 2,
        borderRadius: 2,
        boxShadow: '0 2px 8px #e3e8f0',
        display: 'flex',
        alignItems: 'center', // Vertically align the two main groups (content and icons)
        justifyContent: 'space-between', // Pushes (Checkbox + Text) away from (Icons)
        bgcolor: task.completed ? '#f0fdf4' : 'white',
        borderLeft: task.completed ? '4px solid #22c55e' : '4px solid transparent',
      }}
    >
      {/* Group 1: Checkbox and Text. This group should grow and shrink. */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'flex-start', // Align checkbox (top) and text block (top)
          gap: 1.5, // Space between checkbox and text block
          flexGrow: 1, // Allows this group to take up available space
          minWidth: 0, // Important for allowing shrinking and preventing overflow
        }}
      >
        <Checkbox
          checked={task.completed}
          onChange={() => onToggleComplete(task.id)}
          color="success"
          sx={{ p: 0, mt: '2px' }} // Small top margin to align better with text baseline
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
                mt: 0.5, // Add some margin if description exists
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