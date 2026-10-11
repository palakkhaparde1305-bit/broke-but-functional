import { Commitment, SavingsGoal, LifeEvent, UserProfile } from '../types/finance';

export const DEFAULT_COMMITMENTS: Commitment[] = [
  {
    id: 'comm-1',
    title: 'Spotify Student Premium',
    category: 'entertainment',
    amount: 59,
    dueDay: 4,
    status: 'pending',
    autoDeduct: true,
    iconName: 'Music',
    isEssential: false,
    notes: 'No ads during study playlists.'
  },
  {
    id: 'comm-2',
    title: '5G Mobile Recharge (1.5GB/day)',
    category: 'utilities',
    amount: 299,
    dueDay: 9,
    status: 'pending',
    autoDeduct: true,
    iconName: 'Smartphone',
    isEssential: true,
    notes: 'Non-negotiable connectivity.'
  },
  {
    id: 'comm-3',
    title: 'PG & Shared Room Maintenance',
    category: 'commitments',
    amount: 3200,
    dueDay: 15,
    status: 'pending',
    autoDeduct: false,
    iconName: 'Home',
    isEssential: true,
    notes: 'Landlord does not tolerate delays!'
  },
  {
    id: 'comm-4',
    title: 'Hostel WiFi Split',
    category: 'utilities',
    amount: 250,
    dueDay: 18,
    status: 'pending',
    autoDeduct: true,
    iconName: 'Wifi',
    isEssential: true,
    notes: 'Fiber split with 3 roommates.'
  },
  {
    id: 'comm-5',
    title: 'Campus Gym Membership',
    category: 'health',
    amount: 500,
    dueDay: 24,
    status: 'pending',
    autoDeduct: false,
    iconName: 'Dumbbell',
    isEssential: false,
    notes: 'Mental health & gains.'
  }
];

export const DEFAULT_SAVINGS_GOALS: SavingsGoal[] = [
  {
    id: 'goal-1',
    title: 'Emergency Safety Cushion',
    targetAmount: 1500,
    currentSaved: 500,
    isLocked: true,
    deadlineDay: 30,
    emoji: '🛡️',
    color: '#10B981'
  },
  {
    id: 'goal-2',
    title: 'Concert / Festival Pass',
    targetAmount: 1200,
    currentSaved: 300,
    isLocked: false,
    deadlineDay: 28,
    emoji: '🎸',
    color: '#8B5CF6'
  }
];

export const LIFE_EVENTS_POOL: LifeEvent[] = [
  {
    id: 'event-1',
    title: 'Spontaneous Birthday Celebration!',
    category: 'Social Pressure',
    description: 'Your close college friend decided to host a birthday dinner at an aesthetic rooftop cafe tonight. Everyone is going!',
    triggerDay: 6,
    choices: [
      {
        id: 'c1',
        label: 'Go All In & Treat Them',
        amountDelta: -850,
        healthDelta: -10,
        description: 'You had a blast and great Instagram stories, but your wallet took a serious hit.',
        tag: 'Full Send 🍸'
      },
      {
        id: 'c2',
        label: 'Order Just Starters & Split',
        amountDelta: -380,
        healthDelta: -3,
        description: 'You enjoyed the party while quietly watching your portion size and budget.',
        tag: 'Diplomatic 🥗'
      },
      {
        id: 'c3',
        label: 'Make an Assignment Excuse & Stay In',
        amountDelta: 0,
        healthDelta: 5,
        description: 'Saved ₹0! A bit of FOMO, but your ₹10,000 monthly roadmap remains intact.',
        tag: 'Disciplined 📚'
      }
    ]
  },
  {
    id: 'event-2',
    title: 'Freelance Graphic Design Gig Payout!',
    category: 'Income Windfall',
    description: 'A local startup approved your poster illustrations and just transferred payment via UPI!',
    triggerDay: 11,
    choices: [
      {
        id: 'c1',
        label: 'Accept & Lock 50% into Savings',
        amountDelta: 1500,
        healthDelta: 15,
        description: 'Boosted balance by ₹1,500! Safe daily allowance jumped significantly.',
        tag: 'Big Brain Move 🧠'
      },
      {
        id: 'c2',
        label: 'Add Full Amount to Spending Wallet',
        amountDelta: 1500,
        healthDelta: 10,
        description: '₹1,500 added directly to available funds. Extra cushion for the next 20 days.',
        tag: 'Cash Injection 💸'
      }
    ]
  },
  {
    id: 'event-3',
    title: 'Laptop Charger Fried!',
    category: 'Tech Emergency',
    description: 'During a thunderstorm surge, your laptop charger sparkled and stopped working. Mid-term projects are due next week.',
    triggerDay: 16,
    choices: [
      {
        id: 'c1',
        label: 'Buy New OEM Replacement',
        amountDelta: -1200,
        healthDelta: -15,
        description: 'Immediate peace of mind, but a painful ₹1,200 dent in week 3.',
        tag: 'Safety First ⚡'
      },
      {
        id: 'c2',
        label: 'Buy Compatible Third-Party Adapter',
        amountDelta: -550,
        healthDelta: -6,
        description: 'Works fine for now and saved you ₹650.',
        tag: 'Budget Hack 🔌'
      },
      {
        id: 'c3',
        label: 'Borrow Roommate\'s Alternate Hours',
        amountDelta: 0,
        healthDelta: -4,
        description: 'Zero cost! Inconvenient schedule, but cash preserved.',
        tag: 'Survival Mode ⏰'
      }
    ]
  },
  {
    id: 'event-4',
    title: 'Surprise E-Commerce Refund',
    category: 'Lucky Return',
    description: 'That jacket you returned 3 weeks ago was finally processed and ₹750 refunded to your bank account.',
    triggerDay: 21,
    choices: [
      {
        id: 'c1',
        label: 'Claim Refund & Secure it',
        amountDelta: 750,
        healthDelta: 8,
        description: 'Instant +₹750 balance revival just when month-end fatigue set in.',
        tag: 'Free Money ✨'
      }
    ]
  },
  {
    id: 'event-5',
    title: 'Seasonal Flu & Cough Run',
    category: 'Healthcare',
    description: 'Woke up shivering with throat irritation. Need cough syrup, vitamin C, and paracetamol from the local pharmacy.',
    triggerDay: 26,
    choices: [
      {
        id: 'c1',
        label: 'Buy Full Course Medicine & Soup',
        amountDelta: -420,
        healthDelta: -5,
        description: 'Health recovery is priority #1. You are back on your feet in 2 days.',
        tag: 'Self Care 💊'
      },
      {
        id: 'c2',
        label: 'Generic Strips & Home Haldi Doodh',
        amountDelta: -150,
        healthDelta: -2,
        description: 'Grandma remedy + generic strip saved ₹270.',
        tag: 'Desi Jugaad ☕'
      }
    ]
  }
];

