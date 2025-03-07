import apiClient from './client';

export const createBudget = async (budgetData) => {
  const { data } = await apiClient.post('/budgets', budgetData);
  return data.budget;
};

export const getCurrentBudget = async () => {
  const { data } = await apiClient.get('/budgets/current');
  return data.budget;
};