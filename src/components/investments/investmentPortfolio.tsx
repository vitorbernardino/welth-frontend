import { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Search, Filter, RefreshCw, DollarSign, Package, Target, Loader2 } from "lucide-react";
import { InvestmentSummary } from "./InvestmentSummary";
import { InvestmentTypeSection } from "./InvestmentTypeSection";
import { InvestmentFilters } from "./InvestmentFilters";
import { useToast } from "@/hooks/use-toast";
import { useInvestments, useSyncAllTransactions } from "@/hooks/useApi";

// Mock data baseado na estrutura da API fornecida
const mockInvestmentData = {
  success: true,
  data: {
    totalInvested: 2741.65,
    totalProducts: 19,
    byType: [
      {
        type: "fixed_income",
        total: 2739.08,
        count: 17,
        investments: [
          {
            _id: "68c9f9d179ccecae1ba7ff82",
            externalId: "510900d8-0d43-4d85-9677-134959352601",
            __v: 0,
            balance: 436.96,
            code: "CDBNUF",
            createdAt: "2025-09-16T23:59:13.054Z",
            currencyCode: "BRL",
            issuer: "NU FINANCEIRA S.A. - SOCIEDADE DE CREDITO, FINANCIAMENTO E INVESTIMENTO",
            itemId: "c80ef4c5-c09e-439f-8ee5-50b6f34401e3",
            lastSyncAt: "2025-09-16T23:59:13.054Z",
            name: "CDB - NU FINANCEIRA S.A.",
            rate: 100,
            source: "pluggy",
            subtype: "cdb",
            type: "fixed_income",
            updatedAt: "2025-09-16T23:59:13.054Z",
            userId: "68b8d694bdb7346aec5f22a9"
          },
          {
            _id: "68c9f9d079ccecae1ba7ff76",
            externalId: "0ce31290-34e2-4dbb-a5c8-cf43728b56cd",
            __v: 0,
            balance: 433.7,
            code: "CDBNUF",
            createdAt: "2025-09-16T23:59:12.910Z",
            currencyCode: "BRL",
            issuer: "NU FINANCEIRA S.A. - SOCIEDADE DE CREDITO, FINANCIAMENTO E INVESTIMENTO",
            itemId: "c80ef4c5-c09e-439f-8ee5-50b6f34401e3",
            lastSyncAt: "2025-09-16T23:59:12.909Z",
            name: "CDB - NU FINANCEIRA S.A.",
            rate: 100,
            source: "pluggy",
            subtype: "cdb",
            type: "fixed_income",
            updatedAt: "2025-09-16T23:59:12.910Z",
            userId: "68b8d694bdb7346aec5f22a9"
          },
          {
            _id: "68c9f9d179ccecae1ba7ff80",
            externalId: "70cb0b1c-19ed-4759-b9db-b9b4a8b3ef68",
            __v: 0,
            balance: 400.28,
            code: "CDBNUF",
            createdAt: "2025-09-16T23:59:13.029Z",
            currencyCode: "BRL",
            issuer: "NU FINANCEIRA S.A. - SOCIEDADE DE CREDITO, FINANCIAMENTO E INVESTIMENTO",
            itemId: "c80ef4c5-c09e-439f-8ee5-50b6f34401e3",
            lastSyncAt: "2025-09-16T23:59:13.029Z",
            name: "CDB - NU FINANCEIRA S.A.",
            rate: 100,
            source: "pluggy",
            subtype: "cdb",
            type: "fixed_income",
            updatedAt: "2025-09-16T23:59:13.029Z",
            userId: "68b8d694bdb7346aec5f22a9"
          }
        ]
      },
      {
        type: "other",
        total: 2.57,
        count: 2,
        investments: [
          {
            _id: "68c9f9d179ccecae1ba7ff7e",
            externalId: "8ff7b017-87d3-4218-b35a-e95ecb40b4b8",
            __v: 0,
            balance: 2.57,
            code: "40.156.155/0001-36",
            createdAt: "2025-09-16T23:59:12.997Z",
            currencyCode: "BRL",
            itemId: "c80ef4c5-c09e-439f-8ee5-50b6f34401e3",
            lastSyncAt: "2025-09-16T23:59:12.997Z",
            name: "NU SELEÇÃO POTENCIAL FUNDO DE INVESTIMENTO",
            source: "pluggy",
            subtype: "other",
            type: "other",
            updatedAt: "2025-09-16T23:59:12.997Z",
            userId: "68b8d694bdb7346aec5f22a9"
          }
        ]
      }
    ],
    investments: []
  },
  timestamp: "2025-09-17T00:01:14.138Z"
};

export const InvestmentPortfolio = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [showFilters, setShowFilters] = useState(false);
  
  const { data: investmentsData, isLoading, error, refetch } = useInvestments();
  const syncAllMutation = useSyncAllTransactions();
  
  const investmentData = investmentsData?.data || { totalInvested: 0, totalProducts: 0, byType: [], investments: [] };
  
  /**
   * Função para atualizar dados dos investimentos
   */
  const handleRefreshData = async () => {
    try {
      await refetch();
      syncAllMutation.mutate();
    } catch (error) {
      toast({
        title: "Erro ao atualizar",
        description: "Não foi possível sincronizar os dados. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  /**
   * Filtra investimentos baseado nos critérios selecionados
   */
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
            <Button onClick={handleRefreshData} variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Tentar novamente
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
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2"
              >
                <Filter className="h-4 w-4" />
                Filtros
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefreshData}
                disabled={syncAllMutation.isPending}
                className="flex items-center gap-2"
              >
                <RefreshCw className={`h-4 w-4 ${syncAllMutation.isPending ? 'animate-spin' : ''}`} />
                {syncAllMutation.isPending ? 'Sincronizando...' : 'Atualizar'}
              </Button>
            </div>
          </div>

          {/* Filtros Avançados (Expansível) */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-border">
              <InvestmentFilters onFiltersChange={() => {}} />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Lista de Investimentos por Tipo */}
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