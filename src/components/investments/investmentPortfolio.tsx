import { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Search, RefreshCw, Package, Loader2 } from "lucide-react";
import { InvestmentSummary } from "./InvestmentSummary";
import { InvestmentTypeSection } from "./InvestmentTypeSection";
import { useToast } from "@/hooks/use-toast";
import { useInvestments, useSyncAllInvestments  } from "@/hooks/useApi";

export const InvestmentPortfolio = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState<string>("all");
  
  const { data: investmentsData, isLoading, error, refetch } = useInvestments();
  const syncAllInvestmentsMutation = useSyncAllInvestments();
  
  const investmentData = investmentsData?.data || { totalInvested: 0, totalProducts: 0, byType: [], investments: [] };
  
  const handleSyncData = () => {
    syncAllInvestmentsMutation.mutate();
  };


  const filteredInvestments = useMemo(() => {
    let filtered = investmentData.byType;
    
    if (selectedType !== "all") {
      filtered = filtered.filter(group => group.type === selectedType);
    }
    
    if (searchTerm) {
      filtered = filtered.map(group => ({
        ...group,
        investments: group.investments.filter(investment =>
          investment.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (investment.issuer && investment.issuer.toLowerCase().includes(searchTerm.toLowerCase()))
        )
      })).filter(group => group.investments.length > 0);
    }
    
    return filtered;
  }, [investmentData.byType, selectedType, searchTerm]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="p-8 text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">Carregando investimentos...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
        <div className="space-y-6">
            <Card>
                <CardContent className="p-8 text-center">
                    <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">Erro ao carregar investimentos</h3>
                    <p className="text-muted-foreground mb-4">
                        Não foi possível carregar seus investimentos. Tente novamente.
                    </p>
                    <Button onClick={handleSyncData} variant="outline" disabled={syncAllInvestmentsMutation.isPending}>
                        <RefreshCw className={`h-4 w-4 mr-2 ${syncAllInvestmentsMutation.isPending ? 'animate-spin' : ''}`} />
                        {syncAllInvestmentsMutation.isPending ? 'Sincronizando...' : 'Tentar Sincronizar'}
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
  }


  return (
    <div className="space-y-6">
      {/* Resumo Geral */}
      <InvestmentSummary 
        totalInvested={investmentData.totalInvested}
        totalProducts={investmentData.totalProducts}
        byType={investmentData.byType}
      />

      {/* Barra de Ferramentas */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center flex-1">
              {/* Busca */}
              <div className="relative flex-1 min-w-[250px]">
                <Search className="absolute left-3 top-1/2 h-4 w-4 text-muted-foreground transform -translate-y-1/2" />
                <Input
                  placeholder="Buscar investimentos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Filtro por Tipo */}
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Tipo de investimento" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os tipos</SelectItem>
                  <SelectItem value="fixed_income">Renda Fixa</SelectItem>
                  <SelectItem value="variable_income">Renda Variável</SelectItem>
                  <SelectItem value="other">Outros</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Ações */}
            <div className="flex gap-2">
            
              <Button
                variant="outline"
                size="sm"
                onClick={handleSyncData}
                disabled={syncAllInvestmentsMutation.isPending}
                className="flex items-center gap-2"
              >
                <RefreshCw className={`h-4 w-4 ${syncAllInvestmentsMutation.isPending ? 'animate-spin' : ''}`} />
                {syncAllInvestmentsMutation.isPending ? 'Sincronizando...' : 'Sincronizar'}
              </Button>
            </div>
          </div>

        </CardContent>
      </Card>

      <div className="space-y-6">
        {filteredInvestments.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">Nenhum investimento encontrado</h3>
              <p className="text-muted-foreground">
                {searchTerm || selectedType !== "all" 
                  ? "Tente ajustar os filtros de busca."
                  : "Seus investimentos aparecerão aqui quando sincronizados."
                }
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredInvestments.map((typeGroup) => (
            <InvestmentTypeSection
              key={typeGroup.type}
              typeGroup={typeGroup}
              totalPortfolio={investmentData.totalInvested}
            />
          ))
        )}
      </div>
    </div>
  );
};