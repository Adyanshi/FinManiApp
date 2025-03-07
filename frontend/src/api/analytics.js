import apiClient from './client';

export const getMonthlySummary = async () => {
  const { data } = await apiClient.get('/analytics/monthly-summary');
  return data;
};

export const getCategorySpending = async () => {
  const { data } = await apiClient.get('/analytics/category-spending');
  return data;
};

export const getBudgetProgress = async () => {
  const { data } = await apiClient.get('/analytics/budget-progress');
  return data;
};