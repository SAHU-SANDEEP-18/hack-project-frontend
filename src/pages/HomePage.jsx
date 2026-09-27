import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Send } from 'lucide-react';
import { useInvoiceStore } from '../store/invoiceStore';

export const HomePage = () => {
  const [message, setMessage] = useState('');
  const { generateInvoice, isGenerating } = useInvoiceStore();
  const navigate = useNavigate();

  const handleActionCard = (promptText) => {
    setMessage(promptText);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim() || isGenerating) return;

    try {
      await generateInvoice(message);
      navigate('/review');
    } catch (err) {
      // Handled by store toast
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 min-h-[calc(100vh-2rem)] flex flex-col justify-between">
      
      {/* Top Welcome Header */}
      <div className="space-y-8 my-auto text-center py-6">
        
        <div className="space-y-2">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
            Welcome to Smart Invoice
          </h1>
          <p className="text-slate-500 text-sm sm:text-base max-w-lg mx-auto">
            Get started by creating an invoice task and AI can do the rest. Not sure where to start?
          </p>
        </div>

        {/* 4 Soft Action Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-2xl mx-auto text-left">
          
          <button
            type="button"
            onClick={() => handleActionCard('Please create an invoice for TechCorp (contact@techcorp.io). They ordered 2 Web Development services and 1 Logo Design.')}
            className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-indigo-500 hover:shadow-md transition-all flex items-center justify-between group"
          >
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-base shrink-0">
                📄
              </div>
              <span className="text-xs font-bold text-slate-800">
                Write prompt
              </span>
            </div>
            <span className="text-slate-400 group-hover:text-slate-700 text-sm font-bold">+</span>
          </button>

          <button
            type="button"
            onClick={() => handleActionCard('Bill Priya Mehta (priya.m@designhub.in) for 1 SEO Optimization package and 3 Social Media Post designs.')}
            className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-indigo-500 hover:shadow-md transition-all flex items-center justify-between group"
          >
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-base shrink-0">
                🪄
              </div>
              <span className="text-xs font-bold text-slate-800">
                Design Retainer
              </span>
            </div>
            <span className="text-slate-400 group-hover:text-slate-700 text-sm font-bold">+</span>
          </button>

          <button
            type="button"
            onClick={() => navigate('/prices')}
            className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-indigo-500 hover:shadow-md transition-all flex items-center justify-between group"
          >
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-base shrink-0">
                🏷️
              </div>
              <span className="text-xs font-bold text-slate-800">
                Price Catalog
              </span>
            </div>
            <span className="text-slate-400 group-hover:text-slate-700 text-sm font-bold">+</span>
          </button>

          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-indigo-500 hover:shadow-md transition-all flex items-center justify-between group"
          >
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-base shrink-0">
                📜
              </div>
              <span className="text-xs font-bold text-slate-800">
                View History
              </span>
            </div>
            <span className="text-slate-400 group-hover:text-slate-700 text-sm font-bold">+</span>
          </button>

        </div>

      </div>

      {/* Prompt Input Bar */}
      <div className="pt-4">
        <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-3xl p-4 shadow-lg shadow-slate-200/50 space-y-3">
          
          <textarea
            rows="3"
            required
            placeholder="Type customer message or invoice request..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full bg-transparent border-none text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-0 resize-none px-2 font-mono"
          />

          <div className="flex items-center justify-end border-t border-slate-100 pt-3 px-2 text-xs text-slate-500">
            <div className="flex items-center space-x-3">
              <span className="font-mono">{message.length}/3000</span>
              <button
                type="submit"
                disabled={isGenerating || !message.trim()}
                className="w-9 h-9 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white flex items-center justify-center transition-all disabled:opacity-40 shadow-sm"
              >
                {isGenerating ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

        </form>
      </div>

    </div>
  );
};