export const USER_PROFILES: UserProfile[] = [
  {
    id: 'student',
    name: 'College Hosteler',
    tagline: 'Surviving campus life, canteen debts & group splits',
    initialBudget: 10000,
    initialCommitments: DEFAULT_COMMITMENTS,
    initialSavingsGoals: DEFAULT_SAVINGS_GOALS,
    avatar: '🎓'
  },
  {
    id: 'intern',
    name: 'Bangalore / Metro Intern',
    tagline: '₹10k stipend, metro rides, and shared flat bills',
    initialBudget: 10000,
    initialCommitments: [
      {
        id: 'comm-int-1',
        title: 'Metro Smart Card Pass',
        category: 'transport',
        amount: 800,
        dueDay: 3,
        status: 'pending',
        autoDeduct: true,
        iconName: 'Train',
        isEssential: true,
        notes: 'Daily office commute.'
      },
      {
        id: 'comm-int-2',
        title: 'Flatmate Rent Contribution',
        category: 'commitments',
        amount: 4000,
        dueDay: 10,
        status: 'pending',
        autoDeduct: false,
        iconName: 'Home',
        isEssential: true,
        notes: '2BHK shared with 3 interns.'
      },
      {
        id: 'comm-int-3',
        title: 'Coffee / Co-working Pass',
        category: 'utilities',
        amount: 450,
        dueDay: 16,
        status: 'pending',
        autoDeduct: false,
        iconName: 'Coffee',
        isEssential: false,
        notes: 'Weekend work sessions.'
      },
      {
        id: 'comm-int-4',
        title: 'Phone & Cloud Backup Split',
        category: 'utilities',
        amount: 349,
        dueDay: 22,
        status: 'pending',
        autoDeduct: true,
        iconName: 'Cloud',
        isEssential: true,
        notes: 'Google One + Airtel.'
      }
    ],
    initialSavingsGoals: [
      {
        id: 'goal-int-1',
        title: 'Security Deposit Buffer',
        targetAmount: 2000,
        currentSaved: 800,
        isLocked: true,
        deadlineDay: 30,
        emoji: '🏢',
        color: '#06B6D4'
      }
    ],
    avatar: '💼'
  },
  {
    id: 'creative',
    name: 'Freelancer / Side-Hustler',
    tagline: 'Irregular gigs, high caffeine, tight budget control',
    initialBudget: 10000,
    initialCommitments: [
      {
        id: 'comm-cr-1',
        title: 'Adobe / Figma Subscription',
        category: 'utilities',
        amount: 750,
        dueDay: 5,
        status: 'pending',
        autoDeduct: true,
        iconName: 'PenTool',
        isEssential: true,
        notes: 'Tool of trade.'
      },
      {
        id: 'comm-cr-2',
        title: 'Studio Share / Coworking Seat',
        category: 'commitments',
        amount: 3500,
        dueDay: 12,
        status: 'pending',
        autoDeduct: false,
        iconName: 'Laptop',
        isEssential: true,
        notes: 'High speed fiber desk.'
      },
      {
        id: 'comm-cr-3',
        title: 'Domain & Portfolio Hosting',
        category: 'utilities',
        amount: 299,
        dueDay: 20,
        status: 'pending',
        autoDeduct: true,
        iconName: 'Globe',
        isEssential: true,
        notes: 'Client inbound portfolio.'
      }
    ],
    initialSavingsGoals: [
      {
        id: 'goal-cr-1',
        title: 'Noise Cancelling Headphones',
        targetAmount: 2500,
        currentSaved: 600,
        isLocked: true,
        deadlineDay: 30,
        emoji: '🎧',
        color: '#EC4899'
      }
    ],
    avatar: '🎨'
  }
];
