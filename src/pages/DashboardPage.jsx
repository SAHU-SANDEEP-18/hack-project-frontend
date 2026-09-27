import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  FileText,
  ShieldCheck,
  Download,
  Clock,
  ExternalLink,
  Search,
  IndianRupee,
} from 'lucide-react';
import { useInvoiceStore } from '../store/invoiceStore';
import { InvoiceStatusBadge } from '../components/StatusBadge';
import { formatRupees } from '../services/invoice.service';
import { downloadInvoicePdfUrl } from '../api/invoice.api';

export const DashboardPage = () => {
  const navigate = useNavigate();
  const { invoices, fetchInvoicesList, isLoading, setCurrentInvoice } = useInvoiceStore();
  const [statusFilter, setStatusFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchInvoicesList({ status: statusFilter });
  }, [statusFilter]);

  const handleViewInvoice = (inv) => {
    setCurrentInvoice(inv);
    navigate(`/review/${inv._id}`);
  };

  const totalCount = invoices.length;
  const approvedCount = invoices.filter((i) => i.status === 'APPROVED' || i.status === 'EXPORTED').length;
  const draftCount = invoices.filter((i) => i.status === 'DRAFT' || i.status === 'NEEDS_REVIEW').length;
  const totalRevenuePaise = invoices
    .filter((i) => i.status === 'APPROVED' || i.status === 'EXPORTED')
    .reduce((sum, i) => sum + (i.totalPaise || 0), 0);

  const filteredInvoices = invoices.filter((inv) => {
    const custName = inv.customer?.name || '';
    const custEmail = inv.customer?.email || '';
    const invNum = inv.invoiceNumber || '';
    const search = searchTerm.toLowerCase();

    return (
      custName.toLowerCase().includes(search) ||
      custEmail.toLowerCase().includes(search) ||
      invNum.toLowerCase().includes(search)
    );
  });

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-slate-200 p-5 rounded-2xl shadow-sm">
        <div>
          <div className="flex items-center space-x-2">
            <LayoutDashboard className="w-5 h-5 text-indigo-600" />
            <h1 className="text-xl font-bold text-slate-900">
              Invoice History & Analytics
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Track generated drafts, review status, approved invoices, and download exported PDF invoices.
          </p>
        </div>

        <button
          onClick={() => navigate('/')}
          className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition-colors shadow-sm"
        >
          <FileText className="w-4 h-4" />
          <span>New Invoice</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white border border-slate-200 p-4 space-y-1.5 rounded-2xl shadow-sm">
          <div className="text-[11px] font-bold text-slate-600 uppercase tracking-wider flex items-center justify-between">
            <span>Total Invoices</span>
            <FileText className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900">{totalCount}</div>
        </div>

        <div className="bg-white border border-slate-200 p-4 space-y-1.5 rounded-2xl shadow-sm">
          <div className="text-[11px] font-bold text-slate-600 uppercase tracking-wider flex items-center justify-between">
            <span>Approved</span>
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-extrabold text-emerald-600">{approvedCount}</div>
        </div>

        <div className="bg-white border border-slate-200 p-4 space-y-1.5 rounded-2xl shadow-sm">
          <div className="text-[11px] font-bold text-slate-600 uppercase tracking-wider flex items-center justify-between">
            <span>Drafts</span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-extrabold text-amber-600">{draftCount}</div>
        </div>

        <div className="bg-white border border-slate-200 p-4 space-y-1.5 rounded-2xl shadow-sm">
          <div className="text-[11px] font-bold text-slate-600 uppercase tracking-wider flex items-center justify-between">
            <span>Verified Revenue</span>
            <IndianRupee className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-xl font-extrabold text-slate-900">
            {formatRupees(totalRevenuePaise, true)}
          </div>
        </div>
      </div>

      {/* Filter Tabs & Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-xl border border-slate-200 w-full sm:w-auto">
          {[
            { label: 'All', value: '' },
            { label: 'Drafts', value: 'DRAFT' },
            { label: 'Approved', value: 'APPROVED' },
            { label: 'Exported', value: 'EXPORTED' },
          ].map((tab) => (
            <button
              key={tab.value}
              onClick={() => setStatusFilter(tab.value)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                statusFilter === tab.value
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search by customer or #..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="app-input w-full pl-9 pr-3 py-1.5 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        {isLoading ? (
          <div className="text-center py-8 text-slate-500 text-xs font-medium">Loading invoices from database...</div>
        ) : filteredInvoices.length === 0 ? (
          <div className="text-center py-10 text-slate-500 text-xs font-medium">
            No invoices found in database.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 text-[11px] font-bold text-slate-700 uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="px-5 py-3.5">Invoice #</th>
                  <th className="px-5 py-3.5">Customer</th>
                  <th className="px-5 py-3.5">Status</th>
                  <th className="px-5 py-3.5">Items Count</th>
                  <th className="px-5 py-3.5">Total (₹)</th>
                  <th className="px-5 py-3.5">Date</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredInvoices.map((inv) => {
                  const isApproved = inv.status === 'APPROVED' || inv.status === 'EXPORTED';
                  return (
                    <tr key={inv._id} className="hover:bg-slate-50 transition-colors">
                      
                      <td className="px-5 py-4 font-bold text-slate-900 font-mono text-sm">
                        {inv.invoiceNumber}
                      </td>

                      <td className="px-5 py-4">
                        <div className="font-bold text-slate-900 text-xs">
                          {inv.customer?.name || 'Unnamed Client'}
                        </div>
                        <div className="text-[11px] text-slate-500 font-medium">
                          {inv.customer?.email || 'No email provided'}
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <InvoiceStatusBadge status={inv.status} />
                      </td>

                      <td className="px-5 py-4 font-semibold text-slate-600">
                        {inv.items ? inv.items.length : 0} items
                      </td>

                      <td className="px-5 py-4 font-extrabold text-slate-900 text-sm">
                        {formatRupees(inv.totalPaise, true)}
                      </td>

                      <td className="px-5 py-4 text-slate-500 font-medium">
                        {new Date(inv.createdAt).toLocaleDateString()}
                      </td>

                      <td className="px-5 py-4 text-right space-x-1">
                        <button
                          onClick={() => handleViewInvoice(inv)}
                          className="inline-flex items-center space-x-1 px-3 py-1 rounded-xl text-xs font-bold bg-indigo-50 text-indigo-600 border border-indigo-200 hover:bg-indigo-100 transition-colors"
                        >
                          <span>Review</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </button>

                        {isApproved && (
                          <a
                            href={downloadInvoicePdfUrl(inv._id)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center space-x-1 px-3 py-1 rounded-xl text-xs font-bold bg-blue-50 text-blue-600 border border-blue-200 hover:bg-blue-100 transition-colors"
                          >
                            <Download className="w-3.5 h-3.5" />
                            <span>PDF</span>
                          </a>
                        )}
                      </td>

                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
};
