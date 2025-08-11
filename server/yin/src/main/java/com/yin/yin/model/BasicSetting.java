package com.yin.yin.model;

import lombok.Data;

/**
 * 基本设置实体类
 */
@Data
public class BasicSetting {
    /**
     * 网站名称
     */
    private String siteName;

    /**
     * 网站LOGO
     */
    private String logo;

    /**
     * 网站图标
     */
    private String favicon;

    /**
     * 网站描述
     */
    private String description;

    /**
     * 网站关键词
     */
    private String keywords;

    /**
     * 版权信息
     */
    private String copyright;

    /**
     * ICP备案号
     */
    private String icp;

    /**
     * 公安备案号
     */
    private String psr;

    /**
     * 客服电话
     */
    private String servicePhone;

    /**
     * 客服邮箱
     */
    private String serviceEmail;

    /**
     * 公司地址
     */
    private String address;
}
