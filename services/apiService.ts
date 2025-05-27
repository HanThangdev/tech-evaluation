import axios from 'axios';
import { ApiResponse, Transaction } from '@/services/types';
import dotenv from 'dotenv';

// Initialize dotenv
dotenv.config();

// Base API configuration with axios instance
const api = axios.create({
  baseURL: process.env.API_URL || 'http://localhost:5800/api',
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
      data: response?.data?.data as T,
      meta: response?.data?.meta,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.message || 'An error occurred', // Error occurred
    };
  }
};

// Transaction API endpoints with unified error handling
export const transactionApi = {
  // Get all transactions
  getAll: (params: { page: number, limit: number }) => handleApiResponse<{data: Transaction[], meta: {total: number, totalPages: number, page: number, limit: number}}>(api.get('/transactions', { params })),

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