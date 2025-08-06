package com.yin.yin.model;

import lombok.Data;

import java.util.Date;
import java.util.List;

/**
 * 套餐实体类
 */
@Data
public class Package {
    /**
     * 套餐ID
     */
    private Long id;

    /**
     * 套餐名称
     */
    private String name;

    /**
     * 套餐编码
     */
    private String code;

    /**
     * 套餐类型ID
     */
    private Integer type;

    /**
     * 套餐类型名称
     */
    private String typeName;

    /**
     * 套餐描述
     */
    private String description;

    /**
     * 原价
     */
    private Double price;

    /**
     * 折扣价
     */
    private Double discountPrice;

    /**
     * 套餐特点列表
     */
    private String features;

    /**
     * 套餐内容
     */
    private String content;

    /**
     * 套餐规则
     */
    private String rules;

    /**
     * 套餐时长
     */
    private Integer duration;

    /**
     * 时长单位
     */
    private String durationUnit;

    /**
     * 状态：0-下架，1-上架
     */
    private Integer status;

    /**
     * 是否热门
     */
    private Boolean isHot;

    /**
     * 是否推荐
     */
    private Boolean isRecommended;

    /**
     * 销售数量
     */
    private Integer salesCount;

    /**
     * 创建时间
     */
    private Date createTime;

    /**
     * 更新时间
     */
    private Date updateTime;
}
