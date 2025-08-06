package com.yin.yin.model;

import lombok.Data;

import java.util.Date;
import java.util.List;

/**
 * 订单实体类
 */
@Data
public class Order {
    /**
     * 订单ID
     */
    private String id;

    /**
     * 订单编号
     */
    private String orderNo;

    /**
     * 用户ID
     */
    private Long userId;

    /**
     * 用户名
     */
    private String userName;

    /**
     * 套餐ID
     */
    private Long packageId;

    /**
     * 套餐名称
     */
    private String packageName;

    /**
     * 套餐类型
     */
    private String packageType;

    /**
     * 单价
     */
    private Double price;

    /**
     * 数量
     */
    private Integer quantity;

    /**
     * 总金额
     */
    private Double amount;

    /**
     * 实付金额
     */
    private Double payAmount;

    /**
     * 折扣金额
     */
    private Double discount;

    /**
     * 支付方式ID
     */
    private Integer paymentMethodId;

    /**
     * 支付方式
     */
    private String paymentMethod;

    /**
     * 订单来源
     */
    private String source;

    /**
     * 来源ID
     */
    private Integer sourceId;

    /**
     * 订单状态：0-待支付，1-已支付，2-已取消，3-已退款，4-已完成
     */
    private Integer status;

    /**
     * 状态名称
     */
    private String statusName;

    /**
     * 状态颜色
     */
    private String statusColor;

    /**
     * 备注
     */
    private String remark;

    /**
     * 创建时间
     */
    private Date createTime;

    /**
     * 支付时间
     */
    private Date payTime;

    /**
     * 完成时间
     */
    private Date completeTime;

    /**
     * 订单日志
     */
    private List<OrderLog> logs;
}
