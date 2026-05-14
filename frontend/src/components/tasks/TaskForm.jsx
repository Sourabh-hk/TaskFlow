import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTask } from '../../context/TaskContext';
import LoadingSpinner from '../ui/LoadingSpinner';

const INITIAL_STATE = {
  title: '',
  description: '',
  status: 'Pending',
  priority: 'Medium',
  dueDate: '',
};

const TaskForm = ({ task = null, isEdit = false }) => {
  const { createTask, updateTask, taskLoading } = useTask();
  const navigate = useNavigate();

  const [form, setForm] = useState(
    task
      ? {
          title: task.title || '',
          description: task.description || '',
          status: task.status || 'Pending',
          priority: task.priority || 'Medium',
          dueDate: task.dueDate || '',
        }
      : INITIAL_STATE
  );

  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!form.title.trim()) newErrors.title = 'Title is required';
    if (form.title.length > 255) newErrors.title = 'Title must be under 255 characters';
    if (form.description && form.description.length > 5000)
      newErrors.description = 'Description must be under 5000 characters';
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const payload = {
      ...form,
      dueDate: form.dueDate || null,
    };

    let result;
    if (isEdit && task) {
      result = await updateTask(task.id, payload);
    } else {
      result = await createTask(payload);
    }

    if (result.success) {
      navigate('/tasks');
    }
  };

  const inputClass = (field) =>
    `input-field ${errors[field] ? 'border-red-500/50 focus:ring-red-500' : ''}`;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Title */}
      <div>
        <label htmlFor="task-title" className="label">
          Task Title <span className="text-red-400">*</span>
        </label>
        <input
          id="task-title"
          type="text"
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="e.g. Design landing page"
          className={inputClass('title')}
          autoFocus
        />
        {errors.title && <p className="mt-1.5 text-sm text-red-400">{errors.title}</p>}
      </div>

      {/* Description */}
      <div>
        <label htmlFor="task-description" className="label">
          Description
          <span className="ml-2 text-gray-500 font-normal">(optional)</span>
        </label>
        <textarea
          id="task-description"
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Add more details about this task..."
          rows={4}
          className={`${inputClass('description')} resize-none`}
        />
        {errors.description && <p className="mt-1.5 text-sm text-red-400">{errors.description}</p>}
        <p className="mt-1 text-xs text-gray-600">{form.description.length}/5000</p>
      </div>

      {/* Row: Status + Priority */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="task-status" className="label">Status</label>
          <select
            id="task-status"
            name="status"
            value={form.status}
            onChange={handleChange}
            className="input-field"
          >
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
        </div>

        <div>
          <label htmlFor="task-priority" className="label">Priority</label>
          <select
            id="task-priority"
            name="priority"
            value={form.priority}
            onChange={handleChange}
            className="input-field"
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>
      </div>

      {/* Due Date */}
      <div>
        <label htmlFor="task-dueDate" className="label">
          Due Date
          <span className="ml-2 text-gray-500 font-normal">(optional)</span>
        </label>
        <input
          id="task-dueDate"
          type="date"
          name="dueDate"
          value={form.dueDate}
          onChange={handleChange}
          className="input-field [color-scheme:dark]"
        />
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-2">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="btn-secondary flex-1 sm:flex-none"
          disabled={taskLoading}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="btn-primary flex-1"
          disabled={taskLoading}
        >
          {taskLoading ? <LoadingSpinner size="xs" /> : null}
          {isEdit ? 'Save Changes' : 'Create Task'}
        </button>
      </div>
    </form>
  );
};

export default TaskForm;
