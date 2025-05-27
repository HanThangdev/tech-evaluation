"use client"
import { getAllTransactions } from '@/services/transactionService';
import TransactionListClient from '@/app/components/transactions/TransactionListClient';
import { useEffect, useState } from 'react';
import { Transaction } from '@/services/types';

export default function TransactionList() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [itemsPerPage] = useState(10);
  const [loading, setLoading] = useState(false);

  const fetchTransactions = async (page: number, type: string = 'all') => {
    try {
      setLoading(true);
      const response = await getAllTransactions({ page, limit: itemsPerPage, type });
      setTransactions(response.data?.data || []);
      if (response.data?.meta) {
        setTotalItems(response.data?.meta.total);
        setTotalPages(response.data?.meta.totalPages);
      }
    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions(currentPage);
  }, [currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <TransactionListClient 
      initialTransactions={transactions}
      currentPage={currentPage}
      totalItems={totalItems}
      itemsPerPage={itemsPerPage}
      loading={loading}
      onPageChange={handlePageChange}
      fetchTransactions={fetchTransactions}
    />
  );
}