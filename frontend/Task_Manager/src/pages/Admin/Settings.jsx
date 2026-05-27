import { ShieldCheck as LuShieldCheck, UserCog as LuUserCog, SlidersHorizontal as LuSlidersHorizontal } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';

const settingsData = [
  {
    title: 'Account settings',
    description: 'Manage your profile, security options and billing details.',
    icon: LuUserCog,
    value: 'Secure account',
  },
  {
    title: 'Workspace control',
    description: 'Control team access, notifications and workspace preferences.',
    icon: LuSlidersHorizontal,
    value: 'Team ready',
  },
  {
    title: 'Security & compliance',
    description: 'Keep login, MFA and role policies in sync with your team.',
    icon: LuShieldCheck,
    value: 'Protected',
  },
];

const Settings = () => {
  return (
    <DashboardLayout activeMenu="Settings">
      <div className="space-y-8">
        <div className="rounded-[2rem] border border-slate-200/70 bg-white/95 p-8 shadow-[0_24px_80px_-40px_rgba(15,23,42,0.16)] dark:border-slate-700/70 dark:bg-slate-950/90">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-indigo-600">Settings</p>
          <h1 className="mt-3 text-3xl font-semibold text-slate-950 dark:text-white">Build a tailored workspace for your team.</h1>
          <p className="mt-4 max-w-2xl text-sm text-slate-500 dark:text-slate-400">Use these controls to adjust permissions, notifications, workspace preferences, and security settings.</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {settingsData.map((item) => (
            <Card key={item.title} className="space-y-5">
              <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-indigo-500/10 text-indigo-600 dark:bg-indigo-500/15 dark:text-indigo-300">
                <item.icon className="h-6 w-6" />
              </div>
              <div className="space-y-2">
                <h2 className="text-lg font-semibold text-slate-950 dark:text-white">{item.title}</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">{item.description}</p>
              </div>
              <div className="flex items-center justify-between">
                <Badge variant="admin">{item.value}</Badge>
                <Button variant="ghost" className="rounded-full px-4 py-2 text-sm">Manage</Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Settings;
