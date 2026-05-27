import { Download as LuDownload, TrendingUp as LuTrendingUp } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { AreaChart, Area, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, BarChart, Bar } from 'recharts';

const productivityData = [];

const completionData = [];

const teamPerformance = [];

const Reports = () => {
  const weeklySummary = { active: 0, completed: 0, productivity: 0 };

  return (
    <DashboardLayout activeMenu="Reports">
      <div className="space-y-8">
        <div className="rounded-[2rem] border border-slate-200/70 bg-white/95 p-8 shadow-[0_24px_80px_-40px_rgba(15,23,42,0.16)] dark:border-slate-700/70 dark:bg-slate-950/90">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-indigo-600">Reports</p>
              <h1 className="mt-3 text-3xl font-semibold text-slate-950 dark:text-white">Team performance & productivity overview</h1>
              <p className="mt-3 max-w-2xl text-sm text-slate-500 dark:text-slate-400">Track weekly progress, compare completion stats, and export visual reports for stakeholder review.</p>
            </div>
            <Button variant="primary" className="inline-flex items-center gap-2">
              <LuDownload className="h-4 w-4" /> Export report
            </Button>
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <Card className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Weekly activity</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">Steps taken across all active task streams.</p>
              </div>
              <span className="inline-flex items-center gap-2 rounded-full bg-indigo-50 px-4 py-2 text-sm text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-100">
                <LuTrendingUp className="h-4 w-4" /> +12%
              </span>
            </div>
            <div className="h-[320px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={productivityData} margin={{ top: 10, right: 8, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="productivityGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.85} />
                      <stop offset="95%" stopColor="#4F46E5" stopOpacity={0.12} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="4 4" stroke="rgba(148,163,184,0.18)" vertical={false} />
                  <XAxis dataKey="name" stroke="#94A3B8" tickLine={false} axisLine={false} />
                  <YAxis stroke="#94A3B8" tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ background: 'rgba(15,23,42,0.95)', borderRadius: 18, border: 'none', color: '#fff' }} itemStyle={{ color: '#fff' }} />
                  <Area type="monotone" dataKey="value" stroke="#4F46E5" strokeWidth={3} fill="url(#productivityGradient)" activeDot={{ r: 6 }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card className="space-y-6">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">Completion analytics</p>
              <h2 className="mt-2 text-xl font-semibold text-slate-950 dark:text-white">Completion rates</h2>
            </div>
            <div className="space-y-4">
              {completionData.map((item) => (
                <div key={item.name} className="rounded-3xl bg-slate-50 p-4 dark:bg-slate-900">
                  <div className="flex items-center justify-between text-sm text-slate-500 dark:text-slate-400">
                    <span>{item.name}</span>
                    <span>{item.completed}% completed</span>
                  </div>
                  <div className="mt-3 h-3 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
                    <div className="h-full rounded-full bg-indigo-600" style={{ width: `${item.completed}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="grid gap-6 xl:grid-cols-3">
          <Card className="space-y-4">
            <p className="text-sm text-slate-500 dark:text-slate-400">Active team members</p>
            <p className="text-4xl font-semibold text-slate-950 dark:text-white">24</p>
            <p className="text-sm text-slate-500 dark:text-slate-400">Most recent workstreams are fully staffed and ready to ship.</p>
          </Card>
          <Card className="space-y-4">
            <p className="text-sm text-slate-500 dark:text-slate-400">Average delivery</p>
            <p className="text-4xl font-semibold text-slate-950 dark:text-white">92%</p>
            <p className="text-sm text-slate-500 dark:text-slate-400">High velocity shows strong accountability in the team.</p>
          </Card>
          <Card className="space-y-4">
            <p className="text-sm text-slate-500 dark:text-slate-400">Risk exposure</p>
            <p className="text-4xl font-semibold text-slate-950 dark:text-white">Low</p>
            <p className="text-sm text-slate-500 dark:text-slate-400">The current schedule is stable with low deviation risk.</p>
          </Card>
        </div>

        <Card className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-950 dark:text-white">Team performance</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">Score by function and efficiency.</p>
            </div>
          </div>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={teamPerformance} margin={{ top: 8, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.18)" vertical={false} />
                <XAxis dataKey="name" stroke="#94A3B8" tickLine={false} axisLine={false} />
                <YAxis stroke="#94A3B8" tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ background: 'rgba(15,23,42,0.95)', borderRadius: 16, border: 'none', color: '#fff' }} itemStyle={{ color: '#fff' }} />
                <Bar dataKey="score" radius={[16, 16, 0, 0]} fill="#06B6D4" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Reports;
