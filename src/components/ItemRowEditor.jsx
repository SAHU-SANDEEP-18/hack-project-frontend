import React from 'react';
import { Trash2, HelpCircle, Check } from 'lucide-react';
import { MatchStatusBadge } from './StatusBadge';
import { formatRupees } from '../services/invoice.service';
import { usePricingStore } from '../store/pricingStore';

export const ItemRowEditor = ({ item, index, onUpdate, onDelete }) => {
  const { catalog } = usePricingStore();

  const handleServiceSelect = (e) => {
    const selectedName = e.target.value;
    if (!selectedName) {
      onUpdate(index, {
        matchedService: null,
        unitPricePaise: null,
        matchStatus: 'not_found',
      });
      return;
    }

    const catalogItem = catalog.find((c) => c.name === selectedName);
    if (catalogItem) {
      onUpdate(index, {
        matchedService: catalogItem.name,
        unitPricePaise: catalogItem.unitPricePaise,
        matchStatus: 'matched',
      });
    }
  };

  const handleCandidateClick = (candidateName) => {
    const catalogItem = catalog.find((c) => c.name === candidateName);
    if (catalogItem) {
      onUpdate(index, {
        matchedService: catalogItem.name,
        unitPricePaise: catalogItem.unitPricePaise,
        matchStatus: 'matched',
      });
    }
  };

  const handlePriceChange = (e) => {
    const val = parseFloat(e.target.value);
    const paise = isNaN(val) || val < 0 ? null : Math.round(val * 100);
    onUpdate(index, {
      unitPricePaise: paise,
      matchStatus: paise !== null && item.matchedService ? 'matched' : item.matchStatus,
    });
  };

  return (
    <div className={`p-4 rounded-xl border transition-colors ${
      item.matchStatus === 'matched'
        ? 'bg-slate-50 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700'
        : item.matchStatus === 'ambiguous'
        ? 'bg-amber-50 dark:bg-amber-950/20 border-amber-300 dark:border-amber-500/40'
        : 'bg-rose-50 dark:bg-rose-950/20 border-rose-300 dark:border-rose-500/40'
    }`}>
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
        
        {/* Customer Text & Catalog Dropdown */}
        <div className="md:col-span-5 space-y-1.5">
          <div className="text-xs text-slate-700 dark:text-slate-300">
            Prompt: <span className="text-slate-900 dark:text-white font-bold">"{item.requestedText}"</span>
          </div>

          <select
            value={item.matchedService || ''}
            onChange={handleServiceSelect}
            className="w-full text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-900 dark:text-white font-semibold focus:outline-none focus:border-indigo-500"
          >
            <option value="">-- Select Catalog Service --</option>
            {catalog.map((c) => (
              <option key={c._id || c.name} value={c.name}>
                {c.name} ({formatRupees(c.unitPricePaise, true)})
              </option>
            ))}
          </select>

          {/* Ambiguous candidate pills */}
          {item.matchStatus === 'ambiguous' && item.candidates && item.candidates.length > 0 && (
            <div className="mt-1.5 p-2 rounded bg-amber-100 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-500/20 text-xs">
              <span className="text-amber-800 dark:text-amber-300 font-semibold block mb-1 flex items-center gap-1">
                <HelpCircle className="w-3 h-3" /> Select candidate match:
              </span>
              <div className="flex flex-wrap gap-1">
                {item.candidates.map((cand) => (
                  <button
                    key={cand}
                    type="button"
                    onClick={() => handleCandidateClick(cand)}
                    className="flex items-center space-x-1 px-2 py-0.5 rounded bg-amber-500/20 text-amber-900 dark:text-amber-200 text-xs font-semibold hover:bg-amber-500/30 transition-colors"
                  >
                    <span>{cand}</span>
                    <Check className="w-3 h-3 text-amber-600 dark:text-amber-400" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Quantity */}
        <div className="md:col-span-2">
          <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-0.5">
            Quantity
          </label>
          <input
            type="number"
            min="1"
            value={item.quantity || 1}
            onChange={(e) => onUpdate(index, { quantity: Math.max(1, parseInt(e.target.value) || 1) })}
            className="w-full text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-900 dark:text-white font-bold focus:outline-none"
          />
        </div>

        {/* Unit Price (₹) */}
        <div className="md:col-span-2">
          <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-0.5">
            Unit Price (₹)
          </label>
          <input
            type="number"
            step="0.01"
            min="0"
            placeholder="No price"
            value={item.unitPricePaise !== null && item.unitPricePaise !== undefined ? (item.unitPricePaise / 100) : ''}
            onChange={handlePriceChange}
            className={`w-full text-xs bg-white dark:bg-slate-900 border rounded-lg px-2.5 py-1.5 text-slate-900 dark:text-white font-bold focus:outline-none ${
              item.unitPricePaise === null ? 'border-rose-400 dark:border-rose-500/50 text-rose-600 dark:text-rose-300' : 'border-slate-300 dark:border-slate-700'
            }`}
          />
        </div>

        {/* Line Total & Badge */}
        <div className="md:col-span-2 text-right">
          <div className="text-[11px] font-medium text-slate-500 dark:text-slate-400">Total</div>
          <div className="text-sm font-extrabold text-slate-900 dark:text-white">
            {formatRupees(item.lineTotalPaise || 0, true)}
          </div>
          <div className="mt-1 flex justify-end">
            <MatchStatusBadge status={item.matchStatus} />
          </div>
        </div>

        {/* Delete */}
        <div className="md:col-span-1 flex justify-end">
          <button
            type="button"
            onClick={() => onDelete(index)}
            className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-950/40 rounded-lg transition-colors"
            title="Remove item"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
