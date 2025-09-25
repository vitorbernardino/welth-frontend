import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { DashboardStats } from "@/components/dashboard/DashboardStats";
import { ExpenseBreakdown } from "@/components/dashboard/ExpenseBreakdown";
import { RecentTransactions } from "@/components/dashboard/RecentTransactions";
import { BalanceChart } from "@/components/dashboard/BalanceChast";

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar activeTab="dashboard" onTabChange={() => {}} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header activeTab="dashboard" onTabChange={() => {}} />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
              <p className="text-muted-foreground">
                Visão geral das suas finanças pessoais
              </p>
            </div>
            <DashboardStats />
            <div className="grid gap-6 lg:grid-cols-3">
              <BalanceChart />
              <ExpenseBreakdown />
            </div>
            <RecentTransactions />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;