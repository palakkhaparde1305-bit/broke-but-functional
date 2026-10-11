import React from 'react';
import { useFinance } from '../context/FinanceContext';
import { USER_PROFILES } from '../data/initialData';
import { Volume2, VolumeX, RotateCcw } from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    profile,
    currentDay,
    switchProfile,
    isAudioMuted,
    toggleAudio,
    resetAll
  } = useFinance();

  const progressPercent = Math.min(100, Math.round((currentDay / 30) * 100));

  return (
    <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-lime-400 via-emerald-500 to-cyan-500 p-0.5 shadow-lg shadow-lime-500/10 flex items-center justify-center font-black text-slate-950 text-xl tracking-tighter">
              BBF
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base sm:text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                  BROKE BUT FUNCTIONAL
                </span>
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-lime-400/10 text-lime-400 border border-lime-400/20">
                  ₹10k • 30-Day OS
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                Gen Z Financial Operating System &amp; Survival Simulator
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <div className="relative hidden md:flex items-center">
              <select
                aria-label="Select Profile Persona"
                value={profile.id}
                onChange={(e) => switchProfile(e.target.value)}
                className="bg-slate-900 border border-slate-700/80 rounded-lg text-xs font-medium text-slate-200 py-1.5 pl-3 pr-8 focus:outline-none focus:ring-2 focus:ring-lime-400/50 cursor-pointer appearance-none"
              >
                {USER_PROFILES.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.avatar} {p.name}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute right-2 text-slate-400 text-xs">▼</div>
            </div>

            <button
              onClick={toggleAudio}
              title={isAudioMuted ? 'Unmute Sound Effects' : 'Mute Sound Effects'}
              aria-label={isAudioMuted ? 'Unmute sound effects' : 'Mute sound effects'}
              className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
            >
              {isAudioMuted ? <VolumeX className="w-4 h-4 text-slate-500" /> : <Volume2 className="w-4 h-4 text-lime-400" />}
            </button>

            <button
              onClick={() => {
                if (window.confirm('Reset the month to Day 1 and start fresh with ₹10,000?')) {
                  resetAll();
                }
              }}
              title="Reset Month"
              aria-label="Reset Month to Day 1"
              className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-rose-400 hover:bg-slate-800 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="w-full bg-slate-900 h-1 overflow-hidden relative">
          <div
            className="bg-gradient-to-r from-lime-400 via-cyan-400 to-purple-500 h-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>
    </header>
  );
};
