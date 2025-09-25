
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