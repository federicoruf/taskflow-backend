const express = require('express');
const router = express.Router();
const { createTask, getTasks } = require('../controllers/taskController');
const { protect } = require('../middlewares/authMiddleware');
const validate = require('../middlewares/validateMiddleware');
const { createTaskSchema } = require('../validators/taskValidator');

router.route('/')
  .post(protect,validate(createTaskSchema), createTask)
  .get(protect, getTasks);

router.route('/:id')
  .put(protect, updateTask)
  .delete(protect, deleteTask);
  
module.exports = router;