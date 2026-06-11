const { z } = require('zod');

const registerSchema = z.object({
  name: z
    .string({ required_error: 'El nombre es obligatorio' })
    .trim()
    .min(2, 'El nombre debe tener al menos 2 caracteres'),
  email: z
    .string({ required_error: 'El correo electrónico es obligatorio' })
    .trim()
    .email('El formato del correo electrónico no es válido'),
  password: z
    .string({ required_error: 'La contraseña es obligatoria' })
    .min(6, 'La contraseña debe tener al menos 6 caracteres'),
});

const loginSchema = z.object({
  email: z
    .string({ required_error: 'El correo electrónico es obligatorio' })
    .trim()
    .email('El formato del correo electrónico no es válido'),
  password: z
    .string({ required_error: 'La contraseña es obligatoria' }),
});

module.exports = { registerSchema, loginSchema };