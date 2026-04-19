import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  CheckSquare,
  Zap,
  BookOpen,
  Smile,
  BarChart3,
  X,
} from 'lucide-react';

export default function Sidebar({ isOpen, onClose }) {
  const location = useLocation();

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/tasks', label: 'Tasks', icon: CheckSquare },
    { path: '/habits', label: 'Habits', icon: Zap },
    { path: '/study', label: 'Study Hours', icon: BookOpen },
    { path: '/mood', label: 'Mood Tracker', icon: Smile },
    { path: '/reports', label: 'Reports', icon: BarChart3 },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div
      className={`fixed lg:static top-0 left-0 h-screen bg-gray-900 text-white w-64 transform ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0 transition-transform duration-300 z-40 shadow-xl`}
    >
      <div className="flex justify-between items-center p-4 lg:hidden">
        <h2 className="font-bold text-lg">Menu</h2>
        <button
          onClick={onClose}
          className="p-2 hover:bg-gray-800 rounded"
        >
          <X size={24} />
        </button>
      </div>

      <nav className="mt-8">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={onClose}
              className={`flex items-center gap-4 px-6 py-4 transition-colors ${
                isActive(item.path)
                  ? 'bg-blue-600 border-l-4 border-blue-400'
                  : 'hover:bg-gray-800'
              }`}
            >
              <Icon size={20} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
