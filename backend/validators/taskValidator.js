const { z } = require('zod');

const createTaskSchema = z.object({
  title: z
    .string({ required_error: 'El título es obligatorio' })
    .trim()
    .min(3, 'El título debe tener al menos 3 caracteres')
    .max(100, 'El título no puede superar los 100 caracteres'),
  description: z
    .string({ required_error: 'La descripción es obligatoria' })
    .trim()
    .min(5, 'La descripción debe tener al menos 5 caracteres'),
  assignedTo: z
    .string({ required_error: 'El responsable es obligatorio' })
    .trim()
    .min(2, 'El nombre del responsable debe tener al menos 2 caracteres'),
  status: z
    .enum(['pendiente', 'completada'], { errorMap: () => ({ message: 'El estado debe ser pendiente o completada' }) })
    .optional(),
});

module.exports = { createTaskSchema };