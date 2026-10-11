import React from 'react';
import { useFinance } from '../context/FinanceContext';
import {
  Activity,
  ShieldCheck,
  AlertTriangle,
  Flame,
  Award,
  Zap,
  CheckCircle2,
  HelpCircle
} from 'lucide-react';

export const HealthScoreCard: React.FC = () => {
  const { summary } = useFinance();
  const { healthAnalysis } = summary;

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-lime-400';
    if (score >= 60) return 'text-cyan-400';
    if (score >= 40) return 'text-amber-400';
    return 'text-rose-400';
  };

  const getGradeBg = (grade: string) => {
    switch (grade) {
      case 'S':
      case 'A':
        return 'bg-lime-400/10 text-lime-400 border-lime-400/30';
      case 'B':
        return 'bg-cyan-400/10 text-cyan-400 border-cyan-400/30';
      case 'C':
        return 'bg-amber-400/10 text-amber-300 border-amber-400/30';
      default:
        return 'bg-rose-500/10 text-rose-400 border-rose-500/30';
    }
  };

  return (
    <section className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl mb-8">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-5 border-b border-slate-800 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-cyan-400" />
            <h3 className="text-lg font-bold text-white tracking-tight">
              Financial Health &amp; Risk Radar
            </h3>
            <span
              className={`text-xs px-2.5 py-0.5 rounded-full font-bold uppercase border ${getGradeBg(
                healthAnalysis.grade
              )}`}
            >
              Grade {healthAnalysis.grade} • {healthAnalysis.riskTier}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Multifactor financial resilience score calculated across 5 core health pillars.
          </p>
        </div>

        {/* Score Dial */}
        <div className="flex items-center gap-3 bg-slate-950 px-4 py-2.5 rounded-2xl border border-slate-800">
          <div className="text-right">
            <span className="text-[10px] uppercase font-bold text-slate-500 block">
              Health Index
            </span>
            <span className={`text-2xl font-black font-mono leading-none ${getScoreColor(healthAnalysis.overallScore)}`}>
              {healthAnalysis.overallScore}
              <span className="text-xs text-slate-500 font-normal"> / 100</span>
            </span>
          </div>
          <div
            className={`w-12 h-12 rounded-xl border flex items-center justify-center font-black text-xl shadow-inner ${getGradeBg(
              healthAnalysis.grade
            )}`}
          >
            {healthAnalysis.grade}
          </div>
        </div>
      </div>

      {/* Top Headline & Strategic Recommendation */}
      <div className="bg-slate-950/70 border border-slate-800/80 rounded-2xl p-4 mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-lime-400/10 flex items-center justify-center text-lime-400 shrink-0">
            <Zap className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">{healthAnalysis.headline}</h4>
            <p className="text-xs text-slate-400">{healthAnalysis.topRecommendation}</p>
          </div>
        </div>

        {summary.projectedBrokeDay && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-semibold shrink-0">
            <AlertTriangle className="w-4 h-4 text-rose-400" />
            <span>Overdraft Risk: Day {summary.projectedBrokeDay}</span>
          </div>
        )}
      </div>

      {/* 5 Pillars Breakdown Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3.5">
        {healthAnalysis.pillars.map((pillar, idx) => {
          return (
            <div
              key={idx}
              className="bg-slate-950/90 border border-slate-800/80 rounded-2xl p-3.5 flex flex-col justify-between hover:border-slate-700 transition-colors"
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[11px] font-semibold text-slate-300">
                    {pillar.name}
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">
                    {pillar.weight}% wt
                  </span>
                </div>

                <div className="flex items-baseline justify-between mb-2">
                  <span className={`text-lg font-black font-mono ${getScoreColor(pillar.score)}`}>
                    {pillar.score}
                    <span className="text-[10px] text-slate-600 font-normal">/100</span>
                  </span>
                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.5 rounded uppercase ${
                      pillar.status === 'optimal'
                        ? 'bg-emerald-500/10 text-emerald-400'
                        : pillar.status === 'moderate'
                        ? 'bg-amber-400/10 text-amber-300'
                        : 'bg-rose-500/10 text-rose-400'
                    }`}
                  >
                    {pillar.status}
                  </span>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mb-2">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      pillar.score >= 80
                        ? 'bg-lime-400'
                        : pillar.score >= 55
                        ? 'bg-cyan-400'
                        : pillar.score >= 35
                        ? 'bg-amber-400'
                        : 'bg-rose-500'
                    }`}
                    style={{ width: `${pillar.score}%` }}
                  />
                </div>
              </div>

              <p className="text-[11px] text-slate-400 leading-tight italic pt-1">
                "{pillar.insight}"
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
};
