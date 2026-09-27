import React from 'react';
import { CheckCircle2, AlertTriangle, XCircle, FileClock, ShieldCheck, Download } from 'lucide-react';

export const MatchStatusBadge = ({ status }) => {
  switch (status) {
    case 'matched':
      return (
        <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
          <CheckCircle2 className="w-3 h-3 text-emerald-400" />
          <span>Matched</span>
        </span>
      );
    case 'ambiguous':
      return (
        <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/30 animate-pulse">
          <AlertTriangle className="w-3 h-3 text-amber-400" />
          <span>Ambiguous</span>
        </span>
      );
    case 'not_found':
    default:
      return (
        <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/30">
          <XCircle className="w-3 h-3 text-rose-400" />
          <span>Not Found</span>
        </span>
      );
  }
};

export const InvoiceStatusBadge = ({ status }) => {
  switch (status) {
    case 'APPROVED':
    case 'approved':
      return (
        <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm shadow-emerald-500/10">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Approved</span>
        </span>
      );
    case 'EXPORTED':
    case 'exported':
      return (
        <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-500/20 text-blue-300 border border-blue-500/40 shadow-sm shadow-blue-500/10">
          <Download className="w-3.5 h-3.5 text-blue-400" />
          <span>Exported PDF</span>
        </span>
      );
    case 'DRAFT':
    case 'draft':
    default:
      return (
        <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm shadow-amber-500/10">
          <FileClock className="w-3.5 h-3.5 text-amber-400" />
          <span>Draft Review</span>
        </span>
      );
  }
};
