import React from 'react';

function AuthHeader({ title, subtitle }) {
  return (
    <div className="mb-10">
      <p className="text-xs font-semibold uppercase tracking-[0.32em] text-blue-600">
        Task Manager
      </p>
      <h1 className="mt-4 text-4xl font-semibold text-slate-900 dark:text-white leading-tight">
        {title}
      </h1>
      <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300 max-w-2xl">
        {subtitle}
      </p>
    </div>
  );
}

export default AuthHeader;
