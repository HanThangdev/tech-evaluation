'use client'

import React, { useEffect, useState } from 'react';
import { 
  createTransaction, 
  updateTransaction, 
  deleteTransaction,
} from '../../../services/transactionService';
import { CreateTransactionDTO, Transaction } from '@/services/types';
import ModalAdjustTransaction from './ModalAdjustTransaction';

interface Props {
  initialTransactions: Transaction[];
  currentPage: number;
  totalItems: number;
  itemsPerPage: number;
  loading: boolean;
  onPageChange: (page: number) => void;
  fetchTransactions: (page: number, type: string) => void;
}

export default function TransactionListClient({ 
  initialTransactions,
  currentPage,
  totalItems,
  itemsPerPage,
  loading,
  onPageChange,
  fetchTransactions
}: Props) {
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);
  const [error, setError] = useState<string | null>(null);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [type, setType] = useState<string>('all');
  useEffect(() => {
    setTransactions(initialTransactions);
  }, [initialTransactions]);

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

  const openModalAdjustTransaction = (transaction?: Transaction) => {
    setSelectedTransaction(transaction || null);
    setIsModalOpen(true);
  };

  const handleSubmit = async (data: CreateTransactionDTO) => {
    try {
      let response;
      if (!selectedTransaction) {
        response = await createTransaction(data);
      } else {
        response = await updateTransaction(selectedTransaction.id, data);
      }
      if (response.success) {
        setTransactions(selectedTransaction?.id 
          ? transactions.map(t => t.id === selectedTransaction.id ? response.data! : t) 
          : [...transactions, response.data!]
        );
        setIsModalOpen(false);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setSelectedTransaction(null);
    }
  };

  if (error) return <div>Error: {error}</div>;

  const totalPages = Math.ceil(totalItems / itemsPerPage);
  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold mb-4">Transaction List</h1>
        <div className="flex items-center">
        <button 
          className="bg-blue-500 text-white px-3 py-1 rounded mr-2 hover:bg-blue-600" 
          onClick={() => openModalAdjustTransaction()}
        >
          Create
        </button>
        <select
          name="status"
          value={type}
          onChange={(e) => {
            setType(e.target.value);
            fetchTransactions(currentPage, e.target.value);
          }}
          className="w-full p-2 border rounded"
        >
          <option value="all">All</option>
          <option value="stake">Stake</option>
          <option value="borrow">Borrow</option>
          <option value="lend">Lend</option>
        </select>
        </div>
      </div>
      {loading ? (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="overflow-x-auto">
          {transactions.length > 0 ? (
          <table className="min-w-[700px] w-full bg-white border border-gray-300">
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
              {transactions.length > 0 && transactions?.map((transaction, index) => (
                <tr 
                  key={transaction.id} 
                  className={`border-t border-gray-300 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-gray-100`}
                >
                  <td className="px-4 py-2 uppercase">{transaction.type}</td>
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
                      onClick={() => openModalAdjustTransaction(transaction)}
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
          ) : (
            <div className="flex justify-center items-center py-8">
              <div className="text-gray-500">No transactions found</div>
            </div>
          )}
        </div>
      )}

      {/* Pagination Controls */}
      {totalItems > 0 && (
        <div className="flex justify-between items-center mt-4 px-4">
          <div className="text-sm text-gray-700">
            Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems} entries
          </div>
          <div className="flex space-x-1">
            <button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`px-3 py-1 rounded ${
                currentPage === 1
                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  : 'bg-blue-500 text-white hover:bg-blue-600'
              }`}
            >
              Previous
            </button>
            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index + 1}
                onClick={() => onPageChange(index + 1)}
                className={`px-3 py-1 rounded ${
                  currentPage === index + 1
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {index + 1}
              </button>
            ))}
            <button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`px-3 py-1 rounded ${
                currentPage === totalPages
                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  : 'bg-blue-500 text-white hover:bg-blue-600'
              }`}
            >
              Next
            </button>
          </div>
        </div>
      )}

      <ModalAdjustTransaction
        transaction={selectedTransaction}
        onSubmit={handleSubmit}
        onClose={() => setIsModalOpen(false)}
        isOpen={isModalOpen}
      />
    </div>
  );
}