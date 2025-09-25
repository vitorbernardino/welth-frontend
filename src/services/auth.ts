import { apiService } from './api';

export interface User {
  _id: string;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

class AuthService {
  async login(email: string, password: string): Promise<User> {
    try {
      const response = await apiService.login(email, password);
      
      if (response.success && response.data) {
        const { user, access_token } = response.data;
        
        // Store authentication data
        localStorage.setItem('access_token', access_token);
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('userEmail', user.email);
        localStorage.setItem('userName', user.name);
        localStorage.setItem('userId', user._id);
        
        return user;
      }
      
      throw new Error(response.message || 'Login failed');
    } catch (error: any) {
      throw new Error(error.response?.data?.message || error.message || 'Login failed');
    }
  }

  async register(name: string, email: string, password: string): Promise<User> {
    try {
      const response = await apiService.register(name, email, password);
      
      if (response.success && response.data) {
        return response.data.user;
      }
      
      throw new Error(response.message || 'Registration failed');
    } catch (error: any) {
      throw new Error(error.response?.data?.message || error.message || 'Registration failed');
    }
  }

  async logout(): Promise<void> {
    try {
      await apiService.logout();
    } catch (error) {
      // Even if logout fails on server, clear local storage
      console.error('Logout error:', error);
    } finally {
      this.clearAuthData();
    }
  }

  clearAuthData(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userName');
    localStorage.removeItem('userId');
  }

  isAuthenticated(): boolean {
    return localStorage.getItem('isAuthenticated') === 'true' && 
           !!localStorage.getItem('access_token');
  }

  getCurrentUser(): { id: string; name: string; email: string } | null {
    if (!this.isAuthenticated()) return null;
    
    const id = localStorage.getItem('userId');
    const name = localStorage.getItem('userName');
    const email = localStorage.getItem('userEmail');
    
    if (!id || !name || !email) return null;
    
    return { id, name, email };
  }

  async getProfile(): Promise<User> {
    try {
      const response = await apiService.getProfile();
      
      if (response.success) {
        // Update local storage with fresh data
        localStorage.setItem('userEmail', response.data.email);
        localStorage.setItem('userName', response.data.name);
        localStorage.setItem('userId', response.data._id);
        
        return response.data;
      }
      
      throw new Error(response.message || 'Failed to fetch profile');
    } catch (error: any) {
      throw new Error(error.response?.data?.message || error.message || 'Failed to fetch profile');
    }
  }

  async updateProfile(name: string, email: string): Promise<User> {
    try {
      const response = await apiService.updateProfile({ name, email });
      
      if (response.success) {
        // Update local storage
        localStorage.setItem('userEmail', response.data.email);
        localStorage.setItem('userName', response.data.name);
        
        return response.data;
      }
      
      throw new Error(response.message || 'Failed to update profile');
    } catch (error: any) {
      throw new Error(error.response?.data?.message || error.message || 'Failed to update profile');
    }
  }

  async changePassword(currentPassword: string, newPassword: string, confirmNewPassword: string): Promise<void> {
    try {
      const response = await apiService.changePassword({
        currentPassword,
        newPassword,
        confirmNewPassword
      });
      
      if (!response.success) {
        throw new Error(response.message || 'Failed to change password');
      }
    } catch (error: any) {
      throw new Error(error.response?.data?.message || error.message || 'Failed to change password');
    }
  }
}

export const authService = new AuthService();
export default authService;