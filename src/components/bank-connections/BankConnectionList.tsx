import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Building2, RefreshCw, Trash2, CheckCircle, XCircle, Clock, Wifi } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { BankConnectionButton } from "./BankConnectionButton";
import { BankConnection, ConnectionStatus } from "@/types/bank-connection";

// Mock data para conexões existentes
const MOCK_CONNECTIONS: BankConnection[] = [
  {
    id: "conn-1",
    bankId: "nubank",
    bankName: "Nubank",
    bankLogo: "🟣",
    status: "connected",
    lastSync: "2024-01-15T10:30:00Z",
    accountsCount: 2,
    transactionsCount: 156,
    investmentsCount: 5,
    connectedAt: "2024-01-10T14:20:00Z"
  },
  {
    id: "conn-2",
    bankId: "itau",
    bankName: "Itaú",
    bankLogo: "🟠",
    status: "error",
    lastSync: "2024-01-14T08:15:00Z",
    accountsCount: 1,
    transactionsCount: 89,
    investmentsCount: 0,
    connectedAt: "2024-01-05T09:45:00Z",
    error: "Token expirado"
  },
  {
    id: "conn-3",
    bankId: "bradesco",
    bankName: "Bradesco",
    bankLogo: "🔴",
    status: "syncing",
    lastSync: "2024-01-15T11:00:00Z",
    accountsCount: 1,
    transactionsCount: 234,
    investmentsCount: 12,
    connectedAt: "2024-01-08T16:30:00Z"
  }
];

const getStatusConfig = (status: ConnectionStatus) => {
  switch (status) {
    case "connected":
      return {
        icon: CheckCircle,
        color: "text-success",
        bgColor: "bg-success/10",
        label: "Conectado"
      };
    case "error":
      return {
        icon: XCircle,
        color: "text-destructive",
        bgColor: "bg-destructive/10",
        label: "Erro"
      };
    case "syncing":
      return {
        icon: Clock,
        color: "text-warning",
        bgColor: "bg-warning/10",
        label: "Sincronizando"
      };
  }
};

const formatLastSync = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
  
  if (diffInHours < 1) return "Agora há pouco";
  if (diffInHours < 24) return `Há ${diffInHours}h`;
  
  const diffInDays = Math.floor(diffInHours / 24);
  return `Há ${diffInDays} dia${diffInDays > 1 ? 's' : ''}`;
};

export const BankConnectionsList = () => {
  const [connections, setConnections] = useState(MOCK_CONNECTIONS);
  const [syncingConnections, setSyncingConnections] = useState<Set<string>>(new Set());
  const { toast } = useToast();

  const handleSync = async (connectionId: string, bankName: string) => {
    setSyncingConnections(prev => new Set(prev).add(connectionId));
    
    try {
      // Simula delay de sincronização
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Aqui será integrada a API real de sincronização
      console.log(`Sincronizando ${bankName}...`);
      
      // Atualiza a última sincronização
      setConnections(prev => prev.map(conn => 
        conn.id === connectionId 
          ? { ...conn, lastSync: new Date().toISOString(), status: "connected" as ConnectionStatus }
          : conn
      ));
      
      toast({
        title: "Sincronização concluída!",
        description: `Dados do ${bankName} foram atualizados com sucesso.`,
      });
    } catch (error) {
      toast({
        title: "Erro na sincronização",
        description: `Não foi possível sincronizar com ${bankName}.`,
        variant: "destructive",
      });
    } finally {
      setSyncingConnections(prev => {
        const newSet = new Set(prev);
        newSet.delete(connectionId);
        return newSet;
      });
    }
  };

  const handleRemoveConnection = async (connectionId: string, bankName: string) => {
    try {
      // Aqui será integrada a API real de remoção
      console.log(`Removendo conexão com ${bankName}...`);
      
      setConnections(prev => prev.filter(conn => conn.id !== connectionId));
      
      toast({
        title: "Conexão removida",
        description: `A conexão com ${bankName} foi removida com sucesso.`,
      });
    } catch (error) {
      toast({
        title: "Erro ao remover",
        description: `Não foi possível remover a conexão com ${bankName}.`,
        variant: "destructive",
      });
    }
  };

  if (connections.length === 0) {
    return (
      <div className="text-center py-12">
        <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-medium mb-2">Nenhuma conexão bancária</h3>
        <p className="text-muted-foreground mb-6">
          Conecte com seus bancos para sincronizar automaticamente suas transações e investimentos.
        </p>
        <BankConnectionButton />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header com botão para adicionar nova conexão */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Conexões Bancárias</h2>
          <p className="text-sm text-muted-foreground">
            Gerencie suas conexões com instituições financeiras
          </p>
        </div>
        <BankConnectionButton variant="outline" />
      </div>

      {/* Lista de conexões */}
      <div className="grid gap-4">
        {connections.map((connection) => {
          const statusConfig = getStatusConfig(connection.status);
          const StatusIcon = statusConfig.icon;
          const isSyncing = syncingConnections.has(connection.id);

          return (
            <Card key={connection.id} className="overflow-hidden">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">{connection.bankLogo}</div>
                    <div>
                      <CardTitle className="text-base">{connection.bankName}</CardTitle>
                      <CardDescription className="text-xs">
                        Conectado em {new Date(connection.connectedAt).toLocaleDateString('pt-BR')}
                      </CardDescription>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs ${statusConfig.bgColor}`}>
                      <StatusIcon className={`h-3 w-3 ${statusConfig.color}`} />
                      <span className={statusConfig.color}>{statusConfig.label}</span>
                    </div>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="pt-0">
                {/* Estatísticas */}
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="text-center">
                    <div className="text-lg font-semibold">{connection.accountsCount}</div>
                    <div className="text-xs text-muted-foreground">Contas</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold">{connection.transactionsCount}</div>
                    <div className="text-xs text-muted-foreground">Transações</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold">{connection.investmentsCount}</div>
                    <div className="text-xs text-muted-foreground">Investimentos</div>
                  </div>
                </div>

                {/* Status e última sincronização */}
                <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
                  <div className="flex items-center gap-1">
                    <Wifi className="h-3 w-3" />
                    Última sincronização: {formatLastSync(connection.lastSync)}
                  </div>
                  {connection.error && (
                    <Badge variant="destructive" className="text-xs">
                      {connection.error}
                    </Badge>
                  )}
                </div>

                {/* Ações */}
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleSync(connection.id, connection.bankName)}
                    disabled={isSyncing || connection.status === "syncing"}
                    className="flex-1"
                  >
                    <RefreshCw className={`h-3 w-3 mr-2 ${(isSyncing || connection.status === "syncing") ? 'animate-spin' : ''}`} />
                    {isSyncing || connection.status === "syncing" ? "Sincronizando..." : "Sincronizar"}
                  </Button>
                  
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="outline" size="sm" className="text-destructive hover:text-destructive">
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Remover Conexão</AlertDialogTitle>
                        <AlertDialogDescription>
                          Tem certeza que deseja remover a conexão com {connection.bankName}? 
                          Esta ação não pode ser desfeita e você precisará reconectar manualmente.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleRemoveConnection(connection.id, connection.bankName)}
                          className="bg-destructive hover:bg-destructive/90"
                        >
                          Remover
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};