import { createContext, useContext, useState, useCallback } from 'react';
import { taskService } from '../services/taskService';
import toast from 'react-hot-toast';

const TaskContext = createContext(null);

const DEFAULT_FILTERS = {
  search: '',
  status: '',
  priority: '',
  sortBy: 'createdAt',
  sortOrder: 'DESC',
  page: 1,
  limit: 10,
};

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);
  const [pagination, setPagination] = useState({ total: 0, page: 1, limit: 10, totalPages: 0 });
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [loading, setLoading] = useState(false);
  const [taskLoading, setTaskLoading] = useState(false);
  const [currentTask, setCurrentTask] = useState(null);

  const fetchTasks = useCallback(async (customFilters = {}) => {
    setLoading(true);
    try {
      const params = { ...filters, ...customFilters };
      // Remove empty strings
      Object.keys(params).forEach((k) => {
        if (params[k] === '') delete params[k];
      });
      const data = await taskService.getTasks(params);
      setTasks(data.data.tasks);
      setPagination(data.data.pagination);
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to fetch tasks.';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const fetchTask = useCallback(async (id) => {
    setTaskLoading(true);
    try {
      const data = await taskService.getTask(id);
      setCurrentTask(data.data.task);
      return data.data.task;
    } catch (error) {
      const message = error.response?.data?.message || 'Task not found.';
      toast.error(message);
      return null;
    } finally {
      setTaskLoading(false);
    }
  }, []);

  const createTask = async (taskData) => {
    setTaskLoading(true);
    try {
      const data = await taskService.createTask(taskData);
      toast.success('Task created successfully! ✅');
      return { success: true, task: data.data.task };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to create task.';
      toast.error(message);
      return { success: false, error: message };
    } finally {
      setTaskLoading(false);
    }
  };

  const updateTask = async (id, taskData) => {
    setTaskLoading(true);
    try {
      const data = await taskService.updateTask(id, taskData);
      setTasks((prev) => prev.map((t) => (t.id === data.data.task.id ? data.data.task : t)));
      if (currentTask?.id === data.data.task.id) setCurrentTask(data.data.task);
      toast.success('Task updated successfully! ✅');
      return { success: true, task: data.data.task };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update task.';
      toast.error(message);
      return { success: false, error: message };
    } finally {
      setTaskLoading(false);
    }
  };

  const updateTaskStatus = async (id, status) => {
    try {
      const data = await taskService.updateTaskStatus(id, status);
      setTasks((prev) => prev.map((t) => (t.id === data.data.task.id ? data.data.task : t)));
      if (currentTask?.id === data.data.task.id) setCurrentTask(data.data.task);
      toast.success('Status updated!');
      return { success: true, task: data.data.task };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update status.';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  const deleteTask = async (id) => {
    try {
      await taskService.deleteTask(id);
      setTasks((prev) => prev.filter((t) => t.id !== id));
      setPagination((prev) => ({ ...prev, total: prev.total - 1 }));
      toast.success('Task deleted successfully.');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to delete task.';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  const updateFilters = (newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters, page: 1 }));
  };

  const resetFilters = () => {
    setFilters(DEFAULT_FILTERS);
  };

  return (
    <TaskContext.Provider
      value={{
        tasks,
        pagination,
        filters,
        loading,
        taskLoading,
        currentTask,
        fetchTasks,
        fetchTask,
        createTask,
        updateTask,
        updateTaskStatus,
        deleteTask,
        updateFilters,
        resetFilters,
        setFilters,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export const useTask = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTask must be used within a TaskProvider');
  }
  return context;
};
