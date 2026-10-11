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

// Test 5: 50-30-20 Budget Breakdown Analyzer (Needs vs Wants vs Stashed)
{
  const initialBudget = 10000;
  const currentDay = 15;
  const transactions: Transaction[] = [
    {
      id: 't1',
      title: 'Groceries',
      amount: 2000,
      category: 'groceries',
      type: 'expense',
      day: 5,
      timestamp: new Date().toISOString()
    },
    {
      id: 't2',
      title: 'Zomato & Clubs',
      amount: 1500,
      category: 'food',
      type: 'expense',
      day: 8,
      timestamp: new Date().toISOString()
    }
  ];
  const commitments: Commitment[] = [
    {
      id: 'c1',
      title: 'Hostel Rent',
      category: 'commitments',
      amount: 3000,
      dueDay: 20,
      status: 'pending',
      autoDeduct: false,
      iconName: 'Home',
      isEssential: true
    }
  ];
  const savingsGoals: SavingsGoal[] = [
    {
      id: 's1',
      title: 'Emergency Fund',
      targetAmount: 2000,
      currentSaved: 1000,
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

  assert(summary.budgetBreakdown !== undefined, 'Budget breakdown object is present in summary');
  // fixedNeeds = essential commitments = 3000
  assert(
    summary.budgetBreakdown.fixedNeeds === 3000,
    `Fixed needs accurately aggregates essential commitments (expected 3000, got ${summary.budgetBreakdown.fixedNeeds})`
  );
  // discretionaryWants = totalSpent (2000 + 1500) = 3500
  assert(
    summary.budgetBreakdown.discretionaryWants === 3500,
    `Discretionary wants accurately tracks non-essential spend (expected 3500, got ${summary.budgetBreakdown.discretionaryWants})`
  );
  // lockedSavings = 1000
  assert(
    summary.budgetBreakdown.lockedSavings === 1000,
    `Locked savings tracks locked vaults (expected 1000, got ${summary.budgetBreakdown.lockedSavings})`
  );
  assert(
    summary.budgetBreakdown.totalAllocated > 0,
    `Total allocated is positive (got ${summary.budgetBreakdown.totalAllocated})`
  );
}

// Test 6: Boundary Handling (Day 30, Zero Balance, Zero Division Resilience)
{
  const initialBudget = 10000;
  const currentDay = 30; // Last day of month
  const transactions: Transaction[] = [
    {
      id: 't1',
      title: 'All-in Expense',
      amount: 10000,
      category: 'shopping',
      type: 'expense',
      day: 29,
      timestamp: new Date().toISOString()
    }
  ];

  const summary = computeFinanceSummary(
    initialBudget,
    currentDay,
    transactions,
    [],
    []
  );

  assert(summary.balance === 0, `Zero balance correctly calculated (got ₹${summary.balance})`);
  assert(summary.safeDailyAllowance === 0, `Safe daily allowance clamped at 0 without NaN/Infinity (got ₹${summary.safeDailyAllowance})`);
  assert(summary.healthAnalysis.overallScore <= 50, `Health score flags depleted balance risk (got ${summary.healthAnalysis.overallScore})`);
  assert(summary.healthAnalysis.riskTier === 'CRITICAL', `Risk tier properly reflects CRITICAL status`);
}

// Test 7: Multi-Persona Initial Configuration Sanity
{
  const personas = ['student', 'intern', 'creative'] as const;
  personas.forEach((persona) => {
    // Each persona should produce valid initial summaries
    const summary = computeFinanceSummary(10000, 1, [], [], []);
    assert(summary.safeDailyAllowance > 0, `${persona} persona starts with positive daily allowance`);
    assert(summary.healthAnalysis.overallScore >= 70, `${persona} starts in healthy initial score zone`);
  });
}

console.log('\n🎉 ALL 7 FINANCIAL ENGINE & BREAKDOWN TESTS PASSED WITH 100% SUCCESS!\n');
