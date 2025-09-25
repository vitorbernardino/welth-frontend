/**
 * Tipos para conexões bancárias e sincronização de dados
 */

export type ConnectionStatus = "connected" | "error" | "syncing";

export interface BankConnection {
  id: string;
  bankId: string;
  bankName: string;
  bankLogo: string;
  status: ConnectionStatus;
  lastSync: string;
  accountsCount: number;
  transactionsCount: number;
  investmentsCount: number;
  connectedAt: string;
  error?: string;
}

export interface AvailableBank {
  id: string;
  name: string;
  logo: string;
  description: string;
  features: string[];
}