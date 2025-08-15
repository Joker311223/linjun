package com.yin.yin.model;

import lombok.Data;
import java.util.List;

/**
 * 订单来源数据实体类
 */
@Data
public class SourceData {
    /**
     * 概览数据
     */
    private Overview overview;

    /**
     * 时间序列数据
     */
    private TimeData timeData;

    /**
     * 热门产品数据
     */
    private List<TopProduct> topProducts;

    /**
     * 最近订单数据
     */
    private List<RecentOrder> recentOrders;

    /**
     * 来源信息
     */
    private OrderSource sourceInfo;

    /**
     * 概览数据
     */
    @Data
    public static class Overview {
        /**
         * 总订单数
         */
        private Integer totalOrders;

        /**
         * 总销售额
         */
        private Double totalSales;

        /**
         * 转化率
         */
        private Double conversion;

        /**
         * 环比增长
         */
        private Double growth;
    }

    /**
     * 时间序列数据
     */
    @Data
    public static class TimeData {
        /**
         * 日期列表
         */
        private List<String> dates;

        /**
         * 订单数列表
         */
        private List<Integer> orders;

        /**
         * 销售额列表
         */
        private List<Double> sales;
    }

    /**
     * 热门产品数据
     */
    @Data
    public static class TopProduct {
        /**
         * 产品ID
         */
        private Long id;

        /**
         * 产品名称
         */
        private String name;

        /**
         * 销售额
         */
        private Double sales;

        /**
         * 订单数
         */
        private Integer orders;

        /**
         * 增长率
         */
        private Double growth;
    }

    /**
     * 最近订单数据
     */
    @Data
    public static class RecentOrder {
        /**
         * 订单ID
         */
        private String id;

        /**
         * 订单号
         */
        private String orderNo;

        /**
         * 用户名
         */
        private String userName;

        /**
         * 套餐名称
         */
        private String packageName;

        /**
         * 金额
         */
        private Double amount;

        /**
         * 订单状态
         */
        private Integer status;

        /**
         * 状态名称
         */
        private String statusName;

        /**
         * 状态颜色
         */
        private String statusColor;

        /**
         * 创建时间
         */
        private String createTime;
    }
}
