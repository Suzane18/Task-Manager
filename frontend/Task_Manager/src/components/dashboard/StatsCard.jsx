import { motion } from 'framer-motion';
import Badge from '../ui/Badge';

const StatsCard = ({ title, value, icon: Icon, trend, accent, description }) => {
  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ duration: 0.25 }}
      className="group overflow-hidden rounded-[2rem] border border-slate-200/70 bg-white/95 p-6 shadow-[0_24px_80px_-32px_rgba(15,23,42,0.18)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_90px_-32px_rgba(15,23,42,0.24)] dark:border-slate-700/70 dark:bg-slate-950/95"
    >
      <div className="flex items-center justify-between gap-4">
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">{title}</h4>
          <p className="mt-3 text-3xl font-semibold text-slate-950 dark:text-white">{value}</p>
        </div>
        <div className={`relative inline-flex h-14 w-14 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br ${accent} text-white shadow-lg shadow-slate-400/10`}>
          <div className="absolute inset-0 opacity-30 blur-2xl" />
          <Icon className="relative h-6 w-6" />
        </div>
      </div>
      <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <Badge variant={trend.variant}>{trend.label}</Badge>
        <p className="text-sm text-slate-500 dark:text-slate-400">{description}</p>
      </div>
    </motion.div>
  );
};

export default StatsCard;
