import api, { ApiResponse } from './api';

// 获取角色列表
export const getRoleList = (): Promise<ApiResponse> => {
  return api.get('/api/role/list');
};

// 分页查询角色列表
export const getRolePage = (params: any): Promise<ApiResponse> => {
  return api.get('/api/role/page', { params });
};

// 根据ID获取角色
export const getRoleById = (id: number): Promise<ApiResponse> => {
  return api.get(`/api/role/${id}`);
};

// 根据用户ID获取角色列表
export const getRolesByUserId = (userId: number): Promise<ApiResponse> => {
  return api.get(`/api/role/user/${userId}`);
};

// 添加角色
export const addRole = (role: any): Promise<ApiResponse> => {
  return api.post('/api/role', role);
};

// 更新角色
export const updateRole = (role: any): Promise<ApiResponse> => {
  return api.put('/api/role', role);
};

// 删除角色
export const deleteRole = (id: number): Promise<ApiResponse> => {
  return api.delete(`/api/role/${id}`);
};

// 为用户分配角色
export const assignRolesToUser = (userId: number, roleIds: number[]): Promise<ApiResponse> => {
  return api.post('/api/role/assign', { userId, roleIds });
};
