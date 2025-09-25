import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, CreditCard, ArrowRight, Shield, Lock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

import { PluggyConnect } from "@/components/pluggy/PluggyConnect";

interface BankConnectionButtonProps {
  variant?: "default" | "outline";
  className?: string;
  onConnectionSuccess?: () => void;
}

export const BankConnectionButton = ({ variant = "default", className, onConnectionSuccess }: BankConnectionButtonProps) => {
  return (
    <PluggyConnect 
      variant={variant}
      className={className}
      onConnectionSuccess={onConnectionSuccess}
    />
  );
};