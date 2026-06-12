const taskController = require('../controllers/taskController');
const taskService = require('../services/taskService');

jest.mock('../services/taskService');

describe('🧪 Tests Unitarios: taskController', () => {
  let req;
  let res;

  beforeEach(() => {
    req = {
      body: {},
      params: {},
      user: { _id: 'user_authenticated_123' }
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    jest.clearAllMocks();
  });

  describe('Función: createTask', () => {
    it('Debería responder con 201 y la tarea creada', async () => {
      const mockCreatedTask = { _id: 'task_999', title: 'Nueva Tarea', user: 'user_authenticated_123' };
      req.body = { title: 'Nueva Tarea' };

      taskService.createTask.mockResolvedValue(mockCreatedTask);

      await taskController.createTask(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(mockCreatedTask);
      // Verificamos que al servicio se le pasaron los datos del body y el ID del usuario autenticado
      expect(taskService.createTask).toHaveBeenCalledWith(req.body, 'user_authenticated_123');
    });
  });

  describe('Función: updateTask', () => {
    it('Debería responder con 403 si el servicio deniega la autoría', async () => {
      const fakeError = new Error('No tienes autorización para modificar esta tarea');
      fakeError.statusCode = 403;

      req.params.id = 'task_ajena';
      req.body = { status: 'completada' };

      taskService.updateTask.mockRejectedValue(fakeError);

      await taskController.updateTask(req, res);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({ message: fakeError.message });
    });
  });
});