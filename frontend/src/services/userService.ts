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

// 根据ID获取用户
export const getUserById = (id: number): Promise<ApiResponse> => {
  return api.get(`/api/user/${id}`);
};

// 添加用户
export const addUser = (user: any): Promise<ApiResponse> => {
  return api.post('/api/user', user);
};

// 更新用户
export const updateUser = (user: any): Promise<ApiResponse> => {
  return api.put('/api/user', user);
};

// 删除用户
export const deleteUser = (id: number): Promise<ApiResponse> => {
  return api.delete(`/api/user/${id}`);
};

// 重置用户密码
export const resetUserPassword = (id: number, password: string): Promise<ApiResponse> => {
  return api.put(`/api/user/${id}/password`, { password });
};

// 修改用户状态
export const changeUserStatus = (id: number, status: number): Promise<ApiResponse> => {
  return api.put(`/api/user/${id}/status`, { status });
};
