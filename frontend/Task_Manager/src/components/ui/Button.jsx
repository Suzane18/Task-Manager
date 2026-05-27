import { motion } from 'framer-motion';

const VARIANTS = {
  primary: 'bg-gradient-to-r from-indigo-600 to-cyan-500 text-white shadow-lg shadow-cyan-500/20 hover:from-indigo-700 hover:to-cyan-600',
  secondary: 'bg-slate-100 text-slate-900 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700',
  accent: 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/20 hover:bg-cyan-600',
  ghost: 'bg-transparent border border-slate-200 text-slate-900 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-100 dark:hover:bg-slate-800',
};

const Button = ({ children, variant = 'primary', className = '', ...props }) => {
  return (
    <motion.button
      whileHover={{ y: -2, scale: 1.01 }}
      whileTap={{ scale: 0.96 }}
      transition={{ duration: 0.18 }}
      className={`inline-flex items-center justify-center gap-2 rounded-2xl px-5 py-3 text-sm font-semibold transition-all duration-200 ${VARIANTS[variant] || VARIANTS.primary} ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  );
};

export default Button;
