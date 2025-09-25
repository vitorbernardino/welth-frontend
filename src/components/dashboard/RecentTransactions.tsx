import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { useRecentTransactions } from "@/hooks/useApi";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

const getCategoryLabel = (category: string) => {
  const categoryMap: { [key: string]: string } = {
    'salary': 'Salário',
    'freelance': 'Freelance',
    'sales': 'Vendas',
    'investments': 'Investimentos',
    'food': 'Alimentação',
    'transport': 'Transporte',
    'bills': 'Contas',
    'leisure': 'Lazer',
    'health': 'Saúde',
    'education': 'Educação',
    'shopping': 'Compras',
    'other': 'Outros'
  };
  return categoryMap[category] || category;
};

export const RecentTransactions = () => {
  const { data: transactionsData, isLoading, error } = useRecentTransactions();

  if (isLoading) {
    return (
      <Card className="col-span-full lg:col-span-1">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base font-medium">Transações Recentes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center space-x-4 animate-pulse">
                <div className="w-10 h-10 bg-muted rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-muted rounded w-1/2"></div>
                  <div className="h-3 bg-muted rounded w-1/4"></div>
                </div>
                <div className="h-4 bg-muted rounded w-20"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error || !transactionsData?.success) {
    return (
      <Card className="col-span-full lg:col-span-1">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base font-medium">Transações Recentes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6">
            <p className="text-muted-foreground">Erro ao carregar transações</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const transactions = transactionsData.data || [];

  return (
    <Card className="col-span-full lg:col-span-1">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-base font-medium">Transações Recentes</CardTitle>
        <Button variant="ghost" size="sm" className="text-xs">
          Ver todas
          <ArrowUpRight className="h-3 w-3 ml-1" />
        </Button>
      </CardHeader>
      <CardContent>
        {transactions.length === 0 ? (
          <div className="text-center py-6">
            <p className="text-muted-foreground">Nenhuma transação encontrada</p>
            <p className="text-sm text-muted-foreground mt-1">
              Adicione transações para vê-las aqui
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {transactions.slice(0, 5).map((transaction: any) => (
              <div key={transaction._id} className="flex items-center space-x-4 p-2 rounded-lg hover:bg-muted/50 transition-colors">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  transaction.type === 'income' 
                    ? 'bg-success/10 text-success' 
                    : 'bg-expense/10 text-expense'
                }`}>
                  {transaction.type === 'income' ? (
                    <ArrowUpRight className="h-4 w-4" />
                  ) : (
                    <ArrowDownRight className="h-4 w-4" />
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium leading-none mb-1 truncate">
                    {transaction.description || getCategoryLabel(transaction.category)}
                  </p>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs">
                      {getCategoryLabel(transaction.category)}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {format(new Date(transaction.date), 'dd/MM', { locale: ptBR })}
                    </span>
                  </div>
                </div>
                
                <div className="text-right">
                  <p className={`text-sm font-medium ${
                    transaction.type === 'income' ? 'text-success' : 'text-expense'
                  }`}>
                    {transaction.type === 'income' ? '+' : '-'}
                    R$ {transaction.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};