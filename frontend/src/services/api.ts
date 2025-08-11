import axios, { AxiosResponse } from 'axios';
import config from '../config';
// 不再需要导入config
// import config from '../config';

// 定义API响应类型
export interface ApiResponse<T = any> {
  code: number;
  message: string;
  data: T;
}

// 创建axios实例
const api = axios.create({
  // 使用相对路径，让请求通过代理转发
  baseURL: config.apiBaseUrl,
  timeout: 10000
});

// 请求拦截器
api.interceptors.request.use(
  config => {
    // 从localStorage获取token
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// 响应拦截器
api.interceptors.response.use(
  (response: AxiosResponse) => {
    // 如果返回的状态码为200，说明接口请求成功，可以正常拿到数据
    return response;
  },
  error => {
    if (error.response) {
      if (error.response.status === 401) {
        // 401: 未登录或token过期
        // 清除token并跳转登录页
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
