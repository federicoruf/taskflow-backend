import { useFormik } from "formik";
import * as Yup from "yup";
import { taskService } from "../services/taskService";
import { Box, TextField, Button, Paper, Typography } from "@mui/material";

const validationSchema = Yup.object({
  title: Yup.string().required("El título de la tarea es obligatorio").min(3, "El título debe tener al menos 3 caracteres"),
  description: Yup.string().required("La descripción es obligatoria").min(3, "La descripción debe tener al menos 3 caracteres"),
  assignedTo: Yup.string()
    .required("El nombre del responsable es obligatorio")
    .min(2, "El nombre del responsable debe tener al menos 2 caracteres"), // ◄--- Validación del backend
});

const TaskForm = ({ onTaskCreated }) => {

  const formik = useFormik({
    initialValues: { title: "", description: "", assignedTo: "" },
    validationSchema: validationSchema,
    onSubmit: async (values, { resetForm, setSubmitting }) => {
      try {
        const newTask = await taskService.create(values);
        onTaskCreated(newTask);
        resetForm();
      } catch (err) {
        console.error(err);
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
      <Typography variant="h6" gutterBottom>
        Crear Nueva Tarea
      </Typography>
      <Box component="form" onSubmit={formik.handleSubmit} noValidate>
        <TextField
          margin="normal"
          required
          fullWidth
          id="title"
          name="title"
          label="Título de la tarea"
          value={formik.values.title}
          onChange={formik.handleChange}
          error={formik.touched.title && Boolean(formik.errors.title)}
          helperText={formik.touched.title && formik.errors.title}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          id="description"
          name="description"
          label="Descripción detallada"
          multiline
          rows={3}
          value={formik.values.description}
          onChange={formik.handleChange}
          error={
            formik.touched.description && Boolean(formik.errors.description)
          }
          helperText={formik.touched.description && formik.errors.description}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          id="assignedTo"
          name="assignedTo"
          label="Asignado a"
          value={formik.values.assignedTo}
          onChange={formik.handleChange}
          error={formik.touched.assignedTo && Boolean(formik.errors.assignedTo)}
          helperText={formik.touched.assignedTo && formik.errors.assignedTo}
        />
        <Button
          type="submit"
          fullWidth
          variant="contained"
          disabled={formik.isSubmitting}
          sx={{ mt: 3, mb: 2 }}
        >
          {formik.isSubmitting ? "Creando..." : "Crear Tarea"}
        </Button>
      </Box>
    </Paper>
  );
};

export default TaskForm;
