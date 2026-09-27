import React, { useState, useEffect } from 'react';
import { X, Save, Database } from 'lucide-react';

export const AddServiceModal = ({ isOpen, onClose, onSubmit, initialData = null }) => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [unit, setUnit] = useState('each');
  const [category, setCategory] = useState('');
  const [aliases, setAliases] = useState('');

  useEffect(() => {
    if (initialData) {
      setName(initialData.name || '');
      setPrice(initialData.price !== undefined ? initialData.price : (initialData.unitPricePaise / 100));
      setUnit(initialData.unit || 'each');
      setCategory(initialData.category || '');
      setAliases(initialData.aliases ? initialData.aliases.join(', ') : '');
    } else {
      setName('');
      setPrice('');
      setUnit('each');
      setCategory('');
      setAliases('');
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const parsedAliases = aliases
      .split(',')
      .map((a) => a.trim())
      .filter((a) => a.length > 0);

    const payload = {
      name: name.trim(),
      price: parseFloat(price),
      unit: unit.trim() || 'each',
      category: category.trim() || null,
      aliases: parsedAliases,
    };

    await onSubmit(payload);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-6">
        
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center space-x-2 text-indigo-400">
            <Database className="w-5 h-5" />
            <h3 className="font-bold text-lg text-white">
              {initialData ? 'Edit Service in Catalog' : 'Add New Service to Catalog'}
            </h3>
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
              Service Name <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Web Development"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full text-sm bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Price in Rupees (₹) <span className="text-rose-400">*</span>
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                required
                placeholder="e.g. 5000"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full text-sm bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Billing Unit
              </label>
              <input
                type="text"
                placeholder="e.g. each, hour, page"
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                className="w-full text-sm bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Category
            </label>
            <input
              type="text"
              placeholder="e.g. Software, Design, Marketing"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full text-sm bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Aliases (Comma-separated for AI fuzzy match)
            </label>
            <input
              type="text"
              placeholder="e.g. website, web app, frontend dev"
              value={aliases}
              onChange={(e) => setAliases(e.target.value)}
              className="w-full text-sm bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
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
              <Save className="w-4 h-4" />
              <span>{initialData ? 'Update Service' : 'Save Service'}</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
