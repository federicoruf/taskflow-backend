const taskService = require('../services/taskService');

const getTasks = async (req, res) => {
  try {
    const tasks = await taskService.getTasksByUser(req.user._id);
    return res.status(200).json(tasks);
  } catch (error) {
    const statusCode = error.statusCode || 500;
    return res.status(statusCode).json({ message: error.message });
  }
};

const createTask = async (req, res) => {
  try {
    const task = await taskService.createTask(req.body, req.user._id);
    return res.status(201).json(task);
  } catch (error) {
    const statusCode = error.statusCode || 500;
    return res.status(statusCode).json({ message: error.message });
  }
};

const updateTask = async (req, res) => {
  try {
    const updatedTask = await taskService.updateTask(req.params.id, req.user._id, req.body);
    return res.status(200).json(updatedTask);
  } catch (error) {
    const statusCode = error.statusCode || 500;
    return res.status(statusCode).json({ message: error.message });
  }
};

const deleteTask = async (req, res) => {
  try {
    const result = await taskService.deleteTask(req.params.id, req.user._id);
    return res.status(200).json(result);
  } catch (error) {
    const statusCode = error.statusCode || 500;
    return res.status(statusCode).json({ message: error.message });
  }
};

module.exports = {
  getTasks,
  createTask,
  updateTask,
  deleteTask
};