import { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar as LuCalendar, CheckCircle2 as LuCheckCircle2, FileInput as LuFileInput, ListChecks as LuListChecks, Plus as LuPlus, Tag as LuTag } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Badge from '../../components/ui/Badge';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS, BASE_URL } from '../../utils/apiPaths';
import { UserContext } from '../../context/userContext';

const CreateTask = () => {
  const navigate = useNavigate();
  const userContext = useContext(UserContext);
  const [members, setMembers] = useState([]);
  const [loadingMembers, setLoadingMembers] = useState(true);

  const [form, setForm] = useState({ title: '', description: '', priority: 'Medium', dueDate: '', assignees: [], tags: [], status: 'Pending' });
  const [selectedMember, setSelectedMember] = useState('');
  const [todos, setTodos] = useState([{ id: Date.now(), text: '' }]);
  const [attachment, setAttachment] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState('');

  const addTodo = () => setTodos((current) => [...current, { id: Date.now(), text: '' }]);
  const updateTodo = (id, text) => setTodos((current) => current.map((item) => (item.id === id ? { ...item, text } : item)));
  const removeTodo = (id) => setTodos((current) => current.filter((item) => item.id !== id));

  const loadMembers = async () => {
    setLoadingMembers(true);
    try {
      const { data } = await axiosInstance.get(API_PATHS.USERS.GET_ALL_USERS);
      setMembers(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to load users', error);
      setMembers([]);
    } finally {
      setLoadingMembers(false);
    }
  };

  useEffect(() => {
    loadMembers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError('');
    setSubmitting(true);

    try {
      const payload = {
        title: form.title,
        description: form.description,
        priority: form.priority,
        dueDate: form.dueDate,
        assignedTo: Array.isArray(form.assignees) ? form.assignees : [],
        attachments: attachment ? [attachment.name] : [],
        status: form.status,
        todoChecklist: todos
          .filter((item) => item.text.trim().length > 0)
          .map((item) => ({ text: item.text.trim(), completed: false })),
      };

      const { data } = await axiosInstance.post(API_PATHS.TASKS.CREATE_TASK, payload);
      if (data?.task) {
        // Navigate based on role: admin goes to admin tasks, members to their tasks
        const dest = (userContext?.user?.role === 'admin') ? '/admin/tasks' : '/user/my-tasks';
        navigate(dest, { replace: true });
      }
    } catch (error) {
      setApiError(error.response?.data?.message || error.message || 'Failed to create task.');
      console.error('Failed to create task', error);
    }
      setSubmitting(false);
  };

  return (
    <DashboardLayout activeMenu="Create Task">
      <div className="space-y-8">
        <div className="rounded-[2rem] border border-slate-200/70 bg-white/95 p-8 shadow-[0_24px_80px_-40px_rgba(15,23,42,0.16)] dark:border-slate-700/70 dark:bg-slate-950/90">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-indigo-600">New Task</p>
              <h1 className="mt-2 text-3xl font-semibold text-slate-950 dark:text-white">Create a priority task in seconds</h1>
            </div>
            <Badge variant="completed">Draft mode</Badge>
          </div>
          <p className="mt-4 max-w-2xl text-sm text-slate-500 dark:text-slate-400">Define task details, assign ownership, and set an actionable timeline for your team.</p>
        </div>

        <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-[1.3fr_0.9fr]">
          <div className="space-y-6 rounded-[2rem] border border-slate-200/70 bg-white/95 p-6 shadow-[0_24px_80px_-40px_rgba(15,23,42,0.14)] dark:border-slate-700/70 dark:bg-slate-950/90">
            <div className="grid gap-5">
              <label className="space-y-3">
                <span className="text-sm font-semibold text-slate-900 dark:text-white">Task title</span>
                <Input value={form.title} onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))} placeholder="Design new onboarding flow" />
              </label>
              <label className="space-y-3">
                <span className="text-sm font-semibold text-slate-900 dark:text-white">Description</span>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
                  rows={5}
                  className="w-full rounded-3xl border border-slate-200 bg-white px-4 py-4 text-sm text-slate-900 outline-none transition duration-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:focus:border-cyan-400 dark:focus:ring-cyan-500/20"
                  placeholder="Write a clear task summary and acceptance criteria."
                />
              </label>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <label className="space-y-3">
                <span className="text-sm font-semibold text-slate-900 dark:text-white">Priority</span>
                <select value={form.priority} onChange={(e) => setForm((prev) => ({ ...prev, priority: e.target.value }))} className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition duration-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:focus:border-cyan-400 dark:focus:ring-cyan-500/20">
                  <option>Low</option>
                  <option>Medium</option>
                  <option>High</option>
                </select>
              </label>
              <label className="space-y-3">
                <span className="text-sm font-semibold text-slate-900 dark:text-white">Due date</span>
                <div className="relative">
                  <LuCalendar className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                  <input type="date" value={form.dueDate} onChange={(e) => setForm((prev) => ({ ...prev, dueDate: e.target.value }))} className="w-full rounded-2xl border border-slate-200 bg-white py-3 pl-12 pr-4 text-sm text-slate-900 outline-none transition duration-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:focus:border-cyan-400 dark:focus:ring-cyan-500/20" />
                </div>
              </label>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-semibold text-slate-900 dark:text-white">Assign members</span>
                    <span className="text-xs text-slate-500 dark:text-slate-400">Select a name then click Add</span>
                  </div>
                  <div className="flex gap-2">
                    <select
                      value={selectedMember}
                      onChange={(e) => setSelectedMember(e.target.value)}
                      className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition duration-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:focus:border-cyan-400 dark:focus:ring-cyan-500/20"
                    >
                      <option value="" disabled>{loadingMembers ? 'Loading members...' : 'Select a team member'}</option>
                      {members.map((member) => (
                        <option key={member._id} value={member._id}>{member.name}</option>
                      ))}
                    </select>
                    <button
                      type="button"
                      onClick={() => {
                        if (!selectedMember) return;
                        if (form.assignees.includes(selectedMember)) return;
                        setForm((prev) => ({ ...prev, assignees: [...prev.assignees, selectedMember] }));
                        setSelectedMember('');
                      }}
                      className="inline-flex items-center gap-2 rounded-2xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white hover:bg-indigo-700"
                    >
                      Add
                    </button>
                  </div>
                  {form.assignees.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {form.assignees.map((memberId) => {
                        const member = members.find((user) => user._id === memberId);
                        const avatarUrl = member?.profileImageUrl
                          ? member.profileImageUrl.startsWith('http')
                            ? member.profileImageUrl
                            : `${BASE_URL}/${member.profileImageUrl}`
                          : null;

                        return (
                          <div key={memberId} className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-100 px-3 py-2 text-sm text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">
                            {avatarUrl ? (
                              <img src={avatarUrl} alt={member?.name} className="h-7 w-7 rounded-full object-cover" />
                            ) : (
                              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-indigo-600 text-xs font-semibold uppercase text-white">
                                {member?.name?.split(' ').map((part) => part[0]).join('').slice(0, 2) || 'U'}
                              </div>
                            )}
                            <span>{member?.name ?? 'Added member'}</span>
                            <button type="button" onClick={() => setForm((prev) => ({ ...prev, assignees: prev.assignees.filter((id) => id !== memberId) }))} className="ml-2 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300">✕</button>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </label>
              </div>
              <label className="space-y-3">
                <span className="text-sm font-semibold text-slate-900 dark:text-white">Status</span>
                <select value={form.status} onChange={(e) => setForm((prev) => ({ ...prev, status: e.target.value }))} className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition duration-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:focus:border-cyan-400 dark:focus:ring-cyan-500/20">
                  <option>Pending</option>
                  <option>In Progress</option>
                  <option>Completed</option>
                </select>
              </label>
            </div>

            <div className="rounded-[1.75rem] border border-slate-200/70 bg-slate-50 p-5 dark:border-slate-700/70 dark:bg-slate-900">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h2 className="text-base font-semibold text-slate-950 dark:text-white">Todo checklist</h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Add actionable steps for this task.</p>
                </div>
                <button type="button" onClick={addTodo} className="inline-flex items-center gap-2 rounded-full bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700">
                  <LuPlus className="h-4 w-4" /> Add item
                </button>
              </div>
              <div className="space-y-4">
                {todos.map((item, index) => (
                  <div key={item.id} className="flex items-center gap-3 rounded-3xl bg-white p-4 shadow-sm dark:bg-slate-950">
                    <input type="checkbox" id={`todo-${item.id}`} className="h-5 w-5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" />
                    <input value={item.text} onChange={(e) => updateTodo(item.id, e.target.value)} placeholder={`Step ${index + 1}`} className="flex-1 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition duration-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:focus:border-cyan-400 dark:focus:ring-cyan-500/20" />
                    {todos.length > 1 && (
                      <button type="button" onClick={() => removeTodo(item.id)} className="rounded-full bg-slate-100 px-3 py-2 text-slate-600 transition hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700">Remove</button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6 rounded-[2rem] border border-slate-200/70 bg-white/95 p-6 shadow-[0_24px_80px_-40px_rgba(15,23,42,0.14)] dark:border-slate-700/70 dark:bg-slate-950/90">
            <div className="space-y-5">
              <div className="flex items-center gap-3">
                <div className="grid h-12 w-12 place-items-center rounded-3xl bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                  <LuFileInput className="h-6 w-6" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-slate-950 dark:text-white">Attachments</h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Upload files to keep stakeholders aligned.</p>
                </div>
              </div>
              <label className="group block rounded-3xl border border-dashed border-slate-300 bg-slate-50 px-5 py-8 text-center transition hover:border-indigo-500 hover:bg-white dark:border-slate-700 dark:bg-slate-900 dark:hover:border-cyan-400">
                <input type="file" hidden onChange={(e) => setAttachment(e.target.files?.[0] ?? null)} />
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-3xl bg-indigo-600 text-white">
                  <LuTag className="h-6 w-6" />
                </div>
                <p className="mt-4 text-sm font-semibold text-slate-900 dark:text-white">Drop or choose a file</p>
                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">PNG, PDF, DOCX up to 10MB</p>
              </label>
              {attachment && <p className="text-sm text-slate-600 dark:text-slate-300">Selected file: {attachment.name}</p>}
            </div>

            <div className="space-y-4 rounded-[1.75rem] border border-slate-200/70 bg-slate-50 p-5 dark:border-slate-700/70 dark:bg-slate-900">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-semibold text-slate-950 dark:text-white">Tags</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Add labels to keep priorities visible.</p>
                </div>
                <Badge variant="medium">{form.tags.length} tags</Badge>
              </div>
              <div className="flex flex-wrap gap-3">
                {form.tags.map((tag) => (
                  <span key={tag} className="rounded-2xl bg-indigo-50 px-4 py-2 text-sm font-semibold text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-100">{tag}</span>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            {apiError && (
              <div className="rounded-3xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                {apiError}
              </div>
            )}
            <Button type="submit" variant="primary" className="w-full" disabled={submitting}>
              {submitting ? 'Saving...' : 'Save task'}
            </Button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default CreateTask;