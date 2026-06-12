const Task = require("../models/Task");
const logger = require("../config/logger");

const createTask = async (taskData, userId) => {
  const { title, description, assignedTo } = taskData;

  const task = await Task.create({
    title,
    description,
    assignedTo,
    user: userId,
  });

  logger.info(
    `Tarea creada con éxito. ID: ${task._id} por el usuario ID: ${userId}`,
  );

  return task;
};

const getTasksByUser = async (userId) => {
  return await Task.find({ user: userId }).sort({ createdAt: -1 });
};

const updateTask = async (taskId, userId, updateData) => {
  const task = await Task.findById(taskId);

  if (!task) {
    const error = new Error("Tarea no encontrada");
    error.statusCode = 404;
    throw error;
  }

  if (task.user.toString() !== userId.toString()) {
    const error = new Error("No tienes autorización para modificar esta tarea");
    error.statusCode = 403;
    throw error;
  }

  Object.assign(task, updateData);
  await task.save();

  return task;
};

const deleteTask = async (taskId, userId) => {
  const task = await Task.findById(taskId);

  if (!task) {
    const error = new Error("Tarea no encontrada");
    error.statusCode = 404;
    throw error;
  }

  if (task.user.toString() !== userId.toString()) {
    const error = new Error("No tienes autorización para eliminar esta tarea");
    error.statusCode = 403;
    throw error;
  }

  await task.deleteOne();

  logger.info(`TAREA ELIMINADA. ID Tarea: ${taskId} eliminada por el usuario ID: ${userId}`);

  return { message: "Tarea eliminada correctamente" };
};

module.exports = {
  createTask,
  getTasksByUser,
  updateTask,
  deleteTask,
};
