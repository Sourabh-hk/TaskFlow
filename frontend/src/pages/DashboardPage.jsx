import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTask } from '../context/TaskContext';
import { format } from 'date-fns';
import Badge from '../components/ui/Badge';
import { SkeletonList } from '../components/ui/SkeletonCard';

const StatCard = ({ label, value, icon, color, sublabel }) => (
  <div className="card p-5 hover:border-brand-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-brand-900/10">
    <div className="flex items-center justify-between mb-4">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
        {icon}
      </div>
    </div>
    <p className="text-3xl font-bold text-white">{value}</p>
    <p className="text-sm text-gray-400 mt-1">{label}</p>
    {sublabel && <p className="text-xs text-gray-600 mt-0.5">{sublabel}</p>}
  </div>
);

const DashboardPage = () => {
  const { user } = useAuth();
  const { tasks, loading, pagination, fetchTasks } = useTask();

  useEffect(() => {
    fetchTasks({ limit: 100 });
  }, []);

  const stats = {
    total: pagination.total || tasks.length,
    pending: tasks.filter((t) => t.status === 'Pending').length,
    inProgress: tasks.filter((t) => t.status === 'In Progress').length,
    completed: tasks.filter((t) => t.status === 'Completed').length,
    high: tasks.filter((t) => t.priority === 'High').length,
  };

  const completionRate = stats.total > 0
    ? Math.round((stats.completed / stats.total) * 100)
    : 0;

  const recentTasks = tasks.slice(0, 5);
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">
            {greeting}, {user?.fullName?.split(' ')[0]}! 👋
          </h1>
          <p className="text-gray-400 mt-1">
            {format(new Date(), 'EEEE, MMMM d, yyyy')} · Here's your task overview
          </p>
        </div>
        <Link to="/tasks/new" className="btn-primary self-start sm:self-auto">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
          </svg>
          New Task
        </Link>
      </div>

      {/* Stat Cards */}
      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="card p-5 space-y-3 animate-pulse">
              <div className="skeleton h-10 w-10 rounded-xl" />
              <div className="skeleton h-8 w-16 rounded" />
              <div className="skeleton h-4 w-24 rounded" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            label="Total Tasks"
            value={stats.total}
            color="bg-brand-500/20"
            icon={
              <svg className="w-5 h-5 text-brand-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2" />
              </svg>
            }
          />
          <StatCard
            label="In Progress"
            value={stats.inProgress}
            color="bg-blue-500/20"
            icon={
              <svg className="w-5 h-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            }
          />
          <StatCard
            label="Completed"
            value={stats.completed}
            sublabel={`${completionRate}% completion rate`}
            color="bg-green-500/20"
            icon={
              <svg className="w-5 h-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            }
          />
          <StatCard
            label="High Priority"
            value={stats.high}
            color="bg-red-500/20"
            icon={
              <svg className="w-5 h-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            }
          />
        </div>
      )}

      {/* Progress Bar */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-white">Overall Progress</h3>
          <span className="text-2xl font-bold text-gradient">{completionRate}%</span>
        </div>
        <div className="h-3 bg-surface-elevated rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-brand-600 to-purple-500 rounded-full transition-all duration-700"
            style={{ width: `${completionRate}%` }}
          />
        </div>
        <div className="flex justify-between mt-2 text-xs text-gray-500">
          <span>{stats.completed} completed</span>
          <span>{stats.pending} pending · {stats.inProgress} in progress</span>
        </div>
      </div>

      {/* Recent Tasks */}
      <div className="card overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-surface-border">
          <h3 className="font-semibold text-white">Recent Tasks</h3>
          <Link to="/tasks" className="text-sm text-brand-400 hover:text-brand-300 font-medium transition-colors">
            View all →
          </Link>
        </div>

        {loading ? (
          <div className="p-6">
            <SkeletonList count={3} />
          </div>
        ) : recentTasks.length === 0 ? (
          <div className="py-16 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-surface-elevated flex items-center justify-center">
              <svg className="w-8 h-8 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h4 className="text-lg font-semibold text-white mb-2">No tasks yet</h4>
            <p className="text-gray-500 mb-6 text-sm">Start by creating your first task</p>
            <Link to="/tasks/new" className="btn-primary">
              Create First Task
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-surface-border">
            {recentTasks.map((task) => (
              <Link
                key={task.id}
                to={`/tasks/${task.id}`}
                className="flex items-center gap-4 px-6 py-4 hover:bg-surface-elevated/50 transition-colors group"
              >
                <div
                  className={`w-2 h-2 rounded-full flex-shrink-0 ${
                    task.status === 'Completed' ? 'bg-green-400' :
                    task.status === 'In Progress' ? 'bg-blue-400' : 'bg-yellow-400'
                  }`}
                />
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium truncate group-hover:text-brand-400 transition-colors ${
                    task.status === 'Completed' ? 'line-through text-gray-500' : 'text-white'
                  }`}>
                    {task.title}
                  </p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <Badge type="priority" value={task.priority} />
                  <Badge type="status" value={task.status} />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
