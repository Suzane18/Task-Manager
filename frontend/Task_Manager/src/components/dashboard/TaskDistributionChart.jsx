import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const COLORS = ['#84CC16', '#8B5CF6', '#06B6D4'];

const TaskDistributionChart = ({ data }) => {
  return (
    <div className="h-[360px] w-full overflow-hidden rounded-[2rem] border border-slate-200/70 bg-white/95 p-6 shadow-[0_24px_80px_-40px_rgba(15,23,42,0.16)] transition duration-300 hover:-translate-y-1 dark:border-slate-700/70 dark:bg-slate-950/95">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h3 className="text-base font-semibold text-slate-900 dark:text-white">Task Distribution</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">Overview of workflow status splits.</p>
        </div>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-slate-600 dark:bg-slate-800 dark:text-slate-300">Live</span>
      </div>
      <ResponsiveContainer width="100%" height={240}>
        <PieChart>
          <Pie data={data} dataKey="value" nameKey="name" innerRadius={74} outerRadius={106} paddingAngle={6} cornerRadius={18}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip contentStyle={{ background: 'rgba(15,23,42,0.95)', borderRadius: 18, border: 'none', color: '#fff' }} itemStyle={{ color: '#fff' }} cursor={{ fill: 'rgba(255,255,255,0.08)' }} />
        </PieChart>
      </ResponsiveContainer>
      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        {data.map((item, index) => (
          <div key={item.name} className="rounded-[1.75rem] border border-slate-200/70 bg-slate-50 px-4 py-4 dark:border-slate-700/70 dark:bg-slate-900">
            <div className="flex items-center gap-3">
              <span className="inline-flex h-3.5 w-3.5 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
              <span className="font-semibold text-slate-900 dark:text-slate-200">{item.name}</span>
            </div>
            <p className="mt-3 text-2xl font-semibold text-slate-950 dark:text-white">{item.value}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">{item.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TaskDistributionChart;
