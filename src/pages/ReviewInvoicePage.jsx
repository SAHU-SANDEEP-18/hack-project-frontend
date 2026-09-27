import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  FileText,
  User,
  Plus,
  Save,
  ShieldCheck,
  Download,
  Share2,
  AlertCircle,
  CheckCircle,
  ArrowLeft,
  Cpu,
  Percent,
} from 'lucide-react';
import { useInvoiceStore } from '../store/invoiceStore';
import { usePricingStore } from '../store/pricingStore';
import { ItemRowEditor } from '../components/ItemRowEditor';
import { AddItemModal } from '../components/AddItemModal';
import { InvoiceStatusBadge } from '../components/StatusBadge';
import { formatRupees } from '../services/invoice.service';
import { validateApprovalGate } from '../services/validation.service';
import { generateWhatsAppShareUrl } from '../services/invoice.service';
import { downloadInvoicePdfUrl } from '../api/invoice.api';

export const ReviewInvoicePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    currentInvoice,
    fetchInvoice,
    updateInvoiceDraft,
    updateCurrentItemLocally,
    addItemLocally,
    removeItemLocally,
    approveInvoice,
    isUpdating,
    isApproving,
    isLoading,
  } = useInvoiceStore();

  const { catalog, fetchCatalog } = usePricingStore();

  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [taxRate, setTaxRate] = useState(18);
  const [notes, setNotes] = useState('');
  const [isAddItemOpen, setIsAddItemOpen] = useState(false);

  useEffect(() => {
    fetchCatalog();
    if (id) {
      fetchInvoice(id);
    }
  }, [id]);

  useEffect(() => {
    if (currentInvoice) {
      setCustomerName(currentInvoice.customer?.name || '');
      setCustomerEmail(currentInvoice.customer?.email || '');
      setCustomerPhone(currentInvoice.customer?.phone || '');
      setTaxRate(currentInvoice.taxRatePercent !== undefined ? currentInvoice.taxRatePercent : 18);
      setNotes(currentInvoice.notes || '');
    }
  }, [currentInvoice]);

  if (isLoading || (!currentInvoice && id)) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Loading Invoice Draft...</p>
        </div>
      </div>
    );
  }

  if (!currentInvoice) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 max-w-md w-full text-center space-y-4 rounded-2xl shadow-sm">
          <FileText className="w-10 h-10 text-slate-400 mx-auto" />
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">No Active Invoice</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Please generate a draft from the AI Generator or select one from Invoice History.
          </p>
          <button
            onClick={() => navigate('/')}
            className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-colors"
          >
            Go to Generator
          </button>
        </div>
      </div>
    );
  }

  const activeCustomerState = {
    name: customerName,
    email: customerEmail,
    phone: customerPhone,
  };

  const approvalGate = validateApprovalGate({
    ...currentInvoice,
    customer: activeCustomerState,
  });
  const isApproved = currentInvoice.status === 'APPROVED' || currentInvoice.status === 'EXPORTED';

  const handleSaveDraft = async () => {
    const payload = {
      customer: {
        name: customerName,
        email: customerEmail,
        phone: customerPhone,
      },
      items: currentInvoice.items,
      notes,
      taxRatePercent: Number(taxRate),
    };

    await updateInvoiceDraft(currentInvoice._id, payload);
  };

  const handleApprove = async () => {
    await handleSaveDraft();
    await approveInvoice(currentInvoice._id);
  };

  const handleWhatsAppShare = () => {
    const url = generateWhatsAppShareUrl(currentInvoice);
    if (url) {
      window.open(url, '_blank');
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-sm">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => navigate('/')}
            className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center space-x-3">
              <h1 className="text-xl font-bold text-slate-900 dark:text-white">
                Invoice #{currentInvoice.invoiceNumber}
              </h1>
              <InvoiceStatusBadge status={currentInvoice.status} />
            </div>
            <div className="flex items-center space-x-1.5 text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              <Cpu className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
              <span>AI Provider: <strong className="text-slate-800 dark:text-slate-200 capitalize">{currentInvoice.aiProviderUsed || 'Mistral AI'}</strong></span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleWhatsAppShare}
            className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/50 hover:bg-emerald-100 dark:hover:bg-emerald-950 text-xs font-semibold transition-colors"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>WhatsApp Share</span>
          </button>

          {isApproved ? (
            <a
              href={downloadInvoicePdfUrl(currentInvoice._id)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-1.5 px-4 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition-colors shadow-sm"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download PDF</span>
            </a>
          ) : (
            <button
              onClick={handleSaveDraft}
              disabled={isUpdating}
              className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold border border-slate-200 dark:border-slate-700 transition-colors"
            >
              <Save className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
              <span>{isUpdating ? 'Saving...' : 'Save Draft'}</span>
            </button>
          )}

          {!isApproved && (
            <button
              onClick={handleApprove}
              disabled={!approvalGate.canApprove || isApproving}
              className={`flex items-center space-x-1.5 px-4 py-1.5 rounded-xl text-xs font-bold text-white transition-colors ${
                approvalGate.canApprove
                  ? 'bg-emerald-600 hover:bg-emerald-500'
                  : 'bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-500 cursor-not-allowed border border-slate-300 dark:border-slate-700'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{isApproving ? 'Approving...' : 'Approve Invoice'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Approval Gate Checklist */}
      {!isApproved && (
        <div className={`p-4 rounded-2xl border ${
          approvalGate.canApprove
            ? 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800/40'
            : 'bg-slate-900 border-slate-800 text-slate-100'
        }`}>
          <h3 className="text-xs font-bold mb-1.5 flex items-center space-x-1.5">
            <ShieldCheck className={`w-4 h-4 ${approvalGate.canApprove ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-400'}`} />
            <span>Approval Gate Status</span>
          </h3>
          {approvalGate.canApprove ? (
            <p className="text-xs text-emerald-700 dark:text-emerald-400 font-medium flex items-center space-x-1">
              <CheckCircle className="w-3.5 h-3.5" />
              <span>Ready for approval! Customer info & all items matched.</span>
            </p>
          ) : (
            <ul className="space-y-1 text-xs text-rose-400 font-medium">
              {approvalGate.errors.map((err, i) => (
                <li key={i} className="flex items-center space-x-1">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{err}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Line Items */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 space-y-4 rounded-2xl shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <FileText className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <h2 className="text-base font-bold text-slate-900 dark:text-white">
                  Line Items Verification
                </h2>
              </div>
              
              {!isApproved && (
                <button
                  type="button"
                  onClick={() => setIsAddItemOpen(true)}
                  className="flex items-center space-x-1 text-xs font-semibold px-2.5 py-1 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 hover:bg-indigo-100 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Item</span>
                </button>
              )}
            </div>

            <div className="space-y-3">
              {currentInvoice.items && currentInvoice.items.length > 0 ? (
                currentInvoice.items.map((item, index) => (
                  <ItemRowEditor
                    key={item._id || index}
                    item={item}
                    index={index}
                    onUpdate={(idx, patch) => updateCurrentItemLocally(idx, patch, catalog)}
                    onDelete={(idx) => removeItemLocally(idx)}
                  />
                ))
              ) : (
                <div className="text-center py-6 text-slate-500 dark:text-slate-400 text-xs">
                  No line items found. Click "Add Item" to add one.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Col: Customer Info & Summary */}
        <div className="space-y-6">
          
          {/* Customer Details */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 space-y-3 rounded-2xl shadow-sm">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-800 pb-2 flex items-center space-x-1.5">
              <User className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span>Customer Information</span>
            </h2>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Customer Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Rahul Sharma"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  disabled={isApproved}
                  className="app-input w-full px-3.5 py-2 text-xs text-slate-900 dark:text-white disabled:opacity-60"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Customer Email
                </label>
                <input
                  type="email"
                  placeholder="e.g. rahul@example.com"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  disabled={isApproved}
                  className="app-input w-full px-3.5 py-2 text-xs text-slate-900 dark:text-white disabled:opacity-60"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Phone (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. +91 9876543210"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  disabled={isApproved}
                  className="app-input w-full px-3.5 py-2 text-xs text-slate-900 dark:text-white disabled:opacity-60"
                />
              </div>
            </div>
          </div>

          {/* Totals Summary */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 space-y-3 rounded-2xl shadow-sm">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-800 pb-2">
              Invoice Summary
            </h2>

            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between text-slate-700 dark:text-slate-300">
                <span>Subtotal:</span>
                <span className="font-bold text-slate-900 dark:text-white">
                  {formatRupees(currentInvoice.subtotalPaise, true)}
                </span>
              </div>

              <div className="flex items-center justify-between text-slate-700 dark:text-slate-300">
                <span className="flex items-center space-x-1">
                  <Percent className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                  <span>GST Rate:</span>
                </span>
                <div className="flex items-center space-x-1">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={taxRate}
                    onChange={(e) => setTaxRate(e.target.value)}
                    disabled={isApproved}
                    className="w-12 text-right text-xs bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded px-1.5 py-0.5 text-slate-900 dark:text-white disabled:opacity-60 font-semibold"
                  />
                  <span>%</span>
                </div>
              </div>

              <div className="flex justify-between text-slate-700 dark:text-slate-300">
                <span>Tax Amount:</span>
                <span className="font-bold text-slate-900 dark:text-white">
                  {formatRupees(currentInvoice.taxAmountPaise, true)}
                </span>
              </div>

              <div className="pt-2.5 border-t border-slate-200 dark:border-slate-800 flex justify-between items-center">
                <span className="text-sm font-extrabold text-slate-900 dark:text-white">Total Amount:</span>
                <span className="text-lg font-extrabold text-indigo-600 dark:text-indigo-400">
                  {formatRupees(currentInvoice.totalPaise, true)}
                </span>
              </div>
            </div>
          </div>

        </div>

      </div>

      <AddItemModal
        isOpen={isAddItemOpen}
        onClose={() => setIsAddItemOpen(false)}
        onAdd={(newItem) => addItemLocally(newItem, catalog)}
      />

    </div>
  );
};
