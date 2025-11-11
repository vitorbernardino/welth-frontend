import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { PlusCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useCreateTransaction } from "@/hooks/useApi";

const incomeCategories = [
  { value: "salary", label: "Salário" },
  { value: "freelance", label: "Freelance" }, 
  { value: "sales", label: "Vendas" },
  { value: "investments", label: "Investimentos" },
  { value: "other", label: "Outros" }
];

const expenseCategories = [
  { value: "food", label: "Alimentação" },
  { value: "transport", label: "Transporte" },
  { value: "bills", label: "Contas" },
  { value: "leisure", label: "Lazer" },
  { value: "health", label: "Saúde" },
  { value: "education", label: "Educação" },
  { value: "shopping", label: "Compras" },
  { value: "other", label: "Outros" }
];

export const TransactionFormModal = () => {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    type: '',
    category: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    description: '',
    isRecurring: false,
    dayOfMonth: new Date().getDate().toString()
  });

  const createTransactionMutation = useCreateTransaction();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.type || !formData.category || !formData.amount) {
      toast({
        title: "Erro",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive"
      });
      return;
    }

    const transactionData: any = {
      type: formData.type as 'income' | 'expense',
      category: formData.category.toLowerCase(),
      amount: parseFloat(formData.amount),
      date: new Date(formData.date).toISOString(),
      description: formData.description,
      source: 'manual' as const
    };

    if (formData.isRecurring) {
      transactionData.isRecurring = true;
      transactionData.recurringPattern = {
        frequency: 'monthly',
        dayOfMonth: parseInt(formData.dayOfMonth),
        isActive: true
      };
    }

    createTransactionMutation.mutate(transactionData, {
      onSuccess: () => {
        setFormData({
          type: '',
          category: '',
          amount: '',
          date: new Date().toISOString().split('T')[0],
          description: '',
          isRecurring: false,
          dayOfMonth: new Date().getDate().toString()
        });
        setOpen(false);
      }
    });
  };


  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusCircle className="h-4 w-4 mr-2" />
          Nova Transação
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <PlusCircle className="h-5 w-5" />
            <span>Nova Transação</span>
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type">Tipo *</Label>
              <Select value={formData.type} onValueChange={(value) => 
                setFormData({ ...formData, type: value, category: '' })
              }>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="income">Entrada</SelectItem>
                  <SelectItem value="expense">Saída</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Categoria *</Label>
              <Select 
                value={formData.category} 
                onValueChange={(value) => setFormData({ ...formData, category: value })}
                disabled={!formData.type}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a categoria" />
                </SelectTrigger>
                <SelectContent>
                  {(formData.type === 'income' ? incomeCategories : expenseCategories).map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Valor *</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                placeholder="0,00"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="date">Data</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              placeholder="Adicione uma descrição (opcional)"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
            />
          </div>

          <div className="flex items-center space-x-2 pt-2">
            <Checkbox 
              id="isRecurring" 
              checked={formData.isRecurring}
              onCheckedChange={(checked) => 
                setFormData({ ...formData, isRecurring: checked as boolean })
              }
            />
            <Label 
              htmlFor="isRecurring" 
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
            >
              Transação Recorrente (Mensal)
            </Label>
          </div>

          {formData.isRecurring && (
            <div className="space-y-2 p-4 bg-muted rounded-lg border">
              <Label htmlFor="dayOfMonth">Dia do Mês</Label>
              <Input
                id="dayOfMonth"
                type="number"
                min="1"
                max="31"
                value={formData.dayOfMonth}
                onChange={(e) => setFormData({ ...formData, dayOfMonth: e.target.value })}
                placeholder="Ex: 10"
              />
              <p className="text-xs text-muted-foreground">
                A transação será repetida mensalmente neste dia
              </p>
            </div>
          )}


          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)} className="flex-1">
              Cancelar
            </Button>
            <Button type="submit" className="flex-1" disabled={createTransactionMutation.isPending}>
              <PlusCircle className="h-4 w-4 mr-2" />
              {createTransactionMutation.isPending ? "Adicionando..." : "Adicionar"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};