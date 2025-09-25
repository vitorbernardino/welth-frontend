import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { TransactionFormModal } from "@/components/transactions/TransactionFormModal";
import { TransactionList } from "@/components/transactions/TransactionList";

const Transactions = () => {
  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar activeTab="transactions" onTabChange={() => {}} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header activeTab="transactions" onTabChange={() => {}} />
        <main className="flex-1 overflow-y-auto p-6">
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
        </main>
      </div>
    </div>
  );
};

export default Transactions;