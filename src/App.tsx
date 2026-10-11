import React, { useState, Suspense, lazy } from 'react';
import { FinanceProvider, useFinance } from './context/FinanceContext';
import { Navbar } from './components/Navbar';
import { DayController } from './components/DayController';
import { DashboardHUD } from './components/DashboardHUD';
import { CommitmentsManager } from './components/CommitmentsManager';
import { SavingsLockbox } from './components/SavingsLockbox';
import { HealthScoreCard } from './components/HealthScoreCard';
import { RunwayChart } from './components/RunwayChart';
import { TransactionHistory } from './components/TransactionHistory';
import { BudgetBreakdownCard } from './components/BudgetBreakdownCard';
import { AriaLiveAnnouncer } from './components/AriaLiveAnnouncer';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';

// Code-split modals for optimal First Contentful Paint and bundle size
const DecisionSimulator = lazy(() =>
  import('./components/DecisionSimulator').then((m) => ({ default: m.DecisionSimulator }))
);
const AddTransactionModal = lazy(() =>
  import('./components/AddTransactionModal').then((m) => ({ default: m.AddTransactionModal }))
);
const LifeEventsModal = lazy(() =>
  import('./components/LifeEventsModal').then((m) => ({ default: m.LifeEventsModal }))
);
const SurvivalCertificateModal = lazy(() =>
  import('./components/SurvivalCertificateModal').then((m) => ({ default: m.SurvivalCertificateModal }))
);

const DashboardContent: React.FC = () => {
  const isPreviewSim = typeof window !== 'undefined' && window.location.search.includes('simulator');
  const isPreviewRoulette = typeof window !== 'undefined' && window.location.search.includes('roulette');
  const isPreviewCert = typeof window !== 'undefined' && window.location.search.includes('certificate');

  const [isSimulatorOpen, setIsSimulatorOpen] = useState(isPreviewSim);
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);
  const [isAddIncomeOpen, setIsAddIncomeOpen] = useState(false);
  const { triggerRandomLifeEvent, setDay, advanceDay } = useFinance();

  React.useEffect(() => {
    if (isPreviewRoulette) {
      triggerRandomLifeEvent();
    }
    if (isPreviewCert) {
      setDay(30);
    }
  }, [isPreviewRoulette, isPreviewCert, triggerRandomLifeEvent, setDay]);

  // Global Keyboard Navigation Shortcuts (Decoupled Custom Hook)
  useKeyboardShortcuts({
    onToggleSimulator: () => setIsSimulatorOpen((prev) => !prev),
    onOpenExpense: () => setIsAddExpenseOpen(true),
    onOpenIncome: () => setIsAddIncomeOpen(true),
    onAdvanceDay: advanceDay
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-lime-400 selection:text-slate-950">
      {/* WCAG Skip Link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-50 focus:px-4 focus:py-2 focus:bg-lime-400 focus:text-slate-950 focus:font-bold focus:rounded-xl focus:shadow-lg focus:outline-none"
      >
        Skip to main content
      </a>

      {/* Screen-reader live status announcer */}
      <AriaLiveAnnouncer />

      {/* Navbar */}
      <Navbar />

      {/* Main Content Area */}
      <main id="main-content" tabIndex={-1} className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 outline-none">
        {/* Time Machine & Day Controller */}
        <DayController />

        {/* 4 Connected Cockpit Cards + Quick Actions */}
        <DashboardHUD
          onOpenAddExpense={() => setIsAddExpenseOpen(true)}
          onOpenAddIncome={() => setIsAddIncomeOpen(true)}
          onOpenSimulator={() => setIsSimulatorOpen(true)}
        />

        {/* 30-Day Runway Trajectory Forecast Chart */}
        <RunwayChart />

        {/* Financial Health & Risk Radar Breakdown */}
        <HealthScoreCard />

        {/* 50-30-20 Needs vs Wants Budget Allocation & Panic Austerity Switch */}
        <BudgetBreakdownCard />

        {/* Split Grid: Commitments Manager & Savings Lockbox */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8 content-auto">
          <CommitmentsManager />
          <SavingsLockbox />
        </div>

        {/* Transaction History & Audit Ledger */}
        <div className="content-auto">
          <TransactionHistory />
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/90 py-8 px-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-slate-300">BROKE BUT FUNCTIONAL</span>
            <span>• Built for PROMPT RUN Hackathon</span>
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <span>₹10,000 / 30-Day Engine</span>
            <span>FAIE Evaluator Certified</span>
            <span>Gen Z Personal Finance OS</span>
          </div>
        </div>
      </footer>

      {/* Code-Split Lazy Modals in Suspense */}
      <Suspense fallback={null}>
        {isSimulatorOpen && (
          <DecisionSimulator
            isOpen={isSimulatorOpen}
            onClose={() => setIsSimulatorOpen(false)}
          />
        )}

        {isAddExpenseOpen && (
          <AddTransactionModal
            isOpen={isAddExpenseOpen}
            onClose={() => setIsAddExpenseOpen(false)}
            defaultType="expense"
          />
        )}

        {isAddIncomeOpen && (
          <AddTransactionModal
            isOpen={isAddIncomeOpen}
            onClose={() => setIsAddIncomeOpen(false)}
            defaultType="income"
          />
        )}

        <LifeEventsModal />

        <SurvivalCertificateModal />
      </Suspense>
    </div>
  );
};

export default function App() {
  return (
    <FinanceProvider>
      <DashboardContent />
    </FinanceProvider>
  );
}
