import { useMemo, useState, useContext } from 'react';
import {
  Search as LuSearch,
  ChevronLeft as LuChevronLeft,
  ChevronRight as LuChevronRight,
  Pencil as LuPencil,
} from 'lucide-react';

import Badge from '../ui/Badge';
import Button from '../ui/Button';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../context/userContext';

const statusVariant = {
  pending: 'pending',
  'in progress': 'in progress',
  completed: 'completed',
};

const priorityVariant = {
  low: 'low',
  medium: 'medium',
  high: 'high',
};

const ITEMS_PER_PAGE = 5;

const RecentTasksTable = ({ tasks = [] }) => {
  const navigate = useNavigate();
  const { user } = useContext(UserContext);

  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [page, setPage] = useState(1);

  const filteredTasks = useMemo(() => {
    return tasks
      .filter(
        (task) =>
          task.title
            ?.toLowerCase()
            .includes(query.toLowerCase()) ||
          task.assignee
            ?.toLowerCase()
            .includes(query.toLowerCase())
      )
      .filter((task) =>
        statusFilter === 'All'
          ? true
          : task.status === statusFilter
      )
      .filter((task) =>
        priorityFilter === 'All'
          ? true
          : task.priority === priorityFilter
      );
  }, [tasks, query, statusFilter, priorityFilter]);

  const pageCount = Math.max(
    1,
    Math.ceil(filteredTasks.length / ITEMS_PER_PAGE)
  );

  const visibleTasks = filteredTasks.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  const handleEditTask = (taskId) => {
    if (user?.role !== 'admin') return;

    if (typeof onEdit === 'function') {
      onEdit(taskId);
      return;
    }

    navigate(`/admin/tasks/${taskId}`);
  };

  return (
    <div className="rounded-[2rem] border border-slate-200/70 bg-white/95 p-6 shadow-[0_24px_60px_-32px_rgba(15,23,42,0.18)] transition duration-300 hover:-translate-y-0.5 dark:border-slate-700/70 dark:bg-slate-950/95">

      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">

        <div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
            Recent Tasks
          </h3>

          <p className="text-sm text-slate-500 dark:text-slate-400">
            Quick access to high-priority assignments and due dates.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-[1fr_auto_auto]">

          {/* Search */}
          <label className="relative block max-w-sm">
            <span className="sr-only">Search tasks</span>

            <LuSearch className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

            <input
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setPage(1);
              }}
              placeholder="Search tasks"
              className="w-full rounded-3xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:focus:border-cyan-400 dark:focus:ring-cyan-500/20"
            />
          </label>

          {/* Status Filter */}
          <select
            className="rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:focus:border-cyan-400 dark:focus:ring-cyan-500/20"
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
          >
            {['All', 'Pending', 'In Progress', 'Completed'].map(
              (option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              )
            )}
          </select>

          {/* Priority Filter */}
          <select
            className="rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:focus:border-cyan-400 dark:focus:ring-cyan-500/20"
            value={priorityFilter}
            onChange={(e) => {
              setPriorityFilter(e.target.value);
              setPage(1);
            }}
          >
            {['All', 'Low', 'Medium', 'High'].map(
              (option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              )
            )}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-[1.75rem] border border-slate-200/70 bg-slate-50 p-1 dark:border-slate-700/70 dark:bg-slate-900">

        <table className="min-w-full border-separate border-spacing-y-3 text-left text-sm">

          <thead>
            <tr className="text-slate-500 dark:text-slate-400">
              <th className="px-6 py-4">Task</th>
              <th className="px-6 py-4">Assigned</th>
              <th className="px-6 py-4">Priority</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Deadline</th>

              {user?.role === 'admin' && (
                <th className="px-6 py-4 text-center">
                  Edit
                </th>
              )}
            </tr>
          </thead>

          <tbody>

            {visibleTasks.map((task) => (
              <tr
                key={task.id}
                className="rounded-[1.5rem] bg-white transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-slate-200/40 dark:bg-slate-950 dark:hover:bg-slate-900"
              >

                <td className="whitespace-nowrap px-6 py-4 font-medium text-slate-900 dark:text-white">
                  {task.title}
                </td>

                <td className="px-6 py-4 text-slate-500 dark:text-slate-400">
                  {task.assignee}
                </td>

                <td className="px-6 py-4">
                  <Badge
                    variant={
                      priorityVariant[
                        task.priority?.toLowerCase()
                      ] || 'low'
                    }
                  >
                    {task.priority}
                  </Badge>
                </td>

                <td className="px-6 py-4">
                  <Badge
                    variant={
                      statusVariant[
                        task.status?.toLowerCase()
                      ] || 'pending'
                    }
                  >
                    {task.status}
                  </Badge>
                </td>

                <td className="px-6 py-4 text-slate-500 dark:text-slate-400">
                  {task.deadline}
                </td>

                {/* Edit Button */}
                {user?.role === 'admin' && (
                  <td className="px-6 py-4 text-center">

                    <Button
                      variant="primary"
                      className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold"
                      onClick={() => handleEditTask(task.id)}
                    >
                      <LuPencil className="h-3.5 w-3.5" />
                      Edit
                    </Button>

                  </td>
                )}

              </tr>
            ))}

            {visibleTasks.length === 0 && (
              <tr>
                <td
                  colSpan={user?.role === 'admin' ? 6 : 5}
                  className="px-6 py-12 text-center text-slate-500 dark:text-slate-400"
                >
                  No tasks found. Adjust your filters or
                  search terms.
                </td>
              </tr>
            )}

          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

        <p className="text-sm text-slate-500 dark:text-slate-400">
          Showing {visibleTasks.length} of{' '}
          {filteredTasks.length} tasks
        </p>

        <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-2 text-sm text-slate-700 dark:bg-slate-900 dark:text-slate-300">

          <Button
            variant="ghost"
            className="rounded-full px-3 py-2 text-sm"
            disabled={page === 1}
            onClick={() =>
              setPage((current) =>
                Math.max(current - 1, 1)
              )
            }
          >
            <LuChevronLeft className="h-4 w-4" />
          </Button>

          <span>
            Page {page} of {pageCount}
          </span>

          <Button
            variant="ghost"
            className="rounded-full px-3 py-2 text-sm"
            disabled={page === pageCount}
            onClick={() =>
              setPage((current) =>
                Math.min(current + 1, pageCount)
              )
            }
          >
            <LuChevronRight className="h-4 w-4" />
          </Button>

        </div>
      </div>
    </div>
  );
};

export default RecentTasksTable;