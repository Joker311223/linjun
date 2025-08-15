package com.yin.yin.controller;

import com.yin.yin.common.Result;
import com.yin.yin.model.OrderSource;
import com.yin.yin.model.PaymentMethod;
import com.yin.yin.model.SourceData;
import com.yin.yin.service.OrderService;
import com.yin.yin.service.SourceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 订单来源和支付方式控制器
 */
@RestController
@RequestMapping("/api/sources")
public class SourceController {

    @Autowired
    private OrderService orderService;

    @Autowired
    private SourceService sourceService;

    /**
     * 获取所有订单来源
     */
    @GetMapping
    public Result<?> getAllSources() {
        List<OrderSource> sources = orderService.getAllSources();
        return Result.success(sources);
    }

    /**
     * 根据ID获取订单来源数据
     */
    @GetMapping("/{sourceId}")
    public Result<?> getSourceById(
            @PathVariable String sourceId,
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate) {

        // 检查来源是否存在
        OrderSource source = null;
        List<OrderSource> sources = orderService.getAllSources();
        for (OrderSource s : sources) {
            if (s.getId().equals(sourceId)) {
                source = s;
                break;
            }
        }

        if (source == null) {
            return Result.failed("未找到指定的订单来源");
        }

        // 获取来源详细数据
        SourceData sourceData = sourceService.getSourceData(sourceId, startDate, endDate);
        if (sourceData != null) {
            // 设置来源基本信息
            sourceData.setSourceInfo(source);
            return Result.success(sourceData);
        } else {
            return Result.failed("获取来源数据失败");
        }
    }

    /**
     * 获取所有支付方式
     */
    @GetMapping("/payment-methods")
    public Result<?> getAllPaymentMethods() {
        List<PaymentMethod> paymentMethods = orderService.getAllPaymentMethods();
        return Result.success(paymentMethods);
    }

    /**
     * 根据ID获取支付方式
     */
    @GetMapping("/payment-methods/{id}")
    public Result<?> getPaymentMethodById(@PathVariable Integer id) {
        List<PaymentMethod> paymentMethods = orderService.getAllPaymentMethods();
        for (PaymentMethod method : paymentMethods) {
            if (method.getId().equals(id)) {
                return Result.success(method);
            }
        }
        return Result.failed("未找到指定的支付方式");
    }

    /**
     * 获取订单来源统计数据
     */
    @GetMapping("/statistics")
    public Result<?> getSourcesStatistics() {
        List<SourceData.Overview> statistics = sourceService.getSourcesStatistics();
        return Result.success(statistics);
    }

    /**
     * 导出订单来源数据
     */
    @GetMapping("/{sourceId}/export")
    public Result<?> exportSourceData(
            @PathVariable String sourceId,
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate) {

        // 这里应该实现导出功能，返回文件下载链接或直接返回文件流
        // 简化实现，仅返回成功消息
        return Result.success(null, "导出成功");
    }
}
