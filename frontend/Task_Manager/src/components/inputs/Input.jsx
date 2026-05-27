import React from 'react';

function Input({ label, type, name, placeholder, value, onChange, error, showToggle, className }) {
  const [showPassword, setShowPassword] = React.useState(false);
  const isPassword = type === 'password' && showToggle;
  const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

  return (
    <div className={`flex flex-col gap-2 ${className || ''}`}>
      <label htmlFor={name} className="text-sm font-medium text-slate-700 dark:text-slate-100">
        {label}
      </label>
      <div className="relative">
        <input
          id={name}
          name={name}
          type={inputType}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className={`input-box ${error ? 'input-box-error' : ''} ${isPassword ? 'pr-14' : ''}`}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-5 w-5"
              >
                <path d="M17.94 17.94A10.94 10.94 0 0 1 12 19.5c-5.2 0-9.51-3.23-11-7.5a11.09 11.09 0 0 1 1.64-3.1" />
                <path d="M1 1l22 22" />
                <path d="M9.53 9.53a3.5 3.5 0 0 0 4.94 4.94" />
                <path d="M14.12 14.12A3.5 3.5 0 0 1 9.88 9.88" />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-5 w-5"
              >
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            )}
          </button>
        )}
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}

export default Input;
