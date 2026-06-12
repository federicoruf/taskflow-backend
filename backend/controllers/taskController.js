const taskService = require("../services/taskService");

const getTasks = async (req, res) => {
  const tasks = await taskService.getTasksByUser(req.user._id);
  return res.status(200).json(tasks);
};

const createTask = async (req, res) => {
  const task = await taskService.createTask(req.body, req.user._id);
  return res.status(201).json(task);
};

const updateTask = async (req, res) => {
  const updatedTask = await taskService.updateTask(
    req.params.id,
    req.user._id,
    req.body,
  );
  return res.status(200).json(updatedTask);
};

const deleteTask = async (req, res) => {
  const result = await taskService.deleteTask(req.params.id, req.user._id);
  return res.status(200).json(result);
};

module.exports = {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
};
