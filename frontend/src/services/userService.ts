import api, { ApiResponse } from './api';

// 用户登录
export const login = (username: string, password: string): Promise<ApiResponse> => {
  return api.post('/api/user/login', { username, password });
};

// 获取用户信息
export const getUserInfo = (): Promise<ApiResponse> => {
  return api.get('/api/user/info');
};

// 获取用户列表
export const getUserList = (params: any): Promise<ApiResponse> => {
  return api.get('/api/users/list', { params });
};

// 获取用户统计数据
export const getUserStatistics = (): Promise<ApiResponse> => {
  return api.get('/api/users/statistics');
};

// 退出登录
export const logout = (): Promise<ApiResponse> => {
  return api.post('/api/user/logout');
};
