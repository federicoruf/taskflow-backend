const taskService = require('../services/taskService');
const Task = require('../models/Task');
const mongoose = require('mongoose');

describe('🧪 Tests Unitarios: taskService', () => {

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('▶️ Función: createTask', () => {
    it('✅ Debería crear una tarea correctamente vinculando al usuario', async () => {
      const fakeTaskData = {
        title: 'Test Unitario',
        description: 'Probando la capa de servicio',
        assignedTo: 'Federico'
      };
      const fakeUserId = new mongoose.Types.ObjectId().toString();

      const mockCreatedTask = {
        _id: 'task_123',
        ...fakeTaskData,
        user: fakeUserId
      };

      jest.spyOn(Task, 'create').mockResolvedValue(mockCreatedTask);

      const result = await taskService.createTask(fakeTaskData, fakeUserId);

      expect(result).toHaveProperty('_id', 'task_123');
      expect(result.user).toBe(fakeUserId);
      expect(Task.create).toHaveBeenCalledWith({
        ...fakeTaskData,
        user: fakeUserId
      });
    });
  });

  describe('Función: updateTask (Lógica de Autorización)', () => {
    it('Debería lanzar un error 404 si la tarea no existe', async () => {
      jest.spyOn(Task, 'findById').mockResolvedValue(null);

      const fakeUserId = new mongoose.Types.ObjectId().toString();

      await expect(taskService.updateTask('id_inexistente', fakeUserId, { status: 'completada' }))
        .rejects
        .toThrow('Tarea no encontrada');
    });

    it('Debería lanzar un error 403 si un usuario intenta editar una tarea que NO es suya', async () => {
      const ownerId = new mongoose.Types.ObjectId();
      const hackerId = new mongoose.Types.ObjectId(); // Un ID de usuario diferente

      const mockTaskFromDb = {
        _id: 'task_id_999',
        title: 'Tarea Privada',
        user: ownerId, // El dueño es ownerId
        save: jest.fn() // Simulamos la función save de Mongoose
      };

      // Simulamos que encuentra la tarea en la base de datos
      jest.spyOn(Task, 'findById').mockResolvedValue(mockTaskFromDb);

      // El "hacker" intenta actualizar la tarea del "owner"
      await expect(taskService.updateTask('task_id_999', hackerId, { status: 'completada' }))
        .rejects
        .toThrow('No tienes autorización para modificar esta tarea');
      
      // Verificamos que el método save() NUNCA llegó a ejecutarse por seguridad
      expect(mockTaskFromDb.save).not.toHaveBeenCalled();
    });

    it('✅ Debería permitir actualizar la tarea si el usuario es el dueño legítimo', async () => {
      const ownerId = new mongoose.Types.ObjectId();

      const mockTaskFromDb = {
        _id: 'task_id_999',
        title: 'Tarea Original',
        status: 'pendiente',
        user: ownerId,
        save: jest.fn().mockResolvedValue(true) // Simulamos que el guardado es exitoso
      };

      jest.spyOn(Task, 'findById').mockResolvedValue(mockTaskFromDb);

      const updateData = { status: 'completada', title: 'Tarea Actualizada' };
      
      const result = await taskService.updateTask('task_id_999', ownerId, updateData);

      // Verificamos que los datos del objeto en memoria mutaron correctamente
      expect(result.status).toBe('completada');
      expect(result.title).toBe('Tarea Actualizada');
      // Verificamos que se llamó al método save de Mongoose para persistir
      expect(mockTaskFromDb.save).toHaveBeenCalled();
    });
  });
});