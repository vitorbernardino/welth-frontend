import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Building2, RefreshCw, Trash2, CheckCircle, XCircle, Clock, Wifi, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { BankConnectionButton } from "./BankConnectionButton";
import { formatDistanceToNow } from "date-fns";
import { useQueryClient } from "@tanstack/react-query";
import { useConnections, useDeleteConnection, useSyncTransactions } from "@/hooks/useApi";
import { ptBR } from "date-fns/locale";

interface ApiConnection {
  _id: string;
  itemId: string;
  name: string;
  status: "connected" | "error" | "syncing" | "active";
  createdAt: string;
  updatedAt: string;
}

const getStatusConfig = (status: ApiConnection['status']) => {
  switch (status) {
    case "active":
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

    default:
        return {
            icon: Building2,
            color: "text-muted-foreground",
            bgColor: "bg-muted/50",
            label: "Desconhecido"
        };
  }
};

const formatLastSync = (dateString: string) => {
  const date = new Date(dateString);
  return formatDistanceToNow(date, { addSuffix: true, locale: ptBR });
};

export const BankConnectionsList = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

    const { data: connectionsResponse, isLoading, error } = useConnections();
    const deleteConnectionMutation = useDeleteConnection();
    const syncTransactionsMutation = useSyncTransactions();
  
    const connections: ApiConnection[] = connectionsResponse?.data || [];
  
    const handleConnectionSuccess = () => {
      toast({ title: "Atualizando lista de conexões..." });
      queryClient.invalidateQueries({ queryKey: ['connections'] });
    };

  const handleSync = (itemId: string, bankName: string) => {
    toast({ title: `Sincronizando ${bankName}...`, description: "Buscando novas transações." });
    syncTransactionsMutation.mutate(itemId, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['connections'] });
      }
    });
  };

  const handleRemoveConnection = (connectionId: string, bankName: string) => {
    deleteConnectionMutation.mutate(connectionId);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error) {
    return <div className="text-center py-12 text-destructive">Erro ao carregar conexões.</div>;
  }

  if (connections.length === 0) {
    return (
      <div className="text-center py-12 border-2 border-dashed rounded-lg">
        <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-medium mb-2">Nenhuma conexão bancária</h3>
        <p className="text-muted-foreground mb-6">
          Conecte seu banco para sincronizar transações e investimentos automaticamente.
        </p>
        <BankConnectionButton onConnectionSuccess={handleConnectionSuccess} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Suas Conexões</h2>
          <p className="text-sm text-muted-foreground">
            Gerencie suas instituições financeiras conectadas
          </p>
        </div>
        <BankConnectionButton variant="outline" onConnectionSuccess={handleConnectionSuccess} />
      </div>

      <div className="grid gap-4">
        {connections.map((connection) => {
          const statusConfig = getStatusConfig(connection.status);
          const StatusIcon = statusConfig.icon;
          const isSyncing = syncTransactionsMutation.isPending && syncTransactionsMutation.variables === connection.itemId;

          return (
            <Card key={connection._id} className="overflow-hidden">
              <CardContent className="p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Building2 className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-base">{connection.name}</CardTitle>
                      <CardDescription className="text-xs">
                        Última sincronização: {formatLastSync(connection.updatedAt)}
                      </CardDescription>
                    </div>
                  </div>
                  <div className={`flex items-center gap-1.5 px-2 py-1 rounded-full text-xs ${statusConfig.bgColor}`}>
                    <StatusIcon className={`h-3 w-3 ${statusConfig.color}`} />
                    <span className={statusConfig.color}>{statusConfig.label}</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleSync(connection.itemId, connection.name)}
                    disabled={isSyncing}
                    className="flex-1"
                  >
                    <RefreshCw className={`h-3 w-3 mr-2 ${isSyncing ? 'animate-spin' : ''}`} />
                    {isSyncing ? "Sincronizando..." : "Sincronizar"}
                  </Button>
                  
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="outline" size="icon" className="text-destructive hover:text-destructive hover:bg-destructive/10">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Remover Conexão com {connection.name}?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Esta ação não pode ser desfeita. Suas transações e investimentos já sincronizados não serão apagados.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleRemoveConnection(connection._id, connection.name)}
                          className="bg-destructive hover:bg-destructive/90"
                          disabled={deleteConnectionMutation.isPending}
                        >
                          {deleteConnectionMutation.isPending ? "Removendo..." : "Remover"}
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