// Transaction service for handling CRUD operations
import { ApiResponse, Transaction } from '@/services/types';
import { transactionApi } from './apiService';

// Get all transactions
export const getAllTransactions = async (params: { page: number, limit: number, type: string }): Promise<ApiResponse<{data: Transaction[], meta: {total: number, totalPages: number, page: number, limit: number}}>> => {
  return await transactionApi.getAll(params);
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