import React, { useEffect, useState } from 'react';
import { useFinance } from '../context/FinanceContext';

/**
 * Screen-Reader Accessible Dynamic Status Announcer
 * Emits polite live updates to assistive technology whenever crucial
 * financial timeline metrics or allowances change.
 */
export const AriaLiveAnnouncer: React.FC = () => {
  const { currentDay, summary, isAusterityMode } = useFinance();
  const [announcement, setAnnouncement] = useState('');

  useEffect(() => {
    const message = `Day ${currentDay} active. Liquid cash is ₹${summary.balance.toLocaleString('en-IN')}. Safe daily allowance is ₹${summary.safeDailyAllowance} per day. Risk tier: ${summary.healthAnalysis.riskTier}.${
      isAusterityMode ? ' Warning: Austerity mode panic freeze is engaged.' : ''
    }`;
    setAnnouncement(message);
  }, [currentDay, summary.balance, summary.safeDailyAllowance, summary.healthAnalysis.riskTier, isAusterityMode]);

  return (
    <div
      role="status"
      aria-live="polite"
      aria-atomic="true"
      className="sr-only"
    >
      {announcement}
    </div>
  );
};
