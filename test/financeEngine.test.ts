import {
  computeFinanceSummary,
  simulateDecision,
  generateRunwayTrajectory
} from '../src/utils/financeEngine';
import {
  Transaction,
  Commitment,
  SavingsGoal,
  SimulationDraft
} from '../src/types/finance';

function assert(condition: boolean, message: string) {
  if (!condition) {
    console.error(`❌ FAILED: ${message}`);
    process.exit(1);
  } else {
    console.log(`✅ PASSED: ${message}`);
  }
}

console.log('🚀 Running Broke But Functional Engine Test Suite...\n');

// Test 1: Baseline Budget Integrity on Day 1
{
  const initialBudget = 10000;
  const currentDay = 1;
  const transactions: Transaction[] = [];
  const commitments: Commitment[] = [
    {
      id: 'c1',
      title: 'Rent',
      category: 'commitments',
      amount: 3000,
      dueDay: 15,
      status: 'pending',
      autoDeduct: false,
      iconName: 'Home',
      isEssential: true
    },
    {
      id: 'c2',
      title: '5G Recharge',
      category: 'utilities',
      amount: 299,
      dueDay: 9,
      status: 'pending',
      autoDeduct: true,
      iconName: 'Smartphone',
      isEssential: true
    }
  ];
  const savingsGoals: SavingsGoal[] = [
    {
      id: 's1',
      title: 'Emergency Cushion',
      targetAmount: 1500,
      currentSaved: 500,
      isLocked: true,
      deadlineDay: 30,
      emoji: '🛡️',
      color: '#10B981'
    }
  ];

  const summary = computeFinanceSummary(
    initialBudget,
    currentDay,
    transactions,
    commitments,
    savingsGoals
  );

  // Liquid Balance = 10,000 - 500 (saved) = 9,500
  assert(summary.balance === 9500, `Balance is ₹9,500 after initial locked savings (got ₹${summary.balance})`);

  // Total Upcoming Commitments = 3,000 + 299 = 3,299
  assert(
    summary.totalCommittedUpcoming === 3299,
    `Total upcoming commitments is ₹3,299 (got ₹${summary.totalCommittedUpcoming})`
  );

  // Remaining days on Day 1 = 30
  // Safe Daily Allowance = (9,500 - 3,299) / 30 = 6,201 / 30 = 206
  assert(
    summary.safeDailyAllowance === 206,
    `Safe daily allowance on Day 1 is ₹206/day (got ₹${summary.safeDailyAllowance})`
  );

  // Health Score should be healthy
  assert(
    summary.healthAnalysis.overallScore >= 70,
    `Health score on Day 1 is high (got ${summary.healthAnalysis.overallScore})`
  );
  assert(
    summary.healthAnalysis.riskTier === 'SAFE',
    `Risk tier is SAFE (got ${summary.healthAnalysis.riskTier})`
  );
}

// Test 2: Dynamic recalculation after spending ₹1,000 on Day 3
{
  const initialBudget = 10000;
  const currentDay = 3;
  const transactions: Transaction[] = [
    {
      id: 't1',
      title: 'Party & Outing',
      amount: 1000,
      category: 'entertainment',
      type: 'expense',
      day: 2,
      timestamp: new Date().toISOString()
    }
  ];
  const commitments: Commitment[] = [
    {
      id: 'c1',
      title: 'Rent',
      category: 'commitments',
      amount: 3000,
      dueDay: 15,
      status: 'pending',
      autoDeduct: false,
      iconName: 'Home',
      isEssential: true
    }
  ];
  const savingsGoals: SavingsGoal[] = [];

  const summary = computeFinanceSummary(
    initialBudget,
    currentDay,
    transactions,
    commitments,
    savingsGoals
  );

  // Balance = 10,000 - 1,000 = 9,000
  assert(summary.balance === 9000, `Balance reflects ₹1,000 expense (got ₹${summary.balance})`);

  // Remaining days on Day 3 = 30 - 3 + 1 = 28
  // Uncommitted = 9,000 - 3,000 = 6,000
  // Safe Daily Allowance = 6,000 / 28 = 214
  assert(
    summary.safeDailyAllowance === 214,
    `Safe daily allowance recalculated to ₹214/day (got ₹${summary.safeDailyAllowance})`
  );
}

// Test 3: Pre-Decision Simulator Sandbox Delta Check
{
  const initialBudget = 10000;
  const currentDay = 10;
  const transactions: Transaction[] = [];
  const commitments: Commitment[] = [
    {
      id: 'c1',
      title: 'Rent',
      category: 'commitments',
      amount: 3500,
      dueDay: 15,
      status: 'pending',
      autoDeduct: false,
      iconName: 'Home',
      isEssential: true
    }
  ];
  const savingsGoals: SavingsGoal[] = [];

  const currentSummary = computeFinanceSummary(
    initialBudget,
    currentDay,
    transactions,
    commitments,
    savingsGoals
  );

  // Candidate purchase: Sneaker drop ₹2,500
  const draft: SimulationDraft = {
    title: 'Sneaker Drop',
    amount: 2500,
    category: 'shopping',
    type: 'expense'
  };

  const simResult = simulateDecision(
    currentSummary,
    draft,
    commitments,
    savingsGoals,
    transactions
  );

  assert(simResult.balanceDelta === -2500, `Simulation balance delta is -₹2,500 (got ${simResult.balanceDelta})`);
  assert(
    simResult.dailyAllowanceDelta < 0,
    `Simulation drops daily allowance (delta: ₹${simResult.dailyAllowanceDelta}/day)`
  );
  assert(
    simResult.healthScoreDelta < 0,
    `Simulation drops health score (delta: ${simResult.healthScoreDelta} pts)`
  );
  assert(
    simResult.projectedDailyAllowance === Math.max(0, currentSummary.safeDailyAllowance + simResult.dailyAllowanceDelta),
    `Projected daily allowance math is exact`
  );
  assert(
    simResult.advice.length > 10,
    `AI advice is generated: "${simResult.advice}"`
  );
}

// Test 4: Trajectory Projection & Broke Point
{
  const initialBudget = 10000;
  const currentDay = 12;
  const transactions: Transaction[] = [
    {
      id: 't1',
      title: 'Heavy Spending',
      amount: 7000,
      category: 'shopping',
      type: 'expense',
      day: 5,
      timestamp: new Date().toISOString()
    }
  ];
  const commitments: Commitment[] = [
    {
      id: 'c1',
      title: 'Rent',
      category: 'commitments',
      amount: 2500,
      dueDay: 15,
      status: 'pending',
      autoDeduct: false,
      iconName: 'Home',
      isEssential: true
    }
  ];

  const summary = computeFinanceSummary(
    initialBudget,
    currentDay,
    transactions,
    commitments,
    []
  );

  // Balance = 10,000 - 7,000 = 3,000
  // Burn rate is 7,000 / 12 = 583/day
  // Broke day forecast should be triggered before Day 30!
  assert(
    summary.projectedBrokeDay !== undefined && summary.projectedBrokeDay < 30,
    `Broke point forecast identifies exhaustion before Day 30 (got Day ${summary.projectedBrokeDay})`
  );

  const runway = generateRunwayTrajectory(summary, transactions, commitments);
  assert(runway.length === 30, `Runway trajectory covers exactly 30 days (got ${runway.length})`);
}

console.log('\n🎉 ALL FINANCIAL ENGINE TESTS PASSED WITH 100% SUCCESS!\n');
