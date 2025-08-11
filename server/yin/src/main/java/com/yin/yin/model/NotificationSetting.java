package com.yin.yin.model;

import lombok.Data;

/**
 * 通知设置实体类
 */
@Data
public class NotificationSetting {
    /**
     * 是否启用邮件通知
     */
    private Boolean emailEnabled;

    /**
     * 是否启用短信通知
     */
    private Boolean smsEnabled;

    /**
     * 是否启用站内通知
     */
    private Boolean internalEnabled;

    /**
     * 是否启用微信通知
     */
    private Boolean wechatEnabled;

    /**
     * 订单创建通知
     */
    private Boolean orderCreatedNotify;

    /**
     * 订单支付通知
     */
    private Boolean orderPaidNotify;

    /**
     * 订单完成通知
     */
    private Boolean orderCompletedNotify;

    /**
     * 订单取消通知
     */
    private Boolean orderCancelledNotify;
}
