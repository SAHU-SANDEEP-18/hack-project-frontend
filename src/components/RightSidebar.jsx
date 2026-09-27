import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, MoreHorizontal, ChevronRight, ShieldCheck, Clock } from 'lucide-react';
import { useInvoiceStore } from '../store/invoiceStore';
import { formatRupees } from '../services/invoice.service';

export const RightSidebar = () => {
  const navigate = useNavigate();
  const { invoices, fetchInvoicesList, setCurrentInvoice } = useInvoiceStore();

  useEffect(() => {
    fetchInvoicesList({ limit: 10 });
  }, []);

  const handleSelectInvoice = (inv) => {
    setCurrentInvoice(inv);
    navigate(`/review/${inv._id}`);
  };

  return (
    <aside className="w-72 shrink-0 bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 p-4 flex flex-col justify-between h-screen sticky top-0 text-slate-800 dark:text-slate-200 select-none overflow-y-auto hidden xl:flex">
      
      <div className="space-y-4">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-xs text-slate-900 dark:text-white uppercase tracking-wider">
              Recent Invoices
            </span>
            <span className="text-[11px] font-semibold text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">
              {invoices.length}
            </span>
          </div>
          <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
            <MoreHorizontal className="w-4 h-4" />
          </button>
        </div>

        {/* Live List from MongoDB */}
        <div className="space-y-2.5">
          {invoices.length === 0 ? (
            <div className="text-center py-8 text-slate-400 text-xs">
              No invoices generated yet.
            </div>
          ) : (
            invoices.map((inv) => {
              const isApproved = inv.status === 'APPROVED' || inv.status === 'EXPORTED';
              return (
                <div
                  key={inv._id}
                  onClick={() => handleSelectInvoice(inv)}
                  className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 hover:border-indigo-500/40 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer group"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono text-xs font-bold text-slate-900 dark:text-white">
                      {inv.invoiceNumber}
                    </span>
                    {isApproved ? (
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center gap-0.5">
                        <ShieldCheck className="w-3 h-3" /> Approved
                      </span>
                    ) : (
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400 flex items-center gap-0.5">
                        <Clock className="w-3 h-3" /> Draft
                      </span>
                    )}
                  </div>

                  <div className="text-xs text-slate-600 dark:text-slate-300 font-medium truncate">
                    {inv.customer?.name || 'Unnamed Client'}
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2 pt-2 border-t border-slate-200/60 dark:border-slate-800">
                    <span>{formatRupees(inv.totalPaise, true)}</span>
                    <span className="group-hover:translate-x-0.5 transition-transform flex items-center">
                      View <ChevronRight className="w-3 h-3 ml-0.5" />
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>

      </div>

      <div className="pt-4 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-400 text-center">
        Connected to <strong>MongoDB Atlas</strong>
      </div>

    </aside>
  );
};
