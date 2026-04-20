import axios from 'axios';

const API_BASE_URL = 'https://fakestoreapi.com';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

export const fetchProducts = async () => {
  const response = await api.get('/products');
  return response.data;
};

export const fetchProductById = async (id) => {
  const response = await api.get(`/products/${id}`);
  return response.data;
};

export const fetchCategories = async () => {
  const response = await api.get('/products/categories');
  return response.data;
};

export const fetchProductsByCategory = async (category) => {
  const response = await api.get(`/products/category/${category}`);
  return response.data;
};

export default api;
