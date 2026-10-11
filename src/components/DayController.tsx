import React from 'react';
import { useFinance } from '../context/FinanceContext';
import { Calendar, ChevronRight, Dices, Flame, Clock } from 'lucide-react';

export const DayController: React.FC = () => {
  const {
    currentDay,
    advanceDay,
    setDay,
    triggerRandomLifeEvent,
    summary
  } = useFinance();

  const daysLeft = Math.max(0, 30 - currentDay);
  const isMonthEnd = currentDay >= 30;

  return (
    <section className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xl shadow-black/40 mb-6">
      <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
        {/* Left: Time Machine Status */}
        <div className="flex items-center gap-4 w-full lg:w-auto">
          <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-lime-400/20 to-emerald-500/20 border border-lime-400/30 text-lime-400 font-bold text-lg shadow-inner">
            D{currentDay}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase tracking-wider font-semibold text-lime-400 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" /> 30-Day Time Machine
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-amber-400/10 text-amber-300 border border-amber-400/20">
                <Flame className="w-3 h-3 text-amber-400" /> Day {currentDay} of 30
              </span>
            </div>
            <h2 className="text-lg font-bold text-white tracking-tight">
              {isMonthEnd ? 'Month-End Survival Finale' : `${daysLeft} Days Remaining to Payday`}
            </h2>
          </div>
        </div>

        {/* Center: Interactive Day Scrubber */}
        <div className="w-full lg:max-w-md flex flex-col gap-1.5">
          <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
            <span>Day 1 (Start)</span>
            <span className="text-lime-300 font-mono font-semibold">
              Scrubber: Day {currentDay}
            </span>
            <span>Day 30 (Finish)</span>
          </div>
          <input
            type="range"
            min="1"
            max="30"
            value={currentDay}
            onChange={(e) => setDay(Number(e.target.value))}
            aria-label="30-Day Time Machine Scrubber"
            className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-lime-400 focus:outline-none"
          />
          {/* Key milestone pills */}
          <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono pt-0.5">
            <button
              onClick={() => setDay(1)}
              className={`hover:text-slate-300 transition-colors ${currentDay === 1 ? 'text-lime-400 font-bold' : ''}`}
            >
              D1
            </button>
            <button
              onClick={() => setDay(9)}
              className={`hover:text-slate-300 transition-colors ${currentDay === 9 ? 'text-lime-400 font-bold' : ''}`}
            >
              D9 (5G)
            </button>
            <button
              onClick={() => setDay(15)}
              className={`hover:text-slate-300 transition-colors ${currentDay === 15 ? 'text-rose-400 font-bold' : ''}`}
            >
              D15 (Rent)
            </button>
            <button
              onClick={() => setDay(24)}
              className={`hover:text-slate-300 transition-colors ${currentDay === 24 ? 'text-lime-400 font-bold' : ''}`}
            >
              D24 (Gym)
            </button>
            <button
              onClick={() => setDay(30)}
              className={`hover:text-slate-300 transition-colors ${currentDay === 30 ? 'text-emerald-400 font-bold' : ''}`}
            >
              D30 (Survive)
            </button>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
          <button
            onClick={triggerRandomLifeEvent}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 border border-purple-500/30 text-xs sm:text-sm font-semibold transition-all hover:scale-[1.02] active:scale-[0.98]"
            title="Trigger an unexpected life event shock"
          >
            <Dices className="w-4 h-4 text-purple-400 animate-spin-slow" />
            <span>Vibe Roulette</span>
          </button>

          <button
            onClick={advanceDay}
            disabled={isMonthEnd}
            className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold tracking-tight transition-all shadow-lg active:scale-[0.98] ${
              isMonthEnd
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                : 'bg-lime-400 hover:bg-lime-300 text-slate-950 shadow-lime-400/20 hover:shadow-lime-400/30'
            }`}
          >
            <span>{isMonthEnd ? 'Month Finished' : 'Advance Next Day'}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
};
