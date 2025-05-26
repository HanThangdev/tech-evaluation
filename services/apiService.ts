import axios from 'axios';
import { ApiResponse, Transaction } from '@/services/types';

// Base API configuration with axios instance
const api = axios.create({
  baseURL: 'http://localhost:5800/api' || '',
  headers: {
    'Content-Type': 'application/json',
  }
});

// Generic API response handler with error handling
const handleApiResponse = async <T>(promise: Promise<any>): Promise<ApiResponse<T>> => {
  try {
    const response = await promise;
    return {
      success: true,
      data: response.data as T,
      statusCode: response.status
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.message || 'An error occurred', // Error occurred
      statusCode: error.response?.status || 500
    };
  }
};

// Transaction API endpoints with unified error handling
export const transactionApi = {
  // Get all transactions
  getAll: () => handleApiResponse<Transaction[]>(api.get('/transactions')),

  // Get transaction by ID 
  getById: (id: string) => handleApiResponse<Transaction>(api.get(`/transactions/${id}`)),

  // Create new transaction
  create: (data: Transaction) => handleApiResponse<Transaction>(api.post('/transactions', data)),

  // Update transaction
  update: (id: string, data: Partial<Transaction>) => handleApiResponse<Transaction>(api.put(`/transactions/${id}`, data)),

  // Delete transaction
  delete: (id: string) => handleApiResponse<void>(api.delete(`/transactions/${id}`)),

  // Filter transactions by type
  filter: (type: string) => handleApiResponse<Transaction[]>(api.get(`/transactions/filter?type=${type}`))
}; 