package com.yin.yin.controller;

import com.yin.yin.common.PageResult;
import com.yin.yin.common.Result;
import com.yin.yin.model.Order;
import com.yin.yin.model.OrderSource;
import com.yin.yin.model.OrderStatus;
import com.yin.yin.model.PaymentMethod;
import com.yin.yin.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * 订单控制器
 */
@RestController
@RequestMapping("/api/orders")
public class OrderController {

    @Autowired
    private OrderService orderService;

    /**
     * 获取订单列表
     */
    @GetMapping("/list")
    public Result<?> listOrders(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) Integer status,
            @RequestParam(required = false) String source,
            @RequestParam(required = false) String dateRange,
            @RequestParam(defaultValue = "1") Integer pageNum,
            @RequestParam(defaultValue = "10") Integer pageSize) {

        PageResult<Order> pageResult = orderService.listOrders(keyword, status, source, dateRange, pageNum, pageSize);
        return Result.success(pageResult);
    }

    /**
     * 获取订单详情
     */
    @GetMapping("/detail/{id}")
    public Result<?> getOrderDetail(@PathVariable String id) {
        Order order = orderService.getOrderDetail(id);
        if (order != null) {
            return Result.success(order);
        } else {
            return Result.failed("订单不存在");
        }
    }

    /**
     * 获取订单状态
     */
    @GetMapping("/status")
    public Result<?> getOrderStatus() {
        List<OrderStatus> statusList = orderService.getAllStatus();
        return Result.success(statusList);
    }

    /**
     * 获取支付方式
     */
    @GetMapping("/payment-methods")
    public Result<?> getPaymentMethods() {
        List<PaymentMethod> paymentMethods = orderService.getAllPaymentMethods();
        return Result.success(paymentMethods);
    }

    /**
     * 获取订单来源
     */
    @GetMapping("/sources")
    public Result<?> getOrderSources() {
        List<OrderSource> sources = orderService.getAllSources();
        return Result.success(sources);
    }

    /**
     * 创建订单
     */
    @PostMapping("/create")
    public Result<?> createOrder(@RequestBody Order order) {
        Order createdOrder = orderService.createOrder(order);
        return Result.success(createdOrder, "创建成功");
    }

    /**
     * 更新订单
     */
    @PutMapping("/{id}")
    public Result<?> updateOrder(@PathVariable String id, @RequestBody Order order) {
        order.setId(id);
        int result = orderService.updateOrder(order);
        if (result > 0) {
            return Result.success(null, "更新成功");
        } else {
            return Result.failed("更新失败");
        }
    }

    /**
     * 获取订单统计数据
     */
    @GetMapping("/statistics")
    public Result<?> getOrderStatistics(
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate,
            @RequestParam(defaultValue = "day") String timeUnit) {

        Map<String, Object> statistics = orderService.getOrderStatistics(startDate, endDate, timeUnit);
        return Result.success(statistics);
    }
}
