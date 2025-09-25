import { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  LayoutDashboard, 
  Calculator, 
  ArrowUpDown, 
  TrendingUp,
  Menu,
  X
} from "lucide-react";
import { cn } from "@/lib/utils";
import WelthIcon from "@/assets/welth-icon.svg";

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const Sidebar = ({ activeTab, onTabChange }: SidebarProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const menuItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
      description: "Visão geral das finanças"
    },
    {
      id: "spreadsheet",
      label: "Planilha",
      icon: Calculator,
      description: "Controle diário"
    },
    {
      id: "transactions",
      label: "Lançamentos",
      icon: ArrowUpDown,
      description: "Entradas e saídas"
    },
    {
      id: "investments",
      label: "Investimentos",
      icon: TrendingUp,
      description: "Carteira e rentabilidade"
    }
  ];

  return (
    <div className={cn(
      "bg-card border-r border-border transition-all duration-300 flex flex-col sidebar",
      isCollapsed ? "w-16" : "w-64"
    )}>
      <div className="p-4">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <div className="flex items-center gap-2">
              <img src={WelthIcon} alt="Welth" className="h-8 w-8" />
              <span className="text-xl font-bold text-foreground">Welth</span>
            </div>
          )}
          {isCollapsed && (
            <div className="flex justify-center w-full">
              <img src={WelthIcon} alt="Welth" className="h-8 w-8" />
            </div>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="h-8 w-8 p-0"
          >
            {isCollapsed ? <Menu className="h-4 w-4" /> : <X className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          
          return (
            <Button
              key={item.id}
              variant={isActive ? "default" : "ghost"}
              className={cn(
                "w-full justify-start h-auto p-3",
                isCollapsed && "px-2",
                isActive && "bg-primary text-primary-foreground shadow-md"
              )}
              onClick={() => onTabChange(item.id)}
            >
              <Icon className={cn("h-5 w-5", !isCollapsed && "mr-3")} />
              {!isCollapsed && (
                <div className="flex flex-col items-start">
                  <span className="font-medium">{item.label}</span>
                  <span className="text-xs opacity-70">{item.description}</span>
                </div>
              )}
            </Button>
          );
        })}
      </nav>
    </div>
  );
};