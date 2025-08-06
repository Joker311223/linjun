package com.yin.yin.model;

import lombok.Data;

/**
 * 活动关联套餐实体类
 */
@Data
public class CampaignPackage {
    /**
     * ID
     */
    private Long id;

    /**
     * 套餐ID
     */
    private Long packageId;

    /**
     * 套餐名称
     */
    private String name;

    /**
     * 原价
     */
    private Double price;

    /**
     * 折扣价
     */
    private Double discountPrice;

    /**
     * 折扣
     */
    private Double discount;

    /**
     * 活动ID
     */
    private Long campaignId;
}
