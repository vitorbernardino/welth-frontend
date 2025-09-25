import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, ArrowDownRight, AlertCircle } from "lucide-react";
import { useDashboard } from "@/hooks/useApi";
import { useNavigate } from "react-router-dom";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Alert, AlertDescription } from "@/components/ui/alert";

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
  return categoryMap[category] || category.charAt(0).toUpperCase() + category.slice(1);
};

const LoadingSkeleton = () => (
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
              <div className="h-4 bg-muted rounded w-3/4"></div>
              <div className="h-3 bg-muted rounded w-1/2"></div>
            </div>
            <div className="h-4 bg-muted rounded w-20"></div>
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
);

const EmptyState = () => (
  <Card className="col-span-full lg:col-span-1">
    <CardHeader className="flex flex-row items-center justify-between">
      <CardTitle className="text-base font-medium">Transações Recentes</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="text-center py-8">
        <div className="text-4xl mb-4">💳</div>
        <p className="text-lg font-medium text-muted-foreground mb-2">Nenhuma transação encontrada</p>
        <p className="text-sm text-muted-foreground">
          Adicione transações para vê-las aqui
        </p>
      </div>
    </CardContent>
  </Card>
);

const ErrorState = ({ error }: { error: any }) => (
  <Card className="col-span-full lg:col-span-1">
    <CardHeader className="flex flex-row items-center justify-between">
      <CardTitle className="text-base font-medium">Transações Recentes</CardTitle>
    </CardHeader>
    <CardContent>
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Erro ao carregar transações: {error?.message || 'Erro desconhecido'}
        </AlertDescription>
      </Alert>
    </CardContent>
  </Card>
);

export const RecentTransactions = () => {
  const { data: dashboardData, isLoading, error } = useDashboard();
  const navigate = useNavigate();

  // Estado de carregamento
  if (isLoading) {
    return <LoadingSkeleton />;
  }

  // Estado de erro
  if (error) {
    return <ErrorState error={error} />;
  }

  // Verificar se os dados foram retornados com sucesso
  if (!dashboardData?.success || !dashboardData?.data) {
    return <ErrorState error={{ message: 'Dados não encontrados' }} />;
  }

  // Obter transações recentes do dashboard
  const recentTransactions = dashboardData.data.recentTransactions || [];

  if (recentTransactions.length === 0) {
    return <EmptyState />;
  }

  const formatCurrency = (amount: number, type: 'income' | 'expense') => {
    const sign = type === 'income' ? '+' : '-';
    return `${sign}R$ ${amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
  };

  const formatDate = (dateString: string) => {
    try {
      const date = parseISO(dateString);
      return format(date, 'dd/MM', { locale: ptBR });
    } catch {
      return 'Data inválida';
    }
  };

  const handleViewAllTransactions = () => {
    navigate('/lancamentos');
  };

  return (
    <Card className="col-span-full lg:col-span-1">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-base font-medium">Transações Recentes</CardTitle>
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-xs"
          onClick={handleViewAllTransactions}
        >
          Ver todas
          <ArrowUpRight className="h-3 w-3 ml-1" />
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentTransactions.slice(0, 5).map((transaction: any) => (
            <div 
              key={transaction.id} 
              className="flex items-center space-x-4 p-2 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
              onClick={() => navigate('/lancamentos')}
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                transaction.type === 'income' 
                  ? 'bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400' 
                  : 'bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400'
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
                    {formatDate(transaction.date)}
                  </span>
                </div>
              </div>
              
              <div className="text-right">
                <p className={`text-sm font-medium ${
                  transaction.type === 'income' 
                    ? 'text-green-600 dark:text-green-400' 
                    : 'text-red-600 dark:text-red-400'
                }`}>
                  {formatCurrency(transaction.amount, transaction.type)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};