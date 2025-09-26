import React, { useState, useEffect, useCallback } from "react";
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

const loadPluggyScript = () => {
  return new Promise<void>((resolve, reject) => {
    if (window.PluggyConnect) {
      return resolve();
    }

    const script = document.createElement('script');
    
    script.src = 'https://cdn.pluggy.ai/pluggy-connect/v2.8.2/pluggy-connect.js';
    script.async = true;

    script.onload = () => {
      console.log("Pluggy script loaded successfully.");
      resolve();
    };

    script.onerror = () => {
      console.error("Failed to load Pluggy script.");
      reject(new Error("Não foi possível carregar o script de conexão. Verifique sua conexão com a internet."));
    };

    document.head.appendChild(script);
  });
};


export const PluggyConnect = ({ variant = "default", className, onConnectionSuccess }: PluggyConnectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSuccess = useCallback((itemData: any) => {
    toast({
      title: "Conexão estabelecida!",
      description: `${itemData.connector.name} foi conectado com sucesso.`,
    });
    setIsOpen(false);
    onConnectionSuccess?.();
  }, [onConnectionSuccess, toast]);

  const handleError = useCallback((error: any) => {
    console.error('Pluggy connection error:', error);
    toast({
      title: "Erro na conexão",
      description: error.message || "Não foi possível conectar com a instituição financeira.",
      variant: "destructive",
    });
    setIsOpen(false);
  }, [toast]);
  
  const handleExit = useCallback(() => {
    setIsOpen(false);
  }, []);

  const handleConnect = async () => {
    setIsLoading(true);

    try {
      await loadPluggyScript();

      const currentUser = authService.getCurrentUser();
      if (!currentUser) {
        throw new Error('Usuário não autenticado');
      }
      
      const response = await apiService.getPluggyToken(currentUser.id);
      const connectToken = response?.accessToken;

      if (!connectToken) {
        console.error("A resposta da API não continha um 'accessToken' válido:", response);
        throw new Error('Falha ao obter o token de conexão da API.');
      }

      const pluggyConnect = new window.PluggyConnect({
        connectToken: connectToken,
        includeSandbox: true,
        events: {
          onSuccess: handleSuccess,
          onError: handleError,
          onExit: handleExit,
        }
      });

      pluggyConnect.init();

    } catch (error: any) {
      toast({
        title: "Erro ao Iniciar Conexão",
        description: error.message,
        variant: "destructive",
      });
      setIsLoading(false); 
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
              <h4 className="font-medium text-sm">Segurança de Nível Bancário</h4>
              <p className="text-xs text-muted-foreground mt-1">
                Suas credenciais são criptografadas e nunca são compartilhadas. Conexão via Open Finance, regulado pelo Banco Central.
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
              Continuar com Segurança
            </>
          )}
        </Button>

        <div className="text-center text-xs text-muted-foreground mt-4 pt-4 border-t">
          <p>
            Ao continuar, você concorda em conectar sua conta através da Pluggy.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};