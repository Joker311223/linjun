package com.yin.yin.model;

import lombok.Data;

/**
 * 支付方式实体类
 */
@Data
public class PaymentMethod {
    /**
     * 支付方式ID
     */
    private Integer id;

    /**
     * 支付方式名称
     */
    private String name;
}
