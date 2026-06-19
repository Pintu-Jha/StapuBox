import axios, { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { BASE_URL, API_TOKEN } from '@env';


const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});


apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (API_TOKEN) {
      config.headers['X-Api-Token'] = API_TOKEN;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  },
);


apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  },
);

export default apiClient;
