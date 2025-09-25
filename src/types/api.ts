export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  message?: string;
  timestamp: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
  
  export interface Transaction {
    _id: string;
    userId: string;
    type: 'income' | 'expense';
    category: string;
    amount: number;
    date: string;
    description: string;
    isRecurring?: boolean;
    recurringPattern?: {
      frequency: string;
      dayOfMonth: number;
      isActive: boolean;
    };
    externalId?: string;
    itemId?: string;
    status?: string;
    currencyCode?: string;
    source: 'manual' | 'import' | 'recurring' | 'banking';
    createdAt: string;
    updatedAt: string;
  }
  
  export interface DashboardData {
    currentBalance: {
      currentValue: number;
      previousValue: number;
      percentageChange: number;
      trend: 'up' | 'down';
    };
    monthlyIncome: {
      currentValue: number;
      previousValue: number;
      percentageChange: number;
      trend: 'up' | 'down';
    };
    monthlyExpenses: {
      currentValue: number;
      previousValue: number;
      percentageChange: number;
      trend: 'up' | 'down';
    };
    averageMonthlyExpenses: number;
    balanceEvolution: Array<{
      date: string;
      balance: number;
      day: number;
    }>;
    expensesByCategory: Array<{
      category: string;
      amount: number;
      percentage: number;
    }>;
    recentTransactions: Array<{
      id: string;
      description: string;
      category: string;
      amount: number;
      type: 'income' | 'expense';
      date: string;
      formattedAmount: string;
    }>;
  }
  
  export interface RecentTransaction {
    _id: string;
    type: 'income' | 'expense';
    category: string;
    amount: number;
    date: string;
    description: string;
  }
  
  export interface SpreadsheetData {
    _id: string;
    userId: string;
    year: number;
    month: number;
    dailyData: DayData[];
    monthlyProjections: {
      totalIncome: number;
      totalExpenses: number;
      netBalance: number;
      projectedBalance: number;
    };
    createdAt: string;
    updatedAt: string;
  }

  export interface DayData {
    day: number;
    income: number;
    expenses: number;
    dailySpending: number;
    balance: number;
    calculatedBalance: number;
  }
