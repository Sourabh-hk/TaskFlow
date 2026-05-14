import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { format, parseISO, isValid, isPast, isToday } from 'date-fns';
import { useTask } from '../context/TaskContext';
import Badge from '../components/ui/Badge';
import ConfirmModal from '../components/ui/ConfirmModal';
import LoadingSpinner from '../components/ui/LoadingSpinner';

const InfoRow = ({ label, children }) => (
  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 py-3 border-b border-surface-border last:border-0">
    <span className="text-sm text-gray-500 sm:w-32 flex-shrink-0">{label}</span>
    <div className="flex-1">{children}</div>
  </div>
);

const TaskDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentTask, taskLoading, fetchTask, deleteTask, updateTaskStatus } = useTask();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [statusLoading, setStatusLoading] = useState(false);

  useEffect(() => {
    fetchTask(id).then((task) => {
      if (!task) navigate('/tasks', { replace: true });
    });
  }, [id]);

  const handleDelete = async () => {
    setDeleteLoading(true);
    const result = await deleteTask(id);
    if (result.success) navigate('/tasks');
    setDeleteLoading(false);
  };

  const handleStatusChange = async (e) => {
    setStatusLoading(true);
    await updateTaskStatus(id, e.target.value);
    setStatusLoading(false);
  };

  if (taskLoading && !currentTask) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!currentTask) return null;

  const dueDateInfo = (() => {
    if (!currentTask.dueDate) return null;
    const date = parseISO(currentTask.dueDate);
    if (!isValid(date)) return null;
    return {
      formatted: format(date, 'EEEE, MMMM d, yyyy'),
      isOverdue: isPast(date) && !isToday(date) && currentTask.status !== 'Completed',
      isToday: isToday(date),
    };
  })();

  return (
    <>
      <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-500">
          <Link to="/tasks" className="hover:text-brand-400 transition-colors">Tasks</Link>
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          <span className="text-gray-300 truncate max-w-xs">{currentTask.title}</span>
        </nav>

        {/* Main Card */}
        <div className="card overflow-hidden">
          {/* Header */}
          <div className="p-6 sm:p-8 border-b border-surface-border">
            <div className="flex flex-col sm:flex-row sm:items-start gap-4">
              <div className="flex-1 min-w-0">
                <h1 className={`text-2xl sm:text-3xl font-bold mb-3 ${
                  currentTask.status === 'Completed' ? 'line-through text-gray-400' : 'text-white'
                }`}>
                  {currentTask.title}
                </h1>
                <div className="flex flex-wrap gap-2">
                  <Badge type="status" value={currentTask.status} />
                  <Badge type="priority" value={currentTask.priority} />
                  {dueDateInfo && (
                    <span className={`badge gap-1 ${
                      dueDateInfo.isOverdue
                        ? 'bg-red-500/15 text-red-400 border border-red-500/30'
                        : dueDateInfo.isToday
                        ? 'bg-orange-500/15 text-orange-400 border border-orange-500/30'
                        : 'bg-surface-elevated text-gray-400 border border-surface-border'
                    }`}>
                      {dueDateInfo.isOverdue ? '⚠️ Overdue' : dueDateInfo.isToday ? '📅 Due today' : '📅 ' + dueDateInfo.formatted}
                    </span>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 flex-shrink-0">
                <Link to={`/tasks/${currentTask.id}/edit`} className="btn-secondary">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Edit
                </Link>
                <button
                  onClick={() => setShowDeleteModal(true)}
                  className="btn-danger"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Delete
                </button>
              </div>
            </div>
          </div>

          {/* Details */}
          <div className="p-6 sm:p-8">
            {/* Description */}
            {currentTask.description ? (
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">Description</h3>
                <p className="text-gray-200 leading-relaxed whitespace-pre-wrap">{currentTask.description}</p>
              </div>
            ) : (
              <div className="mb-6 py-4 text-center rounded-xl bg-surface-elevated border border-dashed border-surface-border">
                <p className="text-sm text-gray-500">No description provided</p>
                <Link to={`/tasks/${currentTask.id}/edit`} className="text-xs text-brand-400 hover:text-brand-300 mt-1 block">
                  Add description
                </Link>
              </div>
            )}

            {/* Metadata */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">Details</h3>
              <div className="card-elevated px-4">
                <InfoRow label="Due Date">
                  {dueDateInfo ? (
                    <span className={dueDateInfo.isOverdue ? 'text-red-400 font-medium' : 'text-gray-200'}>
                      {dueDateInfo.formatted}
                      {dueDateInfo.isOverdue && ' (Overdue)'}
                    </span>
                  ) : (
                    <span className="text-gray-500">Not set</span>
                  )}
                </InfoRow>
                <InfoRow label="Created">
                  <span className="text-gray-200">
                    {format(new Date(currentTask.createdAt), 'MMMM d, yyyy · h:mm a')}
                  </span>
                </InfoRow>
                <InfoRow label="Last Updated">
                  <span className="text-gray-200">
                    {format(new Date(currentTask.updatedAt), 'MMMM d, yyyy · h:mm a')}
                  </span>
                </InfoRow>
              </div>
            </div>

            {/* Quick Status Update */}
            <div>
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">Update Status</h3>
              <div className="flex gap-2 flex-wrap">
                {['Pending', 'In Progress', 'Completed'].map((status) => (
                  <button
                    key={status}
                    onClick={() => handleStatusChange({ target: { value: status } })}
                    disabled={currentTask.status === status || statusLoading}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                      currentTask.status === status
                        ? 'bg-brand-600 text-white cursor-default'
                        : 'bg-surface-elevated border border-surface-border text-gray-400 hover:text-white hover:border-brand-500/40 disabled:opacity-50'
                    }`}
                  >
                    {statusLoading && currentTask.status !== status ? (
                      <LoadingSpinner size="xs" className="inline" />
                    ) : null}
                    {status}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Back Link */}
        <Link to="/tasks" className="btn-ghost">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Tasks
        </Link>
      </div>

      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        title="Delete Task"
        message={`Are you sure you want to delete "${currentTask.title}"? This action cannot be undone.`}
        confirmText="Delete Task"
        loading={deleteLoading}
      />
    </>
  );
};

export default TaskDetailPage;
