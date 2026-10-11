import {
  Transaction,
  Commitment,
  SavingsGoal,
  SimulationDraft,
  SimulationResult,
  RiskTier,
  HealthScoreAnalysis,
  PillarScore
} from '../types/finance';

export interface FinanceSummary {
  currentDay: number;
  initialBudget: number;
  balance: number;
  totalSpent: number;
  totalIncome: number;
  totalCommittedUpcoming: number;
  totalCommittedPaid: number;
  totalLockedSavings: number;
  totalAllSavings: number;
  safeDailyAllowance: number;
  remainingDays: number;
  averageDailyBurn: number;
  projectedBrokeDay?: number;
  healthAnalysis: HealthScoreAnalysis;
  budgetBreakdown: {
    fixedNeeds: number;
    discretionaryWants: number;
    lockedSavings: number;
    liquidAvailable: number;
    totalAllocated: number;
  };
}

export function computeFinanceSummary(
  initialBudget: number,
  currentDay: number,
  transactions: Transaction[],
  commitments: Commitment[],
  savingsGoals: SavingsGoal[]
): FinanceSummary {
  const remainingDays = Math.max(1, 30 - currentDay + 1);

  // Sum transactions up to currentDay
  let totalSpent = 0;
  let totalIncome = 0;

  for (const t of transactions) {
    if (t.day <= currentDay) {
      if (t.type === 'expense') {
        totalSpent += t.amount;
      } else if (t.type === 'income') {
        totalIncome += t.amount;
      }
    }
  }

  // Commitments
  let totalCommittedPaid = 0;
  let totalCommittedUpcoming = 0;

  for (const c of commitments) {
    if (c.status === 'paid') {
      totalCommittedPaid += c.amount;
    } else if (c.status === 'pending' && c.dueDay >= currentDay) {
      totalCommittedUpcoming += c.amount;
    }
  }

  // Savings goals
  let totalLockedSavings = 0;
  let totalAllSavings = 0;
  let totalTargetSavings = 0;

  for (const g of savingsGoals) {
    totalAllSavings += g.currentSaved;
    totalTargetSavings += g.targetAmount;
    if (g.isLocked) {
      totalLockedSavings += g.currentSaved;
    }
  }

  // Liquid wallet balance = Initial + Incomes - Expenses - Paid Commitments - Saved Funds
  const balance = Math.max(-5000, initialBudget + totalIncome - totalSpent - totalCommittedPaid - totalAllSavings);

  // Safe Daily Allowance Formula
  // (Balance - Upcoming Commitments - Locked Savings) / Remaining Days
  // Note: TotalAllSavings is already excluded from balance, so we only subtract upcoming commitments.
  const uncommittedLiquid = Math.max(0, balance - totalCommittedUpcoming);
  const safeDailyAllowance = Math.max(0, Math.floor(uncommittedLiquid / remainingDays));

  // Average daily burn rate across days elapsed
  const daysElapsed = Math.max(1, currentDay);
  const averageDailyBurn = Math.round((totalSpent + totalCommittedPaid) / daysElapsed);

  // Forecast projected broke day
  let projectedBrokeDay: number | undefined;
  if (averageDailyBurn > 0 && balance > 0) {
    const daysOfCashLeft = Math.floor(balance / averageDailyBurn);
    const estimatedDay = currentDay + daysOfCashLeft;
    if (estimatedDay < 30) {
      projectedBrokeDay = estimatedDay;
    }
  } else if (balance <= 0) {
    projectedBrokeDay = currentDay;
  }

  // Health Score Analysis
  const healthAnalysis = computeHealthScoreAnalysis(
    balance,
    initialBudget,
    totalCommittedUpcoming,
    totalAllSavings,
    totalTargetSavings,
    safeDailyAllowance,
    averageDailyBurn,
    remainingDays,
    currentDay
  );

  // Budget Breakdown: Needs vs Wants vs Savings vs Spending Buffer
  let fixedNeeds = 0;
  let discretionaryCommitments = 0;
  for (const c of commitments) {
    if (c.status !== 'skipped') {
      if (c.isEssential) {
        fixedNeeds += c.amount;
      } else {
        discretionaryCommitments += c.amount;
      }
    }
  }

  const discretionaryExpenses = totalSpent;
  const discretionaryWants = discretionaryCommitments + discretionaryExpenses;
  const liquidAvailable = Math.max(0, balance - totalCommittedUpcoming);
  const totalAllocated = fixedNeeds + discretionaryWants + totalLockedSavings + liquidAvailable;

  const budgetBreakdown = {
    fixedNeeds,
    discretionaryWants,
    lockedSavings: totalLockedSavings,
    liquidAvailable,
    totalAllocated
  };

  return {
    currentDay,
    initialBudget,
    balance,
    totalSpent,
    totalIncome,
    totalCommittedUpcoming,
    totalCommittedPaid,
    totalLockedSavings,
    totalAllSavings,
    safeDailyAllowance,
    remainingDays,
    averageDailyBurn,
    projectedBrokeDay,
    healthAnalysis,
    budgetBreakdown
  };
}

