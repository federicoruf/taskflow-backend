const taskController = require("../controllers/taskController");
const taskService = require("../services/taskService");

jest.mock("../services/taskService");

describe("taskController", () => {
  let req;
  let res;

  beforeEach(() => {
    req = {
      body: {},
      params: {},
      user: { _id: "user_authenticated_123" },
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    jest.clearAllMocks();
  });

  describe("Función: getTasks", () => {
    it("Debería responder con 200 y el listado de tareas del usuario", async () => {
      const mockTasks = [
        { _id: "task_1", title: "Tarea 1", user: "user_authenticated_123" },
        { _id: "task_2", title: "Tarea 2", user: "user_authenticated_123" },
      ];

      taskService.getTasksByUser.mockResolvedValue(mockTasks);

      await taskController.getTasks(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockTasks);
      expect(taskService.getTasksByUser).toHaveBeenCalledWith(
        "user_authenticated_123",
      );
    });
  });

  describe("Función: createTask", () => {
    it("Debería responder con 201 y la tarea creada", async () => {
      const mockCreatedTask = {
        _id: "task_999",
        title: "Nueva Tarea",
        user: "user_authenticated_123",
      };
      req.body = { title: "Nueva Tarea" };

      taskService.createTask.mockResolvedValue(mockCreatedTask);

      await taskController.createTask(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(mockCreatedTask);
      expect(taskService.createTask).toHaveBeenCalledWith(
        req.body,
        "user_authenticated_123",
      );
    });
  });

  describe("Función: updateTask", () => {
    it("Debería responder con 403 si el servicio deniega la autoría", async () => {
      const fakeError = new Error(
        "No tienes autorización para modificar esta tarea",
      );
      fakeError.statusCode = 403;

      req.params.id = "task_ajena";
      req.body = { title: "Intento de hackeo" };

      taskService.updateTask.mockRejectedValue(fakeError);

      await expect(async () => {
        await taskController.updateTask(req, res);
      }).rejects.toThrow("No tienes autorización para modificar esta tarea");
    });
  });

  describe("Función: deleteTask", () => {
    it("Debería responder con 200 y el mensaje de confirmación si se elimina con éxito", async () => {
      const mockServiceResult = { message: "Tarea eliminada correctamente" };
      req.params.id = "task_123";

      taskService.deleteTask.mockResolvedValue(mockServiceResult);

      await taskController.deleteTask(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockServiceResult);
      expect(taskService.deleteTask).toHaveBeenCalledWith(
        "task_123",
        "user_authenticated_123",
      );
    });

    it("Debería propagar el error si el usuario intenta borrar una tarea ajena", async () => {
      const fakeError = new Error(
        "No tienes autorización para eliminar esta tarea",
      );
      fakeError.statusCode = 403;
      req.params.id = "task_ajena";

      taskService.deleteTask.mockRejectedValue(fakeError);

      await expect(async () => {
        await taskController.deleteTask(req, res);
      }).rejects.toThrow("No tienes autorización para eliminar esta tarea");
    });
  });
});
