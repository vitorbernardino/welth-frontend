import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Building2, 
  Calendar, 
  TrendingUp, 
  Eye, 
  MoreHorizontal,
  Shield,
  Landmark,
  Target
} from "lucide-react";
import { Investment } from "@/types/investment";

interface InvestmentCardProps {
  investment: Investment;
  portfolioTotal: number;
}

/**
 * Configuração de badges para subtipos de investimento
 */
const SUBTYPE_CONFIG = {
  cdb: {
    label: "CDB",
    variant: "default" as const,
    icon: Landmark
  },
  lci: {
    label: "LCI", 
    variant: "secondary" as const,
    icon: Building2
  },
  lca: {
    label: "LCA",
    variant: "secondary" as const, 
    icon: Building2
  },
  tesouro: {
    label: "Tesouro",
    variant: "outline" as const,
    icon: Shield
  },
  fund: {
    label: "Fundo",
    variant: "secondary" as const,
    icon: Target
  },
  other: {
    label: "Outros",
    variant: "secondary" as const,
    icon: MoreHorizontal
  }
} as const;

export const InvestmentCard = ({ investment, portfolioTotal }: InvestmentCardProps) => {
  /**
   * Calcula o percentual do investimento na carteira total
   */
  const portfolioPercentage = portfolioTotal > 0 ? (investment.balance / portfolioTotal) * 100 : 0;

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
   * Formata datas para exibição
   */
  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit', 
      year: 'numeric'
    });
  };

  /**
   * Obtém configuração do subtipo de investimento
   */
  const subtypeConfig = SUBTYPE_CONFIG[investment.subtype as keyof typeof SUBTYPE_CONFIG] || {
    label: investment.subtype.toUpperCase(),
    variant: "secondary" as const,
    icon: MoreHorizontal
  };

  const SubtypeIcon = subtypeConfig.icon;

  /**
   * Trunca nomes muito longos para melhor exibição
   */
  const getTruncatedName = (name: string, maxLength: number = 50): string => {
    if (name.length <= maxLength) return name;
    return name.substring(0, maxLength) + "...";
  };

  /**
   * Obtém nome da instituição de forma simplificada
   */
  const getSimplifiedIssuer = (issuer?: string): string => {
    if (!issuer) return "N/A";
    
    // Extrai apenas o nome principal da instituição
    const simplified = issuer
      .replace(/S\.A\.|LTDA|SOCIEDADE|CREDITO|FINANCIAMENTO|INVESTIMENTO/gi, "")
      .replace(/\s+/g, " ")
      .trim();
    
    return simplified.length > 30 ? simplified.substring(0, 30) + "..." : simplified;
  };

  return (
    <Card className="hover:shadow-md transition-shadow duration-200 border border-border/50">
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-4">
          {/* Informações Principais */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start gap-3 mb-3">
              <div className="p-2 rounded-lg bg-primary/10 flex-shrink-0">
                <SubtypeIcon className="h-4 w-4 text-primary" />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-medium text-sm leading-tight">
                    {getTruncatedName(investment.name)}
                  </h4>
                  <Badge variant={subtypeConfig.variant} className="text-xs">
                    {subtypeConfig.label}
                  </Badge>
                </div>
                
                {investment.issuer && (
                  <div className="flex items-center gap-1 text-xs text-muted-foreground mb-2">
                    <Building2 className="h-3 w-3" />
                    <span>{getSimplifiedIssuer(investment.issuer)}</span>
                  </div>
                )}
                
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    <span>Criado em {formatDate(investment.createdAt)}</span>
                  </div>
                  
                  {investment.rate && (
                    <div className="flex items-center gap-1">
                      <TrendingUp className="h-3 w-3" />
                      <span>{investment.rate}% CDI</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Valores e Ações */}
          <div className="text-right flex-shrink-0">
            <div className="mb-2">
              <div className="text-lg font-bold text-foreground">
                {formatCurrency(investment.balance)}
              </div>
              <div className="text-xs text-muted-foreground">
                {portfolioPercentage.toFixed(2)}% da carteira
              </div>
            </div>
            
            <Button
              variant="outline"
              size="sm"
              className="h-8 px-3 text-xs"
            >
              <Eye className="h-3 w-3 mr-1" />
              Detalhes
            </Button>
          </div>
        </div>

        {/* Informações Adicionais */}
        <div className="mt-3 pt-3 border-t border-border/50">
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div>
              <span className="text-muted-foreground">Código:</span>
              <span className="ml-1 font-mono">{investment.code}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Última atualização:</span>
              <span className="ml-1">{formatDate(investment.lastSyncAt)}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};