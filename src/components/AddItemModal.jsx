import React, { useState } from 'react';
import { X, Plus, Package } from 'lucide-react';
import { usePricingStore } from '../store/pricingStore';

export const AddItemModal = ({ isOpen, onClose, onAdd }) => {
  const { catalog } = usePricingStore();
  const [selectedService, setSelectedService] = useState('');
  const [customText, setCustomText] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [customPrice, setCustomPrice] = useState('');

  if (!isOpen) return null;

  const handleSelectServiceChange = (e) => {
    const value = e.target.value;
    setSelectedService(value);
    if (value) {
      const item = catalog.find((c) => c.name === value);
      if (item) {
        setCustomPrice((item.unitPricePaise / 100).toString());
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const serviceObj = catalog.find((c) => c.name === selectedService);
    
    let unitPricePaise = null;
    if (customPrice !== '') {
      const priceNum = parseFloat(customPrice);
      if (!isNaN(priceNum) && priceNum >= 0) {
        unitPricePaise = Math.round(priceNum * 100);
      }
    } else if (serviceObj) {
      unitPricePaise = serviceObj.unitPricePaise;
    }

    onAdd({
      requestedText: customText || selectedService || 'Custom Item',
      matchedService: selectedService || null,
      quantity: Number(quantity) || 1,
      unitPricePaise,
      matchStatus: selectedService && unitPricePaise !== null ? 'matched' : 'not_found',
    });

    // Reset & close
    setSelectedService('');
    setCustomText('');
    setQuantity(1);
    setCustomPrice('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-6">
        
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center space-x-2 text-indigo-400">
            <Package className="w-5 h-5" />
            <h3 className="font-bold text-lg text-white">Add Item to Invoice</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Select Catalog Service (Optional)
            </label>
            <select
              value={selectedService}
              onChange={handleSelectServiceChange}
              className="w-full text-sm bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            >
              <option value="">-- Custom / Manual Entry --</option>
              {catalog.map((c) => (
                <option key={c._id || c.name} value={c.name}>
                  {c.name} (₹{(c.unitPricePaise / 100).toFixed(2)})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Item Description / Customer Text
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Website Maintenance Service"
              value={customText}
              onChange={(e) => setCustomText(e.target.value)}
              className="w-full text-sm bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Quantity
              </label>
              <input
                type="number"
                min="1"
                required
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="w-full text-sm bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Unit Price (₹)
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                placeholder="Auto or enter price"
                value={customPrice}
                onChange={(e) => setCustomPrice(e.target.value)}
                className="w-full text-sm bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-slate-400 hover:text-white bg-slate-800 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center space-x-2 px-5 py-2 text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl hover:from-indigo-500 hover:to-purple-500 shadow-lg shadow-indigo-500/20"
            >
              <Plus className="w-4 h-4" />
              <span>Add Item</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
