package com.yin.yin.service;

import com.yin.yin.model.*;

import java.util.List;
import java.util.Map;

/**
 * 设置服务接口
 */
public interface SettingService {
    /**
     * 获取所有设置类型
     */
    List<String> getAllSettingTypes();

    /**
     * 获取基本设置
     */
    BasicSetting getBasicSetting();

    /**
     * 更新基本设置
     */
    int updateBasicSetting(BasicSetting basicSetting);

    /**
     * 获取邮件设置
     */
    MailSetting getMailSetting();

    /**
     * 更新邮件设置
     */
    int updateMailSetting(MailSetting mailSetting);

    /**
     * 获取支付设置
     */
    PaymentSetting getPaymentSetting();

    /**
     * 更新支付设置
     */
    int updatePaymentSetting(PaymentSetting paymentSetting);

    /**
     * 获取通知设置
     */
    NotificationSetting getNotificationSetting();

    /**
     * 更新通知设置
     */
    int updateNotificationSetting(NotificationSetting notificationSetting);

    /**
     * 获取安全设置
     */
    SecuritySetting getSecuritySetting();

    /**
     * 更新安全设置
     */
    int updateSecuritySetting(SecuritySetting securitySetting);

    /**
     * 测试邮件设置
     */
    boolean testMailSetting(MailSetting mailSetting, String testEmail);

    /**
     * 根据类型获取设置列表
     */
    List<Setting> getSettingsByType(String type);

    /**
     * 根据类型获取设置Map
     */
    Map<String, String> getSettingsMapByType(String type);

    /**
     * 更新设置
     */
    int updateSetting(String type, String key, String value);
}
