import { useState } from 'react';
import { 
  Card, 
  CardContent, 
  Typography, 
  IconButton, 
  Box, 
  Tooltip,
  Chip 
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import { taskService } from '../services/taskService';

const TaskCard = ({ task, onDelete }) => {
  const [isCompleted, setIsCompleted] = useState(task.status === 'completada');
  const [updating, setUpdating] = useState(false);

  const handleToggleComplete = async () => {
    try {
      setUpdating(true);
      const nextState = !isCompleted;
      
      await taskService.updateStatus(task._id, nextState);
      setIsCompleted(nextState);
    } catch {
      alert('No se pudo actualizar el estado de la tarea.');
    } finally {
      setUpdating(false);
    }
  };

  return (
    <Card 
      elevation={1} 
      sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        justifyContent: 'space-between',
        borderRadius: 2,
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: 3
        },
        bgcolor: isCompleted ? '#f9f9f9' : 'background.paper',
        borderLeft: isCompleted ? '5px solid #4caf50' : '5px solid #1976d2'
      }}
    >
      {/* ✅ Cambiamos el flex a column para que el contenido se estructure hacia abajo */}
      <CardContent sx={{ display: 'flex', flexDirection: 'column', height: '100%', gap: 1.5, pb: '16px !important' }}>
        
        {/* 1️⃣ FILA SUPERIOR: Checkbox + Título + Botón Eliminar */}
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
          <IconButton 
            onClick={handleToggleComplete} 
            disabled={updating}
            color={isCompleted ? "success" : "default"}
            sx={{ mt: -0.5, p: 0.5 }}
          >
            {isCompleted ? <CheckCircleIcon /> : <RadioButtonUncheckedIcon />}
          </IconButton>

          <Box sx={{ flexGrow: 1, minWidth: 0 }}>
            <Typography 
              variant="subtitle1" 
              sx={{ 
                fontWeight: 'bold',
                wordBreak: 'break-word',
                textDecoration: isCompleted ? 'line-through' : 'none',
                color: isCompleted ? 'text.secondary' : 'text.primary'
              }}
            >
              {task.title}
            </Typography>
          </Box>

          <Tooltip title="Eliminar Tarea">
            <IconButton 
              edge="end" 
              aria-label="delete" 
              onClick={() => onDelete(task._id)}
              sx={{ 
                color: 'text.secondary',
                '&:hover': { color: 'error.main' },
                mt: -0.5,
                p: 0.5
              }}
            >
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </Box>

        {/* 2️⃣ ZONA CENTRAL: Nueva sección para renderizar la descripción obligatoria */}
        <Typography 
          variant="body2" 
          color="text.secondary"
          sx={{ 
            flexGrow: 1, 
            wordBreak: 'break-word',
            textDecoration: isCompleted ? 'line-through' : 'none',
            fontStyle: 'italic'
          }}
        >
          {task.description}
        </Typography>

        {/* 3️⃣ FILA INFERIOR: Nueva sección para el responsable (assignedTo) */}
        <Box sx={{ display: 'flex', alignItems: 'center', mt: 'auto', pt: 1 }}>
          <Chip 
            icon={<AssignmentIndIcon />} 
            label={`Asignado a: ${task.assignedTo}`} 
            size="small"
            variant="outlined"
            color={isCompleted ? "default" : "primary"}
            sx={{ maxWidth: '100%', fontWeight: 500 }}
          />
        </Box>

      </CardContent>
    </Card>
  );
};

export default TaskCard;