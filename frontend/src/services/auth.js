import api from './api';

export const getToken = () => {
  return localStorage.getItem('authToken');
};

export const setToken = (token) => {
  api.setToken(token);
};

export const removeToken = () => {
  localStorage.removeItem('authToken');
  api.setToken(null);
};

export const isAuthenticated = () => {
  return !!getToken();
};

export const logout = () => {
  removeToken();
  window.location.href = '/login';
};
