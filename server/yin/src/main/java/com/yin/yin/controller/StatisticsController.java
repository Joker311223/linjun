package com.yin.yin.controller;

import com.yin.yin.common.Result;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.*;

@RestController
@RequestMapping("/api/statistics")
public class StatisticsController {

    @GetMapping("/dashboard")
    public Result getDashboardData() {
        // 创建模拟数据
        Map<String, Object> data = new HashMap<>();

        // 概览数据
        Map<String, Object> overview = new HashMap<>();
        overview.put("totalSales", 128560.75);
        overview.put("totalOrders", 1258);
        overview.put("totalUsers", 856);
        overview.put("totalPackages", 24);
        data.put("overview", overview);

        // 趋势数据
        Map<String, Object> trend = new HashMap<>();
        trend.put("days", Arrays.asList("周一", "周二", "周三", "周四", "周五", "周六", "周日"));
        trend.put("sales", Arrays.asList(12000, 15000, 18000, 14000, 19000, 23000, 21000));
        trend.put("orders", Arrays.asList(120, 150, 180, 140, 190, 230, 210));
        trend.put("users", Arrays.asList(80, 95, 110, 85, 120, 150, 130));
        data.put("trend", trend);

        // 套餐类型数据
        List<Map<String, Object>> packageTypes = new ArrayList<>();
        Map<String, Object> type1 = new HashMap<>();
        type1.put("name", "基础套餐");
        type1.put("value", 458);
        packageTypes.add(type1);

        Map<String, Object> type2 = new HashMap<>();
        type2.put("name", "高级套餐");
        type2.put("value", 356);
        packageTypes.add(type2);

        Map<String, Object> type3 = new HashMap<>();
        type3.put("name", "专业套餐");
        type3.put("value", 289);
        packageTypes.add(type3);

        Map<String, Object> type4 = new HashMap<>();
        type4.put("name", "企业套餐");
        type4.put("value", 155);
        packageTypes.add(type4);

        data.put("packageTypes", packageTypes);

        // 热门套餐
        List<Map<String, Object>> hotPackages = new ArrayList<>();
        Map<String, Object> pkg1 = new HashMap<>();
        pkg1.put("id", 1);
        pkg1.put("name", "抖音推广基础版");
        pkg1.put("sales", 356);
        pkg1.put("growth", 12);
        hotPackages.add(pkg1);

        Map<String, Object> pkg2 = new HashMap<>();
        pkg2.put("id", 2);
        pkg2.put("name", "微信营销专业版");
        pkg2.put("sales", 289);
        pkg2.put("growth", 8);
        hotPackages.add(pkg2);

        Map<String, Object> pkg3 = new HashMap<>();
        pkg3.put("id", 3);
        pkg3.put("name", "全平台推广套餐");
        pkg3.put("sales", 245);
        pkg3.put("growth", -5);
        hotPackages.add(pkg3);

        Map<String, Object> pkg4 = new HashMap<>();
        pkg4.put("id", 4);
        pkg4.put("name", "小红书种草计划");
        pkg4.put("sales", 198);
        pkg4.put("growth", 15);
        hotPackages.add(pkg4);

        data.put("hotPackages", hotPackages);

        // 最近订单
        List<Map<String, Object>> recentOrders = new ArrayList<>();
        String[] statuses = {"已支付", "待支付", "已取消", "已退款"};
        String[] paymentMethods = {"微信支付", "支付宝", "银行卡"};
        String[] sources = {"抖音", "微信", "淘宝", "小红书", "官网", "其他"};
        String[] packageTypeNames = {"基础套餐", "高级套餐", "专业套餐", "企业套餐"};

        Random random = new Random();
        for (int i = 1; i <= 10; i++) {
            Map<String, Object> order = new HashMap<>();
            order.put("id", "ORD" + (10000 + i));
            order.put("packageName", "营销套餐" + i);
            order.put("packageType", packageTypeNames[random.nextInt(packageTypeNames.length)]);
            order.put("amount", 100 + random.nextInt(900));
            order.put("paymentMethod", paymentMethods[random.nextInt(paymentMethods.length)]);
            order.put("source", sources[random.nextInt(sources.length)]);
            order.put("status", statuses[random.nextInt(statuses.length)]);
            order.put("createTime", "2023-08-" + (10 + random.nextInt(20)) + " " +
                    String.format("%02d:%02d:%02d", random.nextInt(24), random.nextInt(60), random.nextInt(60)));
            recentOrders.add(order);
        }
        data.put("recentOrders", recentOrders);

        // 订单来源数据
        Map<String, Object> sourceData = new HashMap<>();
        sourceData.put("sources", Arrays.asList("抖音", "微信", "淘宝", "小红书", "官网", "其他"));
        sourceData.put("values", Arrays.asList(356, 289, 245, 198, 156, 78));
        data.put("sourceData", sourceData);

        return Result.success(data);
    }
}
