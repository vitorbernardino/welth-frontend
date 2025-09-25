import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { useDashboard } from "@/hooks/useApi";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

const COLORS = [
  'hsl(220, 70%, 50%)',  // Azul
  'hsl(340, 75%, 50%)',  // Rosa
  'hsl(45, 90%, 55%)',   // Amarelo
  'hsl(120, 60%, 50%)',  // Verde
  'hsl(280, 60%, 55%)',  // Roxo
  'hsl(15, 80%, 55%)',   // Laranja
  'hsl(195, 75%, 50%)',  // Ciano
  'hsl(25, 70%, 50%)'    // Marrom
];

const getCategoryLabel = (category: string) => {
  const categoryMap: { [key: string]: string } = {
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
  <Card>
    <CardHeader>
      <CardTitle className="text-base font-medium">Gastos por Categoria</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="h-[300px] flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Carregando dados...</div>
      </div>
    </CardContent>
  </Card>
);

const EmptyState = () => (
  <Card>
    <CardHeader>
      <CardTitle className="text-base font-medium">Gastos por Categoria</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="h-[300px] flex items-center justify-center text-muted-foreground">
        <div className="text-center">
          <div className="text-4xl mb-4">📊</div>
          <p className="text-lg font-medium mb-2">Nenhum gasto encontrado</p>
          <p className="text-sm">Adicione transações para ver o gráfico</p>
        </div>
      </div>
    </CardContent>
  </Card>
);

const ErrorState = ({ error }: { error: any }) => (
  <Card>
    <CardHeader>
      <CardTitle className="text-base font-medium">Gastos por Categoria</CardTitle>
    </CardHeader>
    <CardContent>
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Erro ao carregar dados: {error?.message || 'Erro desconhecido'}
        </AlertDescription>
      </Alert>
    </CardContent>
  </Card>
);

export const ExpenseBreakdown = () => {
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

  // Processar dados das despesas por categoria
  const expensesByCategory = dashboardData.data.expensesByCategory || [];
  
  if (expensesByCategory.length === 0) {
    return <EmptyState />;
  }

  const expenseData = expensesByCategory.map((item: any, index: number) => ({
    name: getCategoryLabel(item.category),
    value: item.amount,
    percentage: item.percentage,
    color: COLORS[index % COLORS.length]
  }));

  const formatCurrency = (value: number) => {
    return `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
  };

  const renderCustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
          <p className="font-medium text-foreground">{data.name}</p>
          <p className="text-sm text-muted-foreground">
            {formatCurrency(data.value)} ({data.percentage.toFixed(1)}%)
          </p>
        </div>
      );
    }
    return null;
  };

  const renderLabel = ({ name, percentage }: any) => {
    return `${name}: ${percentage.toFixed(1)}%`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base font-medium">Gastos por Categoria</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={expenseData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={renderLabel}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {expenseData.map((entry: any, index: number) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={renderCustomTooltip} />
            <Legend 
              verticalAlign="bottom" 
              height={36}
              formatter={(value, entry: any) => (
                <span style={{ color: entry.color }}>
                  {value}: {formatCurrency(entry.payload?.value || 0)}
                </span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};