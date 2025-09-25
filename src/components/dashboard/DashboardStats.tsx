import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, DollarSign, Target } from "lucide-react";
import { useDashboard } from "@/hooks/useApi";

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
        trend === "up" ? "text-success" : "text-expense"
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

export const DashboardStats = () => {
  const { data: dashboardData, isLoading, error } = useDashboard();

  if (isLoading) {
    return (
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
  }

  if (error || !dashboardData?.success) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="col-span-full">
          <CardContent className="p-6 text-center">
            <p className="text-muted-foreground">Erro ao carregar dados do dashboard</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const { currentBalance, monthlyIncome, monthlyExpenses, averageMonthlyExpenses } = dashboardData.data;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatCard
        title="Saldo Atual"
        value={`R$ ${currentBalance.currentValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
        change={`${currentBalance.percentageChange > 0 ? '+' : ''}${currentBalance.percentageChange.toFixed(1)}% este mês`}
        trend={currentBalance.trend as "up" | "down"}
        icon={<DollarSign className="h-4 w-4" />}
        className="border-l-4 border-l-success"
      />
      <StatCard
        title="Entradas do Mês"
        value={`R$ ${monthlyIncome.currentValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
        change={`${monthlyIncome.percentageChange > 0 ? '+' : ''}${monthlyIncome.percentageChange.toFixed(1)}% vs mês anterior`}
        trend={monthlyIncome.trend as "up" | "down"}
        icon={<TrendingUp className="h-4 w-4" />}
        className="border-l-4 border-l-income"
      />
      <StatCard
        title="Gastos do Mês"
        value={`R$ ${monthlyExpenses.currentValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
        change={`${monthlyExpenses.percentageChange > 0 ? '+' : ''}${monthlyExpenses.percentageChange.toFixed(1)}% vs mês anterior`}
        trend={monthlyExpenses.trend as "up" | "down"}
        icon={<TrendingDown className="h-4 w-4" />}
        className="border-l-4 border-l-expense"
      />
      <StatCard
        title="Média Mensal"
        value={`R$ ${averageMonthlyExpenses.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
        change="Gastos médios mensais"
        trend="up"
        icon={<Target className="h-4 w-4" />}
        className="border-l-4 border-l-warning"
      />
    </div>
  );
};