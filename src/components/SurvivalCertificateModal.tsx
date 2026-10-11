import React, { useEffect, useRef } from 'react';
import { useFinance } from '../context/FinanceContext';
import confetti from 'canvas-confetti';
import {
  Trophy,
  Award,
  Sparkles,
  ShieldCheck,
  RotateCcw,
  Share2,
  X,
  CheckCircle2,
  Flame
} from 'lucide-react';

export const SurvivalCertificateModal: React.FC = () => {
  const { hasFinishedMonth, closeMonthEndReport, summary, resetAll, profile } = useFinance();
  const confettiTriggered = useRef(false);

  const { healthAnalysis, balance, totalAllSavings, totalSpent, totalCommittedPaid } = summary;
  const isSurviving = balance >= 0;

  useEffect(() => {
    if (hasFinishedMonth && !confettiTriggered.current) {
      confettiTriggered.current = true;
      try {
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 }
        });
      } catch {
        // Confetti fallback
      }
    }
    if (!hasFinishedMonth) {
      confettiTriggered.current = false;
    }
  }, [hasFinishedMonth]);

  if (!hasFinishedMonth) return null;

  const getTitleVerdict = () => {
    if (!isSurviving) {
      return {
        title: 'Broke But Learning',
        tag: 'Instant Maggi Survivor 🍜',
        description: 'You faced unexpected life curveballs and came up slightly short. The simulator proved where the leaks were!'
      };
    }
    if (healthAnalysis.overallScore >= 85) {
      return {
        title: 'Financial Zen Master',
        tag: 'Undefeated Gen Z Legend 👑',
        description: 'Mastered the ₹10,000 monthly cap with flying colors! Protected rent, locked savings, and maintained safe daily pacing.'
      };
    }
    if (healthAnalysis.overallScore >= 65) {
      return {
        title: 'Tactical Survivor',
        tag: 'Calculated Big Brain 🧠',
        description: 'Navigated 30 days of campus life and unexpected surprises without defaulting on bills.'
      };
    }
    return {
      title: 'Scraped By The Skin of Your Teeth',
      tag: 'Survivor by Inches ⚡',
      description: 'You made it across the 30-day finish line with ₹' + balance + ' to spare!'
    };
  };

  const verdict = getTitleVerdict();

  const handleCopyShare = () => {
    const text = `🏆 Broke But Functional: 30-Day Survival Report\n` +
      `Persona: ${profile.name}\n` +
      `Final Grade: ${healthAnalysis.grade} (${healthAnalysis.overallScore}/100)\n` +
      `Remaining Balance: ₹${balance.toLocaleString('en-IN')}\n` +
      `Total Saved: ₹${totalAllSavings.toLocaleString('en-IN')}\n` +
      `Verdict: ${verdict.tag}\n` +
      `Survived ₹10,000 over 30 days!`;

    navigator.clipboard.writeText(text);
    alert('Survival Report copied to clipboard! Share it with friends or on social media!');
  };

  React.useEffect(() => {
    if (!hasFinishedMonth) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeMonthEndReport();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [hasFinishedMonth, closeMonthEndReport]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="certificate-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn"
    >
      <div className="bg-slate-950 border border-lime-400/40 rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl relative shadow-lime-400/10">
        {/* Close Button */}
        <button
          onClick={closeMonthEndReport}
          className="absolute right-5 top-5 text-slate-400 hover:text-white p-1 rounded-lg"
          aria-label="Close Certificate Dialog"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Certificate Inner Frame */}
        <div className="border border-slate-800 rounded-2xl p-6 bg-gradient-to-b from-slate-900/90 to-slate-950 text-center relative overflow-hidden">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-lime-400 to-emerald-400 text-slate-950 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-lime-400/20">
            <Trophy className="w-9 h-9" />
          </div>

          <span className="text-[11px] font-bold uppercase tracking-widest text-lime-400 block mb-1">
            Official 30-Day Completion Badge (Press Esc to close)
          </span>
          <h2 id="certificate-modal-title" className="text-2xl sm:text-3xl font-black text-white tracking-tight mb-1">
            {verdict.title}
          </h2>
          <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-lime-400/10 text-lime-300 border border-lime-400/30 mb-4">
            {verdict.tag}
          </span>

          <p className="text-xs text-slate-300 leading-relaxed max-w-md mx-auto mb-6">
            {verdict.description}
          </p>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-6 text-left">
            <div className="bg-slate-950/80 border border-slate-800/80 p-3 rounded-xl">
              <span className="text-[10px] text-slate-500 font-semibold uppercase block">
                Final Grade
              </span>
              <span className="text-xl font-black font-mono text-lime-400">
                Grade {healthAnalysis.grade}
              </span>
            </div>

            <div className="bg-slate-950/80 border border-slate-800/80 p-3 rounded-xl">
              <span className="text-[10px] text-slate-500 font-semibold uppercase block">
                Ending Cash
              </span>
              <span className={`text-xl font-black font-mono ${isSurviving ? 'text-white' : 'text-rose-400'}`}>
                ₹{balance.toLocaleString('en-IN')}
              </span>
            </div>

            <div className="bg-slate-950/80 border border-slate-800/80 p-3 rounded-xl">
              <span className="text-[10px] text-slate-500 font-semibold uppercase block">
                Total Saved
              </span>
              <span className="text-xl font-black font-mono text-emerald-400">
                ₹{totalAllSavings.toLocaleString('en-IN')}
              </span>
            </div>

            <div className="bg-slate-950/80 border border-slate-800/80 p-3 rounded-xl">
              <span className="text-[10px] text-slate-500 font-semibold uppercase block">
                Bills Cleared
              </span>
              <span className="text-xl font-black font-mono text-purple-400">
                ₹{totalCommittedPaid.toLocaleString('en-IN')}
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={handleCopyShare}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs sm:text-sm border border-slate-700 transition-all flex items-center justify-center gap-2"
            >
              <Share2 className="w-4 h-4 text-cyan-400" />
              <span>Share Report Card</span>
            </button>

            <button
              onClick={() => {
                resetAll();
                closeMonthEndReport();
              }}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-lime-400 hover:bg-lime-300 text-slate-950 font-bold text-xs sm:text-sm shadow-lg shadow-lime-400/20 transition-all flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Start Month 2 Fresh</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
