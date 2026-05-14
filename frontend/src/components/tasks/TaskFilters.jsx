import { useEffect, useCallback, useRef } from 'react';
import { useTask } from '../../context/TaskContext';

const useDebounce = (callback, delay) => {
  const timeoutRef = useRef(null);
  return useCallback((...args) => {
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => callback(...args), delay);
  }, [callback, delay]);
};

const TaskFilters = () => {
  const { filters, updateFilters, resetFilters, fetchTasks } = useTask();

  const debouncedFetch = useDebounce(() => {
    fetchTasks();
  }, 400);

  useEffect(() => {
    debouncedFetch();
  }, [filters]);

  const handleChange = (key, value) => {
    updateFilters({ [key]: value });
  };

  return (
    <div className="card p-4">
      <div className="flex flex-wrap gap-3 items-center">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px]">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500"
            fill="none" viewBox="0 0 24 24" stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0" />
          </svg>
          <input
            type="text"
            placeholder="Search tasks..."
            value={filters.search}
            onChange={(e) => handleChange('search', e.target.value)}
            className="input-field pl-9 py-2 text-sm"
          />
        </div>

        {/* Status Filter */}
        <select
          value={filters.status}
          onChange={(e) => handleChange('status', e.target.value)}
          className="input-field py-2 text-sm w-auto min-w-[130px]"
        >
          <option value="">All Statuses</option>
          <option value="Pending">Pending</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
        </select>

        {/* Priority Filter */}
        <select
          value={filters.priority}
          onChange={(e) => handleChange('priority', e.target.value)}
          className="input-field py-2 text-sm w-auto min-w-[130px]"
        >
          <option value="">All Priorities</option>
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>

        {/* Sort */}
        <select
          value={`${filters.sortBy}-${filters.sortOrder}`}
          onChange={(e) => {
            const [sortBy, sortOrder] = e.target.value.split('-');
            updateFilters({ sortBy, sortOrder });
          }}
          className="input-field py-2 text-sm w-auto min-w-[150px]"
        >
          <option value="createdAt-DESC">Newest First</option>
          <option value="createdAt-ASC">Oldest First</option>
          <option value="dueDate-ASC">Due Date ↑</option>
          <option value="dueDate-DESC">Due Date ↓</option>
          <option value="priority-DESC">Priority (High)</option>
          <option value="priority-ASC">Priority (Low)</option>
          <option value="title-ASC">Title A-Z</option>
        </select>

        {/* Reset */}
        {(filters.search || filters.status || filters.priority) && (
          <button
            onClick={resetFilters}
            className="btn-ghost text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            Clear
          </button>
        )}
      </div>
    </div>
  );
};

export default TaskFilters;
