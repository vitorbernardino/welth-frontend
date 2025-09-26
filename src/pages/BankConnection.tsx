import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { BankConnectionsList } from "@/components/bank-connections/BankConnectionList";

const BankConnections = () => {
  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar activeTab="connections" onTabChange={() => {}} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header activeTab="connections" onTabChange={() => {}} />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Conexões</h1>
              <p className="text-muted-foreground">
                Gerencie suas conexões com bancos e instituições financeiras
              </p>
            </div>
            
            <BankConnectionsList />
          </div>
        </main>
      </div>
    </div>
  );
};

export default BankConnections;