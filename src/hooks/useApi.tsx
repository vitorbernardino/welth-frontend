import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiService } from '@/services/api';
import { authService } from '@/services/auth';
import { useToast } from './use-toast';

// Dashboard hooks
export const useDashboard = () => {
  return useQuery({
    queryKey: ['dashboard'],
    queryFn: async () => {
      console.log('useDashboard: Iniciando requisição...');
      
      try {
        const result = await apiService.getDashboard();
        console.log('useDashboard: Resultado recebido:', result);
        return result;
      } catch (error) {
        console.error('useDashboard: Erro na requisição:', error);
        throw error;
      }
    },
    refetchInterval: 5 * 60 * 1000, // 5 minutes
    retry: (failureCount, error: any) => {
      console.log('useDashboard: Tentativa de retry:', failureCount, error?.message);
      return failureCount < 3;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};

export const useDashboardSummary = () => {
  return useQuery({
    queryKey: ['dashboard-summary'],
    queryFn: apiService.getDashboardSummary,
    refetchInterval: 5 * 60 * 1000,
  });
};

// Transactions hooks
export const useTransactions = (params?: any) => {
  return useQuery({
    queryKey: ['transactions', params],
    queryFn: () => apiService.getTransactions(params),
  });
};

export const useRecentTransactions = () => {
  return useQuery({
    queryKey: ['transactions', 'recent'],
    queryFn: async () => {
      console.log('useRecentTransactions: Iniciando requisição...');
      
      try {
        const result = await apiService.getRecentTransactions();
        console.log('useRecentTransactions: Resultado recebido:', result);
        return result;
      } catch (error) {
        console.error('useRecentTransactions: Erro na requisição:', error);
        throw error;
      }
    },
    refetchInterval: 2 * 60 * 1000, // 2 minutes
  });
};

export const useTransactionStats = (year: number, month: number) => {
  return useQuery({
    queryKey: ['transaction-stats', year, month],
    queryFn: () => apiService.getTransactionStats(year, month),
  });
};

export const useCreateTransaction = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: apiService.createTransaction,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['transaction-stats'] });
      toast({
        title: "Sucesso!",
        description: "Transação criada com sucesso.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro",
        description: error.message || "Erro ao criar transação.",
        variant: "destructive",
      });
    },
  });
};

export const useUpdateTransaction = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => 
      apiService.updateTransaction(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      toast({
        title: "Sucesso!",
        description: "Transação atualizada com sucesso.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro",
        description: error.message || "Erro ao atualizar transação.",
        variant: "destructive",
      });
    },
  });
};

export const useDeleteTransaction = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: apiService.deleteTransaction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      toast({
        title: "Sucesso!",
        description: "Transação excluída com sucesso.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro",
        description: error.message || "Erro ao excluir transação.",
        variant: "destructive",
      });
    },
  });
};

// Investments hooks
export const useInvestments = () => {
  return useQuery({
    queryKey: ['investments'],
    queryFn: apiService.getInvestments,
    refetchInterval: 10 * 60 * 1000, // 10 minutes
  });
};

export const useInvestmentsByConnection = (itemId: string) => {
  return useQuery({
    queryKey: ['investments', 'by-connection', itemId],
    queryFn: () => apiService.getInvestmentsByConnection(itemId),
    enabled: !!itemId,
  });
};

export const useTotalInvested = () => {
  return useQuery({
    queryKey: ['investments', 'total'],
    queryFn: apiService.getTotalInvested,
  });
};

export const useSyncInvestments = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: apiService.syncInvestments,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['investments'] });
      toast({
        title: "Sincronização concluída!",
        description: `${data.data.investmentsCreated} novos investimentos, ${data.data.investmentsUpdated} atualizados.`,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro na sincronização",
        description: error.message || "Erro ao sincronizar investimentos.",
        variant: "destructive",
      });
    },
  });
};

// Spreadsheet hooks
export const useAllSpreadsheets = () => {
  return useQuery({
    queryKey: ['spreadsheets', 'all'],
    queryFn: apiService.getAllSpreadsheets,
  });
};

export const useSpreadsheetByMonth = (year: number, month: number) => {
  return useQuery({
    queryKey: ['spreadsheet', year, month],
    queryFn: () => apiService.getSpreadsheetByMonth(year, month),
    enabled: !!year && !!month,
  });
};

export const useNext10Months = () => {
  return useQuery({
    queryKey: ['spreadsheets', 'next-10-months'],
    queryFn: apiService.getNext10Months,
  });
};

export const useInitializeSpreadsheets = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: apiService.initializeSpreadsheets,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['spreadsheets'] });
      toast({
        title: "Planilhas inicializadas!",
        description: "Suas planilhas foram configuradas com sucesso.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro",
        description: error.message || "Erro ao inicializar planilhas.",
        variant: "destructive",
      });
    },
  });
};

export const useUpdateSpreadsheet = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ year, month, data }: { year: number; month: number; data: any }) =>
      apiService.updateSpreadsheet(year, month, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['spreadsheets'] });
      toast({
        title: "Planilha atualizada!",
        description: "Dados salvos com sucesso.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro",
        description: error.message || "Erro ao atualizar planilha.",
        variant: "destructive",
      });
    },
  });
};

export const useUpdateDayData = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ year, month, day, data }: { year: number; month: number; day: number; data: any }) =>
      apiService.updateDayData(year, month, day, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['spreadsheets'] });
    },
  });
};

// Connections hooks
export const useConnections = () => {
  return useQuery({
    queryKey: ['connections'],
    queryFn: apiService.getConnections,
    refetchInterval: 5 * 60 * 1000,
  });
};

export const useDeleteConnection = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: apiService.deleteConnection,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['connections'] });
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['investments'] });
      toast({
        title: "Conexão removida",
        description: "A conexão foi removida com sucesso.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro",
        description: error.message || "Erro ao remover conexão.",
        variant: "destructive",
      });
    },
  });
};

export const useSyncTransactions = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: apiService.syncTransactions,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      toast({
        title: "Sincronização concluída!",
        description: `${data.data.transactionsCreated} novas transações, ${data.data.transactionsUpdated} atualizadas.`,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro na sincronização",
        description: error.message || "Erro ao sincronizar transações.",
        variant: "destructive",
      });
    },
  });
};

export const useSyncAllTransactions = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: apiService.syncAllTransactions,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['investments'] });
      toast({
        title: "Sincronização concluída!",
        description: `${data.data.totalTransactionsProcessed} transações processadas.`,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro na sincronização",
        description: error.message || "Erro ao sincronizar todas as conexões.",
        variant: "destructive",
      });
    },
  });
};

// Pluggy integration hooks
export const usePluggyToken = (itemId?: string) => {
  const user = authService.getCurrentUser();
  
  return useQuery({
    queryKey: ['pluggy-token', user?.id, itemId],
    queryFn: () => apiService.getPluggyToken(user!.id, itemId),
    enabled: !!user?.id,
  });
};

export const useUserConnections = () => {
  const user = authService.getCurrentUser();
  
  return useQuery({
    queryKey: ['user-connections', user?.id],
    queryFn: () => apiService.getUserConnections(user!.id),
    enabled: !!user?.id,
  });
};

export const useUserTransactions = () => {
  const user = authService.getCurrentUser();
  
  return useQuery({
    queryKey: ['user-transactions', user?.id],
    queryFn: () => apiService.getUserTransactions(user!.id),
    enabled: !!user?.id,
  });
};