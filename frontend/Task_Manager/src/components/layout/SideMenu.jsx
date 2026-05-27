import { useContext, useMemo } from 'react';
import { BASE_URL } from '../../utils/apiPaths';
import { useLocation, useNavigate } from 'react-router-dom';
import { UserContext } from '../../context/userContext';
import { SIDE_MENU_DATA, SIDE_MENU_USER_DATA } from '../../utils/data';

function SideMenu({ activeMenu, mobile = false, onClose }) {
  const { user, clearUser } = useContext(UserContext);
  const location = useLocation();
  const navigate = useNavigate();

  const sideMenuData = useMemo(() => {
    if (!user) return [];
    return user.role === 'admin' ? SIDE_MENU_DATA : SIDE_MENU_USER_DATA;
  }, [user]);

  const handleNavigation = (path) => {
    if (path === 'logout') {
      localStorage.clear();
      clearUser();
      navigate('/login');
      return;
    }
    navigate(path);
    if (mobile && onClose) onClose();
  };

  const profileInitials = user?.name
    ? user.name
        .split(' ')
        .map((part) => part[0])
        .join('')
        .slice(0, 2)
        .toUpperCase()
    : 'U';

  const roleLabel = user?.role === 'admin' ? 'Admin' : 'Member';

  return (
    <aside className={`${mobile ? 'h-full' : 'sticky top-5 h-[calc(100vh-2rem)]'} w-full rounded-[2rem] border border-slate-200/70 bg-white/95 p-6 shadow-[0_24px_80px_-40px_rgba(15,23,42,0.16)] backdrop-blur-xl transition duration-300 dark:border-slate-700/70 dark:bg-slate-950/95`}>
      <div className="mb-8 flex items-center gap-4">
        <div className="overflow-hidden rounded-full border border-slate-200 dark:border-slate-700">
          {user?.profileImageUrl ? (
            <img
              src={(user.profileImageUrl?.startsWith('http') ? user.profileImageUrl : `${BASE_URL}${user.profileImageUrl}`)}
              alt={`${user?.name || 'User'} avatar`}
              className="h-16 w-16 object-cover"
            />
          ) : (
            <div className="grid h-16 w-16 place-items-center rounded-full bg-indigo-600 text-xl font-semibold text-white">
              {profileInitials}
            </div>
          )}
        </div>
        <div>
          <p className="text-sm font-semibold text-slate-900 dark:text-white">{user?.name || 'Product Admin'}</p>
          <p className="text-xs text-slate-500 dark:text-slate-400">{user?.email || 'admin@taskflow.com'}</p>
          <span className="mt-2 inline-flex rounded-full bg-indigo-100 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-100">{roleLabel}</span>
        </div>
      </div>

      <nav className="space-y-2">
        {sideMenuData.map((item) => {
          const isActive = location.pathname === item.path || item.label === activeMenu;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => handleNavigation(item.path)}
              className={`group flex w-full items-center gap-3 rounded-3xl px-4 py-3 text-left text-sm transition duration-200 ${isActive ? 'border-l-4 border-indigo-600 bg-indigo-50 text-slate-900 shadow-lg shadow-indigo-500/10 dark:bg-slate-900 dark:text-white' : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-900'} ${item.path === 'logout' ? 'text-rose-600 dark:text-rose-400' : ''}`}
            >
              <item.icon className={`h-5 w-5 transition-transform duration-300 group-hover:scale-110 ${isActive ? 'text-indigo-600' : 'text-slate-500 dark:text-slate-300'}`} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {!mobile && (
        <div className="mt-10 rounded-[1.75rem] bg-gradient-to-br from-indigo-50 to-cyan-50 p-5 text-slate-900 shadow-inner shadow-indigo-100/40 dark:from-slate-900 dark:to-slate-950 dark:text-white">
          <p className="text-sm font-semibold">Workspace insights</p>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Launch a new sprint, view capacity, and keep the team aligned from one place.</p>
        </div>
      )}
    </aside>
  );
}

export default SideMenu;