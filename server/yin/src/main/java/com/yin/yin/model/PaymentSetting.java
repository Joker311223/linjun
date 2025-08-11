package com.yin.yin.model;

import lombok.Data;

/**
 * 支付设置实体类
 */
@Data
public class PaymentSetting {
    /**
     * 支付宝AppID
     */
    private String alipayAppId;

    /**
     * 支付宝私钥
     */
    private String alipayPrivateKey;

    /**
     * 支付宝公钥
     */
    private String alipayPublicKey;

    /**
     * 支付宝是否启用
     */
    private Boolean alipayEnabled;

    /**
     * 微信支付商户ID
     */
    private String wxpayMchId;

    /**
     * 微信支付AppID
     */
    private String wxpayAppId;

    /**
     * 微信支付密钥
     */
    private String wxpayKey;

    /**
     * 微信支付是否启用
     */
    private Boolean wxpayEnabled;
}
