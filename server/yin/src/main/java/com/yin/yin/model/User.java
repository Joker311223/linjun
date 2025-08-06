package com.yin.yin.model;

import lombok.Data;

import java.util.Date;

/**
 * 用户实体类
 */
@Data
public class User {
    /**
     * 用户ID
     */
    private Long id;

    /**
     * 用户名
     */
    private String username;

    /**
     * 密码
     */
    private String password;

    /**
     * 真实姓名
     */
    private String realName;

    /**
     * 头像
     */
    private String avatar;

    /**
     * 角色
     */
    private String roles;

    /**
     * 权限
     */
    private String permissions;

    /**
     * 邮箱
     */
    private String email;

    /**
     * 手机号
     */
    private String phone;

    /**
     * 部门
     */
    private String department;

    /**
     * 职位
     */
    private String position;

    /**
     * 状态：0-禁用，1-启用
     */
    private Integer status;

    /**
     * 来源
     */
    private String source;

    /**
     * 订单数量
     */
    private Integer orderCount;

    /**
     * 消费总额
     */
    private Double totalSpent;

    /**
     * 注册时间
     */
    private Date registerTime;

    /**
     * 最后登录时间
     */
    private Date lastLoginTime;

    /**
     * 创建时间
     */
    private Date createTime;

    /**
     * 更新时间
     */
    private Date updateTime;
}
