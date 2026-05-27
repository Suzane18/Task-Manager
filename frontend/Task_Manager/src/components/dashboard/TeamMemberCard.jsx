import Badge from '../ui/Badge';

const TeamMemberCard = ({ member }) => {
  return (
    <div className="rounded-[2rem] border border-slate-200/70 bg-white/95 p-6 shadow-[0_24px_60px_-32px_rgba(15,23,42,0.18)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_80px_-32px_rgba(15,23,42,0.22)] dark:border-slate-700/70 dark:bg-slate-950/95">
      <div className="mb-5 flex items-center gap-4">
        <div className="relative flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br from-indigo-500 to-cyan-500 text-white shadow-lg shadow-cyan-500/20">
          <span className="text-xl font-semibold">{member.initials}</span>
          <span className={`absolute -right-1 -top-1 inline-flex h-3.5 w-3.5 rounded-full ${member.status === 'Online' ? 'bg-emerald-400' : 'bg-amber-400'}`} />
        </div>
        <div>
          <h4 className="text-lg font-semibold text-slate-950 dark:text-white">{member.name}</h4>
          <p className="text-sm text-slate-500 dark:text-slate-400">{member.email}</p>
        </div>
      </div>
      <div className="mb-5 flex flex-wrap gap-2">
        <Badge variant={member.role.toLowerCase()}>{member.role}</Badge>
        <Badge variant={member.status === 'Online' ? 'completed' : 'pending'}>{member.status}</Badge>
      </div>
      <div className="grid gap-3 rounded-3xl bg-slate-50 p-4 text-sm dark:bg-slate-900">
        <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
          <span>Assigned tasks</span>
          <span className="font-semibold text-slate-900 dark:text-white">{member.tasks}</span>
        </div>
        <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
          <span>Completion</span>
          <span className="font-semibold text-slate-900 dark:text-white">{member.completion}%</span>
        </div>
      </div>
      <div className="rounded-3xl bg-slate-100 p-4 dark:bg-slate-900">
        <div className="mb-2 flex items-center justify-between text-xs uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">
          <span>Focus load</span>
          <span>{member.completion}%</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
          <div className="h-full rounded-full bg-gradient-to-r from-indigo-600 to-cyan-500" style={{ width: `${member.completion}%` }} />
        </div>
      </div>
    </div>
  );
};

export default TeamMemberCard;
