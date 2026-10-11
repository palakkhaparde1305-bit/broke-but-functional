import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import {
  Transaction,
  Commitment,
  SavingsGoal,
  LifeEvent,
  UserProfile,
  SimulationDraft
} from '../types/finance';
import {
  DEFAULT_COMMITMENTS,
  DEFAULT_SAVINGS_GOALS,
  LIFE_EVENTS_POOL,
  USER_PROFILES
} from '../data/initialData';
import {
  FinanceSummary,
  computeFinanceSummary,
  generateRunwayTrajectory
} from '../utils/financeEngine';
import { playAudio } from '../utils/audio';

interface FinanceContextType {
  profile: UserProfile;
  currentDay: number;
  transactions: Transaction[];
  commitments: Commitment[];
  savingsGoals: SavingsGoal[];
  lifeEvents: LifeEvent[];
  activeLifeEvent: LifeEvent | null;
  activeSimulation: SimulationDraft | null;
  isAudioMuted: boolean;
  hasFinishedMonth: boolean;
  summary: FinanceSummary;
  runwayTrajectory: { day: number; actual?: number; projected: number; ideal: number }[];
  advanceDay: () => void;
  setDay: (day: number) => void;
  addTransaction: (tx: Omit<Transaction, 'id' | 'timestamp'>) => void;
  deleteTransaction: (id: string) => void;
  toggleCommitmentPaid: (id: string) => void;
  skipCommitment: (id: string) => void;
  addCommitment: (c: Omit<Commitment, 'id'>) => void;
  addSavingsGoal: (g: Omit<SavingsGoal, 'id' | 'currentSaved'>) => void;
  depositToSavings: (goalId: string, amount: number) => void;
  withdrawFromSavings: (goalId: string, amount: number) => void;
  toggleGoalLock: (goalId: string) => void;
  triggerRandomLifeEvent: () => void;
  resolveLifeEvent: (eventId: string, choiceId: string) => void;
  dismissLifeEvent: () => void;
  switchProfile: (profileId: string) => void;
  toggleAudio: () => void;
  resetAll: () => void;
  setActiveSimulation: (draft: SimulationDraft | null) => void;
  commitSimulation: (draft: SimulationDraft) => void;
  closeMonthEndReport: () => void;
}

const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

const INITIAL_DEMO_TRANSACTIONS: Transaction[] = [
  {
    id: 'tx-init-1',
    title: 'Metro / Local Bus Pass',
    amount: 150,
    category: 'transport',
    type: 'expense',
    day: 1,
    timestamp: new Date().toISOString(),
    tags: ['commute', 'campus'],
    vibeNote: 'Day 1 travel essentials'
  },
  {
    id: 'tx-init-2',
    title: 'Canteen Thali & Chai',
    amount: 120,
    category: 'food',
    type: 'expense',
    day: 1,
    timestamp: new Date().toISOString(),
    tags: ['food', 'lunch'],
    vibeNote: 'Campus comfort food'
  }
];

