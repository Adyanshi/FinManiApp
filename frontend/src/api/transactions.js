import apiClient from './client';

export const getTransactions = async (params = {}) => {
  try {
    const { data } = await apiClient.get('/transactions', {
      params: {
        type: params.type,
        category: params.category,
        startDate: params.startDate?.toISOString(),
        endDate: params.endDate?.toISOString(),
        page: params.page,
        limit: params.limit || 10
      }
    });
    
    return {
      transactions: data.data.transactions,
      pagination: {
        total: data.results,
        currentPage: params.page || 1,
        totalPages: Math.ceil(data.results / (params.limit || 10))
      },
      stats: {
        totalIncome: data.meta?.totalIncome || 0,
        totalExpenses: data.meta?.totalExpenses || 0,
        netBalance: data.meta?.netBalance || 0
      }
    };
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch transactions');
  }
};

export const createTransaction = async (transactionData) => {
  try {
    const { data } = await apiClient.post('/transactions', {
      ...transactionData,
      amount: parseFloat(transactionData.amount),
      date: transactionData.date.toISOString()
    });
    return data.data.transaction;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to create transaction');
  }
};

export const updateTransaction = async (id, updates) => {
  try {
    const { data } = await apiClient.patch(`/transactions/${id}`, {
      ...updates,
      ...(updates.amount && { amount: parseFloat(updates.amount) }),
      ...(updates.date && { date: updates.date.toISOString() })
    });
    return data.data.transaction;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to update transaction');
  }
};

export const deleteTransaction = async (id) => {
  try {
    await apiClient.delete(`/transactions/${id}`);
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to delete transaction');
  }
};

export const getTransactionStats = async () => {
  try {
    const { data } = await apiClient.get('/transactions/stats');
    return {
      monthlySummary: data.data.monthlySummary,
      categoryBreakdown: data.data.categoryBreakdown,
      budgetProgress: data.data.budgetProgress
    };
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch statistics');
  }
};