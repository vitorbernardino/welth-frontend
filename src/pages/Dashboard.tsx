import { useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { DashboardStats } from "@/components/dashboard/DashboardStats";
import { BalanceChart } from "@/components/dashboard/BalanceChart";
import { ExpenseBreakdown } from "@/components/dashboard/ExpenseBreakdown";
import { RecentTransactions } from "@/components/dashboard/RecentTransactions";
import { MonthlySpreadsheet } from "@/components/spreadsheet/MonthlySpreadsheet";
import { TransactionFormModal } from "@/components/transactions/TransactionFormModal";
import { TransactionList } from "@/components/transactions/TransactionList";
import { InvestmentPortfolio } from "@/components/investments/InvestmentPortfolio";
import BankConnections from "./BankConnections";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("dashboard");

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return (
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
        );
      
      case "spreadsheet":
        return (
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Planilha Financeira</h1>
              <p className="text-muted-foreground">
                Controle diário de entradas, saídas e saldo
              </p>
            </div>
            <MonthlySpreadsheet />
          </div>
        );
      
      case "transactions":
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">Lançamentos</h1>
                <p className="text-muted-foreground">
                  Gerencie suas entradas e saídas
                </p>
              </div>
              <TransactionFormModal />
            </div>
            <TransactionList />
          </div>
        );
      
      case "investments":
        return (
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Investimentos</h1>
              <p className="text-muted-foreground">
                Acompanhe e gerencie sua carteira de investimentos
              </p>
            </div>
            <InvestmentPortfolio />
          </div>
        );
      
      case "connections":
        return <BankConnections />;
      
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header activeTab={activeTab} onTabChange={setActiveTab} />
        <main className="flex-1 overflow-y-auto p-6">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;