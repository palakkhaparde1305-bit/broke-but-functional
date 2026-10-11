import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import { LineChart, TrendingDown, AlertTriangle, ShieldCheck } from 'lucide-react';

export const RunwayChart: React.FC = () => {
  const { summary, runwayTrajectory, currentDay } = useFinance();
  const [hoveredPoint, setHoveredPoint] = useState<(typeof runwayTrajectory)[0] | null>(null);

  // SVG dimensions
  const width = 800;
  const height = 240;
  const padding = { top: 20, right: 30, bottom: 35, left: 55 };

  const innerWidth = width - padding.left - padding.right;
  const innerHeight = height - padding.top - padding.bottom;

  const maxBalance = Math.max(10000, summary.initialBudget);

  const getX = (day: number) => {
    return padding.left + ((day - 1) / 29) * innerWidth;
  };

  const getY = (val: number) => {
    const clamped = Math.max(0, Math.min(maxBalance, val));
    return padding.top + innerHeight - (clamped / maxBalance) * innerHeight;
  };

  // Build SVG path strings
  // 1. Ideal line
  const idealPath = runwayTrajectory
    .map((p, idx) => `${idx === 0 ? 'M' : 'L'} ${getX(p.day)} ${getY(p.ideal)}`)
    .join(' ');

  // 2. Actual line (up to currentDay)
  const actualPoints = runwayTrajectory.filter((p) => p.day <= currentDay);
  const actualPath = actualPoints
    .map((p, idx) => `${idx === 0 ? 'M' : 'L'} ${getX(p.day)} ${getY(p.actual ?? p.projected)}`)
    .join(' ');

  // 3. Projected line (from currentDay to 30)
  const projectedPoints = runwayTrajectory.filter((p) => p.day >= currentDay);
  const projectedPath = projectedPoints
    .map((p, idx) => `${idx === 0 ? 'M' : 'L'} ${getX(p.day)} ${getY(p.projected)}`)
    .join(' ');

  // Find projected broke day if any
  const brokePoint = runwayTrajectory.find((p) => p.day > currentDay && p.projected <= 0);

  return (
    <section className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl mb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-slate-800 mb-5">
        <div>
          <div className="flex items-center gap-2">
            <LineChart className="w-5 h-5 text-lime-400" />
            <h3 className="text-lg font-bold text-white tracking-tight">
              30-Day Financial Runway &amp; Trajectory Forecast
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real-time projection curve showing how current spending momentum carries you to Day 30.
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5 text-cyan-400">
            <span className="w-3 h-1 bg-cyan-400 rounded-full inline-block" />
            <span>Actual Spend</span>
          </div>
          <div className="flex items-center gap-1.5 text-purple-400">
            <span className="w-3 h-0.5 border-t-2 border-dashed border-purple-400 inline-block" />
            <span>Forecast Runway</span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-500">
            <span className="w-3 h-0.5 bg-slate-600 inline-block" />
            <span>Ideal Pacing</span>
          </div>
        </div>
      </div>

      {/* SVG Chart */}
      <div className="relative w-full overflow-x-auto">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-auto min-w-[600px] select-none"
        >
          {/* Background Grid Lines */}
          {[0, 2500, 5000, 7500, 10000].map((val) => {
            const y = getY(val);
            return (
              <g key={val}>
                <line
                  x1={padding.left}
                  y1={y}
                  x2={width - padding.right}
                  y2={y}
                  stroke="#1E293B"
                  strokeWidth="1"
                  strokeDasharray="4 4"
                />
                <text
                  x={padding.left - 8}
                  y={y + 4}
                  fill="#64748B"
                  fontSize="10"
                  textAnchor="end"
                  fontFamily="monospace"
                >
                  ₹{val}
                </text>
              </g>
            );
          })}

          {/* X Axis Day Labels */}
          {[1, 5, 10, 15, 20, 25, 30].map((d) => {
            const x = getX(d);
            return (
              <g key={d}>
                <line
                  x1={x}
                  y1={padding.top}
                  x2={x}
                  y2={height - padding.bottom}
                  stroke="#1E293B"
                  strokeWidth="1"
                />
                <text
                  x={x}
                  y={height - padding.bottom + 16}
                  fill={d === currentDay ? '#CCFF00' : '#64748B'}
                  fontWeight={d === currentDay ? 'bold' : 'normal'}
                  fontSize="11"
                  textAnchor="middle"
                  fontFamily="monospace"
                >
                  D{d}
                </text>
              </g>
            );
          })}

          {/* Current Day Marker Line */}
          <line
            x1={getX(currentDay)}
            y1={padding.top}
            x2={getX(currentDay)}
            y2={height - padding.bottom}
            stroke="#CCFF00"
            strokeWidth="1.5"
            strokeDasharray="2 2"
          />

          {/* 1. Ideal Guideline */}
          <path
            d={idealPath}
            fill="none"
            stroke="#334155"
            strokeWidth="1.5"
          />

          {/* 2. Projected Future Runway */}
          <path
            d={projectedPath}
            fill="none"
            stroke="#A855F7"
            strokeWidth="2.5"
            strokeDasharray="5 5"
          />

          {/* 3. Actual Line */}
          <path
            d={actualPath}
            fill="none"
            stroke="#06B6D4"
            strokeWidth="3"
            strokeLinecap="round"
          />

          {/* Projected Broke Day Red Flag */}
          {brokePoint && (
            <g transform={`translate(${getX(brokePoint.day)}, ${getY(0)})`}>
              <circle r="6" fill="#F43F5E" className="animate-ping opacity-75" />
              <circle r="5" fill="#F43F5E" />
              <text
                x="0"
                y="-12"
                fill="#F43F5E"
                fontSize="10"
                fontWeight="bold"
                textAnchor="middle"
              >
                Broke! (Day {brokePoint.day})
              </text>
            </g>
          )}

          {/* Interactive Hover Circles */}
          {runwayTrajectory.map((p) => {
            const isActual = p.day <= currentDay;
            const x = getX(p.day);
            const val = isActual ? p.actual ?? p.projected : p.projected;
            const y = getY(val);

            return (
              <circle
                key={p.day}
                cx={x}
                cy={y}
                r={p.day === currentDay ? 6 : 4}
                fill={isActual ? '#06B6D4' : '#A855F7'}
                stroke="#020617"
                strokeWidth="2"
                className="cursor-pointer hover:r-8 transition-all"
                onMouseEnter={() => setHoveredPoint(p)}
                onMouseLeave={() => setHoveredPoint(null)}
              />
            );
          })}
        </svg>

        {/* Hover Tooltip Overlay */}
        {hoveredPoint && (
          <div
            className="absolute top-2 right-4 bg-slate-950 border border-slate-700 rounded-xl p-3 shadow-2xl text-xs z-10 pointer-events-none"
          >
            <div className="font-bold text-white mb-1">
              Day {hoveredPoint.day} of 30 {hoveredPoint.day === currentDay && '(Today)'}
            </div>
            <div className="space-y-0.5 font-mono text-[11px]">
              {hoveredPoint.day <= currentDay ? (
                <div className="text-cyan-400">
                  Actual Balance: ₹{(hoveredPoint.actual ?? hoveredPoint.projected).toLocaleString('en-IN')}
                </div>
              ) : (
                <div className="text-purple-400">
                  Projected Balance: ₹{hoveredPoint.projected.toLocaleString('en-IN')}
                </div>
              )}
              <div className="text-slate-500">
                Ideal Benchmark: ₹{hoveredPoint.ideal.toLocaleString('en-IN')}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Chart Footer Insight */}
      <div className="mt-4 pt-3 border-t border-slate-800/80 flex flex-col sm:flex-row items-start sm:items-center justify-between text-xs text-slate-400 gap-2">
        <div className="flex items-center gap-2">
          {summary.projectedBrokeDay ? (
            <span className="text-rose-400 font-semibold flex items-center gap-1">
              <AlertTriangle className="w-3.5 h-3.5" />
              Caution: At current burn, balance exhausts before Day 30!
            </span>
          ) : (
            <span className="text-emerald-400 font-semibold flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              Runway Status: Projected to finish month safely with positive balance!
            </span>
          )}
        </div>
        <span className="text-slate-500">
          Daily burn velocity: ~₹{summary.averageDailyBurn}/day
        </span>
      </div>
    </section>
  );
};
