import React, { useState, useMemo } from 'react';
import { useFinance } from '../context/FinanceContext';
import { SimulationDraft, TransactionCategory } from '../types/finance';
import { simulateDecision } from '../utils/financeEngine';
import {
  Sparkles,
  ArrowRight,
  AlertTriangle,
  CheckCircle2,
  TrendingDown,
  TrendingUp,
  X,
  HelpCircle,
  ShieldAlert,
  Flame
} from 'lucide-react';

interface DecisionSimulatorProps {
  isOpen: boolean;
  onClose: () => void;
}

const PRESET_SCENARIOS: Array<{
  title: string;
  amount: number;
  category: TransactionCategory;
  type: 'expense' | 'income';
  emoji: string;
}> = [
  {
    title: 'Swiggy 2AM Late-Night Cravings',
    amount: 380,
    category: 'food',
    type: 'expense',
    emoji: '🍕'
  },
  {
    title: 'Sneaker Flash Sale Drop',
    amount: 2499,
    category: 'shopping',
    type: 'expense',
    emoji: '👟'
  },
  {
    title: 'Iced Hazelnut Oat Latte & Brownie',
    amount: 280,
    category: 'food',
    type: 'expense',
    emoji: '☕'
  },
  {
    title: 'Music Festival Weekend Pass',
    amount: 1500,
    category: 'entertainment',
    type: 'expense',
    emoji: '🎟️'
  },
  {
    title: 'Freelance UI Design Gig Payout',
    amount: 2500,
    category: 'income',
    type: 'income',
    emoji: '💼'
  },
  {
    title: 'Weekend Movie + Popcorn Combo',
    amount: 650,
    category: 'entertainment',
    type: 'expense',
    emoji: '🍿'
  }
];

