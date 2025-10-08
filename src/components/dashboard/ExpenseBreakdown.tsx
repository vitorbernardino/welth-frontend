import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { useDashboard } from "@/hooks/useApi";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

const COLORS = [
  '#6A4C9C', // Roxo
  '#EF6363', // Coral/Vermelho
  '#F5C562', // Dourado
  '#B695C0', // Lavanda
  '#56A3A6', // Verde-azulado
  '#82B366', // Verde
  '#7C98B3', // Azul ardósia
  '#D98B99'  // Rosa suave
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

const CustomLegend = (props: any) => {
  const { payload } = props;

  const formatCurrency = (value: number) => {
    return `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
  };

  return (
    <div className="mt-4 flex flex-wrap justify-center gap-x-4 gap-y-2">
      {payload.map((entry: any, index: number) => {
        const item = entry.payload.payload;
        return (
          <div key={`item-${index}`} className="flex items-center text-xs">
            <div className="w-2 h-2 rounded-full mr-2" style={{ backgroundColor: entry.color }} />
            <span className="text-muted-foreground mr-1">{item.name}:</span>
            <span className="font-medium text-foreground">{formatCurrency(item.value)}</span>
            <span className="text-muted-foreground ml-1">({item.percentage.toFixed(1)}%)</span>
          </div>
        );
      })}
    </div>
  );
};

export const ExpenseBreakdown = () => {
  const { data: dashboardData, isLoading, error } = useDashboard();

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  if (error) {
    return <ErrorState error={error} />;
  }

  if (!dashboardData?.success || !dashboardData?.data) {
    return <ErrorState error={{ message: 'Dados não encontrados' }} />;
  }

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

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base font-medium">Gastos por Categoria</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={280}>
          <PieChart>
            <Pie
              data={expenseData}
              cx="50%"
              cy="45%"
              labelLine={false}
              outerRadius={79}
              fill="#8884d8"
              dataKey="value"
            >
              {expenseData.map((entry: any, index: number) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={renderCustomTooltip} />
            <Legend content={<CustomLegend />} />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};