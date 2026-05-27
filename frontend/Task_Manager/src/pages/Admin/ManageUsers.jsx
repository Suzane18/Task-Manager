import { useMemo, useState } from 'react';
import { Search as LuSearch, Plus as LuPlus } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import TeamMemberCard from '../../components/dashboard/TeamMemberCard';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Modal from '../../components/ui/Modal';

const ManageUsers = () => {
  const [members] = useState([]);

  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);

  const filtered = useMemo(
    () => members.filter((member) => member.name.toLowerCase().includes(query.toLowerCase()) || member.email.toLowerCase().includes(query.toLowerCase())),
    [members, query],
  );

  return (
    <DashboardLayout activeMenu="Team Members">
      <div className="space-y-8">
        <div className="rounded-[2rem] border border-slate-200/70 bg-white/95 p-8 shadow-[0_24px_80px_-40px_rgba(15,23,42,0.16)] dark:border-slate-700/70 dark:bg-slate-950/90">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-indigo-600">Team Members</p>
              <h1 className="mt-2 text-3xl font-semibold text-slate-950 dark:text-white">A polished overview of your team.</h1>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button variant="secondary" className="inline-flex items-center gap-2">
                <LuSearch className="h-4 w-4" /> Search
              </Button>
              <Button variant="primary" className="inline-flex items-center gap-2" onClick={() => setOpen(true)}>
                <LuPlus className="h-4 w-4" /> Add member
              </Button>
            </div>
          </div>
          <p className="mt-4 max-w-2xl text-sm text-slate-500 dark:text-slate-400">Search active collaborators, invite new contributors, and review assignment load.</p>
        </div>

        <div className="rounded-[2rem] border border-slate-200/70 bg-white/95 p-6 shadow-[0_24px_80px_-40px_rgba(15,23,42,0.14)] dark:border-slate-700/70 dark:bg-slate-950/90">
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative w-full max-w-md">
              <LuSearch className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
              <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search team members" className="pl-11" />
            </div>
            <div className="text-sm text-slate-500 dark:text-slate-400">{filtered.length} members found</div>
          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {filtered.map((member) => (
              <TeamMemberCard key={member.id} member={member} />
            ))}
          </div>
        </div>
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title="Invite new member">
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="space-y-2 text-sm text-slate-700 dark:text-slate-200">
              Name
              <Input placeholder="Name" />
            </label>
            <label className="space-y-2 text-sm text-slate-700 dark:text-slate-200">
              Email
              <Input placeholder="Email" type="email" />
            </label>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="space-y-2 text-sm text-slate-700 dark:text-slate-200">
              Role
              <select className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition duration-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:focus:border-cyan-400 dark:focus:ring-cyan-500/20">
                <option>Engineer</option>
                <option>Designer</option>
                <option>Product</option>
                <option>QA</option>
              </select>
            </label>
            <label className="space-y-2 text-sm text-slate-700 dark:text-slate-200">
              Status
              <select className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition duration-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:focus:border-cyan-400 dark:focus:ring-cyan-500/20">
                <option>Online</option>
                <option>Offline</option>
              </select>
            </label>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Button variant="primary" className="w-full">Send invite</Button>
            <Button variant="secondary" className="w-full" onClick={() => setOpen(false)}>Cancel</Button>
          </div>
        </div>
      </Modal>
    </DashboardLayout>
  );
};

export default ManageUsers;