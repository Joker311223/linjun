package com.yin.yin.model;

import lombok.Data;

import java.util.Date;

/**
 * 系统设置实体类
 */
@Data
public class Setting {
    /**
     * 设置ID
     */
    private Long id;

    /**
     * 设置类型：basic-基本设置，email-邮件设置，sms-短信设置，payment-支付设置
     */
    private String type;

    /**
     * 设置键
     */
    private String settingKey;

    /**
     * 设置值
     */
    private String settingValue;

    /**
     * 设置描述
     */
    private String description;

    /**
     * 创建时间
     */
    private Date createTime;

    /**
     * 更新时间
     */
    private Date updateTime;
}
