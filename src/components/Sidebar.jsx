import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Sparkles,
  FileText,
  Database,
  LayoutDashboard,
  Zap,
} from 'lucide-react';

export const Sidebar = () => {
  const location = useLocation();

  const menuItems = [
    { path: '/', label: 'AI Generator', icon: Sparkles },
    { path: '/review', label: 'Review Draft', icon: FileText },
    { path: '/prices', label: 'Price Catalog', icon: Database },
    { path: '/dashboard', label: 'Invoice History', icon: LayoutDashboard },
  ];

  return (
    <aside className="w-60 shrink-0 bg-white border-r border-slate-200 flex flex-col justify-between h-screen sticky top-0 text-slate-800 select-none shadow-sm">
      
      {/* App Name & Logo */}
      <div className="p-5 space-y-6">
        <Link to="/" className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-sm">
            <Zap className="w-4.5 h-4.5" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-base text-slate-900 tracking-tight leading-none">
              Smart Invoice
            </span>
            <span className="text-[10px] text-indigo-600 font-semibold mt-0.5">
              AI Verification
            </span>
          </div>
        </Link>

        {/* Navigation Menu */}
        <nav className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-indigo-50 text-indigo-600 shadow-sm border border-indigo-100'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-600' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

    </aside>
  );
};
