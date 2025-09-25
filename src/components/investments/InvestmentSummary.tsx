import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { DollarSign, Package, TrendingUp, Target, PieChart } from "lucide-react";
import { InvestmentByType } from "@/types/investment";

interface InvestmentSummaryProps {
  totalInvested: number;
  totalProducts: number;
  byType: InvestmentByType[];
}

/**
 * Mapeamento de tipos de investimento para cores e labels
 */
const INVESTMENT_TYPE_CONFIG = {
  fixed_income: {
    label: "Renda Fixa",
    color: "bg-blue-500",
    bgColor: "bg-blue-50 dark:bg-blue-950",
    textColor: "text-blue-700 dark:text-blue-300"
  },
  variable_income: {
    label: "Renda Variável", 
    color: "bg-green-500",
    bgColor: "bg-green-50 dark:bg-green-950",
    textColor: "text-green-700 dark:text-green-300"
  },
  other: {
    label: "Outros",
    color: "bg-purple-500",
    bgColor: "bg-purple-50 dark:bg-purple-950", 
    textColor: "text-purple-700 dark:text-purple-300"
  },
  crypto: {
    label: "Criptomoedas",
    color: "bg-orange-500",
    bgColor: "bg-orange-50 dark:bg-orange-950",
    textColor: "text-orange-700 dark:text-orange-300"
  },
  real_estate: {
    label: "Fundos Imobiliários",
    color: "bg-indigo-500", 
    bgColor: "bg-indigo-50 dark:bg-indigo-950",
    textColor: "text-indigo-700 dark:text-indigo-300"
  }
} as const;

export const InvestmentSummary = ({ totalInvested, totalProducts, byType }: InvestmentSummaryProps) => {
  /**
   * Calcula o percentual de cada tipo de investimento
   */
  const getTypePercentage = (typeTotal: number): number => {
    return totalInvested > 0 ? (typeTotal / totalInvested) * 100 : 0;
  };

  /**
   * Formata valores monetários para exibição
   */
  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  /**
   * Calcula a rentabilidade estimada mensal (simulação)
   */
  const estimatedMonthlyReturn = totalInvested * 0.007; // 0.7% ao mês (exemplo)

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      {/* Total Investido */}
      <Card className="relative overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Investido</CardTitle>
          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
            <DollarSign className="h-4 w-4 text-primary" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-primary">
            {formatCurrency(totalInvested)}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Valor total da carteira
          </p>
        </CardContent>
      </Card>

      {/* Total de Produtos */}
      <Card className="relative overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total de Produtos</CardTitle>
          <div className="h-8 w-8 rounded-full bg-secondary/10 flex items-center justify-center">
            <Package className="h-4 w-4 text-secondary-foreground" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {totalProducts}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Investimentos ativos
          </p>
        </CardContent>
      </Card>

      {/* Rentabilidade Estimada */}
      <Card className="relative overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Rentabilidade Mensal</CardTitle>
          <div className="h-8 w-8 rounded-full bg-success/10 flex items-center justify-center">
            <TrendingUp className="h-4 w-4 text-success" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-success">
            {formatCurrency(estimatedMonthlyReturn)}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Estimativa baseada em 0,7% a.m.
          </p>
        </CardContent>
      </Card>

      {/* Diversificação */}
      <Card className="relative overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Diversificação</CardTitle>
          <div className="h-8 w-8 rounded-full bg-accent/10 flex items-center justify-center">
            <PieChart className="h-4 w-4 text-accent-foreground" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {byType.length}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Tipos de investimento
          </p>
        </CardContent>
      </Card>

      {/* Composição da Carteira */}
      <Card className="md:col-span-2 lg:col-span-4">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Composição da Carteira
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {byType.map((typeGroup) => {
              const percentage = getTypePercentage(typeGroup.total);
              const config = INVESTMENT_TYPE_CONFIG[typeGroup.type as keyof typeof INVESTMENT_TYPE_CONFIG] || {
                label: typeGroup.type,
                color: "bg-gray-500",
                bgColor: "bg-gray-50 dark:bg-gray-950",
                textColor: "text-gray-700 dark:text-gray-300"
              };

              return (
                <div key={typeGroup.type} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-4 h-4 rounded-full ${config.color}`} />
                      <span className="font-medium">{config.label}</span>
                      <Badge variant="secondary" className="text-xs">
                        {typeGroup.count} produtos
                      </Badge>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">{formatCurrency(typeGroup.total)}</div>
                      <div className="text-sm text-muted-foreground">
                        {percentage.toFixed(1)}%
                      </div>
                    </div>
                  </div>
                  <Progress 
                    value={percentage} 
                    className="h-2"
                    style={{
                      background: `linear-gradient(to right, ${config.color.replace('bg-', 'rgb(var(--')} ${percentage}%, transparent ${percentage}%)`
                    }}
                  />
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};