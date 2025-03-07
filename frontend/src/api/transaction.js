import apiClient from './client';

export const getTransactions = async (params = {}) => {
  const { data } = await apiClient.get('/transactions', { params });
  return data.transactions;
};

export const createTransaction = async (transaction) => {
  const { data } = await apiClient.post('/transactions', transaction);
  return data.transaction;
};

export const updateTransaction = async (id, updates) => {
  const { data } = await apiClient.patch(`/transactions/${id}`, updates);
  return data.transaction;
};

export const deleteTransaction = async (id) => {
  await apiClient.delete(`/transactions/${id}`);
};