export const FinanceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profile, setProfile] = useState<UserProfile>(USER_PROFILES[0]);
  const [currentDay, setCurrentDay] = useState<number>(1);
  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_DEMO_TRANSACTIONS);
  const [commitments, setCommitments] = useState<Commitment[]>(DEFAULT_COMMITMENTS);
  const [savingsGoals, setSavingsGoals] = useState<SavingsGoal[]>(DEFAULT_SAVINGS_GOALS);
  const [lifeEvents, setLifeEvents] = useState<LifeEvent[]>(LIFE_EVENTS_POOL);
  const [activeLifeEvent, setActiveLifeEvent] = useState<LifeEvent | null>(null);
  const [activeSimulation, setActiveSimulation] = useState<SimulationDraft | null>(null);
  const [isAudioMuted, setIsAudioMuted] = useState<boolean>(false);
  const [hasFinishedMonth, setHasFinishedMonth] = useState<boolean>(false);

  // Compute live summary
  const summary = useMemo(() => {
    return computeFinanceSummary(
      profile.initialBudget,
      currentDay,
      transactions,
      commitments,
      savingsGoals
    );
  }, [profile.initialBudget, currentDay, transactions, commitments, savingsGoals]);

  // Compute trajectory
  const runwayTrajectory = useMemo(() => {
    return generateRunwayTrajectory(summary, transactions, commitments);
  }, [summary, transactions, commitments]);

  // Advance day by 1
  const advanceDay = () => {
    if (currentDay >= 30) {
      setHasFinishedMonth(true);
      playAudio.success(isAudioMuted);
      return;
    }

    const nextDay = currentDay + 1;
    setCurrentDay(nextDay);
    playAudio.click(isAudioMuted);

    // Auto-deduct any commitment due on this day that has autoDeduct set to true
    commitments.forEach((comm) => {
      if (comm.dueDay === nextDay && comm.autoDeduct && comm.status === 'pending') {
        // Auto-pay it
        setCommitments((prev) =>
          prev.map((c) => (c.id === comm.id ? { ...c, status: 'paid' } : c))
        );
        // Log transaction
        const autoTx: Transaction = {
          id: 'tx-auto-' + comm.id + '-' + nextDay,
          title: comm.title + ' (Auto-Debit)',
          amount: comm.amount,
          category: comm.category,
          type: 'expense',
          day: nextDay,
          timestamp: new Date().toISOString(),
          tags: ['auto-debit', 'subscription'],
          vibeNote: 'Scheduled recurring commitment deducted'
        };
        setTransactions((prev) => [autoTx, ...prev]);
        playAudio.debit(isAudioMuted);
      }
    });

    // Check if an unhandled life event is scheduled for nextDay
    const scheduledEvent = lifeEvents.find(
      (e) => e.triggerDay === nextDay && !e.resolvedChoiceId
    );
    if (scheduledEvent) {
      setActiveLifeEvent(scheduledEvent);
      playAudio.warning(isAudioMuted);
    }

    if (nextDay === 30) {
      setHasFinishedMonth(true);
      playAudio.success(isAudioMuted);
    }
  };

  const setDay = (targetDay: number) => {
    const clamped = Math.min(30, Math.max(1, targetDay));
    setCurrentDay(clamped);
    playAudio.click(isAudioMuted);
    if (clamped === 30) {
      setHasFinishedMonth(true);
    }
  };

  const addTransaction = (tx: Omit<Transaction, 'id' | 'timestamp'>) => {
    const newTx: Transaction = {
      ...tx,
      id: 'tx-' + Date.now(),
      timestamp: new Date().toISOString()
    };
    setTransactions((prev) => [newTx, ...prev]);
    if (tx.type === 'expense') {
      playAudio.debit(isAudioMuted);
    } else {
      playAudio.coin(isAudioMuted);
    }
  };

  const deleteTransaction = (id: string) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
    playAudio.click(isAudioMuted);
  };

  const toggleCommitmentPaid = (id: string) => {
    setCommitments((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          const nextStatus = c.status === 'paid' ? 'pending' : 'paid';
          if (nextStatus === 'paid') {
            playAudio.debit(isAudioMuted);
          } else {
            playAudio.click(isAudioMuted);
          }
          return { ...c, status: nextStatus };
        }
        return c;
      })
    );
  };

  const skipCommitment = (id: string) => {
    setCommitments((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: 'skipped' } : c))
    );
    playAudio.warning(isAudioMuted);
  };

  const addCommitment = (c: Omit<Commitment, 'id'>) => {
    const newComm: Commitment = {
      ...c,
      id: 'comm-' + Date.now()
    };
    setCommitments((prev) => [...prev, newComm]);
    playAudio.coin(isAudioMuted);
  };

  const addSavingsGoal = (g: Omit<SavingsGoal, 'id' | 'currentSaved'>) => {
    const newGoal: SavingsGoal = {
      ...g,
      id: 'goal-' + Date.now(),
      currentSaved: 0
    };
    setSavingsGoals((prev) => [...prev, newGoal]);
    playAudio.coin(isAudioMuted);
  };

  const depositToSavings = (goalId: string, amount: number) => {
    if (amount <= 0 || amount > summary.balance) return;
    setSavingsGoals((prev) =>
      prev.map((g) => (g.id === goalId ? { ...g, currentSaved: g.currentSaved + amount } : g))
    );
    playAudio.coin(isAudioMuted);
  };

  const withdrawFromSavings = (goalId: string, amount: number) => {
    setSavingsGoals((prev) =>
      prev.map((g) => {
        if (g.id === goalId) {
          const clamped = Math.min(g.currentSaved, amount);
          return { ...g, currentSaved: g.currentSaved - clamped };
        }
        return g;
      })
    );
    playAudio.coin(isAudioMuted);
  };

  const toggleGoalLock = (goalId: string) => {
    setSavingsGoals((prev) =>
      prev.map((g) => (g.id === goalId ? { ...g, isLocked: !g.isLocked } : g))
    );
    playAudio.click(isAudioMuted);
  };

  const triggerRandomLifeEvent = () => {
    const unresolved = lifeEvents.filter((e) => !e.resolvedChoiceId);
    if (unresolved.length === 0) {
      // Re-arm events pool with fresh IDs
      const rearmed = LIFE_EVENTS_POOL.map((e, idx) => ({
        ...e,
        id: 'event-rand-' + Date.now() + '-' + idx,
        resolvedChoiceId: undefined
      }));
      setLifeEvents(rearmed);
      setActiveLifeEvent(rearmed[0]);
    } else {
      const randomEv = unresolved[Math.floor(Math.random() * unresolved.length)];
      setActiveLifeEvent(randomEv);
    }
    playAudio.dice(isAudioMuted);
  };

  const resolveLifeEvent = (eventId: string, choiceId: string) => {
    const ev = lifeEvents.find((e) => e.id === eventId);
    if (!ev) return;
    const choice = ev.choices.find((c) => c.id === choiceId);
    if (!choice) return;

    // Apply amount delta to transactions if non-zero
    if (choice.amountDelta !== 0) {
      const isExpense = choice.amountDelta < 0;
      const eventTx: Transaction = {
        id: 'tx-event-' + Date.now(),
        title: ev.title + ' (' + choice.label + ')',
        amount: Math.abs(choice.amountDelta),
        category: 'emergency',
        type: isExpense ? 'expense' : 'income',
        day: currentDay,
        timestamp: new Date().toISOString(),
        tags: ['life-event', choice.tag],
        vibeNote: choice.description
      };
      setTransactions((prev) => [eventTx, ...prev]);
    }

    setLifeEvents((prev) =>
      prev.map((e) =>
        e.id === eventId
          ? { ...e, resolvedChoiceId: choiceId, resolvedAtDay: currentDay }
          : e
      )
    );

    setActiveLifeEvent(null);

    if (choice.amountDelta < 0) {
      playAudio.debit(isAudioMuted);
    } else {
      playAudio.coin(isAudioMuted);
    }
  };

  const dismissLifeEvent = () => {
    setActiveLifeEvent(null);
  };

  const switchProfile = (profileId: string) => {
    const found = USER_PROFILES.find((p) => p.id === profileId);
    if (!found) return;
    setProfile(found);
    setCurrentDay(1);
    setCommitments(found.initialCommitments);
    setSavingsGoals(found.initialSavingsGoals);
    setTransactions(INITIAL_DEMO_TRANSACTIONS);
    setHasFinishedMonth(false);
    playAudio.coin(isAudioMuted);
  };

  const toggleAudio = () => {
    setIsAudioMuted((prev) => !prev);
  };

  const resetAll = () => {
    setCurrentDay(1);
    setCommitments(profile.initialCommitments);
    setSavingsGoals(profile.initialSavingsGoals);
    setTransactions(INITIAL_DEMO_TRANSACTIONS);
    setLifeEvents(LIFE_EVENTS_POOL);
    setActiveLifeEvent(null);
    setActiveSimulation(null);
    setHasFinishedMonth(false);
    playAudio.coin(isAudioMuted);
  };

  const commitSimulation = (draft: SimulationDraft) => {
    addTransaction({
      title: draft.title,
      amount: draft.amount,
      category: draft.category,
      type: draft.type,
      day: currentDay,
      tags: ['simulated-confirmed', draft.category],
      vibeNote: draft.notes || 'Committed after simulation check'
    });
    setActiveSimulation(null);
    playAudio.coin(isAudioMuted);
  };

  const closeMonthEndReport = () => {
    setHasFinishedMonth(false);
  };

  return (
    <FinanceContext.Provider
      value={{
        profile,
        currentDay,
        transactions,
        commitments,
        savingsGoals,
        lifeEvents,
        activeLifeEvent,
        activeSimulation,
        isAudioMuted,
        hasFinishedMonth,
        summary,
        runwayTrajectory,
        advanceDay,
        setDay,
        addTransaction,
        deleteTransaction,
        toggleCommitmentPaid,
        skipCommitment,
        addCommitment,
        addSavingsGoal,
        depositToSavings,
        withdrawFromSavings,
        toggleGoalLock,
        triggerRandomLifeEvent,
        resolveLifeEvent,
        dismissLifeEvent,
        switchProfile,
        toggleAudio,
        resetAll,
        setActiveSimulation,
        commitSimulation,
        closeMonthEndReport
      }}
    >
      {children}
    </FinanceContext.Provider>
  );
};

export const useFinance = () => {
  const context = useContext(FinanceContext);
  if (!context) {
    throw new Error('useFinance must be used within a FinanceProvider');
  }
  return context;
};
