import api, { ApiResponse } from './api';

// 获取活动列表
export const getCampaignList = (params: any): Promise<ApiResponse> => {
  return api.get('/api/campaigns/list', { params });
};

// 获取活动详情
export const getCampaignDetail = (id: number): Promise<ApiResponse> => {
  return api.get(`/api/campaigns/detail/${id}`);
};

// 获取活动类型
export const getCampaignTypes = (): Promise<ApiResponse> => {
  return api.get('/api/campaigns/types');
};

// 获取活动状态
export const getCampaignStatus = (): Promise<ApiResponse> => {
  return api.get('/api/campaigns/status');
};

// 添加活动
export const addCampaign = (data: any): Promise<ApiResponse> => {
  return api.post('/api/campaigns', data);
};

// 更新活动
export const updateCampaign = (id: number, data: any): Promise<ApiResponse> => {
  return api.put(`/api/campaigns/${id}`, data);
};

// 删除活动
export const deleteCampaign = (id: number): Promise<ApiResponse> => {
  return api.delete(`/api/campaigns/${id}`);
};
