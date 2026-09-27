import React, { useState, useEffect } from 'react';
import {
  Database,
  Plus,
  RefreshCw,
  Search,
  Edit,
  Trash2,
} from 'lucide-react';
import { usePricingStore } from '../store/pricingStore';
import { AddServiceModal } from '../components/AddServiceModal';
import { formatRupees } from '../services/invoice.service';

export const ManagePricesPage = () => {
  const {
    catalog,
    isLoading,
    isSyncing,
    fetchCatalog,
    syncCatalog,
    addService,
    editService,
    removeService,
  } = usePricingStore();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState(null);

  useEffect(() => {
    fetchCatalog();
  }, []);

  const categories = ['all', ...new Set(catalog.map((c) => c.category).filter(Boolean))];

  const filteredCatalog = catalog.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.aliases && item.aliases.some((a) => a.toLowerCase().includes(searchTerm.toLowerCase())));

    const matchesCategory =
      selectedCategory === 'all' || item.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const handleOpenAdd = () => {
    setEditingService(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (service) => {
    setEditingService(service);
    setIsModalOpen(true);
  };

  const handleModalSubmit = async (payload) => {
    if (editingService) {
      await editService(editingService._id, payload);
    } else {
      await addService(payload);
    }
  };

  const handleDelete = async (service) => {
    if (window.confirm(`Delete "${service.name}" from MongoDB catalog?`)) {
      await removeService(service._id);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <div className="flex items-center space-x-2">
            <Database className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">
              Manage Price Catalog
            </h1>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            MongoDB is your Source of Truth. Manage service prices directly or reload from Google Sheet / CSV.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={syncCatalog}
            disabled={isSyncing}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-xs transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 ${isSyncing ? 'animate-spin' : ''}`} />
            <span>{isSyncing ? 'Syncing...' : 'Reload Sheet'}</span>
          </button>

          <button
            onClick={handleOpenAdd}
            className="flex items-center space-x-1.5 px-4 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition-colors shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Service</span>
          </button>
        </div>
      </div>

      {/* Filter & Search */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="sm:col-span-2 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search service name or alias..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="app-input w-full pl-9 pr-3 py-2 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none"
          />
        </div>

        <div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="app-input w-full px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none capitalize"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat === 'all' ? 'All Categories' : cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table with High Contrast Text for Light & Dark */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
        {isLoading ? (
          <div className="text-center py-8 text-slate-500 dark:text-slate-400 text-xs">Loading catalog...</div>
        ) : filteredCatalog.length === 0 ? (
          <div className="text-center py-8 text-slate-500 dark:text-slate-400 text-xs">
            No services found matching filters.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 dark:bg-slate-800/80 text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider border-b border-slate-200 dark:border-slate-700">
                <tr>
                  <th className="px-5 py-3.5">Service Name</th>
                  <th className="px-5 py-3.5">Price (₹)</th>
                  <th className="px-5 py-3.5">Billing Unit</th>
                  <th className="px-5 py-3.5">Category</th>
                  <th className="px-5 py-3.5">Aliases</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredCatalog.map((item) => (
                  <tr key={item._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                    
                    {/* SERVICE NAME (100% visible in Light & Dark mode!) */}
                    <td className="px-5 py-4 font-bold text-slate-900 dark:text-white text-sm">
                      {item.name}
                    </td>

                    <td className="px-5 py-4 font-extrabold text-emerald-600 dark:text-emerald-400 text-sm">
                      {formatRupees(item.unitPricePaise, true)}
                    </td>

                    <td className="px-5 py-4 font-medium text-slate-600 dark:text-slate-400">
                      {item.unit || 'each'}
                    </td>

                    <td className="px-5 py-4">
                      {item.category ? (
                        <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800/50">
                          {item.category}
                        </span>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </td>

                    <td className="px-5 py-4">
                      {item.aliases && item.aliases.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {item.aliases.map((alias, i) => (
                            <span key={i} className="text-[11px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded-md border border-slate-200 dark:border-slate-700">
                              {alias}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-slate-400 text-xs">None</span>
                      )}
                    </td>

                    <td className="px-5 py-4 text-right space-x-1">
                      <button
                        onClick={() => handleOpenEdit(item)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        title="Edit service"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(item)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                        title="Delete service"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <AddServiceModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleModalSubmit}
        initialData={editingService}
      />

    </div>
  );
};
