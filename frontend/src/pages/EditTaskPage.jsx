import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTask } from '../context/TaskContext';
import TaskForm from '../components/tasks/TaskForm';
import LoadingSpinner from '../components/ui/LoadingSpinner';

const EditTaskPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentTask, taskLoading, fetchTask } = useTask();

  useEffect(() => {
    fetchTask(id).then((task) => {
      if (!task) navigate('/tasks', { replace: true });
    });
  }, [id]);

  if (taskLoading && !currentTask) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!currentTask) return null;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-white">Edit Task</h1>
        <p className="text-gray-400 mt-1 truncate max-w-md">{currentTask.title}</p>
      </div>
      <div className="card p-6 sm:p-8">
        <TaskForm task={currentTask} isEdit />
      </div>
    </div>
  );
};

export default EditTaskPage;
