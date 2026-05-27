const STYLE_MAP = {
  pending: 'bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-200',
  'in progress': 'bg-sky-100 text-sky-700 dark:bg-sky-500/15 dark:text-sky-200',
  completed: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-200',
  high: 'bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-200',
  medium: 'bg-violet-100 text-violet-700 dark:bg-violet-500/15 dark:text-violet-200',
  low: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-500/15 dark:text-cyan-200',
  admin: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-200',
};

const Badge = ({ children, variant = 'primary', className = '' }) => {
  return (
    <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] ${STYLE_MAP[variant?.toLowerCase()] || 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200'} ${className}`}>
      {children}
    </span>
  );
};

export default Badge;
