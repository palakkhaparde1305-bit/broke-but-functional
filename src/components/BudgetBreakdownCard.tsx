import React from 'react';
import { useFinance } from '../context/FinanceContext';
import { PieChart, ShieldAlert, Sparkles, CheckCircle2, AlertTriangle, Layers } from 'lucide-react';

export const BudgetBreakdownCard: React.FC = () => {
  const { summary, isAusterityMode, toggleAusterityMode } = useFinance();
  const { budgetBreakdown, initialBudget } = summary;

  const needsPercent = Math.min(100, Math.round((budgetBreakdown.fixedNeeds / initialBudget) * 100));
  const wantsPercent = Math.min(100, Math.round((budgetBreakdown.discretionaryWants / initialBudget) * 100));
  const savingsPercent = Math.min(100, Math.round((budgetBreakdown.lockedSavings / initialBudget) * 100));
  const bufferPercent = Math.max(0, 100 - needsPercent - wantsPercent - savingsPercent);

  return (
    <section
      aria-labelledby="budget-breakdown-heading"
      className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl mb-8"
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-slate-800 mb-5">
        <div>
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-cyan-400" />
            <h3 id="budget-breakdown-heading" className="text-lg font-bold text-white tracking-tight">
              Needs vs. Wants &amp; Capital Allocation
            </h3>
            <span className="text-xs px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 font-mono">
              ₹10k Distribution
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real-time classification of your ₹10,000 monthly allowance across essential obligations, lifestyle wants, and reserves.
          </p>
        </div>

        {/* Austerity Mode Panic Button */}
        <button
          onClick={toggleAusterityMode}
          aria-pressed={isAusterityMode}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shadow-md active:scale-95 border ${
            isAusterityMode
              ? 'bg-amber-400 text-slate-950 border-amber-400 shadow-amber-400/20'
              : 'bg-slate-800 hover:bg-slate-750 text-slate-300 border-slate-700 hover:text-white'
          }`}
          title="Toggle Austerity Shield to pause non-essential subscriptions and boost daily allowance"
        >
          <ShieldAlert className={`w-4 h-4 ${isAusterityMode ? 'text-slate-950' : 'text-amber-400'}`} />
          <span>{isAusterityMode ? 'Austerity Active (-Bills Paused)' : 'Austerity Shield'}</span>
        </button>
      </div>

      {/* Segmented Distribution Bar */}
      <div className="mb-5">
        <div className="flex items-center justify-between text-xs text-slate-400 mb-2 font-medium">
          <span>Allocation Matrix</span>
          <span className="font-mono text-slate-300">Total: ₹{initialBudget.toLocaleString('en-IN')}</span>
        </div>
        <div
          role="progressbar"
          aria-label="Budget Allocation Progress"
          aria-valuenow={100}
          aria-valuemin={0}
          aria-valuemax={100}
          className="h-3 w-full bg-slate-950 rounded-full overflow-hidden flex"
        >
          <div
            title={`Fixed Needs: ₹${budgetBreakdown.fixedNeeds}`}
            className="h-full bg-purple-500 transition-all duration-300"
            style={{ width: `${needsPercent}%` }}
          />
          <div
            title={`Discretionary Wants: ₹${budgetBreakdown.discretionaryWants}`}
            className="h-full bg-rose-500 transition-all duration-300"
            style={{ width: `${wantsPercent}%` }}
          />
          <div
            title={`Locked Reserves: ₹${budgetBreakdown.lockedSavings}`}
            className="h-full bg-emerald-400 transition-all duration-300"
            style={{ width: `${savingsPercent}%` }}
          />
          <div
            title={`Liquid Buffer: ₹${budgetBreakdown.liquidAvailable}`}
            className="h-full bg-lime-400 transition-all duration-300"
            style={{ width: `${bufferPercent}%` }}
          />
        </div>
      </div>

      {/* 4 Category Pillar Badges */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800">
          <div className="flex items-center gap-1.5 text-purple-400 font-semibold mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-purple-500 inline-block" />
            <span>Fixed Needs</span>
          </div>
          <div className="text-base font-black font-mono text-white">
            ₹{budgetBreakdown.fixedNeeds.toLocaleString('en-IN')}
          </div>
          <div className="text-[11px] text-slate-400 font-mono mt-0.5">{needsPercent}% • Rent, 5G, WiFi</div>
        </div>

        <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800">
          <div className="flex items-center gap-1.5 text-rose-400 font-semibold mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block" />
            <span>Discretionary Wants</span>
          </div>
          <div className="text-base font-black font-mono text-white">
            ₹{budgetBreakdown.discretionaryWants.toLocaleString('en-IN')}
          </div>
          <div className="text-[11px] text-slate-400 font-mono mt-0.5">{wantsPercent}% • Spends &amp; Subs</div>
        </div>

        <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800">
          <div className="flex items-center gap-1.5 text-emerald-400 font-semibold mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 inline-block" />
            <span>Locked Reserves</span>
          </div>
          <div className="text-base font-black font-mono text-white">
            ₹{budgetBreakdown.lockedSavings.toLocaleString('en-IN')}
          </div>
          <div className="text-[11px] text-slate-400 font-mono mt-0.5">{savingsPercent}% • Cushion</div>
        </div>

        <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800">
          <div className="flex items-center gap-1.5 text-lime-400 font-semibold mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-lime-400 inline-block" />
            <span>Available Buffer</span>
          </div>
          <div className="text-base font-black font-mono text-lime-400">
            ₹{budgetBreakdown.liquidAvailable.toLocaleString('en-IN')}
          </div>
          <div className="text-[11px] text-slate-400 font-mono mt-0.5">Flexible liquid cash</div>
        </div>
      </div>
    </section>
  );
};
