import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import { SavingsGoal } from '../types/finance';
import {
  Shield,
  Lock,
  Unlock,
  Plus,
  ArrowUpRight,
  ArrowDownLeft,
  X,
  Target,
  Sparkles
} from 'lucide-react';

export const SavingsLockbox: React.FC = () => {
  const {
    savingsGoals,
    depositToSavings,
    withdrawFromSavings,
    toggleGoalLock,
    addSavingsGoal,
    summary
  } = useFinance();

  const [activeGoalModal, setActiveGoalModal] = useState<{
    goal: SavingsGoal;
    type: 'deposit' | 'withdraw';
  } | null>(null);

  const [amountInput, setAmountInput] = useState<number>(200);

  // New goal state
  const [isAddGoalModalOpen, setIsAddGoalModalOpen] = useState(false);
  const [goalTitle, setGoalTitle] = useState('');
  const [goalTarget, setGoalTarget] = useState<number>(1000);
  const [goalEmoji, setGoalEmoji] = useState('🎯');

  React.useEffect(() => {
    if (!activeGoalModal && !isAddGoalModalOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setActiveGoalModal(null);
        setIsAddGoalModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeGoalModal, isAddGoalModalOpen]);

  const handleTransferSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeGoalModal || amountInput <= 0) return;

    if (activeGoalModal.type === 'deposit') {
      depositToSavings(activeGoalModal.goal.id, amountInput);
    } else {
      withdrawFromSavings(activeGoalModal.goal.id, amountInput);
    }

    setActiveGoalModal(null);
    setAmountInput(200);
  };

  const handleCreateGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!goalTitle.trim() || goalTarget <= 0) return;

    addSavingsGoal({
      title: goalTitle.trim(),
      targetAmount: Math.max(100, Math.min(50000, goalTarget)),
      isLocked: true,
      deadlineDay: 30,
      emoji: goalEmoji || '🎯',
      color: '#10B981'
    });

    setGoalTitle('');
    setGoalTarget(1000);
    setIsAddGoalModalOpen(false);
  };

  return (
    <section className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl mb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-slate-800 mb-5">
        <div>
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-emerald-400" />
            <h3 className="text-lg font-bold text-white tracking-tight">
              Savings Lockbox &amp; Reserves
            </h3>
            <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-400/10 text-emerald-300 border border-emerald-400/20 font-mono">
              ₹{summary.totalAllSavings} Stashed
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Locked funds are protected vaults excluded from daily spending calculations.
          </p>
        </div>

        <button
          onClick={() => setIsAddGoalModalOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors"
        >
          <Plus className="w-3.5 h-3.5 text-emerald-400" />
          <span>+ Create Vault</span>
        </button>
      </div>

      {/* Goals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {savingsGoals.map((goal) => {
          const progress = Math.min(
            100,
            Math.round((goal.currentSaved / (goal.targetAmount || 1)) * 100)
          );

          return (
            <div
              key={goal.id}
              className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between hover:border-slate-700 transition-all"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2.5">
                    <span className="text-2xl">{goal.emoji}</span>
                    <div>
                      <h4 className="text-sm font-bold text-white leading-tight">{goal.title}</h4>
                      <span className="text-[11px] text-slate-400">
                        Target by Day {goal.deadlineDay}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => toggleGoalLock(goal.id)}
                    title={goal.isLocked ? 'Locked (Untouchable)' : 'Unlocked'}
                    className={`p-1.5 rounded-lg border transition-colors ${
                      goal.isLocked
                        ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                        : 'bg-slate-800 border-slate-700 text-slate-400'
                    }`}
                  >
                    {goal.isLocked ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
                  </button>
                </div>

                {/* Progress Stats */}
                <div className="flex items-baseline justify-between text-xs mb-1.5 font-mono">
                  <span className="text-emerald-400 font-bold">
                    ₹{goal.currentSaved.toLocaleString('en-IN')}
                  </span>
                  <span className="text-slate-500">
                    of ₹{goal.targetAmount.toLocaleString('en-IN')} ({progress}%)
                  </span>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden mb-3">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-500 to-lime-400 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>

              {/* Deposit / Withdraw Controls */}
              <div className="flex items-center gap-2 pt-2 border-t border-slate-800/80 text-xs">
                <button
                  onClick={() => setActiveGoalModal({ goal, type: 'deposit' })}
                  disabled={summary.balance <= 0}
                  className="flex-1 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 font-semibold border border-emerald-500/20 transition-colors flex items-center justify-center gap-1 disabled:opacity-40"
                >
                  <ArrowDownLeft className="w-3.5 h-3.5" />
                  <span>Deposit</span>
                </button>

                <button
                  onClick={() => setActiveGoalModal({ goal, type: 'withdraw' })}
                  disabled={goal.currentSaved <= 0}
                  className="flex-1 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold transition-colors flex items-center justify-center gap-1 disabled:opacity-40"
                >
                  <ArrowUpRight className="w-3.5 h-3.5" />
                  <span>Withdraw</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Transfer Modal */}
      {activeGoalModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn"
          role="dialog"
          aria-modal="true"
          aria-labelledby="transfer-modal-title"
        >
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-sm w-full p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 id="transfer-modal-title" className="text-base font-bold text-white">
                {activeGoalModal.type === 'deposit' ? 'Deposit to Vault' : 'Withdraw from Vault'}
              </h3>
              <button
                type="button"
                onClick={() => setActiveGoalModal(null)}
                aria-label="Close transfer modal"
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-400 mb-4">
              {activeGoalModal.type === 'deposit'
                ? `Move liquid cash (available: ₹${summary.balance}) into "${activeGoalModal.goal.title}".`
                : `Move saved funds (vault: ₹${activeGoalModal.goal.currentSaved}) back to active balance.`}
            </p>

            <form onSubmit={handleTransferSubmit} className="space-y-4 text-xs">
              <div>
                <label htmlFor="transfer-amount" className="text-slate-300 font-semibold block mb-1">Amount (₹)</label>
                <input
                  id="transfer-amount"
                  type="number"
                  min="1"
                  max={
                    activeGoalModal.type === 'deposit'
                      ? summary.balance
                      : activeGoalModal.goal.currentSaved
                  }
                  required
                  value={amountInput}
                  onChange={(e) => setAmountInput(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:ring-1 focus:ring-emerald-400 text-sm"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setActiveGoalModal(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-400 text-slate-950 font-bold hover:bg-emerald-300"
                >
                  Confirm Transfer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add New Vault Modal */}
      {isAddGoalModalOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn"
          role="dialog"
          aria-modal="true"
          aria-labelledby="add-vault-modal-title"
        >
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-sm w-full p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 id="add-vault-modal-title" className="text-base font-bold text-white flex items-center gap-2">
                <Target className="w-4 h-4 text-emerald-400" /> New Savings Target
              </h3>
              <button
                type="button"
                onClick={() => setIsAddGoalModalOpen(false)}
                aria-label="Close create vault modal"
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateGoal} className="space-y-4 text-xs">
              <div>
                <label htmlFor="vault-goal-title" className="text-slate-300 font-semibold block mb-1">Goal Name</label>
                <input
                  id="vault-goal-title"
                  type="text"
                  required
                  value={goalTitle}
                  onChange={(e) => setGoalTitle(e.target.value)}
                  placeholder="e.g. Goa Trip, New Phone, Shoes"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-emerald-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="vault-goal-target" className="text-slate-300 font-semibold block mb-1">Target (₹)</label>
                  <input
                    id="vault-goal-target"
                    type="number"
                    min="100"
                    required
                    value={goalTarget}
                    onChange={(e) => setGoalTarget(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:ring-1 focus:ring-emerald-400"
                  />
                </div>
                <div>
                  <label htmlFor="vault-goal-emoji" className="text-slate-300 font-semibold block mb-1">Emoji Icon</label>
                  <input
                    id="vault-goal-emoji"
                    type="text"
                    value={goalEmoji}
                    onChange={(e) => setGoalEmoji(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white text-center focus:outline-none focus:ring-1 focus:ring-emerald-400"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddGoalModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-400 text-slate-950 font-bold hover:bg-emerald-300"
                >
                  Save Goal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};
