import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { InvestmentPortfolio } from "@/components/investments/investmentPortfolio";

const Investments = () => {
  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar activeTab="investments" onTabChange={() => {}} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header activeTab="investments" onTabChange={() => {}} />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Investimentos</h1>
              <p className="text-muted-foreground">
                Acompanhe e gerencie sua carteira de investimentos
              </p>
            </div>
            <InvestmentPortfolio />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Investments;