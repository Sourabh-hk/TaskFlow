import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTask } from '../context/TaskContext';
import TaskCard from '../components/tasks/TaskCard';
import TaskFilters from '../components/tasks/TaskFilters';
import Pagination from '../components/tasks/Pagination';
import { SkeletonList } from '../components/ui/SkeletonCard';

const EmptyState = ({ hasFilters }) => (
  <div className="py-20 text-center animate-fade-in">
    <div className="w-20 h-20 mx-auto mb-6 rounded-3xl bg-surface-elevated flex items-center justify-center">
      {hasFilters ? (
        <svg className="w-10 h-10 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0" />
        </svg>
      ) : (
        <svg className="w-10 h-10 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      )}
    </div>
    <h3 className="text-xl font-semibold text-white mb-2">
      {hasFilters ? 'No matching tasks' : 'No tasks yet'}
    </h3>
    <p className="text-gray-500 mb-8 max-w-sm mx-auto">
      {hasFilters
        ? 'Try adjusting your filters or search query to find what you\'re looking for.'
        : 'Create your first task to start organizing your work.'}
    </p>
    {!hasFilters && (
      <Link to="/tasks/new" className="btn-primary">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
        </svg>
        Create Task
      </Link>
    )}
  </div>
);

const TasksPage = () => {
  const { tasks, loading, pagination, filters, fetchTasks } = useTask();

  useEffect(() => {
    fetchTasks();
  }, []);

  const hasFilters = !!(filters.search || filters.status || filters.priority);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">My Tasks</h1>
          <p className="text-gray-400 mt-1">
            {pagination.total > 0
              ? `${pagination.total} task${pagination.total !== 1 ? 's' : ''} total`
              : 'Manage and track all your tasks'}
          </p>
        </div>
        <Link to="/tasks/new" className="btn-primary self-start sm:self-auto">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
          </svg>
          New Task
        </Link>
      </div>

      {/* Filters */}
      <TaskFilters />

      {/* Tasks Grid */}
      {loading ? (
        <SkeletonList count={6} />
      ) : tasks.length === 0 ? (
        <EmptyState hasFilters={hasFilters} />
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {tasks.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
          </div>
          <Pagination />
        </>
      )}
    </div>
  );
};

export default TasksPage;
