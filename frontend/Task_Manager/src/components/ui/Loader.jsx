const Loader = () => {
  return (
    <div className="space-y-4">
      <div className="h-52 rounded-[1.75rem] bg-slate-200/70 animate-pulse dark:bg-slate-700/70" />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[...Array(4)].map((_, idx) => (
          <div key={idx} className="h-28 rounded-[1.5rem] bg-slate-200/70 animate-pulse dark:bg-slate-700/70" />
        ))}
      </div>
      <div className="space-y-3 rounded-[1.75rem] border border-slate-200/70 bg-white/80 p-5 dark:border-slate-700/70 dark:bg-slate-950/80">
        {[...Array(3)].map((_, idx) => (
          <div key={idx} className="h-12 rounded-2xl bg-slate-200/70 animate-pulse dark:bg-slate-700/70" />
        ))}
      </div>
    </div>
  );
};

export default Loader;
