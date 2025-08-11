package com.yin.yin.controller;

import com.yin.yin.common.Result;
import com.yin.yin.mapper.OrderMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.text.SimpleDateFormat;
import java.util.*;

@RestController
@RequestMapping("/api/statistics")
public class StatisticsController {

    @Autowired
    private OrderMapper orderMapper;

    @GetMapping("/dashboard")
    public Result getDashboardData() {
        // 使用实际数据库查询替换模拟数据
        Map<String, Object> data = new HashMap<>();

        try {
            // 1. 概览数据
            Map<String, Object> overview = orderMapper.selectDashboardOverview();
            data.put("overview", overview);

            // 2. 趋势数据
            List<Map<String, Object>> trendList = orderMapper.selectDailyTrend();
            Map<String, Object> trend = processTrendData(trendList);
            data.put("trend", trend);

            // 3. 套餐类型数据
            List<Map<String, Object>> packageTypes = orderMapper.selectPackageTypeDistribution();
            data.put("packageTypes", packageTypes);

            // 4. 热门套餐
            List<Map<String, Object>> hotPackages = orderMapper.selectHotPackages();
            data.put("hotPackages", hotPackages);

            // 5. 最近订单
            List<Map<String, Object>> recentOrders = orderMapper.selectRecentOrders();
            data.put("recentOrders", recentOrders);

            // 6. 订单来源数据
            List<Map<String, Object>> sourceData = orderMapper.selectOrderSourceDistribution();
            Map<String, Object> sourceDistribution = processSourceData(sourceData);
            data.put("sourceData", sourceDistribution);

            return Result.success(data);
        } catch (Exception e) {
            e.printStackTrace();
            return Result.failed("获取仪表盘数据失败: " + e.getMessage());
        }
    }

    /**
     * 处理趋势数据，转换为前端需要的格式
     */
    private Map<String, Object> processTrendData(List<Map<String, Object>> trendList) {
        Map<String, Object> result = new HashMap<>();
        List<String> days = new ArrayList<>();
        List<Double> sales = new ArrayList<>();
        List<Long> orders = new ArrayList<>();
        List<Long> users = new ArrayList<>();

        // 获取最近7天的日期
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
        Calendar calendar = Calendar.getInstance();
        Map<String, Map<String, Object>> dayMap = new HashMap<>();

        // 将查询结果转换为Map以便快速查找
        for (Map<String, Object> item : trendList) {
            dayMap.put((String) item.get("day"), item);
        }

        // 填充最近7天的数据，如果某天没有数据则填充0
        for (int i = 6; i >= 0; i--) {
            calendar.setTime(new Date());
            calendar.add(Calendar.DAY_OF_MONTH, -i);
            String day = sdf.format(calendar.getTime());

            // 添加星期几
            calendar.setTime(calendar.getTime());
            String[] weekDays = {"周日", "周一", "周二", "周三", "周四", "周五", "周六"};
            int w = calendar.get(Calendar.DAY_OF_WEEK) - 1;
            if (w < 0) w = 0;

            days.add(weekDays[w]);

            if (dayMap.containsKey(day)) {
                Map<String, Object> item = dayMap.get(day);
                sales.add(item.get("sales") == null ? 0.0 : ((Number) item.get("sales")).doubleValue());
                orders.add(item.get("orders") == null ? 0L : ((Number) item.get("orders")).longValue());
                users.add(item.get("users") == null ? 0L : ((Number) item.get("users")).longValue());
            } else {
                sales.add(0.0);
                orders.add(0L);
                users.add(0L);
            }
        }

        result.put("days", days);
        result.put("sales", sales);
        result.put("orders", orders);
        result.put("users", users);
        return result;
    }

    /**
     * 处理来源数据，转换为前端需要的格式
     */
    private Map<String, Object> processSourceData(List<Map<String, Object>> sourceData) {
        Map<String, Object> result = new HashMap<>();
        List<String> sources = new ArrayList<>();
        List<Long> values = new ArrayList<>();

        for (Map<String, Object> item : sourceData) {
            sources.add((String) item.get("name"));
            values.add(((Number) item.get("value")).longValue());
        }

        result.put("sources", sources);
        result.put("values", values);
        return result;
    }
}
