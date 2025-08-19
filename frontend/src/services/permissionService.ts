import api, { ApiResponse } from './api';

/**
 * 获取权限列表
 */
export const getPermissionList = (): Promise<ApiResponse> => {
  return api.get('/api/permission/list');
};

/**
 * 分页获取权限列表
 */
export const getPermissionPage = (params: any): Promise<ApiResponse> => {
  return api.get('/api/permission/page', { params });
};

/**
 * 根据ID获取权限
 */
export const getPermissionById = (id: number): Promise<ApiResponse> => {
  return api.get(`/api/permission/${id}`);
};

/**
 * 添加权限
 */
export const addPermission = (permission: any): Promise<ApiResponse> => {
  return api.post('/api/permission', permission);
};

/**
 * 更新权限
 */
export const updatePermission = (permission: any): Promise<ApiResponse> => {
  return api.put('/api/permission', permission);
};

/**
 * 删除权限
 */
export const deletePermission = (id: number): Promise<ApiResponse> => {
  return api.delete(`/api/permission/${id}`);
};

/**
 * 根据角色ID获取权限列表
 */
export const getPermissionsByRoleId = (roleId: number): Promise<ApiResponse> => {
  return api.get(`/api/permission/role/${roleId}`);
};

/**
 * 根据用户ID获取权限列表
 */
export const getPermissionsByUserId = (userId: number): Promise<ApiResponse> => {
  return api.get(`/api/permission/user/${userId}`);
};

/**
 * 为角色分配权限
 */
export const assignPermissionsToRole = (roleId: number, permissionIds: number[]): Promise<ApiResponse> => {
  return api.post(`/api/permission/assign/role/${roleId}`, { permissionIds });
};
