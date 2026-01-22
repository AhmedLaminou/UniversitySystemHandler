import axios from 'axios';
import { API_URLS } from '../utils/constants';
import { storage } from '../utils/storage';

// Helper to create API instances
const createApi = (port: string) => {
  const instance = axios.create({
    baseURL: `${API_URLS.BASE_URL}:${port}`,
    headers: {
      'Content-Type': 'application/json',
    },
    timeout: 10000,
  });

  // Request interceptor to add token
  instance.interceptors.request.use(
    async (config) => {
      const token = await storage.getToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  return instance;
};

// Create client instances for each service
export const api = {
  auth: createApi(API_URLS.AUTH),
  student: createApi(API_URLS.STUDENT),
  grade: createApi(API_URLS.GRADE),
  billing: createApi(API_URLS.BILLING),
  course: createApi(API_URLS.COURSE),
  ai: createApi(API_URLS.AI),
};

export default api;
