const express = require('express');
const router = express.Router();

const {
  createTask,
  getTasks,
  getTask,
  updateTask,
  updateTaskStatus,
  deleteTask,
} = require('../controllers/taskController');
const { protect } = require('../middleware/auth');
const validate = require('../middleware/validate');
const {
  createTaskValidation,
  updateTaskValidation,
  updateStatusValidation,
} = require('../validators/taskValidator');

// All task routes require authentication
router.use(protect);

router.route('/')
  .post(createTaskValidation, validate, createTask)
  .get(getTasks);

router.route('/:id')
  .get(getTask)
  .put(updateTaskValidation, validate, updateTask)
  .delete(deleteTask);

router.patch('/:id/status', updateStatusValidation, validate, updateTaskStatus);

module.exports = router;
