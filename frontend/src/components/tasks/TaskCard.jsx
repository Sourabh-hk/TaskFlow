import { useState } from 'react';
import { Link } from 'react-router-dom';
import { format, isValid, parseISO, isPast, isToday } from 'date-fns';
import Badge from '../ui/Badge';
import ConfirmModal from '../ui/ConfirmModal';
import { useTask } from '../../context/TaskContext';

const TaskCard = ({ task }) => {
  const { deleteTask, updateTaskStatus } = useTask();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const handleDelete = async () => {
    setDeleteLoading(true);
    await deleteTask(task.id);
    setDeleteLoading(false);
    setShowDeleteModal(false);
  };

  const handleStatusChange = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    await updateTaskStatus(task.id, e.target.value);
  };

  const formatDueDate = (dateStr) => {
    if (!dateStr) return null;
    const date = parseISO(dateStr);
    if (!isValid(date)) return null;
    return { formatted: format(date, 'MMM d, yyyy'), isOverdue: isPast(date) && !isToday(date), isToday: isToday(date) };
  };

  const dueDateInfo = formatDueDate(task.dueDate);

  return (
    <>
      <div className="card p-5 hover:border-brand-500/40 hover:shadow-lg hover:shadow-brand-900/20 transition-all duration-300 group animate-fade-in">
        {/* Header */}
        <div className="flex items-start gap-3 mb-3">
          <div className="flex-1 min-w-0">
            <Link
              to={`/tasks/${task.id}`}
              className="block text-base font-semibold text-white hover:text-brand-400 transition-colors truncate"
            >
              {task.title}
            </Link>
            {task.description && (
              <p className="text-sm text-gray-500 mt-0.5 line-clamp-2">{task.description}</p>
            )}
          </div>
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
            <Link
              to={`/tasks/${task.id}/edit`}
              className="p-1.5 rounded-lg text-gray-400 hover:text-brand-400 hover:bg-brand-500/10 transition-colors"
              title="Edit task"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </Link>
            <button
              onClick={() => setShowDeleteModal(true)}
              className="p-1.5 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
              title="Delete task"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Badges */}
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <Badge type="status" value={task.status} />
          <Badge type="priority" value={task.priority} />
          {dueDateInfo && (
            <span className={`badge gap-1 ${
              dueDateInfo.isOverdue
                ? 'bg-red-500/15 text-red-400 border border-red-500/30'
                : dueDateInfo.isToday
                ? 'bg-orange-500/15 text-orange-400 border border-orange-500/30'
                : 'bg-surface-elevated text-gray-400 border border-surface-border'
            }`}>
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {dueDateInfo.isOverdue ? 'Overdue · ' : dueDateInfo.isToday ? 'Today · ' : ''}{dueDateInfo.formatted}
            </span>
          )}
        </div>

        {/* Status Dropdown */}
        <div className="pt-3 border-t border-surface-border">
          <select
            value={task.status}
            onChange={handleStatusChange}
            onClick={(e) => e.stopPropagation()}
            className="w-full text-xs bg-surface-elevated border border-surface-border rounded-lg px-3 py-1.5 text-gray-300 focus:outline-none focus:ring-1 focus:ring-brand-500 cursor-pointer transition-colors hover:border-brand-500/40"
          >
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
        </div>
      </div>

      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        title="Delete Task"
        message={`Are you sure you want to delete "${task.title}"? This action cannot be undone.`}
        confirmText="Delete Task"
        loading={deleteLoading}
      />
    </>
  );
};

export default TaskCard;
