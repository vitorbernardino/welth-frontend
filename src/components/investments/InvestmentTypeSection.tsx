import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  ChevronDown, 
  ChevronUp, 
  TrendingUp, 
  Building, 
  Shield, 
  Package,
  BarChart3 
} from "lucide-react";
import { InvestmentCard } from "./InvestmentCard";
import { InvestmentByType } from "@/types/investment";

interface InvestmentTypeSectionProps {
  typeGroup: InvestmentByType;
  totalPortfolio: number;
}

/**
 * Configuração visual para cada tipo de investimento
 */
const TYPE_CONFIG = {
  fixed_income: {
    label: "Renda Fixa",
    icon: Shield,
    color: "text-blue-600",
    bgColor: "bg-blue-50 dark:bg-blue-950",
    borderColor: "border-blue-200 dark:border-blue-800",
    description: "Investimentos de baixo risco com rentabilidade previsível"
  },
  variable_income: {
    label: "Renda Variável", 
    icon: TrendingUp,
    color: "text-green-600",
    bgColor: "bg-green-50 dark:bg-green-950",
    borderColor: "border-green-200 dark:border-green-800",
    description: "Ações, fundos e investimentos de maior risco e potencial"
  },
  other: {
    label: "Outros Investimentos",
    icon: Package,
    color: "text-purple-600", 
    bgColor: "bg-purple-50 dark:bg-purple-950",
    borderColor: "border-purple-200 dark:border-purple-800",
    description: "Fundos multimercado e outros tipos de investimento"
  },
  crypto: {
    label: "Criptomoedas",
    icon: BarChart3,
    color: "text-orange-600",
    bgColor: "bg-orange-50 dark:bg-orange-950", 
    borderColor: "border-orange-200 dark:border-orange-800",
    description: "Moedas digitais e ativos baseados em blockchain"
  },
  real_estate: {
    label: "Fundos Imobiliários",
    icon: Building,
    color: "text-indigo-600",
    bgColor: "bg-indigo-50 dark:bg-indigo-950",
    borderColor: "border-indigo-200 dark:border-indigo-800", 
    description: "Investimentos em imóveis e fundos do setor"
  }
} as const;

export const InvestmentTypeSection = ({ typeGroup, totalPortfolio }: InvestmentTypeSectionProps) => {
  const [isExpanded, setIsExpanded] = useState(true);

  // Configuração do tipo de investimento
  const config = TYPE_CONFIG[typeGroup.type as keyof typeof TYPE_CONFIG] || {
    label: typeGroup.type,
    icon: Package,
    color: "text-gray-600",
    bgColor: "bg-gray-50 dark:bg-gray-950",
    borderColor: "border-gray-200 dark:border-gray-800",
    description: "Outros tipos de investimento"
  };

  const Icon = config.icon;

  /**
   * Calcula o percentual do tipo na carteira total
   */
  const portfolioPercentage = totalPortfolio > 0 ? (typeGroup.total / totalPortfolio) * 100 : 0;

  /**
   * Formata valores monetários
   */
  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency', 
      currency: 'BRL'
    }).format(value);
  };

  /**
   * Filtra investimentos com saldo maior que zero para exibição
   */
  const activeInvestments = typeGroup.investments.filter(investment => investment.balance > 0);
  const inactiveCount = typeGroup.investments.length - activeInvestments.length;

  /**
   * Ordena investimentos por saldo (maior para menor)
   */
  const sortedInvestments = [...activeInvestments].sort((a, b) => b.balance - a.balance);

  return (
    <Card className={`transition-all duration-200 ${config.borderColor} ${config.bgColor}`}>
      <CardHeader 
        className="cursor-pointer" 
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg bg-background shadow-sm`}>
              <Icon className={`h-5 w-5 ${config.color}`} />
            </div>
            <div>
              <CardTitle className="text-lg flex items-center gap-2">
                {config.label}
                <Badge variant="secondary" className="text-xs">
                  {typeGroup.count} produtos
                </Badge>
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                {config.description}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-xl font-bold">
                {formatCurrency(typeGroup.total)}
              </div>
              <div className="text-sm text-muted-foreground">
                {portfolioPercentage.toFixed(1)}% da carteira
              </div>
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              className="p-1 h-8 w-8"
            >
              {isExpanded ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </CardHeader>

      {isExpanded && (
        <CardContent className="pt-0">
          <div className="space-y-3">
            {sortedInvestments.length > 0 ? (
              <>
                {sortedInvestments.map((investment) => (
                  <InvestmentCard
                    key={investment._id}
                    investment={investment}
                    portfolioTotal={totalPortfolio}
                  />
                ))}
                
                {inactiveCount > 0 && (
                  <div className="mt-4 p-3 rounded-lg bg-muted/50 border border-dashed">
                    <p className="text-sm text-muted-foreground text-center">
                      {inactiveCount} produto{inactiveCount > 1 ? 's' : ''} inativo{inactiveCount > 1 ? 's' : ''} 
                      (saldo zerado) não exibido{inactiveCount > 1 ? 's' : ''}
                    </p>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-6">
                <Package className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">
                  Nenhum investimento ativo nesta categoria
                </p>
              </div>
            )}
          </div>
        </CardContent>
      )}
    </Card>
  );
};