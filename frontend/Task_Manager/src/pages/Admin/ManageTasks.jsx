import { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Filter as LuFilter,
  Plus as LuPlus,
  RefreshCw as LuRefreshCw,
} from 'lucide-react';

import DashboardLayout from '../../components/layout/DashboardLayout';
import RecentTasksTable from '../../components/dashboard/RecentTasksTable';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import { UserContext } from '../../context/userContext';

const ManageTasks = () => {
  const navigate = useNavigate();
  const { user } = useContext(UserContext);

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadTasks = async () => {
    setLoading(true);

    try {
      const { data } = await axiosInstance.get(
        API_PATHS.TASKS.GET_ALL_TASKS
      );

      if (data?.tasks) {
        setTasks(
          data.tasks.map((task) => ({
            id: task._id,
            title: task.title,

            assignee:
              task.assignedTo?.length > 0
                ? task.assignedTo
                    .map((member) => member.name)
                    .join(', ')
                : 'Unassigned',

            priority: task.priority || 'Medium',

            status: task.status || 'Pending',

            deadline: task.dueDate
              ? new Date(task.dueDate).toLocaleDateString(
                  'en-US',
                  {
                    month: 'short',
                    day: 'numeric',
                  }
                )
              : 'N/A',
          }))
        );
      } else {
        setTasks([]);
      }
    } catch (error) {
      console.error('Failed to load tasks', error);
      setTasks([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  return (
    <DashboardLayout activeMenu="Manage Tasks">
      <div className="space-y-8">

        {/* Header */}
        <div className="flex flex-col gap-4 rounded-[2rem] border border-slate-200/70 bg-white/95 p-8 shadow-[0_24px_80px_-40px_rgba(15,23,42,0.16)] dark:border-slate-700/70 dark:bg-slate-950/90 md:flex-row md:items-center md:justify-between">

          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-indigo-600">
              Manage Tasks
            </p>

            <h1 className="mt-2 text-3xl font-semibold text-slate-950 dark:text-white">
              All active workstreams in one place
            </h1>
          </div>

          <div className="flex flex-wrap gap-3">

            <Button
              variant="secondary"
              className="inline-flex items-center gap-2"
              onClick={loadTasks}
              disabled={loading}
            >
              <LuRefreshCw
                className={`h-4 w-4 ${
                  loading ? 'animate-spin' : ''
                }`}
              />
              Refresh
            </Button>

            {user?.role === 'admin' && (
              <Button
                variant="primary"
                className="inline-flex items-center gap-2"
                onClick={() => navigate('/admin/create-task')}
              >
                <LuPlus className="h-4 w-4" />
                New Task
              </Button>
            )}

          </div>
        </div>

        {/* Stats */}
        <div className="grid gap-6 xl:grid-cols-3">

          <Card className="space-y-4">
            <div className="flex items-center justify-between">

              <div>
                <h2 className="text-lg font-semibold text-slate-950 dark:text-white">
                  Active Pipeline
                </h2>

                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Tasks currently in progress.
                </p>
              </div>

              <div className="inline-flex h-11 w-11 items-center justify-center rounded-3xl bg-indigo-600/10 text-indigo-600 dark:bg-indigo-500/15">
                {
                  tasks.filter(
                    (task) => task.status === 'In Progress'
                  ).length
                }
              </div>

            </div>
          </Card>

          <Card className="space-y-4">
            <div className="flex items-center justify-between">

              <div>
                <h2 className="text-lg font-semibold text-slate-950 dark:text-white">
                  Pending Review
                </h2>

                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Tasks awaiting updates.
                </p>
              </div>

              <div className="inline-flex h-11 w-11 items-center justify-center rounded-3xl bg-amber-500/10 text-amber-700 dark:bg-amber-500/15">
                {
                  tasks.filter(
                    (task) => task.status === 'Pending'
                  ).length
                }
              </div>

            </div>
          </Card>

          <Card className="space-y-4">
            <div className="flex items-center justify-between">

              <div>
                <h2 className="text-lg font-semibold text-slate-950 dark:text-white">
                  Completed
                </h2>

                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Tasks completed successfully.
                </p>
              </div>

              <div className="inline-flex h-11 w-11 items-center justify-center rounded-3xl bg-emerald-500/10 text-emerald-700 dark:bg-emerald-500/15">
                {
                  tasks.filter(
                    (task) => task.status === 'Completed'
                  ).length
                }
              </div>

            </div>
          </Card>

        </div>

        {/* Tasks Table */}
        <div className="rounded-[2rem] border border-slate-200/70 bg-white/95 p-6 shadow-[0_24px_80px_-40px_rgba(15,23,42,0.16)] dark:border-slate-700/70 dark:bg-slate-950/90">

          <div className="mb-5 flex items-center justify-between gap-4">

            <div>
              <h2 className="text-lg font-semibold text-slate-950 dark:text-white">
                Task Grid
              </h2>

              <p className="text-sm text-slate-500 dark:text-slate-400">
                Search, filter, and manage every task in the pipeline.
              </p>
            </div>

            <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2 text-sm text-slate-700 dark:bg-slate-900 dark:text-slate-300">
              <LuFilter className="h-4 w-4" />
              Filters Active
            </div>

          </div>

          <RecentTasksTable
            tasks={tasks}
            loading={loading}
            showEdit={user?.role === 'admin'}
            onEdit={(taskId) =>
              navigate(`/admin/edit-task/${taskId}`)
            }
          />

        </div>
      </div>
    </DashboardLayout>
  );
};

export default ManageTasks;