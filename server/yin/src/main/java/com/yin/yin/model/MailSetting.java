package com.yin.yin.model;

import lombok.Data;

/**
 * 邮件设置实体类
 */
@Data
public class MailSetting {
    /**
     * SMTP服务器
     */
    private String smtpServer;

    /**
     * SMTP端口
     */
    private Integer smtpPort;

    /**
     * 是否启用SSL
     */
    private Boolean sslEnabled;

    /**
     * 发件人邮箱
     */
    private String fromEmail;

    /**
     * 发件人名称
     */
    private String fromName;

    /**
     * 邮箱账号
     */
    private String username;

    /**
     * 邮箱密码
     */
    private String password;
}
