package com.yin.yin.service;

import com.yin.yin.common.PageResult;
import com.yin.yin.model.Order;
import com.yin.yin.model.OrderSource;
import com.yin.yin.model.OrderStatus;
import com.yin.yin.model.PaymentMethod;

import java.util.List;
import java.util.Map;

/**
 * 订单服务接口
 */
public interface OrderService {
    /**
     * 获取订单详情
     */
    Order getOrderDetail(String id);

    /**
     * 分页查询订单列表
     */
    PageResult<Order> listOrders(String keyword, Integer status, String source, String dateRange, Integer pageNum, Integer pageSize);

    /**
     * 获取所有订单状态
     */
    List<OrderStatus> getAllStatus();

    /**
     * 获取所有支付方式
     */
    List<PaymentMethod> getAllPaymentMethods();

    /**
     * 获取所有订单来源
     */
    List<OrderSource> getAllSources();

    /**
     * 创建订单
     */
    Order createOrder(Order order);

    /**
     * 更新订单
     */
    int updateOrder(Order order);

    /**
     * 删除订单
     */
    int deleteOrder(String id);

    /**
     * 获取订单统计数据
     */
    Map<String, Object> getOrderStatistics(String startDate, String endDate, String timeUnit);
}
