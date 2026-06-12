const taskService = require('../services/taskService');
const Task = require('../models/Task');
const mongoose = require('mongoose');

jest.mock('../config/logger', () => ({
  info: jest.fn()
}));

describe('taskService', () => {

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createTask', () => {
    it('Debería crear una tarea correctamente vinculando al usuario', async () => {
      const fakeTaskData = {
        title: 'Test Unitario',
        description: 'Probando la capa de servicio',
        assignedTo: 'federico'
      };
      const userId = 'user123';

      jest.spyOn(Task, 'findOne').mockResolvedValue(null);
      
      jest.spyOn(Task, 'create').mockResolvedValue({
        _id: 'task999',
        ...fakeTaskData,
        user: userId
      });

      const result = await taskService.createTask(fakeTaskData, userId);

      expect(result.title).toBe('Test Unitario');
      expect(Task.findOne).toHaveBeenCalled();
      expect(Task.create).toHaveBeenCalled();
    });

    it('Debería lanzar un error 400 si ya existe una tarea con el mismo título', async () => {
      const fakeTaskData = {
        title: 'Tarea Existente',
        description: 'Probando la modularización de los tests',
        assignedTo: 'federico'
      };
      const userId = 'user123';

      jest.spyOn(Task, 'findOne').mockResolvedValue({ _id: 'existing123', title: 'Tarea Existente' });

      await expect(taskService.createTask(fakeTaskData, userId)).rejects.toThrow(
        'Ya tienes una tarea creada con este mismo título'
      );
    });
  });

  describe('updateTask', () => {
    it('Debería lanzar un error 404 si la tarea no existe', async () => {
      jest.spyOn(Task, 'findById').mockResolvedValue(null);

      const fakeUserId = new mongoose.Types.ObjectId().toString();

      await expect(taskService.updateTask('id_inexistente', fakeUserId, { status: 'completada' }))
        .rejects
        .toThrow('Tarea no encontrada');
    });

    it('Debería lanzar un error 403 si un usuario intenta editar una tarea que NO es suya', async () => {
      const ownerId = new mongoose.Types.ObjectId();
      const hackerId = new mongoose.Types.ObjectId();

      const mockTaskFromDb = {
        _id: 'task_id_999',
        title: 'Tarea Privada',
        user: ownerId,
        save: jest.fn()
      };

      jest.spyOn(Task, 'findById').mockResolvedValue(mockTaskFromDb);

      await expect(taskService.updateTask('task_id_999', hackerId, { status: 'completada' }))
        .rejects
        .toThrow('No tienes autorización para modificar esta tarea');
      
      expect(mockTaskFromDb.save).not.toHaveBeenCalled();
    });

    it('Debería permitir actualizar la tarea si el usuario es el dueño legítimo', async () => {
      const ownerId = new mongoose.Types.ObjectId();

      const mockTaskFromDb = {
        _id: 'task_id_999',
        title: 'Tarea Original',
        status: 'pendiente',
        user: ownerId,
        save: jest.fn().mockResolvedValue(true)
      };

      jest.spyOn(Task, 'findById').mockResolvedValue(mockTaskFromDb);

      const updateData = { status: 'completada', title: 'Tarea Actualizada' };
      
      const result = await taskService.updateTask('task_id_999', ownerId, updateData);

      expect(result.status).toBe('completada');
      expect(result.title).toBe('Tarea Actualizada');
      expect(mockTaskFromDb.save).toHaveBeenCalled();
    });
  });
});