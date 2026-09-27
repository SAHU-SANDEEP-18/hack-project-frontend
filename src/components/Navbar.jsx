import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Sparkles, FileText, Database, LayoutDashboard, RefreshCw, Zap } from 'lucide-react';
import { usePricingStore } from '../store/pricingStore';

export const Navbar = () => {
  const location = useLocation();
  const { isSyncing, syncCatalog } = usePricingStore();

  const navLinks = [
    { path: '/', label: 'Generator', icon: Sparkles },
    { path: '/review', label: 'Review & Edit', icon: FileText },
    { path: '/prices', label: 'Price Catalog', icon: Database },
    { path: '/dashboard', label: 'History', icon: LayoutDashboard },
  ];

  return (
    <header className="bg-[#111726]/80 border-b border-white/10 sticky top-0 z-50 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        
        {/* Brand */}
        <Link to="/" className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
            <Zap className="w-4 h-4" />
          </div>
          <div className="flex items-center space-x-2">
            <span className="font-bold text-lg text-white tracking-tight">Kodnexus</span>
            <span className="bg-indigo-500/10 text-indigo-400 text-xs px-2 py-0.5 rounded font-medium border border-indigo-500/20">
              Smart Invoice
            </span>
          </div>
        </Link>

        {/* Links */}
        <nav className="hidden md:flex items-center space-x-1">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-400' : 'text-slate-400'}`} />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Sync Button */}
        <button
          onClick={syncCatalog}
          disabled={isSyncing}
          className="flex items-center space-x-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs px-3 py-1.5 rounded-lg border border-slate-700 transition-colors disabled:opacity-50 font-medium"
          title="Reload prices from Google Sheet or CSV"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-indigo-400 ${isSyncing ? 'animate-spin' : ''}`} />
          <span>{isSyncing ? 'Syncing...' : 'Reload Sheet'}</span>
        </button>

      </div>
    </header>
  );
};
