import { useContext, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { UserContext } from '../../context/userContext';

import Navbar from './Navbar';
import SideMenu from './SideMenu';

function DashboardLayout({ children, activeMenu }) {
  const { user } = useContext(UserContext);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 transition-colors duration-300 dark:bg-slate-950 dark:text-slate-100">
      <Navbar activeMenu={activeMenu} onMobileMenuToggle={() => setMobileOpen((current) => !current)} />

      {user && (
        <div className="flex gap-6 px-4 py-6 sm:px-6 lg:px-8 xl:gap-8">
          <div className="hidden xl:block xl:w-[320px]">
            <SideMenu activeMenu={activeMenu} />
          </div>
          <main className="grow">
            {children}
          </main>
        </div>
      )}

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-slate-950/30 backdrop-blur-sm xl:hidden"
            onClick={() => setMobileOpen(false)}
          >
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', stiffness: 260, damping: 24 }}
              className="absolute left-0 top-0 h-full w-[calc(100%-2rem)] max-w-[320px] bg-white p-5 shadow-2xl dark:bg-slate-950"
              onClick={(event) => event.stopPropagation()}
            >
              <SideMenu activeMenu={activeMenu} mobile onClose={() => setMobileOpen(false)} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default DashboardLayout;