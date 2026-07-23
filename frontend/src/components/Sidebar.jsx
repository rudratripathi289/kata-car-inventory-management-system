import React from 'react';
import { NavLink } from 'react-router-dom';
import { FiHome, FiList, FiPlusSquare, FiSettings, FiUser } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
  const { user } = useAuth();
  
  const links = [
    { name: 'Dashboard', path: '/dashboard', icon: FiHome },
    { name: 'Inventory', path: '/vehicles', icon: FiList },
    ...(user?.role === 'admin' ? [{ name: 'Add Vehicle', path: '/vehicles/new', icon: FiPlusSquare }] : []),
    { name: 'My Profile', path: '/profile', icon: FiUser },
    { name: 'Settings', path: '/settings', icon: FiSettings },
  ];

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 flex-shrink-0 min-h-[calc(100vh-4rem)] shadow-xl relative z-30">
      <div className="py-6 h-full flex flex-col">
        <nav className="flex-1 space-y-1.5 px-3">
          {links.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.name}
                to={link.path}
                className={({ isActive }) =>
                  `group flex items-center px-3 py-2.5 text-sm font-semibold rounded-xl transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-900/50'
                      : 'text-slate-400 hover:bg-slate-800 hover:text-slate-100'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon className={`mr-3 flex-shrink-0 h-5 w-5 transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`} />
                    {link.name}
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>
        
        {/* User Card at bottom of sidebar */}
        <div className="px-3 pb-4">
          <div className="bg-slate-800/50 rounded-2xl p-4 border border-slate-700/50 backdrop-blur-sm">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Pro Tip</p>
            <p className="text-xs text-slate-300 leading-relaxed">
              Use the inventory tab to quick-search and filter vehicles by make or model.
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
