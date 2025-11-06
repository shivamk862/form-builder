import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
});

const adminApi = axios.create({
  baseURL: `${API_URL}/admin`,
});

adminApi.interceptors.request.use((config) => {
  const username = localStorage.getItem('admin_username');
  const password = localStorage.getItem('admin_password');
  if (username && password) {
    config.headers.Authorization = `Basic ${btoa(`${username}:${password}`)}`;
  }
  return config;
});

export const getForms = async () => {
  const response = await api.get('/forms');
  return response.data;
};

export const getFormById = async (id: string) => {
  const response = await api.get(`/forms/${id}`);
  return response.data;
};

export const createForm = async (form: any) => {
  const response = await adminApi.post('/forms', form);
  return response.data;
};

export const updateForm = async (id: string, form: any) => {
  const response = await adminApi.put(`/forms/${id}`, form);
  return response.data;
};

export const deleteForm = async (id: string) => {
  const response = await adminApi.delete(`/forms/${id}`);
  return response.data;
};

export const getSubmissions = async (formId: string) => {
  console.log('Fetching submissions for formId:', formId);
  const response = await adminApi.get(`/forms/${formId}/submissions`);
  return response.data;
};

export const exportSubmissions = async (formId: string) => {
  const response = await adminApi.get(`/forms/${formId}/submissions/export`, {
    responseType: 'blob',
  });
  return response.data;
};

export const submitForm = async (formId: string, answers: any) => {
  const response = await api.post(`/forms/${formId}/submit`, { answers });
  return response.data;
};
