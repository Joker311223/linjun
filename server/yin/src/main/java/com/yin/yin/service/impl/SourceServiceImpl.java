package com.yin.yin.service.impl;

import com.yin.yin.mapper.OrderMapper;
import com.yin.yin.model.Order;
import com.yin.yin.model.OrderSource;
import com.yin.yin.model.SourceData;
import com.yin.yin.service.OrderService;
import com.yin.yin.service.SourceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.text.SimpleDateFormat;
import java.util.*;

/**
 * 订单来源服务实现类
 */
@Service
public class SourceServiceImpl implements SourceService {

    @Autowired
    private OrderMapper orderMapper;

    @Autowired
    private OrderService orderService;

    @Override
    public SourceData getSourceData(String sourceId, String startDate, String endDate) {
        // 如果没有提供日期范围，默认为最近30天
        if (startDate == null || startDate.isEmpty() || endDate == null || endDate.isEmpty()) {
            SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
            endDate = sdf.format(new Date());

            Calendar calendar = Calendar.getInstance();
            calendar.add(Calendar.DAY_OF_MONTH, -30);
            startDate = sdf.format(calendar.getTime());
        }

        // 创建返回对象
        SourceData sourceData = new SourceData();

        // 1. 获取概览数据
        SourceData.Overview overview = getOverviewData(sourceId, startDate, endDate);
        sourceData.setOverview(overview);

        // 2. 获取时间序列数据
        SourceData.TimeData timeData = getTimeSeriesData(sourceId, startDate, endDate);
        sourceData.setTimeData(timeData);

        // 3. 获取热门产品数据
        List<SourceData.TopProduct> topProducts = getTopProducts(sourceId, startDate, endDate);
        sourceData.setTopProducts(topProducts);

        // 4. 获取最近订单数据
        List<SourceData.RecentOrder> recentOrders = getRecentOrders(sourceId, 10);
        sourceData.setRecentOrders(recentOrders);

        return sourceData;
    }

    @Override
    public List<SourceData.Overview> getSourcesStatistics() {
        List<SourceData.Overview> statistics = new ArrayList<>();

        // 获取所有来源
        List<OrderSource> sources = orderService.getAllSources();

        // 获取当前日期和30天前的日期
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
        String endDate = sdf.format(new Date());

        Calendar calendar = Calendar.getInstance();
        calendar.add(Calendar.DAY_OF_MONTH, -30);
        String startDate = sdf.format(calendar.getTime());

        // 为每个来源获取统计数据
        for (OrderSource source : sources) {
            SourceData.Overview overview = getOverviewData(source.getId(), startDate, endDate);
            statistics.add(overview);
        }

        // 按订单数排序
        statistics.sort((o1, o2) -> o2.getTotalOrders().compareTo(o1.getTotalOrders()));

        return statistics;
    }

    /**
     * 获取概览数据
     */
    private SourceData.Overview getOverviewData(String sourceId, String startDate, String endDate) {
        SourceData.Overview overview = new SourceData.Overview();

        // 获取当前时间段的订单数和销售额
        Map<String, Object> currentStats = orderMapper.selectSourceStats(sourceId, startDate, endDate);

        // 获取上一个时间段的订单数和销售额，用于计算环比增长
        Calendar calendar = Calendar.getInstance();
        try {
            SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
            Date end = sdf.parse(endDate);
            Date start = sdf.parse(startDate);

            long diffInMillies = Math.abs(end.getTime() - start.getTime());
            long diffInDays = diffInMillies / (24 * 60 * 60 * 1000);

            calendar.setTime(start);
            calendar.add(Calendar.DAY_OF_MONTH, -1 * (int)diffInDays);
            String prevEndDate = startDate;
            String prevStartDate = sdf.format(calendar.getTime());

            Map<String, Object> prevStats = orderMapper.selectSourceStats(sourceId, prevStartDate, prevEndDate);

            // 设置数据 - 修复类型转换问题
            Object totalOrdersObj = currentStats.getOrDefault("totalOrders", 0);
            Integer totalOrders = 0;
            if (totalOrdersObj instanceof Long) {
                totalOrders = ((Long) totalOrdersObj).intValue();
            } else if (totalOrdersObj instanceof Integer) {
                totalOrders = (Integer) totalOrdersObj;
            } else if (totalOrdersObj instanceof Number) {
                totalOrders = ((Number) totalOrdersObj).intValue();
            }

            Object totalSalesObj = currentStats.getOrDefault("totalSales", 0.0);
            Double totalSales = 0.0;
            if (totalSalesObj instanceof Number) {
                totalSales = ((Number) totalSalesObj).doubleValue();
            }

            Object prevTotalOrdersObj = prevStats.getOrDefault("totalOrders", 0);
            Integer prevTotalOrders = 0;
            if (prevTotalOrdersObj instanceof Long) {
                prevTotalOrders = ((Long) prevTotalOrdersObj).intValue();
            } else if (prevTotalOrdersObj instanceof Integer) {
                prevTotalOrders = (Integer) prevTotalOrdersObj;
            } else if (prevTotalOrdersObj instanceof Number) {
                prevTotalOrders = ((Number) prevTotalOrdersObj).intValue();
            }

            overview.setTotalOrders(totalOrders);
            overview.setTotalSales(totalSales);

            // 计算转化率 (假设有访问量数据，这里简化处理)
            Object visitsObj = currentStats.getOrDefault("visits", 100.0);
            Double visits = 100.0;
            if (visitsObj instanceof Number) {
                visits = ((Number) visitsObj).doubleValue();
            }
            Double conversion = totalOrders / visits * 100;
            overview.setConversion(conversion);

            // 计算环比增长
            Double growth = 0.0;
            if (prevTotalOrders > 0) {
                growth = ((double)totalOrders - prevTotalOrders) / prevTotalOrders * 100;
            }
            overview.setGrowth(growth);

        } catch (Exception e) {
            e.printStackTrace();
            // 设置默认值
            overview.setTotalOrders(0);
            overview.setTotalSales(0.0);
            overview.setConversion(0.0);
            overview.setGrowth(0.0);
        }

        return overview;
    }

