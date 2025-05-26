'use client'

import React, { useState } from 'react';
import { 
  createTransaction, 
  updateTransaction, 
  deleteTransaction,
  Transaction,
  CreateTransactionDTO 
} from '../../services/transactionService';

interface Props {
  initialTransactions: Transaction[];
}

export default function TransactionListClient({ initialTransactions }: Props) {
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);
  const [error, setError] = useState<string | null>(null);

  // Create new transaction
  const handleCreate = async (newTransaction: CreateTransactionDTO) => {
    const response = await createTransaction(newTransaction);
    if (response.success && response.data) {
      setTransactions(prev => [...prev, response.data!]);
      setError(null);
    } else {
      setError(response.error || 'Failed to create transaction');
    }
  };

  // Update transaction
  const handleUpdate = async (id: string, data: Partial<CreateTransactionDTO>) => {
    const response = await updateTransaction(id, data);
    if (response.success && response.data) {
      setTransactions(prev => 
        prev.map(t => t.id === id ? response.data! : t)
      );
      setError(null);
    } else {
      setError(response.error || 'Failed to update transaction');
    }
  };

  // Delete transaction
  const handleDelete = async (id: string) => {
    const response = await deleteTransaction(id);
    if (response.success) {
      setTransactions(prev => prev.filter(t => t.id !== id));
      setError(null);
    } else {
      setError(response.error || 'Failed to delete transaction');
    }
  };

  if (error) return <div>Error: {error}</div>;

  return (
    <div className="w-full overflow-x-auto">
      <h1 className="text-2xl font-bold mb-4">Transaction List</h1>
      <table className="min-w-full bg-white border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="px-4 py-2 text-left">Type</th>
            <th className="px-4 py-2 text-left">Token</th>
            <th className="px-4 py-2 text-left">Amount</th>
            <th className="px-4 py-2 text-left">Status</th>
            <th className="px-4 py-2 text-left">Description</th>
            <th className="px-4 py-2 text-center">Action</th>
          </tr>
        </thead>
        <tbody>
          {transactions?.map(transaction => (
            <tr key={transaction.id} className="border-t border-gray-300 hover:bg-gray-50">
              <td className="px-4 py-2">{transaction.type}</td>
              <td className="px-4 py-2">{transaction.token}</td>
              <td className="px-4 py-2">{transaction.amount}</td>
              <td className="px-4 py-2">
                <span className={`px-2 py-1 rounded-full text-sm ${
                  transaction.status === 'Completed' ? 'bg-green-100 text-green-800' :
                  transaction.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {transaction.status}
                </span>
              </td>
              <td className="px-4 py-2">{transaction.description}</td>
              <td className="px-4 py-2 text-center">
                <button 
                  onClick={() => handleUpdate(transaction.id, { amount: 2.0 })}
                  className="bg-blue-500 text-white px-3 py-1 rounded mr-2 hover:bg-blue-600"
                >
                  Edit
                </button>
                <button 
                  onClick={() => handleDelete(transaction.id)}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}