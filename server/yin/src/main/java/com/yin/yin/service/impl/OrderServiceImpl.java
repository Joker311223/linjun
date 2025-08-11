package com.yin.yin.service.impl;

import com.yin.yin.common.PageResult;
import com.yin.yin.mapper.OrderMapper;
import com.yin.yin.model.Order;
import com.yin.yin.model.OrderLog;
import com.yin.yin.model.OrderSource;
import com.yin.yin.model.OrderStatus;
import com.yin.yin.model.PaymentMethod;
import com.yin.yin.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.text.SimpleDateFormat;
import java.util.*;

/**
 * 订单服务实现类
 */
@Service
public class OrderServiceImpl implements OrderService {

    @Autowired
    private OrderMapper orderMapper;

    @Override
    public Order getOrderDetail(String id) {
        Order order = orderMapper.selectById(id);
        if (order != null) {
            // 查询订单日志
            List<OrderLog> logs = orderMapper.selectLogsByOrderId(id);
            order.setLogs(logs);
        }
        return order;
    }

    @Override
    public PageResult<Order> listOrders(String keyword, Integer status, String source, String dateRange, Integer pageNum, Integer pageSize) {
        // 解析日期范围
        String startDate = null;
        String endDate = null;
        if (dateRange != null && !dateRange.isEmpty()) {
            String[] dates = dateRange.split(",");
            if (dates.length == 2) {
                startDate = dates[0];
                endDate = dates[1];
            }
        }

        // 计算分页参数
        Integer offset = (pageNum - 1) * pageSize;
        Integer limit = pageSize;

        // 查询订单列表
        List<Order> orders = orderMapper.selectList(keyword, status, source, startDate, endDate, offset, limit);

        // 查询总数
        Long total = orderMapper.selectCount(keyword, status, source, startDate, endDate);

        return new PageResult<>(total, orders);
    }

    @Override
    public List<OrderStatus> getAllStatus() {
        return orderMapper.selectAllStatus();
    }

    @Override
    public List<PaymentMethod> getAllPaymentMethods() {
        return orderMapper.selectAllPaymentMethods();
    }

    @Override
    public List<OrderSource> getAllSources() {
        return orderMapper.selectAllSources();
    }

    @Override
    @Transactional
    public Order createOrder(Order order) {
        // 生成订单ID和订单号
        String id = UUID.randomUUID().toString().replace("-", "");
        String orderNo = "ORD" + new SimpleDateFormat("yyyyMMddHHmmss").format(new Date()) + (int)(Math.random() * 1000);

        order.setId(id);
        order.setOrderNo(orderNo);

        // 设置默认值
        if (order.getStatus() == null) {
            order.setStatus(0); // 待支付
            order.setStatusName("待支付");
            order.setStatusColor("warning");
        }

        // 计算金额
        if (order.getQuantity() == null) {
            order.setQuantity(1);
        }
        if (order.getPrice() != null && order.getQuantity() != null) {
            double amount = order.getPrice() * order.getQuantity();
            order.setAmount(amount);

            // 如果没有设置折扣，默认为0
            if (order.getDiscount() == null) {
                order.setDiscount(0.0);
            }

            // 计算实付金额
            double payAmount = amount - order.getDiscount();
            order.setPayAmount(payAmount);
        }

        order.setCreateTime(new Date());

        // 插入订单
        orderMapper.insert(order);

        // 添加订单日志
        OrderLog log = new OrderLog();
        log.setOrderId(id);
        log.setAction("创建订单");
        log.setOperator("系统");
        log.setOperateTime(new Date());
        log.setDetails("用户通过" + order.getSource() + "创建订单");
        orderMapper.insertLog(log);

        return order;
    }

