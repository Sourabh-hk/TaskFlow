import TaskForm from '../components/tasks/TaskForm';

const CreateTaskPage = () => {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-white">Create New Task</h1>
        <p className="text-gray-400 mt-1">Fill in the details to create a new task</p>
      </div>
      <div className="card p-6 sm:p-8">
        <TaskForm />
      </div>
    </div>
  );
};

export default CreateTaskPage;
