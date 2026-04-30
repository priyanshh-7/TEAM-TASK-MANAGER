import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { FiHome, FiFolder, FiLogOut, FiMenu, FiX, FiCheckCircle, FiSearch, FiBell, FiSettings, FiUsers } from 'react-icons/fi';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/authSlice';
import { motion, AnimatePresence } from 'framer-motion';

const Layout = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const navLinks = [
    { name: 'Dashboard', path: '/', icon: FiHome },
    { name: 'Projects', path: '/projects', icon: FiFolder },
    { name: 'Team', path: '/team', icon: FiUsers },
    { name: 'Settings', path: '/settings', icon: FiSettings },
  ];

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <AnimatePresence>
        {(isSidebarOpen || window.innerWidth > 768) && (
          <motion.aside 
            initial={{ x: -250 }}
            animate={{ x: 0 }}
            exit={{ x: -250 }}
            className={`fixed md:sticky top-0 z-40 w-64 h-screen bg-surface border-r border-textMain/10 shadow-2xl flex flex-col transition-transform`}
          >
            <div className="p-6 flex items-center justify-between">
              <h1 className="text-xl font-bold text-gradient flex items-center gap-2">
                <FiCheckCircle className="text-primary" /> TaskFlow
              </h1>
              <button className="md:hidden text-textMuted" onClick={() => setIsSidebarOpen(false)}>
                <FiX size={24} />
              </button>
            </div>

            <nav className="flex-1 px-4 py-6 space-y-2">
              {navLinks.map((link) => (
                <NavLink
                  key={link.name}
                  to={link.path}
                  className={({ isActive }) => 
                    `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                      isActive 
                        ? 'bg-primary/10 text-primary font-semibold border border-primary/20' 
                        : 'text-textMuted hover:bg-textMain/5 hover:text-textMain'
                    }`
                  }
                >
                  <link.icon size={20} />
                  {link.name}
                </NavLink>
              ))}
            </nav>

            {/* User Profile Summary */}
            <div className="p-4 m-4 rounded-xl bg-background border border-textMain/10">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary to-secondary flex items-center justify-center text-white font-bold">
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
                <div className="overflow-hidden">
                  <p className="text-sm font-semibold truncate text-textMain">{user?.name}</p>
                  <p className="text-xs text-textMuted truncate">{user?.role}</p>
                </div>
              </div>
              <button 
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 py-2 text-sm text-danger hover:bg-danger/10 rounded-lg transition-colors"
              >
                <FiLogOut /> Logout
              </button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Sticky Top Navbar */}
        <header className="h-16 sticky top-0 z-30 flex items-center justify-between px-6 bg-surface/80 backdrop-blur-md border-b border-textMain/10">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsSidebarOpen(true)} className="md:hidden text-textMain">
              <FiMenu size={24} />
            </button>
            <div className="hidden md:flex items-center bg-background border border-textMain/10 rounded-full px-4 py-2 w-64 focus-within:border-primary transition-colors">
              <FiSearch className="text-textMuted mr-2" />
              <input type="text" placeholder="Search..." className="bg-transparent text-sm w-full outline-none text-textMain placeholder-textMuted" />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="relative p-2 text-textMuted hover:text-textMain transition-colors">
              <FiBell size={20} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-danger rounded-full"></span>
            </button>
            <div className="md:hidden w-8 h-8 rounded-full bg-gradient-to-tr from-primary to-secondary flex items-center justify-center text-white font-bold text-sm">
                {user?.name?.charAt(0).toUpperCase()}
            </div>
          </div>
        </header>
        <div className="flex-1 overflow-y-auto flex flex-col relative">
          <div className="flex-1 p-4 md:p-8">
            <Outlet />
          </div>
          
          {/* Footer */}
          <footer className="w-full py-6 px-4 md:px-8 border-t border-textMain/5 bg-surface/30 mt-auto">
            <div className="flex flex-col md:flex-row items-center justify-between text-sm text-textMuted">
              <div className="flex items-center gap-2 mb-4 md:mb-0">
                <FiCheckCircle className="text-primary" />
                <span className="font-semibold text-textMain">Team Task Manager</span>
                <span>&copy; {new Date().getFullYear()} All rights reserved.</span>
              </div>
              <div className="flex gap-6">
                <button 
                  onClick={() => import('react-hot-toast').then(({ default: toast }) => toast('Privacy Policy coming soon!', { icon: '📄' }))}
                  className="hover:text-primary transition-colors cursor-pointer"
                >
                  Privacy Policy
                </button>
                <button 
                  onClick={() => import('react-hot-toast').then(({ default: toast }) => toast('Terms of Service coming soon!', { icon: '⚖️' }))}
                  className="hover:text-primary transition-colors cursor-pointer"
                >
                  Terms of Service
                </button>
                <button 
                  onClick={() => import('react-hot-toast').then(({ default: toast }) => toast('Contact Support coming soon!', { icon: '💬' }))}
                  className="hover:text-primary transition-colors cursor-pointer"
                >
                  Contact Support
                </button>
              </div>
            </div>
          </footer>
        </div>
      </main>
    </div>
  );
};

export default Layout;
