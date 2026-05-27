import { useEffect, useState } from 'react';
import { useUserAuth } from '../../hooks/useUserAuth';
import DashboardLayout from '../../components/layout/DashboardLayout';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import RecentTasksTable from '../../components/dashboard/RecentTasksTable';
import Loader from '../../components/ui/Loader';
import { ListChecks, Clock3 } from 'lucide-react';

const MyTasks = () => {
  useUserAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadTasks = async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await axiosInstance.get(API_PATHS.TASKS.GET_ALL_TASKS);
      setTasks(
        Array.isArray(data.tasks)
          ? data.tasks.map((task) => ({
              id: task._id,
              title: task.title,
              assignee: task.assignedTo?.map((user) => user.name).join(', ') || 'Unassigned',
              priority: task.priority || 'Medium',
              status: task.status || 'Pending',
              deadline: task.dueDate ? new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'N/A',
            }))
          : []
      );
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to load tasks.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  return (
    <DashboardLayout activeMenu="My Tasks">
      <div className="space-y-8">
        {error && <div className="rounded-3xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">{error}</div>}
        {loading ? <Loader /> : <RecentTasksTable tasks={tasks} />}
      </div>
    </DashboardLayout>
  );
};

export default MyTasks;