export const DecisionSimulator: React.FC<DecisionSimulatorProps> = ({ isOpen, onClose }) => {
  const { summary, commitments, savingsGoals, transactions, commitSimulation } = useFinance();

  const [title, setTitle] = useState('Weekend Music Festival Pass');
  const [amount, setAmount] = useState<number>(1500);
  const [category, setCategory] = useState<TransactionCategory>('entertainment');
  const [type, setType] = useState<'expense' | 'income'>('expense');
  const [notes, setNotes] = useState('');

  const draft: SimulationDraft = useMemo(
    () => ({
      title: title || 'Simulated Decision',
      amount: Math.max(0, amount || 0),
      category,
      type,
      notes
    }),
    [title, amount, category, type, notes]
  );

  const simulationResult = useMemo(() => {
    return simulateDecision(summary, draft, commitments, savingsGoals, transactions);
  }, [summary, draft, commitments, savingsGoals, transactions]);

  const handleApplyPreset = (preset: (typeof PRESET_SCENARIOS)[0]) => {
    setTitle(preset.title);
    setAmount(preset.amount);
    setCategory(preset.category);
    setType(preset.type);
  };

  const handleCommit = () => {
    commitSimulation(draft);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md overflow-y-auto animate-fadeIn">
      <div className="bg-slate-950 border border-slate-800 rounded-3xl max-w-4xl w-full p-5 sm:p-7 shadow-2xl relative my-auto max-h-[95vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-lime-400/20 border border-lime-400/30 flex items-center justify-center text-lime-400 font-bold">
              <Sparkles className="w-5 h-5 fill-lime-400" />
            </div>
            <div>
              <h2 className="text-xl font-black text-white tracking-tight flex items-center gap-2">
                "What If?" Pre-Decision Simulator
              </h2>
              <p className="text-xs text-slate-400">
                Simulate the interconnected ripple effects on your ₹10,000 budget before spending a single rupee.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close Simulator"
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Preset Quick Chips */}
        <div className="mb-6">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2.5 block">
            Gen Z Scenarios (One-Click Presets):
          </span>
          <div className="flex flex-wrap gap-2">
            {PRESET_SCENARIOS.map((p, idx) => (
              <button
                key={idx}
                onClick={() => handleApplyPreset(p)}
                className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-lime-400/40 text-xs font-medium text-slate-300 hover:text-white transition-all flex items-center gap-1.5 active:scale-95"
              >
                <span>{p.emoji}</span>
                <span>{p.title}</span>
                <span className={p.type === 'expense' ? 'text-rose-400 font-mono' : 'text-emerald-400 font-mono'}>
                  ({p.type === 'expense' ? '-' : '+'}₹{p.amount})
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Input Parameters Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-6 bg-slate-900/60 p-4 rounded-2xl border border-slate-800/80">
          <div className="md:col-span-6 flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-300">Decision Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Swiggy Late Night, Sneaker Sale"
              className="bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-lime-400/50"
            />
          </div>

          <div className="md:col-span-3 flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-300">Amount (₹)</label>
            <input
              type="number"
              min="0"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-white font-mono focus:outline-none focus:ring-2 focus:ring-lime-400/50"
            />
          </div>

          <div className="md:col-span-3 flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-300">Decision Type</label>
            <div className="grid grid-cols-2 gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800">
              <button
                type="button"
                onClick={() => setType('expense')}
                className={`py-1.5 text-xs font-bold rounded-lg transition-all ${
                  type === 'expense'
                    ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Expense
              </button>
              <button
                type="button"
                onClick={() => setType('income')}
                className={`py-1.5 text-xs font-bold rounded-lg transition-all ${
                  type === 'income'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Income
              </button>
            </div>
          </div>
        </div>

        {/* Live Side-by-Side Interconnected Impact HUD */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-lime-400 flex items-center gap-1.5">
              <Flame className="w-4 h-4 text-lime-400" /> Interconnected Impact Analysis
            </span>
            <span className="text-xs text-slate-400">
              Comparing Before vs After Simulation
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            {/* Metric 1: Liquid Balance */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                Liquid Balance
              </span>
              <div className="flex items-baseline justify-between mb-1">
                <span className="text-xs font-mono text-slate-400">
                  ₹{simulationResult.currentBalance.toLocaleString('en-IN')}
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-600" />
                <span
                  className={`text-base font-bold font-mono ${
                    simulationResult.projectedBalance < 0
                      ? 'text-rose-400'
                      : simulationResult.balanceDelta >= 0
                      ? 'text-emerald-400'
                      : 'text-white'
                  }`}
                >
                  ₹{simulationResult.projectedBalance.toLocaleString('en-IN')}
                </span>
              </div>
              <div
                className={`text-xs font-bold font-mono mt-1 ${
                  simulationResult.balanceDelta >= 0 ? 'text-emerald-400' : 'text-rose-400'
                }`}
              >
                {simulationResult.balanceDelta >= 0 ? '+' : ''}₹
                {simulationResult.balanceDelta.toLocaleString('en-IN')}
              </div>
            </div>

            {/* Metric 2: Safe Daily Allowance */}
            <div className="bg-slate-900 border-2 border-lime-400/40 rounded-2xl p-4 shadow-lg shadow-lime-400/5">
              <span className="text-[11px] font-bold text-lime-400 uppercase tracking-wider block mb-1">
                Daily Allowance
              </span>
              <div className="flex items-baseline justify-between mb-1">
                <span className="text-xs font-mono text-slate-400">
                  ₹{simulationResult.currentDailyAllowance}/d
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-lime-400/60" />
                <span className="text-base font-black font-mono text-lime-400">
                  ₹{simulationResult.projectedDailyAllowance}/d
                </span>
              </div>
              <div
                className={`text-xs font-bold font-mono mt-1 ${
                  simulationResult.dailyAllowanceDelta >= 0 ? 'text-emerald-400' : 'text-rose-400'
                }`}
              >
                {simulationResult.dailyAllowanceDelta >= 0 ? '+' : ''}₹
                {simulationResult.dailyAllowanceDelta}/d across {summary.remainingDays} days
              </div>
            </div>

            {/* Metric 3: Financial Health Score */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                Financial Health
              </span>
              <div className="flex items-baseline justify-between mb-1">
                <span className="text-xs font-mono text-slate-400">
                  {simulationResult.currentHealthScore} / 100
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-600" />
                <span className="text-base font-bold font-mono text-cyan-400">
                  {simulationResult.projectedHealthScore} / 100
                </span>
              </div>
              <div
                className={`text-xs font-bold font-mono mt-1 ${
                  simulationResult.healthScoreDelta >= 0 ? 'text-emerald-400' : 'text-rose-400'
                }`}
              >
                {simulationResult.healthScoreDelta >= 0 ? '+' : ''}
                {simulationResult.healthScoreDelta} points
              </div>
            </div>

            {/* Metric 4: Risk Tier */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                Risk Outlook
              </span>
              <div className="flex items-baseline justify-between mb-1">
                <span className="text-xs font-mono text-slate-400">
                  {simulationResult.currentRiskTier}
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-600" />
                <span
                  className={`text-sm font-bold uppercase ${
                    simulationResult.projectedRiskTier === 'CRITICAL'
                      ? 'text-rose-400'
                      : simulationResult.projectedRiskTier === 'DANGER'
                      ? 'text-amber-400'
                      : 'text-emerald-400'
                  }`}
                >
                  {simulationResult.projectedRiskTier}
                </span>
              </div>
              <div className="text-[11px] text-slate-400 mt-1">
                Survival Odds: {simulationResult.survivalProbability}%
              </div>
            </div>
          </div>
        </div>

        {/* AI Vibe Verdict Banner */}
        <div
          className={`p-4 rounded-2xl border mb-6 flex items-start gap-3.5 ${
            simulationResult.severity === 'danger'
              ? 'bg-rose-500/10 border-rose-500/30 text-rose-200'
              : simulationResult.severity === 'warning'
              ? 'bg-amber-400/10 border-amber-400/30 text-amber-200'
              : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-200'
          }`}
        >
          {simulationResult.severity === 'danger' ? (
            <ShieldAlert className="w-6 h-6 text-rose-400 shrink-0 mt-0.5" />
          ) : simulationResult.severity === 'warning' ? (
            <AlertTriangle className="w-6 h-6 text-amber-400 shrink-0 mt-0.5" />
          ) : (
            <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0 mt-0.5" />
          )}
          <div className="space-y-1">
            <h4 className="text-sm font-bold">
              Gen Z Vibe Check:{' '}
              {simulationResult.severity === 'danger'
                ? 'High Risk Alert!'
                : simulationResult.severity === 'warning'
                ? 'Think Twice'
                : 'Safe to Send!'}
            </h4>
            <p className="text-xs leading-relaxed opacity-90">{simulationResult.advice}</p>
            {simulationResult.brokeDayForecast && (
              <p className="text-xs font-bold text-rose-400 pt-1">
                ⚠️ Warning: At this burn rate, you are projected to run out of money on Day{' '}
                {simulationResult.brokeDayForecast}!
              </p>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-4 border-t border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 font-semibold text-xs sm:text-sm border border-slate-800 transition-colors"
          >
            ❌ Walk Away / Discard
          </button>

          <button
            type="button"
            onClick={handleCommit}
            className={`w-full sm:w-auto px-6 py-2.5 rounded-xl font-bold text-xs sm:text-sm shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2 ${
              type === 'expense'
                ? 'bg-rose-500 hover:bg-rose-400 text-white shadow-rose-500/20'
                : 'bg-emerald-400 hover:bg-emerald-300 text-slate-950 shadow-emerald-400/20'
            }`}
          >
            <span>
              {type === 'expense' ? '💸 Commit Purchase & Deduct' : '💰 Log Simulated Income'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
