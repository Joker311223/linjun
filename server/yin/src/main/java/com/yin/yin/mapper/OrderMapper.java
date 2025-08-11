package com.yin.yin.mapper;

import com.yin.yin.model.Order;
import com.yin.yin.model.OrderLog;
import com.yin.yin.model.OrderSource;
import com.yin.yin.model.OrderStatus;
import com.yin.yin.model.PaymentMethod;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;
import java.util.Map;

/**
 * 订单Mapper接口
 */
@Mapper
public interface OrderMapper {
    /**
     * 根据ID查询订单
     */
    Order selectById(String id);

    /**
     * 查询订单列表
     */
    List<Order> selectList(@Param("keyword") String keyword,
                          @Param("status") Integer status,
                          @Param("source") String source,
                          @Param("startDate") String startDate,
                          @Param("endDate") String endDate,
                          @Param("offset") Integer offset,
                          @Param("limit") Integer limit);

    /**
     * 查询订单总数
     */
    Long selectCount(@Param("keyword") String keyword,
                    @Param("status") Integer status,
                    @Param("source") String source,
                    @Param("startDate") String startDate,
                    @Param("endDate") String endDate);

    /**
     * 插入订单
     */
    int insert(Order order);

    /**
     * 更新订单
     */
    int update(Order order);

    /**
     * 删除订单
     */
    int deleteById(String id);

    /**
     * 查询所有订单状态
     */
    List<OrderStatus> selectAllStatus();

    /**
     * 查询所有支付方式
     */
    List<PaymentMethod> selectAllPaymentMethods();

    /**
     * 查询所有订单来源
     */
    List<OrderSource> selectAllSources();

    /**
     * 根据订单ID查询订单日志
     */
    List<OrderLog> selectLogsByOrderId(String orderId);

    /**
     * 插入订单日志
     */
    int insertLog(OrderLog log);

    /**
     * 查询订单统计数据
     */
    Map<String, Object> selectStatistics(@Param("startDate") String startDate,
                                        @Param("endDate") String endDate,
                                        @Param("timeUnit") String timeUnit);

    /**
     * 查询仪表盘概览数据
     */
    Map<String, Object> selectDashboardOverview();

    /**
     * 查询每日趋势数据
     */
    List<Map<String, Object>> selectDailyTrend();

    /**
     * 查询套餐类型分布
     */
    List<Map<String, Object>> selectPackageTypeDistribution();

    /**
     * 查询热门套餐
     */
    List<Map<String, Object>> selectHotPackages();

    /**
     * 查询最近订单
     */
    List<Map<String, Object>> selectRecentOrders();

    /**
     * 查询订单来源分布
     */
    List<Map<String, Object>> selectOrderSourceDistribution();
}
