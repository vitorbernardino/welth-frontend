import { useState, useEffect } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis
} from "@/components/ui/pagination";
import { Search, ArrowUpRight, ArrowDownRight, Loader2 } from "lucide-react";
import { useTransactions, useDeleteTransaction, useTransactionCategories  } from "@/hooks/useApi";
import { usePagination, DOTS } from "@/hooks/use-pagination";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useDebounce } from "@/hooks/use-debounce";

const getCategoryLabel = (category: string) => {
  const categoryMap: { [key: string]: string } = {
    'salary': 'Salário',
    'freelance': 'Freelance',
    'sales': 'Vendas',
    'investments': 'Investimentos',
    'food': 'Alimentação',
    'transport': 'Transporte',
    'bills': 'Contas',
    'leisure': 'Lazer',
    'health': 'Saúde',
    'education': 'Educação',
    'shopping': 'Compras',
    'other': 'Outros'
  };
  return categoryMap[category] || category;
};

export const TransactionList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [page, setPage] = useState(1);

  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const queryParams = {
    page,
    limit: 10,
    search: debouncedSearchTerm || undefined,
    type: typeFilter !== "all" ? typeFilter : undefined,
    category: categoryFilter !== "all" ? categoryFilter : undefined,
  };

  const { data: transactionsData, isLoading, error } = useTransactions(queryParams);
  const deleteTransactionMutation = useDeleteTransaction();

  const { data: categoriesResponse } = useTransactionCategories();
  const categories = categoriesResponse?.data || [];


  const transactions = transactionsData?.data || [];

  const pagination = transactionsData?.pagination ?? { page: 1, totalPages: 1 };

  const paginationRange = usePagination({
    currentPage: pagination.page,
    totalPageCount: pagination.totalPages,
    siblingCount: 1,
  });

  useEffect(() => {
    setPage(1);
  }, [debouncedSearchTerm, typeFilter, categoryFilter]);


  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setPage(newPage);
    }
  };
  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground">Carregando transações...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
          <CardTitle>Transações</CardTitle>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 text-muted-foreground transform -translate-y-1/2" />
              <Input
                placeholder="Buscar transações..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="income">Entradas</SelectItem>
              <SelectItem value="expense">Saídas</SelectItem>
            </SelectContent>
          </Select>

          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Categoria" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as categorias</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {getCategoryLabel(category)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      
      <CardContent>
        {transactions.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">Nenhuma transação encontrada</p>
          </div>
        ) : (
          <div className="space-y-3">
            {transactions.map((transaction: any) => (
              <div key={transaction._id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50">
                <div className="flex items-center space-x-4">
                  <div className={`p-3 rounded-full ${
                    transaction.type === 'income' 
                      ? 'bg-success/10 text-success' 
                      : 'bg-expense/10 text-expense'
                  }`}>
                    {transaction.type === 'income' ? (
                      <ArrowUpRight className="h-4 w-4" />
                    ) : (
                      <ArrowDownRight className="h-4 w-4" />
                    )}
                  </div>
                  
                  <div>
                    <p className="font-medium">{transaction.description || getCategoryLabel(transaction.category)}</p>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-xs">
                        {getCategoryLabel(transaction.category)}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {format(new Date(transaction.date), 'dd/MM/yyyy', { locale: ptBR })}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className={`text-lg font-semibold ${
                  transaction.type === 'income' ? 'text-success' : 'text-expense'
                }`}>
                  {transaction.type === 'income' ? '+' : '-'}
                  R$ {transaction.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>

      {pagination.totalPages > 1 && (
        <CardFooter className="flex items-center justify-center border-t pt-6">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(e) => { e.preventDefault(); handlePageChange(page - 1); }}
                  className={page === 1 ? 'pointer-events-none opacity-50' : ''}
                />
              </PaginationItem>

              {paginationRange?.map((pageNumber, index) => {
                if (pageNumber === DOTS) {
                  return <PaginationItem key={`dots-${index}`}><PaginationEllipsis /></PaginationItem>;
                }

                return (
                  <PaginationItem key={pageNumber}>
                    <PaginationLink
                      href="#"
                      isActive={pageNumber === page}
                      onClick={(e) => { e.preventDefault(); handlePageChange(pageNumber as number); }}
                    >
                      {pageNumber}
                    </PaginationLink>
                  </PaginationItem>
                );
              })}

              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={(e) => { e.preventDefault(); handlePageChange(page + 1); }}
                  className={page === pagination.totalPages ? 'pointer-events-none opacity-50' : ''}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </CardFooter>
      )}
    </Card>
  );
};