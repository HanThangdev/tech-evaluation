"use client"
import { getAllTransactions } from '@/services/transactionService';
import TransactionListClient from '@/app/components/TransactionListClient';
import { useState, useEffect } from 'react';
import { Transaction } from '@/services/types';

export default function TransactionList() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  useEffect(() => {
    const fetchTransactions = async () => {
      const { data } = await getAllTransactions();
      setTransactions(data || []);
    };
    fetchTransactions();
  }, []);
  return <TransactionListClient initialTransactions={transactions || []} />;
} 