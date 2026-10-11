import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import {
  Wallet,
  Coins,
  CalendarDays,
  ShieldCheck,
  TrendingDown,
  Info,
  PlusCircle,
  Sparkles,
  AlertTriangle
} from 'lucide-react';

interface DashboardHUDProps {
  onOpenAddExpense: () => void;
  onOpenAddIncome: () => void;
  onOpenSimulator: () => void;
}

export const DashboardHUD: React.FC<DashboardHUDProps> = ({
  onOpenAddExpense,
  onOpenAddIncome,
  onOpenSimulator
}) => {
  const { summary } = useFinance();
  const [showFormulaModal, setShowFormulaModal] = useState(false);

  const isBroke = summary.balance <= 0;
  const isDanger = summary.healthAnalysis.riskTier === 'CRITICAL' || summary.healthAnalysis.riskTier === 'DANGER';

  React.useEffect(() => {
    if (!showFormulaModal) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShowFormulaModal(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showFormulaModal]);

  return (
    <div className="space-y-6 mb-8">
      {/* 4 Connected Cockpit Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {/* Card 1: Liquid Balance */}
        <div className="relative overflow-hidden rounded-2xl bg-slate-900/90 border border-slate-800 p-5 shadow-lg transition-all hover:border-slate-700">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs uppercase tracking-wider font-semibold text-slate-400 flex items-center gap-1.5">
              <Wallet className="w-4 h-4 text-cyan-400" /> Liquid Balance
            </span>
            <span
              className={`text-[11px] font-bold px-2 py-0.5 rounded-full uppercase border ${
                isBroke
                  ? 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                  : isDanger
                  ? 'bg-amber-400/10 text-amber-300 border-amber-400/20'
                  : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
              }`}
            >
              {isBroke ? 'Overdraft' : isDanger ? 'Low Buffer' : 'Healthy'}
            </span>
          </div>

          <div className="flex items-baseline gap-2 mb-2">
            <span
              className={`text-3xl sm:text-4xl font-black tracking-tight font-mono ${
                isBroke ? 'text-rose-400' : 'text-white'
              }`}
            >
              ₹{summary.balance.toLocaleString('en-IN')}
            </span>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-400 border-t border-slate-800/80 pt-2.5 mt-2">
            <span>Budget: ₹{summary.initialBudget.toLocaleString('en-IN')}</span>
            <span className="text-slate-500">
              Spent: ₹{(summary.totalSpent + summary.totalCommittedPaid).toLocaleString('en-IN')}
            </span>
          </div>

          <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/5 rounded-full blur-2xl pointer-events-none" />
        </div>

        {/* Card 2: Safe Daily Allowance (The Core Metric) */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border-2 border-lime-400/40 p-5 shadow-xl shadow-lime-400/5 transition-all hover:border-lime-400">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs uppercase tracking-wider font-bold text-lime-400 flex items-center gap-1.5">
              <Coins className="w-4 h-4 text-lime-400" /> Safe Daily Allowance
            </span>
            <button
              onClick={() => setShowFormulaModal(true)}
              title="How is Safe Daily Allowance calculated?"
              className="text-slate-400 hover:text-lime-300 transition-colors p-0.5 rounded"
            >
              <Info className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-3xl sm:text-4xl font-black tracking-tight font-mono text-lime-400">
              ₹{summary.safeDailyAllowance.toLocaleString('en-IN')}
            </span>
            <span className="text-xs font-semibold text-slate-400">/ day</span>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-400 border-t border-slate-800/80 pt-2.5 mt-2">
            <span>{summary.remainingDays} days remaining</span>
            <span
              title={`Average burn is ₹${summary.averageDailyBurn}/day compared to safe limit of ₹${summary.safeDailyAllowance}/day`}
              className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${
                summary.averageDailyBurn > summary.safeDailyAllowance
                  ? 'bg-rose-500/10 text-rose-300 border-rose-500/30'
                  : 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
              }`}
            >
              {summary.averageDailyBurn > summary.safeDailyAllowance
                ? `🔥 ₹${summary.averageDailyBurn}/d Burn (Over)`
                : `🛡️ ₹${summary.averageDailyBurn}/d Burn (Optimal)`}
            </span>
          </div>

          <div className="absolute top-0 right-0 w-24 h-24 bg-lime-400/10 rounded-full blur-2xl pointer-events-none" />
        </div>

        {/* Card 3: Upcoming Commitments */}
        <div className="relative overflow-hidden rounded-2xl bg-slate-900/90 border border-slate-800 p-5 shadow-lg transition-all hover:border-slate-700">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs uppercase tracking-wider font-semibold text-slate-400 flex items-center gap-1.5">
              <CalendarDays className="w-4 h-4 text-purple-400" /> Upcoming Commitments
            </span>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/20">
              Protected
            </span>
          </div>

          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-3xl sm:text-4xl font-black tracking-tight font-mono text-purple-300">
              ₹{summary.totalCommittedUpcoming.toLocaleString('en-IN')}
            </span>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-400 border-t border-slate-800/80 pt-2.5 mt-2">
            <span>Ring-fenced for bills</span>
            <span className="text-slate-500">Rent, 5G, Splits</span>
          </div>

          <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/5 rounded-full blur-2xl pointer-events-none" />
        </div>

        {/* Card 4: Locked Savings Shield */}
        <div className="relative overflow-hidden rounded-2xl bg-slate-900/90 border border-slate-800 p-5 shadow-lg transition-all hover:border-slate-700">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs uppercase tracking-wider font-semibold text-slate-400 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" /> Locked Savings
            </span>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Untouchable
            </span>
          </div>

          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-3xl sm:text-4xl font-black tracking-tight font-mono text-emerald-400">
              ₹{summary.totalLockedSavings.toLocaleString('en-IN')}
            </span>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-400 border-t border-slate-800/80 pt-2.5 mt-2">
            <span>Total Saved: ₹{summary.totalAllSavings.toLocaleString('en-IN')}</span>
            <span className="text-emerald-400/90 text-[11px]">Emergency Cushion</span>
          </div>

          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />
        </div>
      </div>

      {/* Quick Action Navigation Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900/60 border border-slate-800/80 rounded-2xl p-3 sm:p-4">
        <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-400">
          <span className="font-semibold text-slate-200">Quick Actions:</span>
          <span>Log real transactions or simulate upcoming decisions</span>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
          <button
            onClick={onOpenAddExpense}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700/80 text-rose-300 border border-rose-500/20 text-xs sm:text-sm font-semibold transition-all hover:scale-[1.02]"
          >
            <TrendingDown className="w-4 h-4 text-rose-400" />
            <span>- Log Spend</span>
          </button>

          <button
            onClick={onOpenAddIncome}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700/80 text-emerald-300 border border-emerald-500/20 text-xs sm:text-sm font-semibold transition-all hover:scale-[1.02]"
          >
            <PlusCircle className="w-4 h-4 text-emerald-400" />
            <span>+ Add Income</span>
          </button>

          <button
            onClick={onOpenSimulator}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-lime-400 to-emerald-400 hover:from-lime-300 hover:to-emerald-300 text-slate-950 font-bold text-xs sm:text-sm shadow-md shadow-lime-400/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <Sparkles className="w-4 h-4 text-slate-950 fill-slate-950" />
            <span>⚡ What If? Simulator</span>
          </button>
        </div>
      </div>

      {/* Formula Explanation Modal */}
      {showFormulaModal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="formula-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn"
        >
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative">
            <h3 id="formula-modal-title" className="text-lg font-bold text-white mb-2 flex items-center gap-2">
              <Coins className="w-5 h-5 text-lime-400" /> Safe Daily Allowance Formula (Press Esc to close)
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Traditional apps tell you what you spent yesterday. Our dynamic formula tells you exactly what you can safely spend today without defaulting on rent or going broke on Day 30.
            </p>

            <div className="bg-slate-950 rounded-xl p-4 border border-slate-800 font-mono text-xs space-y-3 mb-5">
              <div className="text-lime-300 font-bold text-sm">
                Safe Daily Allowance = Max(0, (Balance - Upcoming Commitments) ÷ Days Remaining)
              </div>
              <div className="text-slate-400 text-[11px] space-y-1 pt-1 border-t border-slate-800">
                <div className="flex justify-between">
                  <span>Current Liquid Balance:</span>
                  <span className="text-white font-bold">₹{summary.balance.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between">
                  <span>- Upcoming Commitments (Rent, 5G):</span>
                  <span className="text-purple-400 font-bold">- ₹{summary.totalCommittedUpcoming.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between border-t border-slate-800/80 pt-1">
                  <span>= Uncommitted Liquid Cash:</span>
                  <span className="text-lime-400 font-bold">
                    ₹{Math.max(0, summary.balance - summary.totalCommittedUpcoming).toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>÷ Remaining Days:</span>
                  <span className="text-cyan-400 font-bold">{summary.remainingDays} Days</span>
                </div>
                <div className="flex justify-between border-t border-slate-800 pt-1 text-sm font-bold text-lime-400">
                  <span>Result:</span>
                  <span>₹{summary.safeDailyAllowance.toLocaleString('en-IN')} / day</span>
                </div>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-lime-400/10 border border-lime-400/20 text-xs text-lime-300 mb-5 flex items-start gap-2">
              <Sparkles className="w-4 h-4 shrink-0 mt-0.5" />
              <span>
                If you stick to ₹{summary.safeDailyAllowance}/day, you will 100% pay your PG rent, maintain your savings cushion, and survive all 30 days without financial panic.
              </span>
            </div>

            <button
              onClick={() => setShowFormulaModal(false)}
              className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-sm transition-colors"
            >
              Got it, Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
