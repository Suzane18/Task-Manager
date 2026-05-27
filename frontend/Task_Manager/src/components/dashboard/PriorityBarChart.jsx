import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from 'recharts';

const BAR_COLORS = ['#84CC16', '#8B5CF6', '#06B6D4'];

const PriorityBarChart = ({ data }) => {
  return (
    <div className="h-[360px] w-full overflow-hidden rounded-[2rem] border border-slate-200/70 bg-white/95 p-6 shadow-[0_24px_80px_-40px_rgba(15,23,42,0.16)] transition duration-300 hover:-translate-y-1 dark:border-slate-700/70 dark:bg-slate-950/95">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h3 className="text-base font-semibold text-slate-900 dark:text-white">Priority Levels</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">Urgency breakdown with high-fidelity trends.</p>
        </div>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-slate-600 dark:bg-slate-800 dark:text-slate-300">Priority</span>
      </div>
      <ResponsiveContainer width="100%" height={240}>
        <BarChart data={data} margin={{ top: 8, right: 0, left: -18, bottom: 0 }} barCategoryGap="28%">
          <CartesianGrid strokeDasharray="4 4" stroke="rgba(148,163,184,0.18)" vertical={false} />
          <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
          <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
          <Tooltip contentStyle={{ background: 'rgba(15,23,42,0.95)', borderRadius: 18, border: 'none', color: '#fff' }} itemStyle={{ color: '#fff' }} />
          <Bar dataKey="value" radius={[18, 18, 0, 0]}>
            {data.map((entry, index) => (
              <Cell key={`cell-${entry.name}`} fill={BAR_COLORS[index % BAR_COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PriorityBarChart;
