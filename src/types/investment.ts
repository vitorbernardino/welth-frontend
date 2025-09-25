export interface Investment {
    _id: string;
    externalId: string;
    __v: number;
    balance: number;
    code: string;
    createdAt: string;
    currencyCode: string;
    issuer?: string;
    itemId: string;
    lastSyncAt: string;
    name: string;
    rate?: number;
    source: string;
    subtype: string;
    type: string;
    updatedAt: string;
    userId: string;
  }
  
  /**
   * Interface para agrupamento de investimentos por tipo
   */
  export interface InvestmentByType {
    type: string;
    total: number;
    count: number;
    investments: Investment[];
  }
  
  /**
   * Interface para dados completos da API de investimentos
   */
  export interface InvestmentApiResponse {
    success: boolean;
    data: {
      totalInvested: number;
      totalProducts: number;
      byType: InvestmentByType[];
      investments: Investment[];
    };
    timestamp: string;
  }
  
  /**
   * Tipos de investimento suportados
   */
  export const INVESTMENT_TYPES = {
    FIXED_INCOME: 'fixed_income',
    VARIABLE_INCOME: 'variable_income',
    OTHER: 'other',
    CRYPTO: 'crypto',
    REAL_ESTATE: 'real_estate'
  } as const;
  
  /**
   * Subtipos de investimento
   */
  export const INVESTMENT_SUBTYPES = {
    CDB: 'cdb',
    LCI: 'lci',
    LCA: 'lca',
    TESOURO: 'tesouro',
    DEBENTURE: 'debenture',
    STOCK: 'stock',
    FII: 'fii',
    FUND: 'fund',
    OTHER: 'other'
  } as const;
  
  /**
   * Interface para filtros de investimento
   */
  export interface InvestmentFilters {
    type?: string;
    subtype?: string;
    minBalance?: number;
    maxBalance?: number;
    searchTerm?: string;
  }
  
  /**
   * Interface para ordenação de investimentos
   */
  export interface InvestmentSort {
    field: 'balance' | 'name' | 'rate' | 'createdAt';
    direction: 'asc' | 'desc';
  }