import React from 'react';
import { useFinance } from '../context/FinanceContext';
import { Dices, AlertCircle, Sparkles, X, ArrowRight, ShieldCheck } from 'lucide-react';

export const LifeEventsModal: React.FC = () => {
  const { activeLifeEvent, resolveLifeEvent, dismissLifeEvent } = useFinance();

  React.useEffect(() => {
    if (!activeLifeEvent) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        dismissLifeEvent();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeLifeEvent, dismissLifeEvent]);

  if (!activeLifeEvent) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="life-event-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn"
    >
      <div className="bg-slate-950 border border-purple-500/40 rounded-3xl max-w-xl w-full p-6 sm:p-7 shadow-2xl relative shadow-purple-500/10">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <Dices className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-purple-400 block">
                {activeLifeEvent.category} • Vibe Roulette (Press Esc to close)
              </span>
              <h3 id="life-event-title" className="text-lg font-black text-white tracking-tight">
                {activeLifeEvent.title}
              </h3>
            </div>
          </div>
          <button
            onClick={dismissLifeEvent}
            aria-label="Dismiss Life Event"
            className="text-slate-400 hover:text-white p-1 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Narrative Description */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 mb-6 text-xs sm:text-sm text-slate-300 leading-relaxed">
          {activeLifeEvent.description}
        </div>

        {/* Choice Cards */}
        <div className="space-y-3 mb-6">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
            Choose Your Financial Response:
          </span>

          {activeLifeEvent.choices.map((choice) => {
            const isGain = choice.amountDelta > 0;
            const isZero = choice.amountDelta === 0;

            return (
              <button
                key={choice.id}
                onClick={() => resolveLifeEvent(activeLifeEvent.id, choice.id)}
                className="w-full text-left p-4 rounded-2xl bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-purple-400/50 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 group active:scale-[0.99]"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-white group-hover:text-purple-300 transition-colors">
                      {choice.label}
                    </span>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/20">
                      {choice.tag}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 leading-tight">
                    {choice.description}
                  </p>
                </div>

                <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                  <div className="text-right font-mono">
                    <div
                      className={`text-sm font-black ${
                        isGain
                          ? 'text-emerald-400'
                          : isZero
                          ? 'text-slate-400'
                          : 'text-rose-400'
                      }`}
                    >
                      {isGain ? '+' : ''}₹{Math.abs(choice.amountDelta)}
                    </div>
                    <div className="text-[10px] text-slate-500">
                      {choice.healthDelta > 0 ? `+${choice.healthDelta} HP` : `${choice.healthDelta} HP`}
                    </div>
                  </div>

                  <div className="w-8 h-8 rounded-xl bg-slate-800 group-hover:bg-purple-500/20 group-hover:text-purple-300 flex items-center justify-center transition-colors">
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-purple-300" />
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        <p className="text-[11px] text-slate-500 text-center">
          Every decision immediately impacts your liquid wallet and recalculates your safe daily allowance.
        </p>
      </div>
    </div>
  );
};
