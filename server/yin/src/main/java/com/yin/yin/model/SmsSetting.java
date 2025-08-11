package com.yin.yin.model;

import lombok.Data;

/**
 * 短信设置实体类
 */
@Data
public class SmsSetting {
    /**
     * 短信服务提供商
     */
    private String provider;

    /**
     * 短信API密钥
     */
    private String apiKey;

    /**
     * 短信API密钥
     */
    private String apiSecret;

    /**
     * 短信签名
     */
    private String signName;

    /**
     * 短信模板ID - 验证码
     */
    private String verificationTemplateId;

    /**
     * 短信模板ID - 通知
     */
    private String notificationTemplateId;

    /**
     * 短信模板ID - 营销
     */
    private String marketingTemplateId;
}
