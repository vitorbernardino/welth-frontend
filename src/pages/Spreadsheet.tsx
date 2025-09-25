import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { MonthlySpreadsheet } from "@/components/spreadsheet/MonthlySpreadsheet";

const Spreadsheet = () => {
  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar activeTab="spreadsheet" onTabChange={() => {}} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header activeTab="spreadsheet" onTabChange={() => {}} />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Planilha Financeira</h1>
              <p className="text-muted-foreground">
                Controle diário de entradas, saídas e saldo
              </p>
            </div>
            <MonthlySpreadsheet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Spreadsheet;