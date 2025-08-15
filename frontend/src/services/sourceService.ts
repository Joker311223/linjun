import api, { ApiResponse } from './api';

/**
 * 获取所有订单来源
 */
export const getAllSources = (): Promise<ApiResponse> => {
  return api.get('/api/sources');
};

/**
 * 获取特定订单来源数据
 * @param sourceId 来源ID
 * @param startDate 开始日期
 * @param endDate 结束日期
 */
export const getSourceById = (
  sourceId: string,
  startDate?: string,
  endDate?: string
): Promise<ApiResponse> => {
  return api.get(`/api/sources/${sourceId}`, {
    params: {
      startDate,
      endDate
    }
  });
};

/**
 * 获取订单来源统计数据
 */
export const getSourcesStatistics = (): Promise<ApiResponse> => {
  return api.get('/api/sources/statistics');
};

/**
 * 获取支付方式列表
 */
export const getPaymentMethods = (): Promise<ApiResponse> => {
  return api.get('/api/sources/payment-methods');
};

/**
 * 获取特定支付方式
 * @param id 支付方式ID
 */
export const getPaymentMethodById = (id: number): Promise<ApiResponse> => {
  return api.get(`/api/sources/payment-methods/${id}`);
};

/**
 * 导出订单来源数据
 * @param sourceId 来源ID
 * @param startDate 开始日期
 * @param endDate 结束日期
 */
export const exportSourceData = (
  sourceId: string,
  startDate: string,
  endDate: string
): Promise<ApiResponse> => {
  return api.get(`/api/sources/${sourceId}/export`, {
    params: {
      startDate,
      endDate
    },
    responseType: 'blob'
  });
};