export function computeHealthScoreAnalysis(
  balance: number,
  initialBudget: number,
  upcomingCommitments: number,
  totalSaved: number,
  targetSaved: number,
  safeDailyAllowance: number,
  averageDailyBurn: number,
  remainingDays: number,
  currentDay: number
): HealthScoreAnalysis {
  // 1. Liquidity Runway (Weight 30%)
  const expectedProratedBudget = initialBudget * (remainingDays / 30);
  let liquidityScore = 0;
  if (balance <= 0) {
    liquidityScore = 0;
  } else {
    const ratio = balance / Math.max(1, expectedProratedBudget);
    liquidityScore = Math.min(100, Math.max(0, Math.round(ratio * 90)));
  }

  const liquidityPillar: PillarScore = {
    name: 'Liquidity Runway',
    score: liquidityScore,
    weight: 30,
    status: liquidityScore >= 75 ? 'optimal' : liquidityScore >= 45 ? 'moderate' : 'critical',
    insight:
      liquidityScore >= 75
        ? 'Healthy balance buffer to complete remaining ' + remainingDays + ' days.'
        : liquidityScore >= 45
        ? 'Liquidity is getting tight; monitor impulse spends.'
        : 'Dangerous burn rate! Cash runway is depleted.'
  };

  // 2. Commitment Coverage (Weight 25%)
  let commitmentScore = 100;
  if (upcomingCommitments > 0) {
    if (balance >= upcomingCommitments * 1.5) {
      commitmentScore = 100;
    } else if (balance >= upcomingCommitments) {
      commitmentScore = 75;
    } else {
      const coverageRatio = balance / upcomingCommitments;
      commitmentScore = Math.max(0, Math.round(coverageRatio * 50));
    }
  }

  const commitmentPillar: PillarScore = {
    name: 'Obligations Shield',
    score: commitmentScore,
    weight: 25,
    status: commitmentScore >= 75 ? 'optimal' : commitmentScore >= 50 ? 'moderate' : 'critical',
    insight:
      commitmentScore >= 75
        ? 'All upcoming bills and rent splits are 100% safeguarded.'
        : commitmentScore >= 50
        ? 'Upcoming commitments are barely covered by current cash.'
        : 'Warning: Deficit detected! You cannot pay all scheduled bills!'
  };

  // 3. Savings Shield (Weight 20%)
  const savingsRatio = targetSaved > 0 ? totalSaved / targetSaved : 1;
  const savingsScore = Math.min(100, Math.round(savingsRatio * 100));

  const savingsPillar: PillarScore = {
    name: 'Savings Lockbox',
    score: savingsScore,
    weight: 20,
    status: savingsScore >= 70 ? 'optimal' : savingsScore >= 35 ? 'moderate' : 'critical',
    insight:
      savingsScore >= 70
        ? 'Great savings discipline with ring-fenced backup funds.'
        : savingsScore >= 35
        ? 'Partial emergency cushion active.'
        : 'Minimal emergency reserves locked in.'
  };

  // 4. Daily Burn Discipline (Weight 15%)
  let disciplineScore = 80;
  if (safeDailyAllowance > 0 && averageDailyBurn > 0) {
    if (averageDailyBurn <= safeDailyAllowance) {
      disciplineScore = 100;
    } else {
      const overspendRatio = averageDailyBurn / safeDailyAllowance;
      disciplineScore = Math.max(10, Math.round(100 - (overspendRatio - 1) * 60));
    }
  } else if (balance <= 0) {
    disciplineScore = 10;
  }

  const disciplinePillar: PillarScore = {
    name: 'Daily Burn Discipline',
    score: disciplineScore,
    weight: 15,
    status: disciplineScore >= 75 ? 'optimal' : disciplineScore >= 45 ? 'moderate' : 'critical',
    insight:
      disciplineScore >= 75
        ? 'Daily spending is below or on track with safe allowance.'
        : 'Spending exceeds safe allowance. Downscale discretionary tags.'
  };

  // 5. Emergency Resilience (Weight 10%)
  const emergencySurplus = balance - upcomingCommitments - 800; // ability to take an ₹800 hit
  let resilienceScore = 50;
  if (emergencySurplus >= 500) {
    resilienceScore = 100;
  } else if (emergencySurplus >= 0) {
    resilienceScore = 75;
  } else if (emergencySurplus >= -400) {
    resilienceScore = 40;
  } else {
    resilienceScore = 10;
  }

  const resiliencePillar: PillarScore = {
    name: 'Shock Resilience',
    score: resilienceScore,
    weight: 10,
    status: resilienceScore >= 75 ? 'optimal' : resilienceScore >= 45 ? 'moderate' : 'critical',
    insight:
      resilienceScore >= 75
        ? 'Can absorb a surprise ₹800 expense without missing bills.'
        : 'A sudden ₹800 surprise will disrupt your monthly survival.'
  };

  // Weighted overall composite score
  const overallScore = Math.round(
    liquidityScore * 0.3 +
    commitmentScore * 0.25 +
    savingsScore * 0.2 +
    disciplineScore * 0.15 +
    resilienceScore * 0.1
  );

  let grade: 'S' | 'A' | 'B' | 'C' | 'D' | 'F' = 'C';
  if (overallScore >= 90) grade = 'S';
  else if (overallScore >= 80) grade = 'A';
  else if (overallScore >= 68) grade = 'B';
  else if (overallScore >= 50) grade = 'C';
  else if (overallScore >= 35) grade = 'D';
  else grade = 'F';

  let riskTier: RiskTier = 'SAFE';
  if (overallScore >= 75 && balance > upcomingCommitments) {
    riskTier = 'SAFE';
  } else if (overallScore >= 50 && balance > upcomingCommitments) {
    riskTier = 'CAUTION';
  } else if (balance > upcomingCommitments) {
    riskTier = 'DANGER';
  } else {
    riskTier = 'CRITICAL';
  }

  let headline = 'Smooth Sailing & Chill Vibes';
  let topRecommendation = 'Keep steady on your ₹' + safeDailyAllowance + '/day safe allowance.';

  if (riskTier === 'CRITICAL') {
    headline = '🚨 Code Red: Immediate Overdraft Threat';
    topRecommendation = 'Skip or negotiate non-essential commitments immediately to protect rent!';
  } else if (riskTier === 'DANGER') {
    headline = '⚠️ Thin Ice: Living on the Edge';
    topRecommendation = 'Avoid all non-essential retail and food delivery for the next 7 days.';
  } else if (riskTier === 'CAUTION') {
    headline = '🟡 Sweating Slightly: Manage Daily Spends';
    topRecommendation = 'Keep daily spends strictly under ₹' + safeDailyAllowance + ' to maintain your buffer.';
  }

  return {
    overallScore,
    grade,
    riskTier,
    pillars: [liquidityPillar, commitmentPillar, savingsPillar, disciplinePillar, resiliencePillar],
    headline,
    topRecommendation
  };
}

