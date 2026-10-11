import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import { TransactionCategory } from '../types/finance';
import { PlusCircle, TrendingDown, TrendingUp, X, Sparkles } from 'lucide-react';

interface AddTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultType?: 'expense' | 'income';
}

const QUICK_PRESETS: Array<{ title: string; amount: number; category: TransactionCategory; type: 'expense' | 'income' }> = [
  { title: 'Chai & Maggi at Tapri', amount: 60, category: 'food', type: 'expense' },
  { title: 'Swiggy Lunch Bowl', amount: 240, category: 'food', type: 'expense' },
  { title: 'Auto / Rapido Ride', amount: 90, category: 'transport', type: 'expense' },
  { title: 'College Printouts & Stationery', amount: 80, category: 'utilities', type: 'expense' },
  { title: 'Freelance Design Help', amount: 800, category: 'income', type: 'income' },
  { title: 'Pocket Money / Mom Transfer', amount: 1000, category: 'income', type: 'income' }
];

export const AddTransactionModal: React.FC<AddTransactionModalProps> = ({
  isOpen,
  onClose,
  defaultType = 'expense'
}) => {
  const { currentDay, addTransaction, summary } = useFinance();

  const [type, setType] = useState<'expense' | 'income'>(defaultType);
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState<number>(150);
  const [category, setCategory] = useState<TransactionCategory>('food');
  const [vibeNote, setVibeNote] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || amount <= 0) return;

    addTransaction({
      title: title.trim(),
      amount,
      category,
      type,
      day: currentDay,
      tags: [category, type],
      vibeNote: vibeNote.trim() || undefined
    });

    onClose();
  };

  const applyPreset = (preset: (typeof QUICK_PRESETS)[0]) => {
    setTitle(preset.title);
    setAmount(preset.amount);
    setCategory(preset.category);
    setType(preset.type);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-slate-950 border border-slate-800 rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl relative">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-5">
          <div className="flex items-center gap-2.5">
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                type === 'expense'
                  ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                  : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
              }`}
            >
              {type === 'expense' ? <TrendingDown className="w-5 h-5" /> : <TrendingUp className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="text-lg font-bold text-white tracking-tight">
                {type === 'expense' ? 'Record Expense' : 'Log Extra Income'}
              </h3>
              <p className="text-xs text-slate-400">Recorded on Day {currentDay} of 30</p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close Modal"
            className="text-slate-400 hover:text-white p-1 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Presets */}
        <div className="mb-5">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-2">
            Quick Gen Z Presets:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {QUICK_PRESETS.map((p, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => applyPreset(p)}
                className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-[11px] text-slate-300 hover:text-white transition-all font-medium"
              >
                {p.title} ({p.type === 'expense' ? '-' : '+'}₹{p.amount})
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Toggle Type */}
          <div className="grid grid-cols-2 gap-2 bg-slate-900 p-1 rounded-xl border border-slate-800">
            <button
              type="button"
              onClick={() => setType('expense')}
              className={`py-2 text-xs font-bold rounded-lg transition-all ${
                type === 'expense'
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Expense (-₹)
            </button>
            <button
              type="button"
              onClick={() => setType('income')}
              className={`py-2 text-xs font-bold rounded-lg transition-all ${
                type === 'income'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Income (+₹)
            </button>
          </div>

          <div>
            <label className="text-slate-300 font-semibold block mb-1">Title / Description</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Chai, Metro, Freelance Gig"
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-lime-400"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-slate-300 font-semibold block mb-1">Amount (₹)</label>
              <input
                type="number"
                min="1"
                required
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm font-mono text-white focus:outline-none focus:ring-1 focus:ring-lime-400"
              />
            </div>

            <div>
              <label className="text-slate-300 font-semibold block mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as TransactionCategory)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-lime-400"
              >
                <option value="food">Food &amp; Dining</option>
                <option value="transport">Transport / Rides</option>
                <option value="entertainment">Fun &amp; Outings</option>
                <option value="shopping">Shopping &amp; Gear</option>
                <option value="utilities">Utilities &amp; Essentials</option>
                <option value="health">Health &amp; Meds</option>
                <option value="income">Income / Inflow</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-slate-300 font-semibold block mb-1">Vibe Note (Optional)</label>
            <input
              type="text"
              value={vibeNote}
              onChange={(e) => setVibeNote(e.target.value)}
              placeholder="e.g. Campus celebration, study snack"
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-lime-400"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`px-5 py-2 rounded-xl font-bold transition-all text-sm ${
                type === 'expense'
                  ? 'bg-rose-500 hover:bg-rose-400 text-white'
                  : 'bg-emerald-400 hover:bg-emerald-300 text-slate-950'
              }`}
            >
              {type === 'expense' ? 'Deduct Spend' : 'Add Cash'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
