import API from './client';

export const login = async (email, password) => {
  const response = await API.post('/auth/login', { email, password });
  localStorage.setItem('token', response.data.token);
  return response.data.user;
};

export const register = async (userData) => {
  const response = await API.post('/auth/signup', userData);
  localStorage.setItem('token', response.data.token);
  return response.data.user;
};

export const logout = () => {
  localStorage.removeItem('token');
};