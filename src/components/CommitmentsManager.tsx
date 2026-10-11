import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import { Commitment, TransactionCategory } from '../types/finance';
import {
  CalendarDays,
  CheckCircle2,
  AlertCircle,
  Plus,
  Home,
  Music,
  Smartphone,
  Wifi,
  Dumbbell,
  CreditCard,
  X,
  Clock,
  Sparkles
} from 'lucide-react';

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  Music: <Music className="w-4 h-4 text-pink-400" />,
  Smartphone: <Smartphone className="w-4 h-4 text-cyan-400" />,
  Home: <Home className="w-4 h-4 text-amber-400" />,
  Wifi: <Wifi className="w-4 h-4 text-blue-400" />,
  Dumbbell: <Dumbbell className="w-4 h-4 text-emerald-400" />
};

export const CommitmentsManager: React.FC = () => {
  const {
    commitments,
    currentDay,
    toggleCommitmentPaid,
    skipCommitment,
    addCommitment,
    summary
  } = useFinance();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newAmount, setNewAmount] = useState<number>(300);
  const [newDueDay, setNewDueDay] = useState<number>(15);
  const [newCategory, setNewCategory] = useState<TransactionCategory>('utilities');
  const [newEssential, setNewEssential] = useState(true);

  React.useEffect(() => {
    if (!isAddModalOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsAddModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isAddModalOpen]);

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || newAmount <= 0) return;

    addCommitment({
      title: newTitle.trim(),
      amount: Math.max(1, Math.min(50000, newAmount)),
      dueDay: Math.min(30, Math.max(1, newDueDay)),
      category: newCategory,
      status: 'pending',
      autoDeduct: true,
      iconName: 'CreditCard',
      isEssential: newEssential,
      notes: 'Custom commitment'
    });

    setNewTitle('');
    setNewAmount(300);
    setIsAddModalOpen(false);
  };

  return (
    <section aria-labelledby="commitments-heading" className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl mb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-slate-800 mb-5">
        <div>
          <div className="flex items-center gap-2">
            <CalendarDays className="w-5 h-5 text-purple-400" />
            <h3 id="commitments-heading" className="text-lg font-bold text-white tracking-tight">
              Commitments &amp; Subscriptions
            </h3>
            <span className="text-xs px-2 py-0.5 rounded-full bg-purple-400/10 text-purple-300 border border-purple-400/20 font-mono">
              ₹{summary.totalCommittedUpcoming} Pending
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Fixed obligations ring-fenced from your daily allowance to guarantee zero defaults.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          aria-label="Add New Scheduled Commitment"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors"
        >
          <Plus className="w-3.5 h-3.5 text-lime-400" />
          <span>+ Add Bill</span>
        </button>
      </div>

      {/* Commitments List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {commitments.map((comm) => {
          const isOverdue = comm.dueDay < currentDay && comm.status === 'pending';
          const isDueToday = comm.dueDay === currentDay;
          const isPaid = comm.status === 'paid';
          const isSkipped = comm.status === 'skipped';

          return (
            <div
              key={comm.id}
              className={`p-4 rounded-2xl border transition-all relative overflow-hidden flex flex-col justify-between ${
                isPaid
                  ? 'bg-slate-950/40 border-slate-800/60 opacity-70'
                  : isSkipped
                  ? 'bg-slate-950/30 border-slate-800/40 opacity-50 line-through'
                  : isOverdue
                  ? 'bg-rose-950/20 border-rose-500/40 shadow-rose-950/20 shadow-lg'
                  : isDueToday
                  ? 'bg-amber-950/20 border-amber-500/40 shadow-amber-950/20 shadow-lg'
                  : 'bg-slate-900 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center">
                      {CATEGORY_ICONS[comm.iconName] || <CreditCard className="w-4 h-4 text-purple-400" />}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white leading-tight">{comm.title}</h4>
                      <span className="text-[11px] text-slate-400">
                        Due on Day {comm.dueDay} {isDueToday && '• Today!'}
                      </span>
                    </div>
                  </div>

                  <span
                    className={`text-xs font-bold font-mono px-2 py-0.5 rounded-full ${
                      isPaid
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : isSkipped
                        ? 'bg-slate-800 text-slate-500'
                        : isOverdue
                        ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                        : 'text-purple-300 font-semibold'
                    }`}
                  >
                    ₹{comm.amount.toLocaleString('en-IN')}
                  </span>
                </div>

                {comm.notes && (
                  <p className="text-[11px] text-slate-400 mb-3 italic">
                    "{comm.notes}"
                  </p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-800/80 mt-2 text-xs">
                <div className="flex items-center gap-1.5">
                  {comm.isEssential && (
                    <span className="text-[10px] font-semibold text-amber-400 bg-amber-400/10 px-1.5 py-0.5 rounded">
                      Vital
                    </span>
                  )}
                  {comm.autoDeduct && (
                    <span className="text-[10px] font-semibold text-cyan-400 bg-cyan-400/10 px-1.5 py-0.5 rounded">
                      Auto
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1.5">
                  {comm.status === 'pending' && !comm.isEssential && (
                    <button
                      onClick={() => skipCommitment(comm.id)}
                      className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 text-[11px] transition-colors"
                      title="Skip / Cancel this non-essential subscription to save money"
                    >
                      Skip
                    </button>
                  )}

                  <button
                    onClick={() => toggleCommitmentPaid(comm.id)}
                    className={`px-2.5 py-1 rounded-lg font-semibold text-[11px] transition-all flex items-center gap-1 ${
                      isPaid
                        ? 'bg-slate-800 hover:bg-slate-700 text-slate-400'
                        : 'bg-lime-400 hover:bg-lime-300 text-slate-950 font-bold'
                    }`}
                  >
                    {isPaid ? 'Unpay' : 'Pay Now'}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Commitment Modal */}
      {isAddModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="add-comm-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn"
        >
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 id="add-comm-modal-title" className="text-base font-bold text-white flex items-center gap-2">
                <Plus className="w-4 h-4 text-lime-400" /> Add Scheduled Commitment (Press Esc to close)
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                aria-label="Close Add Commitment Dialog"
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-4 text-xs">
              <div>
                <label htmlFor="comm-input-title" className="text-slate-300 font-semibold block mb-1">
                  Bill / Subscription Title
                </label>
                <input
                  id="comm-input-title"
                  type="text"
                  required
                  maxLength={80}
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Netflix Split, Gym Pass"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-lime-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="comm-input-amount" className="text-slate-300 font-semibold block mb-1">
                    Amount (₹)
                  </label>
                  <input
                    id="comm-input-amount"
                    type="number"
                    min="1"
                    max="50000"
                    required
                    value={newAmount}
                    onChange={(e) => setNewAmount(Math.max(1, Math.min(50000, Number(e.target.value) || 1)))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:ring-1 focus:ring-lime-400"
                  />
                </div>
                <div>
                  <label htmlFor="comm-input-dueday" className="text-slate-300 font-semibold block mb-1">
                    Due Day (1-30)
                  </label>
                  <input
                    id="comm-input-dueday"
                    type="number"
                    min="1"
                    max="30"
                    required
                    value={newDueDay}
                    onChange={(e) => setNewDueDay(Math.min(30, Math.max(1, Number(e.target.value) || 1)))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:ring-1 focus:ring-lime-400"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="comm-input-category" className="text-slate-300 font-semibold block mb-1">
                  Category
                </label>
                <select
                  id="comm-input-category"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as TransactionCategory)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-lime-400"
                >
                  <option value="commitments">Rent &amp; Housing</option>
                  <option value="utilities">Utilities &amp; 5G</option>
                  <option value="entertainment">Streaming &amp; Music</option>
                  <option value="health">Fitness &amp; Health</option>
                </select>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="vitalCheck"
                  checked={newEssential}
                  onChange={(e) => setNewEssential(e.target.checked)}
                  className="rounded bg-slate-950 border-slate-800 text-lime-400 focus:ring-0"
                />
                <label htmlFor="vitalCheck" className="text-slate-300 cursor-pointer">
                  Non-negotiable essential (cannot be easily skipped)
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-lime-400 text-slate-950 font-bold hover:bg-lime-300"
                >
                  Save Commitment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};
