import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Calendar, TrendingUp, TrendingDown, Loader2, History } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useAllSpreadsheets, useUpdateDayData } from "@/hooks/useApi"; // Hooks da API
import { SpreadsheetData, DayData } from "@/types/api"; // Tipos da API

const LoadingState = () => (
    <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        <p className="ml-2 text-muted-foreground">Carregando dados da planilha...</p>
    </div>
);

const EmptyState = ({ isHistory = false }: { isHistory?: boolean }) => (
    <div className="text-center h-64 flex flex-col justify-center items-center">
        <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium">Nenhum dado encontrado</h3>
        <p className="text-sm text-muted-foreground">
            {isHistory
                ? "Não há planilhas no seu histórico."
                : "Parece que não há planilhas para exibir."}
        </p>
    </div>
);


const SpreadsheetList = ({
    months,
    monthNames,
    editingCell,
    setEditingCell,
    originalCellValue,
    setOriginalCellValue,
    handleUpdateDay,
    getMonthSummary,
    EditableCell,
}: any) => {
    if (months.length === 0) {
        return <EmptyState />;
    }

    return (
        <Accordion type="multiple" defaultValue={[`${months[0]?.year}-${months[0]?.month}`]} className="space-y-4">
            {months.map((monthData: SpreadsheetData, monthIndex: number) => {
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
                                        {monthNames[monthData.month - 1]} {monthData.year}
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
                                            R$ {summary.totalExpenses.toFixed(2)}
                                        </span>
                                    </div>
                                    <div className={`font-bold ${summary.finalBalance >= 0 ? 'text-success' : 'text-expense'
                                        }`}>
                                        R$ {summary.finalBalance.toFixed(2)}
                                    </div>
                                </div>
                            </div>
                        </AccordionTrigger>

                        <AccordionContent className="px-6 pb-6">
                            <div className="space-y-4">
                                <div className="grid grid-cols-6 gap-2 p-3 bg-muted/50 rounded-lg">
                                    <div className="text-xs font-semibold text-center">Data</div>
                                    <div className="text-xs font-semibold text-center text-income">Entrada</div>
                                    <div className="text-xs font-semibold text-center text-expense">Saída</div>
                                    <div className="text-xs font-semibold text-center">Saldo</div>
                                    <div className="text-xs font-semibold text-center text-blue-500">Saldo Projetado</div>
                                    <div className="text-xs font-semibold text-center">Status</div>
                                </div>

                                <div className="space-y-1">
                                    {monthData.dailyData.map((day, dayIndex) => (
                                        <div key={day.day} className="grid grid-cols-6 gap-2 p-2 border border-border/50 rounded hover:bg-muted/30 transition-colors">
                                            <div className="text-xs font-medium text-center flex items-center justify-center">
                                                {day.day.toString().padStart(2, '0')}
                                            </div>

                                            <EditableCell
                                                value={day.income || 0}
                                                onSave={(val: number) => handleUpdateDay(monthIndex, dayIndex, 'income', val)}
                                                className="text-income"
                                                cellKey={`income-${monthKey}-${day.day}`}
                                            />

                                            <EditableCell
                                                value={day.expenses || 0}
                                                onSave={(val: number) => handleUpdateDay(monthIndex, dayIndex, 'expenses', val)}
                                                className="text-expense"
                                                cellKey={`expense-${monthKey}-${day.day}`}
                                            />

                                            <div className={`h-8 flex items-center justify-center text-xs font-medium px-2 rounded ${(day.balance || 0) >= 0 ? 'text-success bg-success/10' : 'text-expense bg-expense/10'
                                                }`}>
                                                R$ {(day.balance || 0).toFixed(2)}
                                            </div>

                                            <div className={`h-8 flex items-center justify-center text-xs font-medium px-2 rounded ${(day.calculatedBalance || 0) >= 0 ? 'text-blue-500 bg-blue-500/10' : 'text-expense bg-expense/10'
                                                }`}>
                                                R$ {(day.calculatedBalance || 0).toFixed(2)}
                                            </div>

                                            <div className="flex items-center justify-center">
                                                <div className={`w-2 h-2 rounded-full ${(day.balance || 0) >= 0 ? 'bg-success' : 'bg-expense'
                                                    }`} />
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="mt-4 p-4 bg-gradient-to-r from-muted/50 to-muted/30 rounded-lg border">
                                    <div className="grid grid-cols-3 gap-4 text-sm">
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
                                            <div className="font-medium text-muted-foreground mb-1">Saldo Final</div>
                                            <div className={`text-xl font-bold ${summary.finalBalance >= 0 ? 'text-success' : 'text-expense'
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
    );
};


export const MonthlySpreadsheet = () => {
    const [editingCell, setEditingCell] = useState<string | null>(null);
    const [currentMonths, setCurrentMonths] = useState<SpreadsheetData[]>([]);
    const [historicalMonths, setHistoricalMonths] = useState<SpreadsheetData[]>([]);
    const [originalCellValue, setOriginalCellValue] = useState<number>(0);

    const { data: spreadsheetResponse, isLoading, error } = useAllSpreadsheets();
    const updateDayMutation = useUpdateDayData();

    const monthNames = [
        "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
        "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
    ];

    useEffect(() => {
        if (spreadsheetResponse?.success && spreadsheetResponse.data) {
            const sortedData = [...spreadsheetResponse.data].sort((a, b) => {
                if (a.year !== b.year) {
                    return a.year - b.year;
                }
                return a.month - b.month;
            });
            setCurrentMonths(sortedData.filter(m => !m.isHistorical));
            setHistoricalMonths(sortedData.filter(m => m.isHistorical));
        }
    }, [spreadsheetResponse]);


    const handleUpdateDay = (monthIndex: number, dayIndex: number, field: keyof DayData, value: number, isHistorical: boolean) => {
        const monthsList = isHistorical ? historicalMonths : currentMonths;
        const monthData = monthsList[monthIndex];
        const dayData = monthData.dailyData[dayIndex];

        const payload = {
            year: monthData.year,
            month: monthData.month,
            day: dayData.day,
            data: { [field]: value }
        };

        updateDayMutation.mutate(payload, {
            onSuccess: (updatedSpreadsheet) => {
                const updatedMonths = [...monthsList];
                updatedMonths[monthIndex] = updatedSpreadsheet.data;
                if (isHistorical) {
                    setHistoricalMonths(updatedMonths);
                } else {
                    setCurrentMonths(updatedMonths);
                }
            },
            onError: (error) => {
                console.error("Erro ao atualizar o dia:", error);
            }
        });
    };

    const getMonthSummary = (monthData: SpreadsheetData) => {
        const totalIncome = monthData.dailyData.reduce((sum, day) => sum + (day.income || 0), 0);
        const totalExpenses = monthData.dailyData.reduce((sum, day) => sum + (day.expenses || 0), 0);
        const finalBalance = monthData.monthlyProjections?.projectedBalance || 0;

        return { totalIncome, totalExpenses, finalBalance };
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

        const handleSave = (currentValue: number) => {
            if (currentValue !== originalCellValue) {
                onSave(currentValue);
            }
            setEditingCell(null);
        };


        if (isEditing) {
            return (
                <Input
                    type="number"
                    step="0.01"
                    defaultValue={value}
                    className="h-8 text-xs"
                    onBlur={(e) => {
                        handleSave(parseFloat(e.target.value) || 0);
                    }}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            handleSave(parseFloat(e.currentTarget.value) || 0);
                        }
                        if (e.key === 'Escape') {
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
                onClick={() => {
                    setOriginalCellValue(value);
                    setEditingCell(cellKey);
                }}
            >
                R$ {value.toFixed(2)}
            </div>
        );
    };

    if (isLoading) {
        return (
            <Card className="w-full">
                <CardHeader>
                </CardHeader>
                <CardContent>
                    <LoadingState />
                </CardContent>
            </Card>
        );
    }

    if (error) {
        return (
            <Card className="w-full">
                <CardHeader>
                </CardHeader>
                <CardContent>
                    <div className="text-red-500 text-center">Erro ao carregar os dados.</div>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card className="w-full">
            <CardHeader>
                <div className="flex items-center justify-between">
            
                    {historicalMonths.length > 0 && (
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button variant="outline" size="icon">
                                    <History className="h-4 w-4" />
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-4xl">
                                <DialogHeader>
                                    <DialogTitle>Histórico de Planilhas</DialogTitle>
                                </DialogHeader>
                                <ScrollArea className="h-[70vh]">
                                    <SpreadsheetList
                                        months={historicalMonths}
                                        monthNames={monthNames}
                                        editingCell={editingCell}
                                        setEditingCell={setEditingCell}
                                        originalCellValue={originalCellValue}
                                        setOriginalCellValue={setOriginalCellValue}
                                        handleUpdateDay={(monthIndex: number, dayIndex: number, field: keyof DayData, value: number) => handleUpdateDay(monthIndex, dayIndex, field, value, true)}
                                        getMonthSummary={getMonthSummary}
                                        EditableCell={EditableCell}
                                    />
                                </ScrollArea>
                            </DialogContent>
                        </Dialog>
                    )}
                </div>
            </CardHeader>
            <CardContent>
                <SpreadsheetList
                    months={currentMonths}
                    monthNames={monthNames}
                    editingCell={editingCell}
                    setEditingCell={setEditingCell}
                    originalCellValue={originalCellValue}
                    setOriginalCellValue={setOriginalCellValue}
                    handleUpdateDay={(monthIndex: number, dayIndex: number, field: keyof DayData, value: number) => handleUpdateDay(monthIndex, dayIndex, field, value, false)}
                    getMonthSummary={getMonthSummary}
                    EditableCell={EditableCell}
                />
            </CardContent>
        </Card>
    );
};