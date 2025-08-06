package com.yin.yin.model;

import lombok.Data;

/**
 * 订单来源实体类
 */
@Data
public class OrderSource {
    /**
     * 来源ID
     */
    private String id;

    /**
     * 来源名称
     */
    private String name;

    /**
     * 来源颜色
     */
    private String color;

    /**
     * 来源图标
     */
    private String icon;
}
