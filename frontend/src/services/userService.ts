import api, { ApiResponse } from './api';

interface RegisterData {
  username: string;
  password: string;
  confirmPassword: string;
  phone: string;
  inviteCode: string;
  email?: string;
}

// 用户登录
export const login = (username: string, password: string): Promise<ApiResponse> => {
  return api.post('/api/user/login', { username, password });
};

// 用户注册
export const register = (data: RegisterData): Promise<ApiResponse> => {
  return api.post('/api/user/register', data);
};

// 获取用户信息
export const getUserInfo = (userId?: number): Promise<ApiResponse> => {
  return api.get('/api/user/info', { params: userId ? { userId } : {} });
};

// 获取用户权限
export const getUserPermissions = (userId?: number): Promise<ApiResponse> => {
  return api.get('/api/user/permissions', { params: userId ? { userId } : {} });
};

// 获取用户角色
export const getUserRoles = (userId?: number): Promise<ApiResponse> => {
  return api.get('/api/user/roles', { params: userId ? { userId } : {} });
};

// 获取用户列表
export const getUserList = (params: any): Promise<ApiResponse> => {
  return api.get('/api/user/users/list', { params });
};

// 获取用户统计数据
export const getUserStatistics = (): Promise<ApiResponse> => {
  return api.get('/api/user/users/statistics');
};

// 退出登录
export const logout = (): Promise<ApiResponse> => {
  return api.post('/api/user/logout');
};
