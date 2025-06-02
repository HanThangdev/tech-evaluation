// API Response interface
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  meta?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

// Transaction interface
export interface Transaction {
  id: string;
  type: string;
  token: string;
  amount: number;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  description: string;
}

// Create Transaction DTO
export interface CreateTransactionDTO {
  type: string;
  token: string;
  amount: number;
  status: string;
  description: string;
  userId: string;
} 