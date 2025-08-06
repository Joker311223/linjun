package com.yin.yin.model;

import lombok.Data;

import java.util.Date;
import java.util.List;

/**
 * 营销活动实体类
 */
@Data
public class Campaign {
    /**
     * 活动ID
     */
    private Long id;

    /**
     * 活动名称
     */
    private String name;

    /**
     * 活动编码
     */
    private String code;

    /**
     * 活动类型ID
     */
    private Integer type;

    /**
     * 活动类型名称
     */
    private String typeName;

    /**
     * 活动描述
     */
    private String description;

    /**
     * 活动规则
     */
    private String rules;

    /**
     * 活动内容
     */
    private String content;

    /**
     * 开始时间
     */
    private Date startTime;

    /**
     * 结束时间
     */
    private Date endTime;

    /**
     * 活动状态：0-未开始，1-进行中，2-已结束，3-已取消
     */
    private Integer status;

    /**
     * 活动状态名称
     */
    private String statusName;

    /**
     * 创建人
     */
    private String createUser;

    /**
     * 创建时间
     */
    private Date createTime;

    /**
     * 更新时间
     */
    private Date updateTime;

    /**
     * 关联套餐列表
     */
    private List<CampaignPackage> packages;
}
