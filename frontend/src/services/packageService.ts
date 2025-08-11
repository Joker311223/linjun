import api, { ApiResponse } from './api';

// 获取套餐列表
export const getPackageList = (params: any): Promise<ApiResponse> => {
  return api.get('/api/packages/list', { params });
};

// 获取套餐详情
export const getPackageDetail = (id: number): Promise<ApiResponse> => {
  return api.get(`/api/packages/detail/${id}`);
};

// 获取套餐类型
export const getPackageTypes = (): Promise<ApiResponse> => {
  return api.get('/api/packages/types');
};

// 添加套餐
export const addPackage = (data: any): Promise<ApiResponse> => {
  return api.post('/api/packages', data);
};

// 更新套餐
export const updatePackage = (id: number, data: any): Promise<ApiResponse> => {
  return api.put(`/api/packages/${id}`, data);
};

// 删除套餐
export const deletePackage = (id: number): Promise<ApiResponse> => {
  return api.delete(`/api/packages/${id}`);
};
