import { useContext, useState, useEffect } from 'react';
import { Pencil, UploadCloud, Trash2, UserCircle2 } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS, BASE_URL } from '../../utils/apiPaths';
import { UserContext } from '../../context/userContext';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const { user, updateUser, clearUser } = useContext(UserContext);
  const [name, setName] = useState(user?.name || '');
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState('');
  const [deleting, setDeleting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('name', name);
      if (file) formData.append('profileImage', file);

      const { data } = await axiosInstance.put(API_PATHS.USERS.UPDATE_PROFILE, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const token = localStorage.getItem('token');
      if (data?.user) updateUser({ ...data.user, token });
      setSuccess('Profile updated successfully');
      // clear selected file and preview after successful upload
      setFile(null);
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
        setPreviewUrl(null);
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to update profile');
    }
    setSubmitting(false);
  };

  const handleRemoveImage = async () => {
    setSubmitting(true);
    setSuccess('');
    try {
      const { data } = await axiosInstance.delete(API_PATHS.USERS.REMOVE_PROFILE_IMAGE);
      const token = localStorage.getItem('token');
      if (data?.user) updateUser({ ...data.user, token });
      setSuccess('Profile image removed');
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
        setPreviewUrl(null);
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to remove image');
    }
    setSubmitting(false);
  };

  // create a preview URL when a new file is selected
  useEffect(() => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const isDirty = (name !== (user?.name || '')) || !!file;

  return (
    <DashboardLayout activeMenu="Profile">
      <div className="space-y-6">
        <Card className="p-6">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-3">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-indigo-600">Account</p>
              <h2 className="text-2xl font-semibold text-slate-950 dark:text-white">Profile settings</h2>
              <p className="text-sm text-slate-700 dark:text-slate-300">Update your display name and profile image for your account.</p>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-4 py-3 text-sm font-semibold text-slate-950 dark:bg-slate-800 dark:text-white">
              <UserCircle2 className="h-5 w-5" />
              Personalized profile
            </div>
          </div>
        </Card>

        <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <Card className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-semibold text-slate-950 dark:text-white">Profile details</h3>
                  <p className="text-sm text-slate-950 dark:text-white">Your name and email are visible to your team.</p>
                </div>
                <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-2 text-sm text-slate-950 dark:bg-slate-800 dark:text-white">
                  <Pencil className="h-4 w-4" /> Edit details
                </div>
              </div>

              <label className="block">
                <span className="text-sm font-semibold text-slate-950 dark:text-white">Name</span>
                <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter your display name" />
              </label>

              <label className="block">
                <span className="text-sm font-semibold text-slate-950 dark:text-white">Email</span>
                <div className="mt-2 rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-950 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100">
                  {user?.email || 'No email available'}
                </div>
              </label>
            </div>
          </Card>

          <Card className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-semibold text-slate-950 dark:text-white">Avatar</h3>
                  <p className="text-sm text-slate-950 dark:text-white">Upload a profile image or remove the current one.</p>
                </div>
                <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-2 text-sm text-slate-950 dark:bg-slate-800 dark:text-white">
                  <UploadCloud className="h-4 w-4" /> Upload
                </div>
              </div>

              <div className="flex flex-col items-center gap-4 rounded-[1.75rem] border border-slate-200 bg-slate-50 p-5 text-center dark:border-slate-700 dark:bg-slate-900">
                {previewUrl ? (
                  <img src={previewUrl} alt="avatar preview" className="h-24 w-24 rounded-full object-cover" />
                ) : user?.profileImageUrl ? (
                  <img src={(user.profileImageUrl?.startsWith('http') ? user.profileImageUrl : `${BASE_URL}${user.profileImageUrl}`)} alt="avatar" className="h-24 w-24 rounded-full object-cover" />
                ) : (
                  <div className="grid h-24 w-24 place-items-center rounded-full bg-indigo-600 text-3xl font-semibold text-white">
                    {user?.name?.split(' ').map((part) => part[0]).join('').slice(0, 2).toUpperCase()}
                  </div>
                )}
                <div className="space-y-2">
                  <p className="text-sm font-semibold text-slate-950 dark:text-white">Current avatar</p>
                  <p className="text-sm text-slate-950 dark:text-white">Upload a new image to personalize your account.</p>
                </div>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <label className="inline-flex cursor-pointer items-center justify-center rounded-full border border-dashed border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-950 transition hover:border-indigo-500 hover:text-indigo-600 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:hover:border-cyan-400">
                    <UploadCloud className="mr-2 h-4 w-4" />
                    Choose file
                    <input type="file" accept="image/*" className="sr-only" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
                  </label>
                  {file && <div className="text-sm text-slate-950 dark:text-white">{file.name}</div>}
                  <button type="button" onClick={handleRemoveImage} disabled={submitting || !user?.profileImageUrl} className="inline-flex items-center justify-center rounded-full bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-600 transition hover:bg-rose-100 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-rose-500/10 dark:text-rose-100 dark:hover:bg-rose-500/20">
                    <Trash2 className="mr-2 h-4 w-4" /> Remove image
                  </button>
                </div>
              </div>
            </div>
          </Card>

          <div className="lg:col-span-2">
            {error && <div className="rounded-3xl border border-rose-200 bg-rose-50 p-4 text-sm font-medium text-rose-700">{error}</div>}
            {success && <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-medium text-emerald-700">{success}</div>}
            <Button type="submit" disabled={submitting} variant="primary" className="mt-3 w-full sm:w-auto">
              {submitting ? 'Saving...' : 'Save changes'}
            </Button>
            
            <div className="mt-6 rounded-[1.75rem] border border-slate-200/70 bg-white/95 p-5 dark:border-slate-700/70 dark:bg-slate-950/90">
              <h3 className="text-lg font-semibold text-slate-950 dark:text-white">Danger zone</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">Delete your account permanently. This action cannot be undone.</p>
              <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
                <input value={deleteConfirm} onChange={(e) => setDeleteConfirm(e.target.value)} placeholder="Type delete to confirm" className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100" />
                <button
                  type="button"
                  onClick={async () => {
                    if (deleteConfirm.trim().toLowerCase() !== 'delete') return;
                    setDeleting(true);
                    try {
                      await axiosInstance.delete(API_PATHS.USERS.DELETE_PROFILE);
                      // clear user and token then navigate to login
                      clearUser();
                      navigate('/login');
                    } catch (err) {
                      setError(err.response?.data?.message || err.message || 'Failed to delete account');
                    }
                    setDeleting(false);
                  }}
                  disabled={deleting || deleteConfirm.trim().toLowerCase() !== 'delete'}
                  className="inline-flex items-center justify-center rounded-2xl bg-rose-600 px-4 py-3 text-sm font-semibold text-white hover:bg-rose-700 disabled:opacity-50"
                >
                  {deleting ? 'Deleting...' : 'Delete account'}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default Profile;