    /**
     * 获取时间序列数据
     */
    private SourceData.TimeData getTimeSeriesData(String sourceId, String startDate, String endDate) {
        SourceData.TimeData timeData = new SourceData.TimeData();

        // 获取时间序列数据
        List<Map<String, Object>> seriesData = orderMapper.selectSourceTimeSeriesData(sourceId, startDate, endDate);

        List<String> dates = new ArrayList<>();
        List<Integer> orders = new ArrayList<>();
        List<Double> sales = new ArrayList<>();

        for (Map<String, Object> data : seriesData) {
            dates.add((String) data.get("date"));

            // 处理orders字段的类型转换
            Object ordersObj = data.get("orders");
            if (ordersObj instanceof Long) {
                orders.add(((Long) ordersObj).intValue());
            } else if (ordersObj instanceof Integer) {
                orders.add((Integer) ordersObj);
            } else if (ordersObj instanceof Number) {
                orders.add(((Number) ordersObj).intValue());
            } else {
                orders.add(0);
            }

            // 处理sales字段的类型转换
            Object salesObj = data.get("sales");
            if (salesObj instanceof Number) {
                sales.add(((Number) salesObj).doubleValue());
            } else {
                sales.add(0.0);
            }
        }

        timeData.setDates(dates);
        timeData.setOrders(orders);
        timeData.setSales(sales);

        return timeData;
    }

    /**
     * 获取热门产品数据
     */
    private List<SourceData.TopProduct> getTopProducts(String sourceId, String startDate, String endDate) {
        List<Map<String, Object>> productsData = orderMapper.selectSourceTopProducts(sourceId, startDate, endDate, 6);

        List<SourceData.TopProduct> topProducts = new ArrayList<>();

        for (Map<String, Object> data : productsData) {
            SourceData.TopProduct product = new SourceData.TopProduct();

            // 处理id字段的类型转换
            Object idObj = data.get("id");
            if (idObj instanceof Number) {
                product.setId(((Number) idObj).longValue());
            } else {
                product.setId(0L);
            }

            product.setName((String) data.get("name"));

            // 处理sales字段的类型转换
            Object salesObj = data.get("sales");
            if (salesObj instanceof Number) {
                product.setSales(((Number) salesObj).doubleValue());
            } else {
                product.setSales(0.0);
            }

            // 处理orders字段的类型转换
            Object ordersObj = data.get("orders");
            if (ordersObj instanceof Long) {
                product.setOrders(((Long) ordersObj).intValue());
            } else if (ordersObj instanceof Integer) {
                product.setOrders((Integer) ordersObj);
            } else if (ordersObj instanceof Number) {
                product.setOrders(((Number) ordersObj).intValue());
            } else {
                product.setOrders(0);
            }

            // 计算增长率
            Object prevSalesObj = data.getOrDefault("prevSales", 0.0);
            Double prevSales = 0.0;
            if (prevSalesObj instanceof Number) {
                prevSales = ((Number) prevSalesObj).doubleValue();
            }

            Double growth = 0.0;
            if (prevSales > 0) {
                growth = (product.getSales() - prevSales) / prevSales * 100;
            }
            product.setGrowth(growth);

            topProducts.add(product);
        }

        return topProducts;
    }

    /**
     * 获取最近订单数据
     */
    private List<SourceData.RecentOrder> getRecentOrders(String sourceId, int limit) {
        List<Order> orders = orderMapper.selectRecentOrdersBySource(sourceId, limit);

        List<SourceData.RecentOrder> recentOrders = new ArrayList<>();

        for (Order order : orders) {
            SourceData.RecentOrder recentOrder = new SourceData.RecentOrder();
            recentOrder.setId(order.getId());
            recentOrder.setOrderNo(order.getOrderNo());
            recentOrder.setUserName(order.getUserName());
            recentOrder.setPackageName(order.getPackageName());
            recentOrder.setAmount(order.getAmount());
            recentOrder.setStatus(order.getStatus());
            recentOrder.setStatusName(order.getStatusName());
            recentOrder.setStatusColor(order.getStatusColor());

            // 格式化创建时间
            SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
            recentOrder.setCreateTime(sdf.format(order.getCreateTime()));

            recentOrders.add(recentOrder);
        }

        return recentOrders;
    }
}
