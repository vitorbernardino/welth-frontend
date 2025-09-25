import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Calendar, TrendingUp, TrendingDown } from "lucide-react";

interface DayData {
  date: number;
  income: number;
  expense: number;
  dailyExpense: number;
  balance: number;
}

interface MonthData {
  month: number;
  year: number;
  days: DayData[];
  isExpanded: boolean;
}

export const MonthlySpreadsheet = () => {
  const [editingCell, setEditingCell] = useState<string | null>(null);
  const [months, setMonths] = useState<MonthData[]>([]);

  const monthNames = [
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
  ];

  const getDaysInMonth = (month: number, year: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const createEmptyMonth = (month: number, year: number): MonthData => {
    const daysInMonth = getDaysInMonth(month, year);
    return {
      month,
      year,
      isExpanded: false,
      days: Array.from({ length: daysInMonth }, (_, i) => ({
        date: i + 1,
        income: 0,
        expense: 0,
        dailyExpense: 50,
        balance: 0
      }))
    };
  };

  useEffect(() => {
    // Initialize with current month and next 11 months
    const currentDate = new Date();
    const initialMonths: MonthData[] = [];
    
    for (let i = 0; i < 12; i++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth() + i, 1);
      const monthData = createEmptyMonth(date.getMonth(), date.getFullYear());
      if (i === 0) monthData.isExpanded = true; // Expand current month by default
      initialMonths.push(monthData);
    }
    
    setMonths(initialMonths);
  }, []);

  const calculateBalances = (data: DayData[]) => {
    let runningBalance = 0;
    return data.map(day => {
      runningBalance += day.income - day.expense - day.dailyExpense;
      return { ...day, balance: runningBalance };
    });
  };

  const updateDayData = (monthIndex: number, dayIndex: number, field: keyof DayData, value: number) => {
    const newMonths = [...months];
    const newDays = [...newMonths[monthIndex].days];
    newDays[dayIndex] = { ...newDays[dayIndex], [field]: value };
    newMonths[monthIndex].days = calculateBalances(newDays);
    setMonths(newMonths);
  };

  const addNewMonth = () => {
    const lastMonth = months[months.length - 1];
    const nextMonth = lastMonth.month === 11 ? 0 : lastMonth.month + 1;
    const nextYear = lastMonth.month === 11 ? lastMonth.year + 1 : lastMonth.year;
    
    const newMonth = createEmptyMonth(nextMonth, nextYear);
    setMonths([...months, newMonth]);
  };

  const getMonthSummary = (monthData: MonthData) => {
    const totalIncome = monthData.days.reduce((sum, day) => sum + day.income, 0);
    const totalExpenses = monthData.days.reduce((sum, day) => sum + day.expense, 0);
    const totalDailyExpenses = monthData.days.reduce((sum, day) => sum + day.dailyExpense, 0);
    const finalBalance = monthData.days[monthData.days.length - 1]?.balance || 0;
    
    return { totalIncome, totalExpenses, totalDailyExpenses, finalBalance };
  };


  const EditableCell = ({ 
    value, 
    onSave, 
    className = "", 
    cellKey 
  }: { 
    value: number; 
    onSave: (val: number) => void; 
    className?: string;
    cellKey: string;
  }) => {
    const isEditing = editingCell === cellKey;
    
    if (isEditing) {
      return (
        <Input
          type="number"
          step="0.01"
          defaultValue={value}
          className="h-8 text-xs"
          onBlur={(e) => {
            onSave(parseFloat(e.target.value) || 0);
            setEditingCell(null);
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              onSave(parseFloat(e.currentTarget.value) || 0);
              setEditingCell(null);
            }
          }}
          autoFocus
        />
      );
    }

    return (
      <div
        className={`h-8 flex items-center justify-center text-xs cursor-pointer hover:bg-muted/50 rounded px-2 ${className}`}
        onClick={() => setEditingCell(cellKey)}
      >
        R$ {value.toFixed(2)}
      </div>
    );
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-bold flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Planilha Financeira Multi-Mês
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[calc(100vh-200px)]">
          <Accordion type="multiple" className="space-y-4">
            {months.map((monthData, monthIndex) => {
              const summary = getMonthSummary(monthData);
              const monthKey = `${monthData.year}-${monthData.month}`;
              
              return (
                <AccordionItem 
                  key={monthKey} 
                  value={monthKey}
                  className="border border-border rounded-lg overflow-hidden"
                >
                  <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-muted/50 transition-colors">
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center gap-3">
                        <h3 className="text-lg font-semibold">
                          {monthNames[monthData.month]} {monthData.year}
                        </h3>
                        <Badge variant={summary.finalBalance >= 0 ? "default" : "destructive"} className="ml-2">
                          {summary.finalBalance >= 0 ? "Positivo" : "Negativo"}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center gap-6 text-sm mr-4">
                        <div className="flex items-center gap-2">
                          <TrendingUp className="h-4 w-4 text-income" />
                          <span className="text-income font-medium">
                            R$ {summary.totalIncome.toFixed(2)}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <TrendingDown className="h-4 w-4 text-expense" />
                          <span className="text-expense font-medium">
                            R$ {(summary.totalExpenses + summary.totalDailyExpenses).toFixed(2)}
                          </span>
                        </div>
                        <div className={`font-bold ${
                          summary.finalBalance >= 0 ? 'text-success' : 'text-expense'
                        }`}>
                          R$ {summary.finalBalance.toFixed(2)}
                        </div>
                      </div>
                    </div>
                  </AccordionTrigger>
                  
                  <AccordionContent className="px-6 pb-6">
                    <div className="space-y-4">
                      {/* Header */}
                      <div className="grid grid-cols-6 gap-2 p-3 bg-muted/50 rounded-lg">
                        <div className="text-xs font-semibold text-center">Data</div>
                        <div className="text-xs font-semibold text-center text-income">Entrada</div>
                        <div className="text-xs font-semibold text-center text-expense">Saída</div>
                        <div className="text-xs font-semibold text-center text-warning">Gasto Diário</div>
                        <div className="text-xs font-semibold text-center">Saldo</div>
                        <div className="text-xs font-semibold text-center">Status</div>
                      </div>

                      {/* Data rows */}
                      <div className="space-y-1 max-h-[400px] overflow-y-auto">
                        {monthData.days.map((day, dayIndex) => (
                          <div key={day.date} className="grid grid-cols-6 gap-2 p-2 border border-border/50 rounded hover:bg-muted/30 transition-colors">
                            <div className="text-xs font-medium text-center flex items-center justify-center">
                              {day.date.toString().padStart(2, '0')}
                            </div>
                            
                            <EditableCell
                              value={day.income}
                              onSave={(val) => updateDayData(monthIndex, dayIndex, 'income', val)}
                              className="text-income"
                              cellKey={`income-${monthKey}-${day.date}`}
                            />
                            
                            <EditableCell
                              value={day.expense}
                              onSave={(val) => updateDayData(monthIndex, dayIndex, 'expense', val)}
                              className="text-expense"
                              cellKey={`expense-${monthKey}-${day.date}`}
                            />
                            
                            <EditableCell
                              value={day.dailyExpense}
                              onSave={(val) => updateDayData(monthIndex, dayIndex, 'dailyExpense', val)}
                              className="text-warning"
                              cellKey={`daily-${monthKey}-${day.date}`}
                            />
                            
                            <div className={`h-8 flex items-center justify-center text-xs font-medium px-2 rounded ${
                              day.balance >= 0 ? 'text-success bg-success/10' : 'text-expense bg-expense/10'
                            }`}>
                              R$ {day.balance.toFixed(2)}
                            </div>
                            
                            <div className="flex items-center justify-center">
                              <div className={`w-2 h-2 rounded-full ${
                                day.balance >= 0 ? 'bg-success' : 'bg-expense'
                              }`} />
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Month Summary */}
                      <div className="mt-4 p-4 bg-gradient-to-r from-muted/50 to-muted/30 rounded-lg border">
                        <div className="grid grid-cols-4 gap-4 text-sm">
                          <div className="text-center">
                            <div className="font-medium text-muted-foreground mb-1">Total Entradas</div>
                            <div className="text-lg font-bold text-income">
                              R$ {summary.totalIncome.toFixed(2)}
                            </div>
                          </div>
                          <div className="text-center">
                            <div className="font-medium text-muted-foreground mb-1">Total Saídas</div>
                            <div className="text-lg font-bold text-expense">
                              R$ {summary.totalExpenses.toFixed(2)}
                            </div>
                          </div>
                          <div className="text-center">
                            <div className="font-medium text-muted-foreground mb-1">Gastos Diários</div>
                            <div className="text-lg font-bold text-warning">
                              R$ {summary.totalDailyExpenses.toFixed(2)}
                            </div>
                          </div>
                          <div className="text-center">
                            <div className="font-medium text-muted-foreground mb-1">Saldo Final</div>
                            <div className={`text-xl font-bold ${
                              summary.finalBalance >= 0 ? 'text-success' : 'text-expense'
                            }`}>
                              R$ {summary.finalBalance.toFixed(2)}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};