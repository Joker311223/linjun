package com.yin.yin.controller;

import com.yin.yin.common.Result;
import com.yin.yin.model.OrderSource;
import com.yin.yin.model.PaymentMethod;
import com.yin.yin.service.OrderService;
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

    /**
     * 获取所有订单来源
     */
    @GetMapping
    public Result<?> getAllSources() {
        List<OrderSource> sources = orderService.getAllSources();
        return Result.success(sources);
    }

    /**
     * 根据ID获取订单来源
     */
    @GetMapping("/{sourceId}")
    public Result<?> getSourceById(@PathVariable String sourceId) {
        List<OrderSource> sources = orderService.getAllSources();
        for (OrderSource source : sources) {
            if (source.getId().equals(sourceId)) {
                return Result.success(source);
            }
        }
        return Result.failed("未找到指定的订单来源");
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
}
