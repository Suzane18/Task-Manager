import { useContext, useMemo, useState } from 'react';
import { UserContext } from '../../context/userContext';
import { Search as LuSearch, Menu as LuMenu, ChevronDown as LuChevronDown } from 'lucide-react';
import { motion } from 'framer-motion';
import moment from 'moment';
import { BASE_URL } from '../../utils/apiPaths';

const Navbar = ({ onMobileMenuToggle }) => {
  const { user, clearUser } = useContext(UserContext);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const profileImageSrc = user?.profileImageUrl
    ? user.profileImageUrl.startsWith('http')
      ? user.profileImageUrl
      : `${BASE_URL}${user.profileImageUrl}`
    : null;

  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  }, []);

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/70 bg-white/85 backdrop-blur-xl shadow-sm transition duration-300 dark:border-slate-800 dark:bg-slate-950/85">
      <div className="mx-auto flex h-20 max-w-[1560px] items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4">
          <button onClick={onMobileMenuToggle} className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:border-slate-300 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-slate-600 xl:hidden">
            <LuMenu className="h-5 w-5" />
          </button>
          <div className="hidden sm:block">
            <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">{greeting}, {user?.name || 'Admin'}</p>
            <p className="text-sm text-slate-500 dark:text-slate-400">{moment().format('dddd, MMMM D')}</p>
          </div>
        </div>

        <div className="flex flex-1 items-center gap-4">
          <div className="relative hidden flex-1 items-center sm:flex">
            <LuSearch className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
            <input type="search" placeholder="Search projects, tasks, members..." className="w-full rounded-3xl border border-slate-200 bg-slate-50 py-3 pl-12 pr-4 text-sm text-slate-900 outline-none transition duration-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:focus:border-cyan-400 dark:focus:ring-cyan-500/20" />
          </div>
          <div className="ml-auto flex items-center gap-3">
            <div className="relative">
              <button onClick={() => setDropdownOpen((current) => !current)} className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-900 shadow-sm transition hover:border-slate-300 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:border-slate-600">
                <span className={`inline-flex h-9 w-9 items-center justify-center rounded-full ${profileImageSrc ? 'overflow-hidden bg-slate-100 dark:bg-slate-800' : 'bg-gradient-to-br from-indigo-600 to-cyan-500 text-sm font-semibold text-white'}`}>
                  {profileImageSrc ? (
                    <img
                      src={profileImageSrc}
                      alt={`${user?.name || 'User'} avatar`}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    user?.name?.[0] || 'A'
                  )}
                </span>
                <span className="hidden sm:block">{user?.name || 'Admin'}</span>
                <LuChevronDown className="h-4 w-4 text-slate-500" />
              </button>
              {dropdownOpen && (
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="absolute right-0 top-full mt-3 w-48 rounded-[1.5rem] border border-slate-200 bg-white p-3 shadow-2xl shadow-slate-950/10 dark:border-slate-700 dark:bg-slate-950">
                  <button onClick={() => { clearUser(); window.location.href = '/login'; }} className="w-full rounded-2xl px-3 py-2 text-left text-sm text-slate-700 transition hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800">Logout</button>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;