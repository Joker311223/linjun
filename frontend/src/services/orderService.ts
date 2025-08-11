import api, { ApiResponse } from './api';

// 获取订单列表
export const getOrderList = (params: any): Promise<ApiResponse> => {
  return api.get('/api/orders/list', { params });
};

// 获取订单详情
export const getOrderDetail = (id: string): Promise<ApiResponse> => {
  return api.get(`/api/orders/detail/${id}`);
};

// 获取订单状态
export const getOrderStatus = (): Promise<ApiResponse> => {
  return api.get('/api/orders/status');
};

// 获取支付方式
export const getPaymentMethods = (): Promise<ApiResponse> => {
  return api.get('/api/orders/payment-methods');
};

// 获取订单来源
export const getOrderSources = (): Promise<ApiResponse> => {
  return api.get('/api/orders/sources');
};

// 创建订单
export const createOrder = (data: any): Promise<ApiResponse> => {
  return api.post('/api/orders/create', data);
};

// 更新订单
export const updateOrder = (id: string, data: any): Promise<ApiResponse> => {
  return api.put(`/api/orders/${id}`, data);
};

// 获取订单统计数据
export const getOrderStatistics = (params: any): Promise<ApiResponse> => {
  return api.get('/api/orders/statistics', { params });
};