    @Override
    @Transactional
    public int updateOrder(Order order) {
        Order oldOrder = orderMapper.selectById(order.getId());
        if (oldOrder == null) {
            return 0;
        }

        // 如果状态发生变化，添加日志
        if (order.getStatus() != null && !order.getStatus().equals(oldOrder.getStatus())) {
            OrderLog log = new OrderLog();
            log.setOrderId(order.getId());
            log.setOperateTime(new Date());

            switch (order.getStatus()) {
                case 1: // 已支付
                    log.setAction("支付订单");
                    log.setOperator(order.getUserName());
                    log.setDetails("用户通过" + order.getPaymentMethod() + "支付订单");
                    order.setPayTime(new Date());
                    break;
                case 2: // 已取消
                    log.setAction("取消订单");
                    log.setOperator(order.getUserName() != null ? order.getUserName() : "系统");
                    log.setDetails("用户取消订单");
                    order.setCompleteTime(new Date());
                    break;
                case 3: // 已退款
                    log.setAction("退款订单");
                    log.setOperator("系统");
                    log.setDetails("系统处理退款");
                    order.setCompleteTime(new Date());
                    break;
                case 4: // 已完成
                    log.setAction("完成订单");
                    log.setOperator("系统");
                    log.setDetails("订单服务已完成");
                    order.setCompleteTime(new Date());
                    break;
            }

            orderMapper.insertLog(log);
        }

        return orderMapper.update(order);
    }

    @Override
    public int deleteOrder(String id) {
        return orderMapper.deleteById(id);
    }

    @Override
    public Map<String, Object> getOrderStatistics(String startDate, String endDate, String timeUnit) {
        // 如果没有提供日期范围，默认为最近30天
        if (startDate == null || startDate.isEmpty() || endDate == null || endDate.isEmpty()) {
            SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
            endDate = sdf.format(new Date());

            Calendar calendar = Calendar.getInstance();
            calendar.add(Calendar.DAY_OF_MONTH, -30);
            startDate = sdf.format(calendar.getTime());
        }

        // 1. 获取基本统计数据
        Map<String, Object> statistics = orderMapper.selectStatistics(startDate, endDate, timeUnit);

        // 2. 获取时间序列数据
        List<Map<String, Object>> timeSeriesData = orderMapper.selectTimeSeriesData(startDate, endDate, timeUnit);

        // 3. 获取套餐分布数据
        List<Map<String, Object>> packageData = orderMapper.selectPackageDistribution(startDate, endDate);

        // 4. 获取支付方式分布数据
        List<Map<String, Object>> payMethodData = orderMapper.selectPayMethodDistribution(startDate, endDate);

        // 5. 整合时间序列数据
        Map<String, Object> timeData = new HashMap<>();
        List<String> dates = new ArrayList<>();
        List<Number> amounts = new ArrayList<>();
        List<Number> orders = new ArrayList<>();
        List<Number> users = new ArrayList<>();

        for (Map<String, Object> data : timeSeriesData) {
            dates.add((String) data.get("date"));
            amounts.add((Number) data.get("amount"));
            orders.add((Number) data.get("order_count"));
            users.add((Number) data.get("user_count"));
        }

        timeData.put("dates", dates);
        timeData.put("amounts", amounts);
        timeData.put("orders", orders);
        timeData.put("users", users);

        // 6. 整合套餐分布数据
        Map<String, Object> packageDistribution = new HashMap<>();
        List<String> packageNames = new ArrayList<>();
        List<Number> packageValues = new ArrayList<>();

        for (Map<String, Object> data : packageData) {
            packageNames.add((String) data.get("name"));
            packageValues.add((Number) data.get("value"));
        }

        packageDistribution.put("names", packageNames);
        packageDistribution.put("values", packageValues);

        // 7. 整合支付方式分布数据
        Map<String, Object> payMethodDistribution = new HashMap<>();
        List<String> methods = new ArrayList<>();
        List<Number> values = new ArrayList<>();

        for (Map<String, Object> data : payMethodData) {
            methods.add((String) data.get("method"));
            values.add((Number) data.get("value"));
        }

        payMethodDistribution.put("methods", methods);
        payMethodDistribution.put("values", values);

        // 8. 将所有数据整合到结果中
        statistics.put("timeData", timeData);
        statistics.put("packageData", packageDistribution);
        statistics.put("payMethodData", payMethodDistribution);

        return statistics;
    }
}
