import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserAuth } from '../../hooks/useUserAuth';
import { UserContext } from '../../context/userContext';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Loader from '../../components/ui/Loader';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import { ClipboardList, Clock3, Sparkles } from 'lucide-react';

function UserDashboard() {
  useUserAuth();
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError('');
      try {
        const { data } = await axiosInstance.get(API_PATHS.TASKS.GET_USER_DASHBOARD_DATA);
        setDashboardData(data);
      } catch (err) {
        setError(err.response?.data?.message || err.message || 'Unable to load dashboard metrics.');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  return (
    <DashboardLayout activeMenu="Dashboard">
      <div className="space-y-8">
        <Card className="grid gap-6 lg:grid-cols-[1.4fr_0.8fr]">
          <div className="space-y-6">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-indigo-600">Welcome back</p>
              <h1 className="mt-3 text-3xl font-semibold text-slate-950 dark:text-white">{user?.name || 'Team member'}</h1>
              <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">This is your personal workspace for active tasks, progress updates, and quick actions.</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Card className="space-y-3 bg-slate-50 dark:bg-slate-900 p-6">
                <div className="flex items-center gap-3 text-indigo-600">
                  <Sparkles className="h-5 w-5" />
                  <h2 className="text-sm font-semibold text-slate-900 dark:text-white">Focus mode</h2>
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400">Review your assigned tasks and keep your priorities aligned.</p>
              </Card>
              <Card className="space-y-3 bg-slate-50 dark:bg-slate-900 p-6">
                <div className="flex items-center gap-3 text-indigo-600">
                  <Clock3 className="h-5 w-5" />
                  <h2 className="text-sm font-semibold text-slate-900 dark:text-white">Stay on schedule</h2>
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400">Check deadlines and updates for tasks assigned to you.</p>
              </Card>
            </div>
          </div>
          <div className="rounded-[2rem] border border-slate-200/70 bg-white/95 p-6 shadow-[0_24px_80px_-32px_rgba(15,23,42,0.16)] dark:border-slate-700/70 dark:bg-slate-950/90">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">Today's quick action</p>
                <h2 className="mt-2 text-xl font-semibold text-slate-950 dark:text-white">Create or review tasks</h2>
              </div>
              <div className="rounded-3xl bg-indigo-600/10 p-3 text-indigo-600 dark:bg-indigo-500/15 dark:text-indigo-100">
                <ClipboardList className="h-5 w-5" />
              </div>
            </div>
            <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">Use the task manager to see your current workload and track progress in one place.</p>
            <Button variant="primary" className="mt-6 w-full" onClick={() => navigate('/user/my-tasks')}>
              View tasks
            </Button>
          </div>
        </Card>

        {loading ? (
          <Loader />
        ) : (
          <div className="grid gap-6 xl:grid-cols-3">
            <Card className="space-y-4">
              <p className="text-sm text-slate-500 dark:text-slate-400">Assigned Tasks</p>
              <p className="text-4xl font-semibold text-slate-950 dark:text-white">{dashboardData?.statistics?.totalTasks ?? 0}</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">Tasks assigned to you will appear here.</p>
            </Card>
            <Card className="space-y-4">
              <p className="text-sm text-slate-500 dark:text-slate-400">Completed</p>
              <p className="text-4xl font-semibold text-slate-950 dark:text-white">{dashboardData?.statistics?.completedTasks ?? 0}</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">Complete tasks to keep your progress up to date.</p>
            </Card>
            <Card className="space-y-4">
              <p className="text-sm text-slate-500 dark:text-slate-400">Due soon</p>
              <p className="text-4xl font-semibold text-slate-950 dark:text-white">{dashboardData?.statistics?.overdueTasks ?? 0}</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">Due task counts will update automatically.</p>
            </Card>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

export default UserDashboard;