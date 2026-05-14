const { Task } = require('../models');
const AppError = require('../utils/AppError');
const { Op } = require('sequelize');

/**
 * Create a new task for the authenticated user
 */
const createTask = async (userId, taskData) => {
  const task = await Task.create({ ...taskData, userId });
  return task;
};

/**
 * Get all tasks for a user with search, filter, sort, and pagination
 */
const getUserTasks = async (userId, query) => {
  const {
    search = '',
    status,
    priority,
    sortBy = 'createdAt',
    sortOrder = 'DESC',
    page = 1,
    limit = 10,
  } = query;

  const where = { userId };

  if (search) {
    where[Op.or] = [
      { title: { [Op.iLike]: `%${search}%` } },
      { description: { [Op.iLike]: `%${search}%` } },
    ];
  }

  if (status && ['Pending', 'In Progress', 'Completed'].includes(status)) {
    where.status = status;
  }

  if (priority && ['Low', 'Medium', 'High'].includes(priority)) {
    where.priority = priority;
  }

  const allowedSortFields = ['createdAt', 'updatedAt', 'dueDate', 'priority', 'status', 'title'];
  const sortField = allowedSortFields.includes(sortBy) ? sortBy : 'createdAt';
  const sortDir = sortOrder.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

  const offset = (parseInt(page) - 1) * parseInt(limit);
  const parsedLimit = Math.min(parseInt(limit) || 10, 100);

  const { count, rows } = await Task.findAndCountAll({
    where,
    order: [[sortField, sortDir]],
    limit: parsedLimit,
    offset,
  });

  return {
    tasks: rows,
    pagination: {
      total: count,
      page: parseInt(page),
      limit: parsedLimit,
      totalPages: Math.ceil(count / parsedLimit),
    },
  };
};

/**
 * Get a single task — validates ownership
 */
const getTaskById = async (taskId, userId) => {
  const task = await Task.findOne({ where: { id: taskId, userId } });
  if (!task) {
    throw new AppError('Task not found or you do not have permission to view it.', 404);
  }
  return task;
};

/**
 * Update a task — validates ownership
 */
const updateTask = async (taskId, userId, updateData) => {
  const task = await Task.findOne({ where: { id: taskId, userId } });
  if (!task) {
    throw new AppError('Task not found or you do not have permission to edit it.', 404);
  }

  const allowedFields = ['title', 'description', 'status', 'priority', 'dueDate'];
  allowedFields.forEach((field) => {
    if (updateData[field] !== undefined) {
      task[field] = updateData[field];
    }
  });

  await task.save();
  return task;
};

/**
 * Update only the status of a task — validates ownership
 */
const updateTaskStatus = async (taskId, userId, status) => {
  const task = await Task.findOne({ where: { id: taskId, userId } });
  if (!task) {
    throw new AppError('Task not found or you do not have permission to update it.', 404);
  }

  task.status = status;
  await task.save();
  return task;
};

/**
 * Delete a task — validates ownership
 */
const deleteTask = async (taskId, userId) => {
  const task = await Task.findOne({ where: { id: taskId, userId } });
  if (!task) {
    throw new AppError('Task not found or you do not have permission to delete it.', 404);
  }

  await task.destroy();
  return true;
};

module.exports = {
  createTask,
  getUserTasks,
  getTaskById,
  updateTask,
  updateTaskStatus,
  deleteTask,
};
