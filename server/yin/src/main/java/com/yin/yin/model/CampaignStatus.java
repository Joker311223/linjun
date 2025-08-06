package com.yin.yin.model;

import lombok.Data;

/**
 * 活动状态实体类
 */
@Data
public class CampaignStatus {
    /**
     * 状态ID
     */
    private Integer id;

    /**
     * 状态名称
     */
    private String name;

    /**
     * 状态颜色
     */
    private String color;
}
