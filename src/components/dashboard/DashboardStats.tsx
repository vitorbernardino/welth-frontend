import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, DollarSign, Target, AlertCircle } from "lucide-react";
import { useDashboard } from "@/hooks/useApi";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  trend: "up" | "down";
  icon: React.ReactNode;
  className?: string;
}

const StatCard = ({ title, value, change, trend, icon, className }: StatCardProps) => (
  <Card className={`transition-all duration-200 hover:shadow-lg ${className}`}>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium text-muted-foreground">
        {title}
      </CardTitle>
      <div className="text-muted-foreground">
        {icon}
      </div>
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      <div className={`flex items-center text-xs ${
        trend === "up" ? "text-green-600" : "text-red-600"
      }`}>
        {trend === "up" ? (
          <TrendingUp className="h-3 w-3 mr-1" />
        ) : (
          <TrendingDown className="h-3 w-3 mr-1" />
        )}
        {change}
      </div>
    </CardContent>
  </Card>
);

const LoadingSkeleton = () => (
  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
    {[...Array(4)].map((_, i) => (
      <Card key={i} className="animate-pulse">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div className="h-4 bg-muted rounded w-20"></div>
          <div className="h-4 w-4 bg-muted rounded"></div>
        </CardHeader>
        <CardContent>
          <div className="h-8 bg-muted rounded w-24 mb-2"></div>
          <div className="h-4 bg-muted rounded w-32"></div>
        </CardContent>
      </Card>
    ))}
  </div>
);

const ErrorState = ({ error }: { error: any }) => (
  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
    <div className="col-span-full">
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Erro ao carregar dados do dashboard: {error?.message || 'Erro desconhecido'}
        </AlertDescription>
      </Alert>
    </div>
  </div>
);

export const DashboardStats = () => {
  const { data: dashboardData, isLoading, error } = useDashboard();

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

  const { currentBalance, monthlyIncome, monthlyExpenses, averageMonthlyExpenses } = dashboardData.data;

  // Verificar se todos os campos obrigatórios existem
  if (!currentBalance || !monthlyIncome || !monthlyExpenses || typeof averageMonthlyExpenses !== 'number') {
    return <ErrorState error={{ message: 'Dados incompletos retornados pela API' }} />;
  }

  const formatCurrency = (value: number) => {
    return `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
  };

  const formatPercentage = (value: number) => {
    const sign = value > 0 ? '+' : '';
    return `${sign}${value.toFixed(1)}%`;
  };

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatCard
        title="Saldo Atual"
        value={formatCurrency(currentBalance.currentValue)}
        change={`${formatPercentage(currentBalance.percentageChange)} este mês`}
        trend={currentBalance.trend}
        icon={<DollarSign className="h-4 w-4" />}
        className="border-l-4 border-l-green-500"
      />
      <StatCard
        title="Entradas do Mês"
        value={formatCurrency(monthlyIncome.currentValue)}
        change={`${formatPercentage(monthlyIncome.percentageChange)} vs mês anterior`}
        trend={monthlyIncome.trend}
        icon={<TrendingUp className="h-4 w-4" />}
        className="border-l-4 border-l-blue-500"
      />
      <StatCard
        title="Gastos do Mês"
        value={formatCurrency(monthlyExpenses.currentValue)}
        change={`${formatPercentage(monthlyExpenses.percentageChange)} vs mês anterior`}
        trend={monthlyExpenses.trend}
        icon={<TrendingDown className="h-4 w-4" />}
        className="border-l-4 border-l-red-500"
      />
      <StatCard
        title="Média Mensal"
        value={formatCurrency(averageMonthlyExpenses)}
        change="Gastos médios mensais"
        trend="up"
        icon={<Target className="h-4 w-4" />}
        className="border-l-4 border-l-yellow-500"
      />
    </div>
  );
};