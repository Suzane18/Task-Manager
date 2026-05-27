import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ClipboardList as LuClipboardList, CheckCircle2 as LuCheckCircle2, Clock as LuClock, Layers as LuLayers, Sparkles as LuSparkles } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import StatsCard from '../../components/dashboard/StatsCard';
import TaskDistributionChart from '../../components/dashboard/TaskDistributionChart';
import PriorityBarChart from '../../components/dashboard/PriorityBarChart';
import RecentTasksTable from '../../components/dashboard/RecentTasksTable';
import Button from '../../components/ui/Button';
import Loader from '../../components/ui/Loader';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';

const formatDate = (dateValue) => {
  if (!dateValue) return 'TBD';
  const date = new Date(dateValue);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setLoading(true);
        setError('');
        const { data } = await axiosInstance.get(API_PATHS.TASKS.GET_DASHBOARD_DATA);
        setDashboardData(data);
      } catch (err) {
        setError(err?.response?.data?.message || err.message || 'Unable to load dashboard data.');
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  const stats = useMemo(() => {
    if (!dashboardData) return [];

    const total = dashboardData.statistics?.totalTasks ?? 0;
    const pending = dashboardData.statistics?.pendingTasks ?? 0;
    const completed = dashboardData.statistics?.completedTasks ?? 0;
    const inProgress = total - pending - completed;

    return [
      {
        title: 'Total Tasks',
        value: total,
        icon: LuClipboardList,
        trend: { label: 'Live from DB', variant: 'completed' },
        accent: 'from-purple-500 to-indigo-500',
        description: 'Overall task volume',
      },
      {
        title: 'Pending Tasks',
        value: pending,
        icon: LuClock,
        trend: { label: 'Tracked now', variant: 'pending' },
        accent: 'from-emerald-500 to-cyan-500',
        description: 'Needs attention',
      },
      {
        title: 'In Progress',
        value: inProgress,
        icon: LuLayers,
        trend: { label: 'Realtime update', variant: 'in progress' },
        accent: 'from-indigo-500 to-violet-500',
        description: 'Active workflow',
      },
      {
        title: 'Completed',
        value: completed,
        icon: LuCheckCircle2,
        trend: { label: 'Finalized', variant: 'completed' },
        accent: 'from-cyan-500 to-sky-500',
        description: 'Delivered tasks',
      },
    ];
  }, [dashboardData]);

  const distributionData = useMemo(() => {
    if (!dashboardData) return [];

    return [
      { name: 'Pending', value: dashboardData.charts?.taskDistribution?.Pending ?? 0, description: 'Waiting for review' },
      { name: 'In Progress', value: dashboardData.charts?.taskDistribution?.InProgress ?? 0, description: 'Work in motion' },
      { name: 'Completed', value: dashboardData.charts?.taskDistribution?.Completed ?? 0, description: 'Finished tasks' },
    ];
  }, [dashboardData]);

  const priorityData = useMemo(() => {
    if (!dashboardData) return [];

    return [
      { name: 'Low', value: dashboardData.charts?.taskPriorityLevels?.Low ?? 0 },
      { name: 'Medium', value: dashboardData.charts?.taskPriorityLevels?.Medium ?? 0 },
      { name: 'High', value: dashboardData.charts?.taskPriorityLevels?.High ?? 0 },
    ];
  }, [dashboardData]);

  const recentTasks = useMemo(() => {
    if (!dashboardData) return [];

    return dashboardData.recentTasks.map((task) => ({
      id: task._id,
      title: task.title,
      assignee: task.assignedTo?.length
        ? task.assignedTo.map((user) => user.name).join(', ')
        : 'Unassigned',
      priority: task.priority || 'Low',
      status: task.status || 'Pending',
      deadline: formatDate(task.dueDate),
    }));
  }, [dashboardData]);

  const navigate = useNavigate();

  if (loading) {
    return (
      <DashboardLayout activeMenu="Dashboard">
        <Loader />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout activeMenu="Dashboard">
      <div className="space-y-8">
        {error && (
          <div className="rounded-3xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}
        <section className="rounded-[2rem] border border-slate-200/70 bg-gradient-to-br from-slate-50 via-slate-100 to-white p-8 shadow-[0_24px_80px_-40px_rgba(15,23,42,0.18)] dark:border-slate-700/60 dark:from-slate-900/70 dark:via-slate-950/70 dark:to-slate-950/95">
          <div className="grid gap-8 lg:grid-cols-[1.3fr_0.7fr] lg:items-center">
            <div className="space-y-4">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-indigo-600">Welcome back</p>
              <h1 className="text-4xl font-semibold text-slate-950 dark:text-white">Modern task management for high-performing teams.</h1>
              <p className="max-w-2xl text-sm text-slate-600 dark:text-slate-400">Keep work flowing with premium insights, streamlined task orchestration, and clean project visibility.</p>
              <div className="flex flex-wrap gap-3">
                <Button variant="primary" onClick={() => navigate('/admin/create-task')}>Create task</Button>
              </div>
            </div>
            <div className="relative overflow-hidden rounded-[2rem] bg-indigo-600/10 p-8 text-white backdrop-blur-xl">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(99,102,241,0.18),_transparent_30%)]" />
              <div className="relative z-10 space-y-4">
                {/* Focus mode removed per request */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-[1.75rem] bg-white/15 p-5">
                    <p className="text-sm text-slate-100">Next review</p>
                    <p className="mt-3 text-2xl font-semibold">May 28</p>
                  </div>
                  <div className="rounded-[1.75rem] bg-white/15 p-5">
                    <p className="text-sm text-slate-100">Velocity</p>
                    <p className="mt-3 text-2xl font-semibold">+18%</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      
        <div className="grid gap-5 xl:grid-cols-4">
          {stats.map((card) => (
            <StatsCard key={card.title} {...card} />
          ))}
        </div>

        <div className="grid gap-5 xl:grid-cols-3">
          <div className="hidden xl:block" />
          <TaskDistributionChart data={distributionData} />
          <PriorityBarChart data={priorityData} />
        </div>

        <RecentTasksTable tasks={recentTasks} />
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;