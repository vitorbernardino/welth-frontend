import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { X, RotateCcw } from "lucide-react";
import { InvestmentFilters as IInvestmentFilters } from "@/types/investment";

interface InvestmentFiltersProps {
  onFiltersChange: (filters: IInvestmentFilters) => void;
}

/**
 * Opções de filtros disponíveis
 */
const FILTER_OPTIONS = {
  types: [
    { value: "fixed_income", label: "Renda Fixa" },
    { value: "variable_income", label: "Renda Variável" },
    { value: "other", label: "Outros" },
    { value: "crypto", label: "Criptomoedas" },
    { value: "real_estate", label: "Fundos Imobiliários" }
  ],
  subtypes: [
    { value: "cdb", label: "CDB" },
    { value: "lci", label: "LCI" },
    { value: "lca", label: "LCA" },
    { value: "tesouro", label: "Tesouro Direto" },
    { value: "fund", label: "Fundos" },
    { value: "other", label: "Outros" }
  ]
};

const BALANCE_RANGES = {
  min: 0,
  max: 50000,
  step: 500
};

export const InvestmentFilters = ({ onFiltersChange }: InvestmentFiltersProps) => {
  const [filters, setFilters] = useState<IInvestmentFilters>({});
  const [balanceRange, setBalanceRange] = useState<[number, number]>([
    BALANCE_RANGES.min, 
    BALANCE_RANGES.max
  ]);

  /**
   * Atualiza filtros e notifica componente pai
   */
  const updateFilters = (newFilters: Partial<IInvestmentFilters>) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    onFiltersChange(updatedFilters);
  };

  /**
   * Remove um filtro específico
   */
  const removeFilter = (filterKey: keyof IInvestmentFilters) => {
    const newFilters = { ...filters };
    delete newFilters[filterKey];
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  /**
   * Limpa todos os filtros
   */
  const clearAllFilters = () => {
    setFilters({});
    setBalanceRange([BALANCE_RANGES.min, BALANCE_RANGES.max]);
    onFiltersChange({});
  };

  /**
   * Atualiza faixa de saldo
   */
  const handleBalanceRangeChange = (value: number[]) => {
    const [min, max] = value;
    setBalanceRange([min, max]);
    updateFilters({
      minBalance: min > BALANCE_RANGES.min ? min : undefined,
      maxBalance: max < BALANCE_RANGES.max ? max : undefined
    });
  };

  /**
   * Formata valor monetário
   */
  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  /**
   * Conta quantos filtros estão ativos
   */
  const activeFiltersCount = Object.keys(filters).filter(key => 
    filters[key as keyof IInvestmentFilters] !== undefined
  ).length;

  return (
    <div className="space-y-6">
      {/* Header dos Filtros */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="font-medium">Filtros Avançados</h3>
          {activeFiltersCount > 0 && (
            <Badge variant="secondary" className="text-xs">
              {activeFiltersCount} aplicado{activeFiltersCount > 1 ? 's' : ''}
            </Badge>
          )}
        </div>
        
        {activeFiltersCount > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={clearAllFilters}
            className="h-8 px-3 text-xs"
          >
            <RotateCcw className="h-3 w-3 mr-1" />
            Limpar tudo
          </Button>
        )}
      </div>

      {/* Grid de Filtros */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Filtro por Tipo */}
        <div className="space-y-2">
          <Label htmlFor="type-filter">Tipo de Investimento</Label>
          <Select
            value={filters.type || ""}
            onValueChange={(value) => updateFilters({ type: value || undefined })}
          >
            <SelectTrigger id="type-filter">
              <SelectValue placeholder="Todos os tipos" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Todos os tipos</SelectItem>
              {FILTER_OPTIONS.types.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Filtro por Subtipo */}
        <div className="space-y-2">
          <Label htmlFor="subtype-filter">Subtipo</Label>
          <Select
            value={filters.subtype || ""}
            onValueChange={(value) => updateFilters({ subtype: value || undefined })}
          >
            <SelectTrigger id="subtype-filter">
              <SelectValue placeholder="Todos os subtipos" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Todos os subtipos</SelectItem>
              {FILTER_OPTIONS.subtypes.map((subtype) => (
                <SelectItem key={subtype.value} value={subtype.value}>
                  {subtype.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Busca por Termo */}
        <div className="space-y-2">
          <Label htmlFor="search-filter">Buscar por nome</Label>
          <Input
            id="search-filter"
            placeholder="Nome ou instituição..."
            value={filters.searchTerm || ""}
            onChange={(e) => updateFilters({ searchTerm: e.target.value || undefined })}
          />
        </div>
      </div>

      {/* Filtro de Faixa de Saldo */}
      <div className="space-y-4">
        <Label>Faixa de Saldo</Label>
        <div className="px-3">
          <Slider
            value={balanceRange}
            onValueChange={handleBalanceRangeChange}
            min={BALANCE_RANGES.min}
            max={BALANCE_RANGES.max}
            step={BALANCE_RANGES.step}
            className="w-full"
          />
        </div>
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>{formatCurrency(balanceRange[0])}</span>
          <span>{formatCurrency(balanceRange[1])}</span>
        </div>
      </div>

      {/* Tags dos Filtros Ativos */}
      {activeFiltersCount > 0 && (
        <div className="space-y-2">
          <Label>Filtros Aplicados</Label>
          <div className="flex flex-wrap gap-2">
            {filters.type && (
              <Badge variant="secondary" className="text-xs">
                Tipo: {FILTER_OPTIONS.types.find(t => t.value === filters.type)?.label}
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-4 w-4 p-0 ml-2"
                  onClick={() => removeFilter('type')}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            )}
            
            {filters.subtype && (
              <Badge variant="secondary" className="text-xs">
                Subtipo: {FILTER_OPTIONS.subtypes.find(s => s.value === filters.subtype)?.label}
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-4 w-4 p-0 ml-2"
                  onClick={() => removeFilter('subtype')}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            )}
            
            {filters.searchTerm && (
              <Badge variant="secondary" className="text-xs">
                Busca: "{filters.searchTerm}"
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-4 w-4 p-0 ml-2"
                  onClick={() => removeFilter('searchTerm')}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            )}
            
            {(filters.minBalance || filters.maxBalance) && (
              <Badge variant="secondary" className="text-xs">
                Saldo: {formatCurrency(filters.minBalance || 0)} - {formatCurrency(filters.maxBalance || BALANCE_RANGES.max)}
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-4 w-4 p-0 ml-2"
                  onClick={() => {
                    removeFilter('minBalance');
                    removeFilter('maxBalance');
                    setBalanceRange([BALANCE_RANGES.min, BALANCE_RANGES.max]);
                  }}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            )}
          </div>
        </div>
      )}
    </div>
  );
};