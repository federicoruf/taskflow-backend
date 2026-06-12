// src/pages/Dashboard.jsx
import { useState, useEffect } from "react";
import { taskService } from "../services/taskService";
import {
  Container,
  Grid,
  Box,
  Typography,
  CircularProgress,
  Alert,
} from "@mui/material";
import TaskForm from "../components/TaskForm";
import TaskCard from "../components/TaskCard";
import Navbar from "../components/Navbar";

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // 🔄 Cargar las tareas del usuario al montar el componente
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setLoading(true);
        const responseData = await taskService.getAll();
        setTasks(responseData);
      } catch {
        setError("No se pudieron cargar las tareas. Inténtalo de nuevo.");
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  // ➕ Agregar una nueva tarea al estado
  const handleTaskCreated = (newTask) => {
    setTasks((prevTasks) => [newTask, ...prevTasks]);
  };

  // 🗑️ Eliminar una tarea del estado
  const handleTaskDeleted = async (taskId) => {
    try {
      await taskService.delete(taskId);
      setTasks((prevTasks) => prevTasks.filter((task) => task._id !== taskId));
    } catch {
      alert("Error al intentar eliminar la tarea.");
    }
  };

  return (
    <Box sx={{ flexGrow: 1, minHeight: "100vh", bgcolor: "#f5f5f5" }}>
      {/* Barra de navegación superior unificada */}
      <Navbar />

      {/* Contenedor Principal Responsive */}
      <Container maxWidth="lg" sx={{ mt: 4, pb: 4 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Grid container spacing={4}>
          {/* Columna Izquierda: Formulario (Fijo al hacer scroll en escritorio) */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Box sx={{ position: { md: "sticky" }, top: 24 }}>
              <Typography
                variant="h6"
                sx={{ mb: 2, fontWeight: "bold", color: "text.primary" }}
              >
                Crear Nueva Tarea
              </Typography>
              {/* ✅ Renderizado directo sin contenedores duplicados */}
              <TaskForm onTaskCreated={handleTaskCreated} />
            </Box>
          </Grid>

          {/* Columna Derecha: Lista de Tareas */}
          <Grid size={{ xs: 12, md: 8 }}>
            <Typography
              variant="h6"
              sx={{ mb: 2, fontWeight: "bold", color: "text.primary" }}
            >
              Mis Tareas ({tasks.length})
            </Typography>

            {loading ? (
              <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
                <CircularProgress />
              </Box>
            ) : tasks.length === 0 ? (
              <Box
                sx={{
                  p: 4,
                  textAlign: "center",
                  bgcolor: "background.paper",
                  borderRadius: 2,
                  boxShadow: 1,
                }}
              >
                <Typography variant="body1" color="text.secondary">
                  No tienes ninguna tarea creada. ¡Empieza creando una a la izquierda!
                </Typography>
              </Box>
            ) : (
              <Grid container spacing={2}>
                {tasks.map((task) => (
                  <Grid size={{ xs: 12, sm: 6 }} key={task._id}>
                    <TaskCard task={task} onDelete={handleTaskDeleted} />
                  </Grid>
                ))}
              </Grid>
            )}
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Dashboard;