import { BankConnectionsList } from "@/components/bank-connections/BankConnectionsList";

const BankConnections = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Conexões</h1>
        <p className="text-muted-foreground">
          Gerencie suas conexões com bancos e instituições financeiras
        </p>
      </div>
      
      <BankConnectionsList />
    </div>
  );
};

export default BankConnections;