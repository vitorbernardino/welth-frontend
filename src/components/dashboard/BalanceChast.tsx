import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useDashboard } from "@/hooks/useApi";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

const LoadingSkeleton = () => (
  <Card className="col-span-full lg:col-span-2">
    <CardHeader>
      <CardTitle className="text-base font-medium">Evolução do Saldo</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="h-[300px] flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Carregando dados...</div>
      </div>
    </CardContent>
  </Card>
);

const EmptyState = () => (
  <Card className="col-span-full lg:col-span-2">
    <CardHeader>
      <CardTitle className="text-base font-medium">Evolução do Saldo</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="h-[300px] flex items-center justify-center text-muted-foreground">
        <div className="text-center">
          <div className="text-4xl mb-4">📈</div>
          <p className="text-lg font-medium mb-2">Nenhum dado de evolução</p>
          <p className="text-sm">Adicione transações para ver o gráfico</p>
        </div>
      </div>
    </CardContent>
  </Card>
);

const ErrorState = ({ error }: { error: any }) => (
  <Card className="col-span-full lg:col-span-2">
    <CardHeader>
      <CardTitle className="text-base font-medium">Evolução do Saldo</CardTitle>
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

export const BalanceChart = () => {
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

  // Processar dados da evolução do saldo
  const balanceEvolution = dashboardData.data.balanceEvolution || [];
  
  if (balanceEvolution.length === 0) {
    return <EmptyState />;
  }

  const chartData = balanceEvolution.map((item: any) => ({
    name: item.day.toString().padStart(2, '0'),
    day: item.day,
    saldo: item.balance,
    date: item.date
  }));

  const formatCurrency = (value: number) => {
    return `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
  };

  const formatTooltipCurrency = (value: number) => {
    return [formatCurrency(value), 'Saldo'];
  };

  const renderTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
          <p className="font-medium text-foreground">Dia {label}</p>
          <p className="text-sm text-muted-foreground">
            Saldo: {formatCurrency(data.saldo)}
          </p>
          {data.date && (
            <p className="text-xs text-muted-foreground">
              {new Date(data.date).toLocaleDateString('pt-BR')}
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="col-span-full lg:col-span-2">
      <CardHeader>
        <CardTitle className="text-base font-medium">Evolução do Saldo</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted opacity-30" />
            <XAxis 
              dataKey="name" 
              className="text-muted-foreground"
              fontSize={12}
              tick={{ fill: 'hsl(var(--muted-foreground))' }}
            />
            <YAxis 
              className="text-muted-foreground"
              fontSize={12}
              tickFormatter={(value) => `R$ ${value.toLocaleString('pt-BR')}`}
              tick={{ fill: 'hsl(var(--muted-foreground))' }}
            />
            <Tooltip 
              content={renderTooltip}
            />
            <Line 
              type="monotone" 
              dataKey="saldo" 
              stroke="hsl(var(--primary))" 
              strokeWidth={3}
              dot={{ fill: 'hsl(var(--primary))', r: 4 }}
              activeDot={{ r: 6, fill: 'hsl(var(--primary))' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};