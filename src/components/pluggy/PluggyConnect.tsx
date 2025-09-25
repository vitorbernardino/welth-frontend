import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Building2, Shield, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiService } from "@/services/api";
import { authService } from "@/services/auth";

interface PluggyConnectProps {
  variant?: "default" | "outline";
  className?: string;
  onConnectionSuccess?: () => void;
}

declare global {
  interface Window {
    PluggyConnect: any;
  }
}

export const PluggyConnect = ({ variant = "default", className, onConnectionSuccess }: PluggyConnectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [pluggyToken, setPluggyToken] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Load Pluggy SDK
    if (!window.PluggyConnect) {
      const script = document.createElement('script');
      script.src = 'https://cdn.pluggy.ai/widget/pluggy-connect.umd.js';
      script.async = true;
      document.head.appendChild(script);
    }
  }, []);

  const fetchPluggyToken = async () => {
    try {
      setIsLoading(true);
      const currentUser = authService.getCurrentUser();
      
      if (!currentUser) {
        throw new Error('User not authenticated');
      }

      const response = await apiService.getPluggyToken(currentUser.id);
      
      if (response.success) {
        setPluggyToken(response.data.token);
        return response.data.token;
      }
      
      throw new Error(response.message || 'Failed to get Pluggy token');
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message || "Não foi possível obter token de conexão",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const handleConnect = async () => {
    const token = await fetchPluggyToken();
    
    if (!token || !window.PluggyConnect) {
      toast({
        title: "Erro",
        description: "Não foi possível carregar o widget de conexão",
        variant: "destructive",
      });
      return;
    }

    try {
      const pluggyConnect = new window.PluggyConnect({
        token: token,
        includeSandbox: false,
        updateItem: null,
      });

      pluggyConnect.init();

      pluggyConnect.onSuccess((itemData: any) => {
        toast({
          title: "Conexão estabelecida!",
          description: `${itemData.connector.name} foi conectado com sucesso.`,
        });
        
        setIsOpen(false);
        onConnectionSuccess?.();
      });

      pluggyConnect.onError((error: any) => {
        console.error('Pluggy connection error:', error);
        toast({
          title: "Erro na conexão",
          description: "Não foi possível conectar com a instituição financeira.",
          variant: "destructive",
        });
      });

      pluggyConnect.onExit(() => {
        console.log('User exited Pluggy widget');
      });
    } catch (error) {
      console.error('Error initializing Pluggy:', error);
      toast({
        title: "Erro",
        description: "Erro ao inicializar widget de conexão",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant={variant} className={className}>
          <Building2 className="h-4 w-4 mr-2" />
          Conectar Banco
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Conectar com seu Banco
          </DialogTitle>
          <DialogDescription>
            Conecte sua conta bancária de forma segura para sincronizar automaticamente suas transações e investimentos.
          </DialogDescription>
        </DialogHeader>

        <div className="bg-muted/50 rounded-lg p-4 mb-6">
          <div className="flex items-start gap-3">
            <Shield className="h-5 w-5 text-primary mt-0.5" />
            <div>
              <h4 className="font-medium text-sm">Segurança e Privacidade</h4>
              <p className="text-xs text-muted-foreground mt-1">
                Suas credenciais são protegidas com criptografia de nível bancário. 
                Tecnologia Open Banking certificada pelo Banco Central.
              </p>
            </div>
          </div>
        </div>

        <Button 
          onClick={handleConnect}
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Carregando...
            </>
          ) : (
            <>
              <Shield className="h-4 w-4 mr-2" />
              Conectar com Segurança
            </>
          )}
        </Button>

        <div className="text-center text-xs text-muted-foreground mt-4 pt-4 border-t">
          <p>
            Conexão protegida por SSL. Tecnologia Open Banking certificada pelo Banco Central.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};