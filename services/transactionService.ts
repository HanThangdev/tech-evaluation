// Transaction service for handling CRUD operations
import { ApiResponse } from '@/services/types';
import { transactionApi } from './apiService';

// Get all transactions
export const getAllTransactions = async (): Promise<ApiResponse<any[]>> => {
  return await transactionApi.getAll();
};

// Get transaction by ID
export const getTransactionById = async (id: string): Promise<ApiResponse<any>> => {
  return await transactionApi.getById(id);
};

// Create new transaction
export const createTransaction = async (data: any): Promise<ApiResponse<any>> => {
  return await transactionApi.create(data);
};

// Update transaction
export const updateTransaction = async (id: string, data: any): Promise<ApiResponse<any>> => {
  return await transactionApi.update(id, data);
};

// Delete transaction
export const deleteTransaction = async (id: string): Promise<ApiResponse<any>> => {
  return await transactionApi.delete(id);
}; 