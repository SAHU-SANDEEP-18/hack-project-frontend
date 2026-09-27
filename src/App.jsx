import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Sidebar } from './components/Sidebar';
import { RightSidebar } from './components/RightSidebar';
import { ToastContainer } from './components/ToastContainer';
import { HomePage } from './pages/HomePage';
import { ReviewInvoicePage } from './pages/ReviewInvoicePage';
import { ManagePricesPage } from './pages/ManagePricesPage';
import { DashboardPage } from './pages/DashboardPage';
import { useThemeStore } from './store/themeStore';

export function App() {
  const { theme } = useThemeStore();

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-slate-50 dark:bg-[#0b0f17] text-slate-900 dark:text-slate-100 flex font-sans selection:bg-indigo-500 selection:text-white">
        
        {/* Left Sidebar (Screenshot style) */}
        <Sidebar />

        {/* Center Workspace */}
        <main className="flex-1 min-w-0 overflow-y-auto min-h-screen flex flex-col">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/review" element={<ReviewInvoicePage />} />
            <Route path="/review/:id" element={<ReviewInvoicePage />} />
            <Route path="/prices" element={<ManagePricesPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
          </Routes>
        </main>

        {/* Right Sidebar (Live MongoDB Recent Invoices) */}
        <RightSidebar />

        <ToastContainer />
      </div>
    </BrowserRouter>
  );
}

export default App;
