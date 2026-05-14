const catchAsync = require('../utils/catchAsync');
const taskService = require('../services/taskService');

/**
 * POST /api/tasks
 */
const createTask = catchAsync(async (req, res, next) => {
  const { title, description, status, priority, dueDate } = req.body;
  const task = await taskService.createTask(req.user.id, {
    title,
    description,
    status,
    priority,
    dueDate: dueDate || null,
  });

  res.status(201).json({
    success: true,
    message: 'Task created successfully.',
    data: { task },
  });
});

/**
 * GET /api/tasks
 */
const getTasks = catchAsync(async (req, res, next) => {
  const result = await taskService.getUserTasks(req.user.id, req.query);

  res.status(200).json({
    success: true,
    data: result,
  });
});

/**
 * GET /api/tasks/:id
 */
const getTask = catchAsync(async (req, res, next) => {
  const task = await taskService.getTaskById(req.params.id, req.user.id);

  res.status(200).json({
    success: true,
    data: { task },
  });
});

/**
 * PUT /api/tasks/:id
 */
const updateTask = catchAsync(async (req, res, next) => {
  const { title, description, status, priority, dueDate } = req.body;
  const task = await taskService.updateTask(req.params.id, req.user.id, {
    title,
    description,
    status,
    priority,
    dueDate,
  });

  res.status(200).json({
    success: true,
    message: 'Task updated successfully.',
    data: { task },
  });
});

/**
 * PATCH /api/tasks/:id/status
 */
const updateTaskStatus = catchAsync(async (req, res, next) => {
  const { status } = req.body;
  const task = await taskService.updateTaskStatus(req.params.id, req.user.id, status);

  res.status(200).json({
    success: true,
    message: 'Task status updated successfully.',
    data: { task },
  });
});

/**
 * DELETE /api/tasks/:id
 */
const deleteTask = catchAsync(async (req, res, next) => {
  await taskService.deleteTask(req.params.id, req.user.id);

  res.status(200).json({
    success: true,
    message: 'Task deleted successfully.',
  });
});

module.exports = { createTask, getTasks, getTask, updateTask, updateTaskStatus, deleteTask };