export function simulateDecision(
  currentSummary: FinanceSummary,
  draft: SimulationDraft,
  commitments: Commitment[],
  savingsGoals: SavingsGoal[],
  transactions: Transaction[]
): SimulationResult {
  const isExpense = draft.type === 'expense';
  const amountSigned = isExpense ? draft.amount : -draft.amount;

  // Create simulated transaction
  const simulatedTransactions: Transaction[] = [
    ...transactions,
    {
      id: 'simulated-temp',
      title: draft.title,
      amount: draft.amount,
      category: draft.category,
      type: draft.type,
      day: currentSummary.currentDay,
      timestamp: new Date().toISOString(),
      isSimulated: true
    }
  ];

  const simulatedSummary = computeFinanceSummary(
    currentSummary.initialBudget,
    currentSummary.currentDay,
    simulatedTransactions,
    commitments,
    savingsGoals
  );

  const balanceDelta = simulatedSummary.balance - currentSummary.balance;
  const dailyAllowanceDelta = simulatedSummary.safeDailyAllowance - currentSummary.safeDailyAllowance;
  const healthScoreDelta = simulatedSummary.healthAnalysis.overallScore - currentSummary.healthAnalysis.overallScore;

  let severity: 'safe' | 'warning' | 'danger' = 'safe';
  if (simulatedSummary.healthAnalysis.riskTier === 'CRITICAL' || simulatedSummary.balance <= 0) {
    severity = 'danger';
  } else if (simulatedSummary.healthAnalysis.riskTier === 'DANGER' || dailyAllowanceDelta < -40) {
    severity = 'warning';
  }

  // Witty Gen Z contextual advice
  let advice = '';
  if (isExpense) {
    if (severity === 'danger') {
      advice = '💀 Big Oof: This drops your safe daily allowance to ₹' + simulatedSummary.safeDailyAllowance + '/day and jeopardizes your commitments! Unless this is vital, skip it.';
    } else if (severity === 'warning') {
      advice = '👀 Proceed with caution: This cuts ₹' + Math.abs(dailyAllowanceDelta) + '/day from your daily allowance for the next ' + currentSummary.remainingDays + ' days.';
    } else {
      advice = '✅ Low impact vibe: Fits comfortably within your financial shield. Safe to proceed!';
    }
  } else {
    advice = '🚀 Cash injection alert! Boosts your safe daily allowance by +₹' + dailyAllowanceDelta + '/day and elevates your health score by +' + healthScoreDelta + ' pts!';
  }

  const survivalProbability = Math.max(
    5,
    Math.min(99, Math.round(simulatedSummary.healthAnalysis.overallScore * 0.95))
  );

  return {
    currentBalance: currentSummary.balance,
    projectedBalance: simulatedSummary.balance,
    balanceDelta,
    currentDailyAllowance: currentSummary.safeDailyAllowance,
    projectedDailyAllowance: simulatedSummary.safeDailyAllowance,
    dailyAllowanceDelta,
    currentHealthScore: currentSummary.healthAnalysis.overallScore,
    projectedHealthScore: simulatedSummary.healthAnalysis.overallScore,
    healthScoreDelta,
    currentRiskTier: currentSummary.healthAnalysis.riskTier,
    projectedRiskTier: simulatedSummary.healthAnalysis.riskTier,
    brokeDayForecast: simulatedSummary.projectedBrokeDay,
    severity,
    advice,
    survivalProbability
  };
}

