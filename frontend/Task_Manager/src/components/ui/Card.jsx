const Card = ({ children, className = '' }) => {
  return (
    <div className={`rounded-[28px] border border-slate-200/70 bg-white/95 p-6 shadow-[0_24px_80px_rgba(15,23,42,0.08)] transition-colors duration-200 dark:border-slate-700/60 dark:bg-slate-950/90 ${className}`}>
      {children}
    </div>
  );
};

export default Card;
