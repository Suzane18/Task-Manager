import { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import {
  Calendar as LuCalendar,
  FileInput as LuFileInput,
  Tag as LuTag
} from 'lucide-react';

import DashboardLayout from '../../components/layout/DashboardLayout';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Badge from '../../components/ui/Badge';

import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS, BASE_URL } from '../../utils/apiPaths';

import { UserContext } from '../../context/userContext';

const EditTask = () => {
  const { id } = useParams();
  const { user } = useContext(UserContext);

  const [members, setMembers] = useState([]);
  const [loadingMembers, setLoadingMembers] = useState(true);
  const [loadingTask, setLoadingTask] = useState(true);

  const [form, setForm] = useState({
    title: '',
    description: '',
    priority: 'Medium',
    dueDate: '',
    assignees: [],
    tags: [],
    status: 'Pending',
  });

  const [todos, setTodos] = useState([]);
  const [attachment, setAttachment] = useState(null);

  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState('');
  const [success, setSuccess] = useState('');

  const [selectedMember, setSelectedMember] = useState('');

  // ================= LOAD MEMBERS =================

  const loadMembers = async () => {
    setLoadingMembers(true);

    try {
      const { data } = await axiosInstance.get(
        API_PATHS.USERS.GET_ALL_USERS
      );

      setMembers(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to load users', error);
      setMembers([]);
    } finally {
      setLoadingMembers(false);
    }
  };

  // ================= LOAD TASK =================

  const loadTask = async () => {
    setLoadingTask(true);

    try {
      console.log('Loading task ID:', id);

      const { data } = await axiosInstance.get(
        API_PATHS.TASKS.GET_TASK_BY_ID(id)
      );

      console.log('Task Response:', data);

      // supports:
      // { task: {...} }
      // OR direct task object
      const task = data?.task || data;

      if (!task) {
        setApiError('Task not found');
        return;
      }

      setForm({
        title: task.title || '',
        description: task.description || '',
        priority: task.priority || 'Medium',

        dueDate: task.dueDate
          ? new Date(task.dueDate)
              .toISOString()
              .split('T')[0]
          : '',

        assignees: Array.isArray(task.assignedTo)
          ? task.assignedTo.map((u) => u._id || u)
          : [],

        tags: task.tags || [],

        status: task.status || 'Pending',
      });

      setTodos(
        Array.isArray(task.todoChecklist)
          ? task.todoChecklist
          : []
      );

    } catch (error) {
      console.error('Failed to load task', error);

      setApiError(
        error.response?.data?.message ||
        'Failed to load task'
      );
    } finally {
      setLoadingTask(false);
    }
  };

  useEffect(() => {
    loadMembers();

    if (id) {
      loadTask();
    }
  }, [id]);

  // ================= UPDATE TASK =================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setSubmitting(true);
    setApiError('');
    setSuccess('');

    try {
      const payload = {
        title: form.title,
        description: form.description,
        priority: form.priority,
        dueDate: form.dueDate,

        assignedTo: form.assignees,

        attachments: attachment
          ? [attachment.name]
          : [],

        status: form.status,

        todoChecklist: todos
          .filter(
            (item) =>
              item.text &&
              item.text.trim().length > 0
          )
          .map((item) => ({
            text: item.text.trim(),
            completed: !!item.completed,
          })),
      };

      const { data } = await axiosInstance.put(
        API_PATHS.TASKS.UPDATE_TASK(id),
        payload
      );

      console.log('Updated Task:', data);

      setSuccess(
        data?.message || 'Task updated successfully'
      );

    } catch (error) {
      console.error('Update Error:', error);

      setApiError(
        error.response?.data?.message ||
        'Failed to update task'
      );
    } finally {
      setSubmitting(false);
    }
  };

  // ================= LOADING =================

  if (loadingTask) {
    return (
      <DashboardLayout activeMenu="Edit Task">
        <div className="p-8 text-lg font-semibold">
          Loading task...
        </div>
      </DashboardLayout>
    );
  }

  // ================= UI =================

  return (
  <DashboardLayout activeMenu="Edit Task">
    <div className="space-y-8 text-white">
      <form
        onSubmit={handleSubmit}
        className="grid gap-6 lg:grid-cols-[1.3fr_0.9fr]"
      >
        {/* LEFT SIDE */}

        <div className="space-y-6 rounded-[2rem] border border-slate-800 bg-[#0f172a] p-6 shadow-2xl">
          {/* TITLE */}

          <div className="grid gap-5">
            <label className="space-y-3">
              <span className="text-sm font-semibold text-slate-200">
                Task title
              </span>

              <Input
                value={form.title}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    title: e.target.value,
                  }))
                }
                placeholder="Task title"
              />
            </label>

            {/* DESCRIPTION */}

            <label className="space-y-3">
              <span className="text-sm font-semibold text-slate-200">
                Description
              </span>

              <textarea
                rows={5}
                value={form.description}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                className="w-full rounded-3xl border border-slate-700 bg-[#020617] px-4 py-4 text-sm text-white outline-none transition-all focus:border-indigo-500"
                placeholder="Task description"
              />
            </label>
          </div>

          {/* PRIORITY + DATE */}

          <div className="grid gap-5 sm:grid-cols-2">
            <label className="space-y-3">
              <span className="text-sm font-semibold text-slate-200">
                Priority
              </span>

              <select
                value={form.priority}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    priority: e.target.value,
                  }))
                }
                className="w-full rounded-2xl border border-slate-700 bg-[#020617] px-4 py-3 text-sm text-white outline-none transition-all focus:border-indigo-500"
              >
                <option className="bg-slate-900">Low</option>
                <option className="bg-slate-900">Medium</option>
                <option className="bg-slate-900">High</option>
              </select>
            </label>

            <label className="space-y-3">
              <span className="text-sm font-semibold text-slate-200">
                Due Date
              </span>

              <div className="relative">
                <LuCalendar className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

                <input
                  type="date"
                  value={form.dueDate}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      dueDate: e.target.value,
                    }))
                  }
                  className="w-full rounded-2xl border border-slate-700 bg-[#020617] py-3 pl-12 pr-4 text-sm text-white outline-none transition-all focus:border-indigo-500"
                />
              </div>
            </label>
          </div>

          {/* TODO CHECKLIST */}

          <div className="rounded-[1.75rem] border border-slate-800 bg-[#111827] p-5">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-base font-semibold text-white">
                Todo Checklist
              </h2>

              <button
                type="button"
                onClick={() =>
                  setTodos((prev) => [
                    ...prev,
                    { text: '', completed: false },
                  ])
                }
                className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-700"
              >
                + Add Todo
              </button>
            </div>

            <div className="space-y-4">
              {todos.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 rounded-3xl border border-slate-800 bg-[#020617] p-4"
                >
                  <input
                    type="checkbox"
                    checked={!!item.completed}
                    onChange={(e) =>
                      setTodos((cur) =>
                        cur.map((it, i) =>
                          i === index
                            ? {
                                ...it,
                                completed: e.target.checked,
                              }
                            : it
                        )
                      )
                    }
                    className="h-5 w-5 accent-indigo-600"
                  />

                  <input
                    value={item.text}
                    onChange={(e) =>
                      setTodos((cur) =>
                        cur.map((it, i) =>
                          i === index
                            ? {
                                ...it,
                                text: e.target.value,
                              }
                            : it
                        )
                      )
                    }
                    placeholder={`Step ${index + 1}`}
                    className="flex-1 rounded-2xl border border-slate-700 bg-[#0f172a] px-4 py-3 text-sm text-white outline-none focus:border-indigo-500"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setTodos((prev) =>
                        prev.filter((_, i) => i !== index)
                      )
                    }
                    className="rounded-xl bg-red-500/10 px-3 py-2 text-sm text-red-300 hover:bg-red-500/20"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT SIDE */}

        <div className="space-y-6 rounded-[2rem] border border-slate-800 bg-[#0f172a] p-6 shadow-2xl">
          {/* ATTACHMENTS */}

          <div className="space-y-5">
            <div className="flex items-center gap-3">
              <div className="grid h-12 w-12 place-items-center rounded-3xl bg-slate-800">
                <LuFileInput className="h-6 w-6 text-white" />
              </div>

              <div>
                <h2 className="text-lg font-semibold text-white">
                  Attachments
                </h2>
              </div>
            </div>

            <label className="block rounded-3xl border border-dashed border-slate-700 bg-[#111827] px-5 py-8 text-center transition-all hover:border-indigo-500">
              <input
                type="file"
                hidden
                onChange={(e) =>
                  setAttachment(e.target.files?.[0] ?? null)
                }
              />

              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-3xl bg-indigo-600 text-white">
                <LuTag className="h-6 w-6" />
              </div>

              <p className="mt-4 text-sm font-semibold text-white">
                Upload File
              </p>
            </label>

            {attachment && (
              <p className="text-sm text-slate-300">
                Selected: {attachment.name}
              </p>
            )}
          </div>

          {/* MEMBERS */}

          <div className="space-y-4 rounded-[1.75rem] border border-slate-800 bg-[#111827] p-5">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-semibold text-white">
                Assign Members
              </h3>

              <Badge variant="medium">
                {form.assignees.length} members
              </Badge>
            </div>

            <div className="flex gap-2">
              <select
                value={selectedMember}
                onChange={(e) =>
                  setSelectedMember(e.target.value)
                }
                className="w-full rounded-2xl border border-slate-700 bg-[#020617] px-4 py-3 text-sm text-white outline-none transition-all focus:border-indigo-500"
              >
                <option value="" className="bg-slate-900">
                  {loadingMembers
                    ? 'Loading...'
                    : 'Select member'}
                </option>

                {members.map((member) => (
                  <option
                    key={member._id}
                    value={member._id}
                    className="bg-slate-900"
                  >
                    {member.name}
                  </option>
                ))}
              </select>

              <button
                type="button"
                onClick={() => {
                  if (!selectedMember) return;

                  if (
                    form.assignees.includes(
                      selectedMember
                    )
                  )
                    return;

                  setForm((prev) => ({
                    ...prev,
                    assignees: [
                      ...prev.assignees,
                      selectedMember,
                    ],
                  }));

                  setSelectedMember('');
                }}
                className="rounded-2xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700"
              >
                Add
              </button>
            </div>

            {/* ASSIGNED USERS */}

            {form.assignees.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {form.assignees.map((memberId) => {
                  const member = members.find(
                    (u) => u._id === memberId
                  );

                  const avatarUrl =
                    member?.profileImageUrl
                      ? member.profileImageUrl.startsWith(
                          'http'
                        )
                        ? member.profileImageUrl
                        : `${BASE_URL}/${member.profileImageUrl}`
                      : null;

                  return (
                    <div
                      key={memberId}
                      className="inline-flex items-center gap-2 rounded-full border border-slate-700 bg-[#020617] px-3 py-2 text-sm text-white"
                    >
                      {avatarUrl ? (
                        <img
                          src={avatarUrl}
                          alt={member?.name}
                          className="h-7 w-7 rounded-full object-cover"
                        />
                      ) : (
                        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-indigo-600 text-xs font-semibold uppercase text-white">
                          {member?.name
                            ?.split(' ')
                            .map((part) => part[0])
                            .join('')
                            .slice(0, 2) || 'U'}
                        </div>
                      )}

                      <span>{member?.name}</span>

                      <button
                        type="button"
                        onClick={() =>
                          setForm((prev) => ({
                            ...prev,
                            assignees:
                              prev.assignees.filter(
                                (id) =>
                                  id !== memberId
                              ),
                          }))
                        }
                        className="text-red-300 hover:text-red-400"
                      >
                        ✕
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* FOOTER */}

        <div className="lg:col-span-2">
          {apiError && (
            <div className="mb-4 rounded-3xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-300">
              {apiError}
            </div>
          )}

          {success && (
            <div className="mb-4 rounded-3xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-sm text-emerald-300">
              {success}
            </div>
          )}

          <Button
            type="submit"
            variant="primary"
            className="w-full"
            disabled={submitting}
          >
            {submitting
              ? 'Saving...'
              : 'Save Changes'}
          </Button>
        </div>
      </form>
    </div>
  </DashboardLayout>
);
};

export default EditTask;