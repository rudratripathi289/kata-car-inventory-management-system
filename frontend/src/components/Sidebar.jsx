import React from 'react';
import { NavLink } from 'react-router-dom';
import { FiHome, FiList, FiPlusSquare, FiSettings } from 'react-icons/fi';

const Sidebar = () => {
  const links = [
    { name: 'Dashboard', path: '/dashboard', icon: FiHome },
    { name: 'Inventory', path: '/vehicles', icon: FiList },
    { name: 'Add Vehicle', path: '/vehicles/new', icon: FiPlusSquare },
    { name: 'Settings', path: '/settings', icon: FiSettings },
  ];

  return (
    <aside className="w-64 bg-gray-800 text-white flex-shrink-0 min-h-[calc(100vh-4rem)]">
      <div className="py-6">
        <nav className="space-y-1 px-2">
          {links.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.name}
                to={link.path}
                className={({ isActive }) =>
                  `group flex items-center px-2 py-2 text-base font-medium rounded-md ${
                    isActive
                      ? 'bg-gray-900 text-white'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`
                }
              >
                <Icon className="mr-4 flex-shrink-0 h-6 w-6" />
                {link.name}
              </NavLink>
            );
          })}
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;
