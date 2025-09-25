import axios, { AxiosInstance } from 'axios';

const BASE_URL = 'http://localhost:3001/api/v1';

export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  message?: string;
  timestamp: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: BASE_URL,
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor para adicionar token
    this.api.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('access_token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor para lidar com tokens expirados
    this.api.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response?.status === 401) {
          try {
            await this.refreshToken();
            // Retry the original request
            const originalRequest = error.config;
            const token = localStorage.getItem('access_token');
            if (token) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            return this.api.request(originalRequest);
          } catch (refreshError) {
            // Redirect to login if refresh fails
            localStorage.removeItem('access_token');
            localStorage.removeItem('isAuthenticated');
            window.location.href = '/login';
            return Promise.reject(refreshError);
          }
        }
        return Promise.reject(error);
      }
    );
  }

  // Auth Methods
  async login(email: string, password: string): Promise<ApiResponse<{ user: any; access_token: string }>> {
    const response = await this.api.post('/auth/login', { email, password });
    return response.data;
  }

  async register(name: string, email: string, password: string): Promise<ApiResponse<{ user: any }>> {
    const response = await this.api.post('/auth/register', { name, email, password });
    return response.data;
  }

  async logout(): Promise<ApiResponse<null>> {
    const response = await this.api.post('/auth/logout');
    return response.data;
  }

  async refreshToken(): Promise<ApiResponse<{ user: any }>> {
    const response = await this.api.post('/auth/refresh');
    return response.data;
  }

  // User Methods
  async getProfile(): Promise<ApiResponse<any>> {
    const response = await this.api.get('/users/profile');
    return response.data;
  }

  async updateProfile(data: { name: string; email: string }): Promise<ApiResponse<any>> {
    const response = await this.api.put('/users/profile', data);
    return response.data;
  }

  async changePassword(data: { currentPassword: string; newPassword: string; confirmNewPassword: string }): Promise<ApiResponse<any>> {
    const response = await this.api.put('/users/change-password', data);
    return response.data;
  }

  async getPluggyToken(userId: string, itemId?: string): Promise<ApiResponse<{ token: string; sdk: string }>> {
    const params = itemId ? { itemId } : {};
    const response = await this.api.post(`/users/${userId}/token`, {}, { params });
    return response.data;
  }

  async getUserConnections(userId: string): Promise<ApiResponse<any[]>> {
    const response = await this.api.get(`/users/${userId}/connections`);
    return response.data;
  }

  async getUserTransactions(userId: string): Promise<ApiResponse<any[]>> {
    const response = await this.api.get(`/users/${userId}/transactions`);
    return response.data;
  }

  // Transactions Methods
  async createTransaction(data: {
    type: 'income' | 'expense';
    category: string;
    amount: number;
    date: string;
    description: string;
    isRecurring?: boolean;
    recurringPattern?: any;
    source?: string;
  }): Promise<ApiResponse<any>> {
    const response = await this.api.post('/transactions', data);
    return response.data;
  }

  async getTransactions(params?: {
    page?: number;
    limit?: number;
    type?: 'income' | 'expense';
    category?: string;
    dateFrom?: string;
    dateTo?: string;
    search?: string;
  }): Promise<ApiResponse<any[]>> {
    const response = await this.api.get('/transactions', { params });
    return response.data;
  }

  async getRecentTransactions(): Promise<ApiResponse<any[]>> {
    const response = await this.api.get('/transactions/recent');
    return response.data;
  }

  async getTransactionStats(year: number, month: number): Promise<ApiResponse<any>> {
    const response = await this.api.get(`/transactions/stats/${year}/${month}`);
    return response.data;
  }

  async getTransaction(id: string): Promise<ApiResponse<any>> {
    const response = await this.api.get(`/transactions/${id}`);
    return response.data;
  }

  async updateTransaction(id: string, data: any): Promise<ApiResponse<any>> {
    const response = await this.api.put(`/transactions/${id}`, data);
    return response.data;
  }

  async deleteTransaction(id: string): Promise<ApiResponse<boolean>> {
    const response = await this.api.delete(`/transactions/${id}`);
    return response.data;
  }

  async syncTransactions(itemId: string): Promise<ApiResponse<any>> {
    const response = await this.api.post(`/transactions/sync/${itemId}`);
    return response.data;
  }

  async syncAllTransactions(): Promise<ApiResponse<any>> {
    const response = await this.api.post('/transactions/sync-all');
    return response.data;
  }

  // Dashboard Methods
  async getDashboard(): Promise<ApiResponse<any>> {
    const response = await this.api.get('/dashboard');
    return response.data;
  }

  async getDashboardSummary(): Promise<ApiResponse<any>> {
    const response = await this.api.get('/dashboard/summary');
    return response.data;
  }

  // Investments Methods
  async getInvestments(): Promise<ApiResponse<any>> {
    const response = await this.api.get('/investments');
    return response.data;
  }

  async getInvestmentsByConnection(itemId: string): Promise<ApiResponse<any[]>> {
    const response = await this.api.get(`/investments/by-connection/${itemId}`);
    return response.data;
  }

  async getTotalInvested(): Promise<ApiResponse<number>> {
    const response = await this.api.get('/investments/total');
    return response.data;
  }

  async syncInvestments(itemId: string): Promise<ApiResponse<any>> {
    const response = await this.api.post(`/investments/sync/${itemId}`);
    return response.data;
  }

  // Spreadsheet Methods
  async createSpreadsheet(data: any): Promise<ApiResponse<any>> {
    const response = await this.api.post('/spreadsheet', data);
    return response.data;
  }

  async initializeSpreadsheets(): Promise<ApiResponse<any[]>> {
    const response = await this.api.post('/spreadsheet/initialize');
    return response.data;
  }

  async addNextMonth(): Promise<ApiResponse<any>> {
    const response = await this.api.post('/spreadsheet/add-month');
    return response.data;
  }

  async getAllSpreadsheets(): Promise<ApiResponse<any[]>> {
    const response = await this.api.get('/spreadsheet/all');
    return response.data;
  }

  async getNext10Months(): Promise<ApiResponse<any[]>> {
    const response = await this.api.get('/spreadsheet/next-10-months');
    return response.data;
  }

  async getYearOverview(year: number): Promise<ApiResponse<any>> {
    const response = await this.api.get(`/spreadsheet/year/${year}`);
    return response.data;
  }

  async getSpreadsheetByMonth(year: number, month: number): Promise<ApiResponse<any>> {
    const response = await this.api.get(`/spreadsheet/${year}/${month}`);
    return response.data;
  }

  async updateSpreadsheet(year: number, month: number, data: any): Promise<ApiResponse<any>> {
    const response = await this.api.put(`/spreadsheet/${year}/${month}`, data);
    return response.data;
  }

  async updateDayData(year: number, month: number, day: number, data: any): Promise<ApiResponse<any>> {
    const response = await this.api.put(`/spreadsheet/${year}/${month}/day/${day}`, data);
    return response.data;
  }

  async deleteSpreadsheet(year: number, month: number): Promise<ApiResponse<boolean>> {
    const response = await this.api.delete(`/spreadsheet/${year}/${month}`);
    return response.data;
  }

  // Connections Methods
  async getConnections(): Promise<ApiResponse<any[]>> {
    const response = await this.api.get('/connections');
    return response.data;
  }

  async getConnection(id: string): Promise<ApiResponse<any>> {
    const response = await this.api.get(`/connections/${id}`);
    return response.data;
  }

  async deleteConnection(id: string): Promise<ApiResponse<boolean>> {
    const response = await this.api.delete(`/connections/${id}`);
    return response.data;
  }
}

export const apiService = new ApiService();
export default apiService;