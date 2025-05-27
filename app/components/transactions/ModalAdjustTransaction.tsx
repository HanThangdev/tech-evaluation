'use client'

import React, { useEffect, useState } from 'react';
import { CreateTransactionDTO, Transaction } from '@/services/types';
import Modal from '../Modal';

interface Props {
  transaction?: Transaction | null;
  onSubmit: (data: CreateTransactionDTO) => void;
  onClose: () => void;
  isOpen: boolean;
}

export default function ModalAdjustTransaction({ transaction, onSubmit, onClose, isOpen }: Props) {
  const [formData, setFormData] = useState<CreateTransactionDTO>({
    type: transaction?.type || 'buy',
    token: transaction?.token || '',
    amount: transaction?.amount || 0,
    status: transaction?.status || 'pending',
    description: transaction?.description || '',
    userId: transaction?.userId || ''  // Added userId field to match CreateTransactionDTO
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'amount' ? parseFloat(value) : value
    }));
  };

  const handleSubmit = () => {
    onSubmit(formData);
    onClose();
  };
  useEffect(() => {
    if (transaction) {
      setFormData({
        type: transaction.type || 'buy',
        token: transaction.token || '',
        amount: transaction.amount || 0,
        status: transaction.status || 'pending',
        description: transaction.description || '',
        userId: transaction.userId || ''
      });
    } else {
      setFormData({
        type: 'stake',
        token: '',
        amount: 0,
        status: 'pending',
        description: '',
        userId: '1'
      });
    }
  }, [transaction])

  const formContent = (
    <form className="space-y-4" onSubmit={(e) => {
        e.preventDefault()
        handleSubmit()
      }}>
      <div>
        <label className="block mb-2">Type</label>
        <select
          name="type"
          value={formData.type}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        >
          <option value="stake">Stake</option>
          <option value="borrow">Borrow</option>
          <option value="lend">Lend</option>
        </select>
      </div>

      <div>
        <label className="block mb-2">Token</label>
        <input
          type="text"
          name="token"
          value={formData.token}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
      </div>

      <div>
        <label className="block mb-2">Amount</label>
        <input
          type="number"
          name="amount"
          value={formData.amount}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
      </div>

      <div>
        <label className="block mb-2">Status</label>
        <select
          name="status"
          value={formData.status}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        >
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
          <option value="failed">Failed</option>
        </select>
      </div>

      <div>
        <label className="block mb-2">Description</label>
        <input
          type="text"
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
      </div>
    </form>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={handleSubmit}
      title={transaction ? 'Edit Transaction' : 'Create Transaction'}
      confirmLabel={transaction ? 'Update' : 'Create'}
    >
      {formContent}
    </Modal>
  );
}
