import { AnimatePresence, motion } from 'framer-motion';

const Modal = ({ open, title, onClose, children, footer }) => {
  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 grid place-items-center bg-slate-950/30 p-4 backdrop-blur-sm"
        >
          <motion.div
            initial={{ y: 24, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 24, opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className="w-full max-w-2xl overflow-hidden rounded-[2rem] border border-slate-200/70 bg-white/95 p-6 shadow-2xl shadow-slate-950/10 ring-1 ring-slate-200 dark:border-slate-700/60 dark:bg-slate-950/95"
          >
            <div className="mb-4 flex items-center justify-between gap-4">
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white">{title}</h3>
              <button
                type="button"
                onClick={onClose}
                className="rounded-full border border-slate-200 bg-white/90 px-3 py-2 text-slate-500 transition hover:border-slate-300 hover:text-slate-900 dark:border-slate-700 dark:bg-slate-900/80 dark:text-slate-300 dark:hover:text-white"
              >
                ×
              </button>
            </div>
            {children}
            {footer && <div className="mt-6">{footer}</div>}
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
};

export default Modal;
