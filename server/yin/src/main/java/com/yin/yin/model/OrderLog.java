package com.yin.yin.model;

import lombok.Data;

import java.util.Date;

/**
 * 订单日志实体类
 */
@Data
public class OrderLog {
    /**
     * 日志ID
     */
    private Long id;

    /**
     * 订单ID
     */
    private String orderId;

    /**
     * 操作类型
     */
    private String action;

    /**
     * 操作人
     */
    private String operator;

    /**
     * 操作时间
     */
    private Date operateTime;

    /**
     * 操作详情
     */
    private String details;
}