export function generateRunwayTrajectory(
  summary: FinanceSummary,
  transactions: Transaction[],
  commitments: Commitment[]
): { day: number; actual?: number; projected: number; ideal: number }[] {
  const points = [];
  const initial = summary.initialBudget;
  const dailyIdealRate = initial / 30;

  // Map known balances per day
  let runningBalance = initial;
  const dayBalanceMap = new Map<number, number>();
  dayBalanceMap.set(1, initial);

  for (let d = 1; d <= summary.currentDay; d++) {
    // Spends on day d
    const daySpends = transactions
      .filter((t) => t.day === d && t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    const dayIncome = transactions
      .filter((t) => t.day === d && t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    const dayPaidBills = commitments
      .filter((c) => c.status === 'paid' && c.dueDay === d)
      .reduce((sum, c) => sum + c.amount, 0);

    runningBalance = runningBalance + dayIncome - daySpends - dayPaidBills;
    dayBalanceMap.set(d, runningBalance);
  }

  // Future projection from currentDay
  let futureProjected = summary.balance;
  const dailyFutureBurn = Math.max(150, summary.averageDailyBurn || 250);

  for (let d = 1; d <= 30; d++) {
    const ideal = Math.max(0, Math.round(initial - (d - 1) * dailyIdealRate));

    if (d <= summary.currentDay) {
      points.push({
        day: d,
        actual: dayBalanceMap.get(d) ?? summary.balance,
        projected: dayBalanceMap.get(d) ?? summary.balance,
        ideal
      });
    } else {
      // Future day
      const upcomingCommitmentOnDay = commitments
        .filter((c) => c.status === 'pending' && c.dueDay === d)
        .reduce((sum, c) => sum + c.amount, 0);

      futureProjected = Math.max(0, futureProjected - dailyFutureBurn - upcomingCommitmentOnDay);

      points.push({
        day: d,
        projected: futureProjected,
        ideal
      });
    }
  }

  return points;
}
