package com.yin.yin.model;

import lombok.Data;

/**
 * 安全设置实体类
 */
@Data
public class SecuritySetting {
    /**
     * 是否启用验证码
     */
    private Boolean captchaEnabled;

    /**
     * 是否启用IP限制
     */
    private Boolean ipRestrictionEnabled;

    /**
     * 允许的IP地址列表
     */
    private String allowedIps;

    /**
     * 是否启用密码策略
     */
    private Boolean passwordPolicyEnabled;

    /**
     * 密码最小长度
     */
    private Integer passwordMinLength;

    /**
     * 密码是否需要包含数字
     */
    private Boolean passwordRequireDigit;

    /**
     * 密码是否需要包含小写字母
     */
    private Boolean passwordRequireLowercase;

    /**
     * 密码是否需要包含大写字母
     */
    private Boolean passwordRequireUppercase;

    /**
     * 密码是否需要包含特殊字符
     */
    private Boolean passwordRequireSpecialChar;

    /**
     * 密码过期天数
     */
    private Integer passwordExpiryDays;

    /**
     * 是否启用两步验证
     */
    private Boolean twoFactorAuthEnabled;
}
