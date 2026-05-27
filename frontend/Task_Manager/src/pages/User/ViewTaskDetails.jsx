import { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Badge from '../../components/ui/Badge';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS, BASE_URL } from '../../utils/apiPaths';
import { UserContext } from '../../context/userContext';

const ViewTaskDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(UserContext);

  const [members, setMembers] = useState([]);
  const [loadingMembers, setLoadingMembers] = useState(true);
  const [loadingTask, setLoadingTask] = useState(true);

  const [form, setForm] = useState({ title: '', description: '', priority: 'Medium', dueDate: '', assignees: [], tags: [], status: 'Pending' });
  const [todos, setTodos] = useState([]);
  const [attachment, setAttachment] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState('');
  const [success, setSuccess] = useState('');
  const [selectedMember, setSelectedMember] = useState('');

  const loadMembers = async () => {
    setLoadingMembers(true);
    try {
      const { data } = await axiosInstance.get(API_PATHS.USERS.GET_ALL_USERS);
      setMembers(Array.isArray(data) ? data : []);
    } catch (error) {
      setMembers([]);
    } finally {
      setLoadingMembers(false);
    }
  };

  const loadTask = async () => {
    setLoadingTask(true);
    try {
      const { data } = await axiosInstance.get(API_PATHS.TASKS.GET_TASK_BY_ID(id));
      if (data) {
        setForm({
          title: data.title || '',
          description: data.description || '',
          priority: data.priority || 'Medium',
          dueDate: data.dueDate ? data.dueDate.split('T')[0] : '',
          assignees: Array.isArray(data.assignedTo) ? data.assignedTo.map((u) => u._id || u) : [],
          tags: data.tags || [],
          status: data.status || 'Pending',
          attachments: data.attachments || [],
        });
        setTodos(data.todoChecklist || []);
      }
    } catch (error) {
      setApiError('Failed to load task details.');
    } finally {
      setLoadingTask(false);
    }
  };

  useEffect(() => {
    loadMembers();
    if (id) loadTask();
    // eslint-disable-next-line
  }, [id]);

  // Only allow checklist update
  const handleChecklistChange = async (index, checked) => {
    const updatedTodos = todos.map((item, i) => i === index ? { ...item, completed: checked } : item);
    setTodos(updatedTodos);
    setSubmitting(true);
    setApiError('');
    setSuccess('');
    try {
      const payload = { todoChecklist: updatedTodos };
      const { data } = await axiosInstance.put(API_PATHS.TASKS.UPDATE_TASK_CHECKLIST(id), payload);
      if (data?.updatedTask) {
        setTodos(data.updatedTask.todoChecklist || []);
        setForm((prev) => ({ ...prev, status: data.updatedTask.status || prev.status }));
        setSuccess('Checklist updated');
      }
    } catch (error) {
      setApiError(error.response?.data?.message || error.message || 'Failed to update checklist.');
    }
    setSubmitting(false);
  };

  if (loadingTask) return (
    <DashboardLayout activeMenu="Task Details">
      <div className="p-8">Loading...</div>
    </DashboardLayout>
  );

  return (
    <DashboardLayout activeMenu="Task Details">
      <div className="space-y-8">
        <div className="rounded-[2rem] border border-slate-200/70 bg-white/95 p-6 shadow-[0_24px_80px_-40px_rgba(15,23,42,0.14)] dark:border-slate-700/70 dark:bg-slate-950/90">
          <h2 className="text-xl font-semibold mb-2 text-slate-950 dark:text-white">{form.title}</h2>
          <p className="mb-4 text-slate-600 dark:text-slate-300">{form.description}</p>
          <div className="mb-2 flex gap-4 text-sm flex-wrap">
            <span className="font-semibold">Priority:</span> <span>{form.priority}</span>
            <span className="font-semibold">Due:</span> <span>{form.dueDate}</span>
            <span className="font-semibold">Status:</span> <span>{form.status}</span>
          </div>
          <div className="mb-2 flex gap-4 text-sm flex-wrap">
            <span className="font-semibold">Tags:</span>
            {form.tags && form.tags.length > 0 ? (
              form.tags.map((tag) => (
                <span key={tag} className="rounded-2xl bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-100 mr-2">{tag}</span>
              ))
            ) : (
              <span className="text-slate-400">None</span>
            )}
          </div>
          <div className="mb-2 flex gap-4 text-sm flex-wrap items-center">
            <span className="font-semibold">Assignees:</span>
            {members && form.assignees && form.assignees.length > 0 ? (
              form.assignees.map((memberId) => {
                const member = members.find((user) => user._id === memberId);
                return (
                  <span key={memberId} className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-100 px-2 py-1 text-xs text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 mr-2">
                    {member?.name || 'Member'}
                  </span>
                );
              })
            ) : (
              <span className="text-slate-400">None</span>
            )}
          </div>
          <div className="mb-6 flex gap-4 text-sm flex-wrap items-center">
            <span className="font-semibold">Attachments:</span>
            {/* Show attachment names if any (read-only) */}
            {Array.isArray(form.attachments) && form.attachments.length > 0 ? (
              form.attachments.map((file, idx) => (
                <span key={idx} className="rounded bg-slate-100 px-2 py-1 text-xs text-slate-700 dark:bg-slate-800 dark:text-slate-200 mr-2">{file}</span>
              ))
            ) : (
              <span className="text-slate-400">None</span>
            )}
          </div>
          <div className="mb-6">
            <h3 className="text-base font-semibold text-slate-950 dark:text-white mb-2">Todo checklist</h3>
            <div className="space-y-4">
              {todos.map((item, index) => (
                <div key={item.id || index} className="flex items-center gap-3 rounded-3xl bg-white p-4 shadow-sm dark:bg-slate-950">
                  <input
                    type="checkbox"
                    checked={!!item.completed}
                    onChange={(e) => handleChecklistChange(index, e.target.checked)}
                    className="h-5 w-5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                    disabled={submitting}
                  />
                  <span className="flex-1 text-slate-900 dark:text-slate-100">{item.text}</span>
                </div>
              ))}
            </div>
          </div>
          {apiError && (
            <div className="rounded-3xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{apiError}</div>
          )}
          {success && (
            <div className="mb-4 rounded-3xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700">{success}</div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ViewTaskDetails;