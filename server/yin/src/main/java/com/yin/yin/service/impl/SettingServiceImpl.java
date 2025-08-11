package com.yin.yin.service.impl;

import com.yin.yin.mapper.SettingMapper;
import com.yin.yin.model.*;
import com.yin.yin.service.SettingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

/**
 * 设置服务实现类
 */
@Service
public class SettingServiceImpl implements SettingService {

    @Autowired
    private SettingMapper settingMapper;

    @Override
    public List<String> getAllSettingTypes() {
        List<String> types = new ArrayList<>();
        types.add("basic");
        types.add("mail");
        types.add("payment");
        types.add("notification");
        types.add("security");
        return types;
    }

    @Override
    public BasicSetting getBasicSetting() {
        List<Setting> settings = settingMapper.selectByType("basic");
        BasicSetting basicSetting = new BasicSetting();

        for (Setting setting : settings) {
            String key = setting.getSettingKey();
            String value = setting.getSettingValue();

            switch (key) {
                case "siteName":
                    basicSetting.setSiteName(value);
                    break;
                case "logo":
                    basicSetting.setLogo(value);
                    break;
                case "favicon":
                    basicSetting.setFavicon(value);
                    break;
                case "description":
                    basicSetting.setDescription(value);
                    break;
                case "keywords":
                    basicSetting.setKeywords(value);
                    break;
                case "copyright":
                    basicSetting.setCopyright(value);
                    break;
                case "icp":
                    basicSetting.setIcp(value);
                    break;
                case "psr":
                    basicSetting.setPsr(value);
                    break;
                case "servicePhone":
                    basicSetting.setServicePhone(value);
                    break;
                case "serviceEmail":
                    basicSetting.setServiceEmail(value);
                    break;
                case "address":
                    basicSetting.setAddress(value);
                    break;
            }
        }

        return basicSetting;
    }

    @Override
    @Transactional
    public int updateBasicSetting(BasicSetting basicSetting) {
        int result = 0;

        // 更新网站名称
        result += updateSetting("basic", "siteName", basicSetting.getSiteName());

        // 更新网站LOGO
        result += updateSetting("basic", "logo", basicSetting.getLogo());

        // 更新网站图标
        result += updateSetting("basic", "favicon", basicSetting.getFavicon());

        // 更新网站描述
        result += updateSetting("basic", "description", basicSetting.getDescription());

        // 更新网站关键词
        result += updateSetting("basic", "keywords", basicSetting.getKeywords());

        // 更新版权信息
        result += updateSetting("basic", "copyright", basicSetting.getCopyright());

        // 更新ICP备案号
        result += updateSetting("basic", "icp", basicSetting.getIcp());

        // 更新公安备案号
        result += updateSetting("basic", "psr", basicSetting.getPsr());

        // 更新客服电话
        result += updateSetting("basic", "servicePhone", basicSetting.getServicePhone());

        // 更新客服邮箱
        result += updateSetting("basic", "serviceEmail", basicSetting.getServiceEmail());

        // 更新公司地址
        result += updateSetting("basic", "address", basicSetting.getAddress());

        return result;
    }

    @Override
    public MailSetting getMailSetting() {
        List<Setting> settings = settingMapper.selectByType("mail");
        MailSetting mailSetting = new MailSetting();

        for (Setting setting : settings) {
            String key = setting.getSettingKey();
            String value = setting.getSettingValue();

            switch (key) {
                case "smtpServer":
                    mailSetting.setSmtpServer(value);
                    break;
                case "smtpPort":
                    mailSetting.setSmtpPort(value != null ? Integer.parseInt(value) : null);
                    break;
                case "sslEnabled":
                    mailSetting.setSslEnabled(value != null ? Boolean.parseBoolean(value) : false);
                    break;
                case "fromEmail":
                    mailSetting.setFromEmail(value);
                    break;
                case "fromName":
                    mailSetting.setFromName(value);
                    break;
                case "username":
                    mailSetting.setUsername(value);
                    break;
                case "password":
                    mailSetting.setPassword(value);
                    break;
            }
        }

        return mailSetting;
    }

    @Override
    @Transactional
    public int updateMailSetting(MailSetting mailSetting) {
        int result = 0;

        result += updateSetting("mail", "smtpServer", mailSetting.getSmtpServer());
        result += updateSetting("mail", "smtpPort", mailSetting.getSmtpPort() != null ? mailSetting.getSmtpPort().toString() : null);
        result += updateSetting("mail", "sslEnabled", mailSetting.getSslEnabled() != null ? mailSetting.getSslEnabled().toString() : "false");
        result += updateSetting("mail", "fromEmail", mailSetting.getFromEmail());
        result += updateSetting("mail", "fromName", mailSetting.getFromName());
        result += updateSetting("mail", "username", mailSetting.getUsername());
        result += updateSetting("mail", "password", mailSetting.getPassword());

        return result;
    }

    @Override
    public PaymentSetting getPaymentSetting() {
        List<Setting> settings = settingMapper.selectByType("payment");
        PaymentSetting paymentSetting = new PaymentSetting();

        for (Setting setting : settings) {
            String key = setting.getSettingKey();
            String value = setting.getSettingValue();

            switch (key) {
                case "alipayAppId":
                    paymentSetting.setAlipayAppId(value);
                    break;
                case "alipayPrivateKey":
                    paymentSetting.setAlipayPrivateKey(value);
                    break;
                case "alipayPublicKey":
                    paymentSetting.setAlipayPublicKey(value);
                    break;
                case "alipayEnabled":
                    paymentSetting.setAlipayEnabled(value != null ? Boolean.parseBoolean(value) : false);
                    break;
                case "wxpayMchId":
                    paymentSetting.setWxpayMchId(value);
                    break;
                case "wxpayAppId":
                    paymentSetting.setWxpayAppId(value);
                    break;
                case "wxpayKey":
                    paymentSetting.setWxpayKey(value);
                    break;
                case "wxpayEnabled":
                    paymentSetting.setWxpayEnabled(value != null ? Boolean.parseBoolean(value) : false);
                    break;
            }
        }

        return paymentSetting;
    }

    @Override
    @Transactional
    public int updatePaymentSetting(PaymentSetting paymentSetting) {
        int result = 0;

        result += updateSetting("payment", "alipayAppId", paymentSetting.getAlipayAppId());
        result += updateSetting("payment", "alipayPrivateKey", paymentSetting.getAlipayPrivateKey());
        result += updateSetting("payment", "alipayPublicKey", paymentSetting.getAlipayPublicKey());
        result += updateSetting("payment", "alipayEnabled", paymentSetting.getAlipayEnabled() != null ? paymentSetting.getAlipayEnabled().toString() : "false");
        result += updateSetting("payment", "wxpayMchId", paymentSetting.getWxpayMchId());
        result += updateSetting("payment", "wxpayAppId", paymentSetting.getWxpayAppId());
        result += updateSetting("payment", "wxpayKey", paymentSetting.getWxpayKey());
        result += updateSetting("payment", "wxpayEnabled", paymentSetting.getWxpayEnabled() != null ? paymentSetting.getWxpayEnabled().toString() : "false");

        return result;
    }

    @Override
    public NotificationSetting getNotificationSetting() {
        List<Setting> settings = settingMapper.selectByType("notification");
        NotificationSetting notificationSetting = new NotificationSetting();

        for (Setting setting : settings) {
            String key = setting.getSettingKey();
            String value = setting.getSettingValue();

            switch (key) {
                case "emailEnabled":
                    notificationSetting.setEmailEnabled(value != null ? Boolean.parseBoolean(value) : false);
                    break;
                case "smsEnabled":
                    notificationSetting.setSmsEnabled(value != null ? Boolean.parseBoolean(value) : false);
                    break;
                case "internalEnabled":
                    notificationSetting.setInternalEnabled(value != null ? Boolean.parseBoolean(value) : false);
                    break;
                case "wechatEnabled":
                    notificationSetting.setWechatEnabled(value != null ? Boolean.parseBoolean(value) : false);
                    break;
                case "orderCreatedNotify":
                    notificationSetting.setOrderCreatedNotify(value != null ? Boolean.parseBoolean(value) : false);
                    break;
                case "orderPaidNotify":
                    notificationSetting.setOrderPaidNotify(value != null ? Boolean.parseBoolean(value) : false);
                    break;
                case "orderCompletedNotify":
                    notificationSetting.setOrderCompletedNotify(value != null ? Boolean.parseBoolean(value) : false);
                    break;
                case "orderCancelledNotify":
                    notificationSetting.setOrderCancelledNotify(value != null ? Boolean.parseBoolean(value) : false);
                    break;
            }
        }

        return notificationSetting;
    }

    @Override
    @Transactional
    public int updateNotificationSetting(NotificationSetting notificationSetting) {
        int result = 0;

        result += updateSetting("notification", "emailEnabled", notificationSetting.getEmailEnabled() != null ? notificationSetting.getEmailEnabled().toString() : "false");
        result += updateSetting("notification", "smsEnabled", notificationSetting.getSmsEnabled() != null ? notificationSetting.getSmsEnabled().toString() : "false");
        result += updateSetting("notification", "internalEnabled", notificationSetting.getInternalEnabled() != null ? notificationSetting.getInternalEnabled().toString() : "false");
        result += updateSetting("notification", "wechatEnabled", notificationSetting.getWechatEnabled() != null ? notificationSetting.getWechatEnabled().toString() : "false");
        result += updateSetting("notification", "orderCreatedNotify", notificationSetting.getOrderCreatedNotify() != null ? notificationSetting.getOrderCreatedNotify().toString() : "false");
        result += updateSetting("notification", "orderPaidNotify", notificationSetting.getOrderPaidNotify() != null ? notificationSetting.getOrderPaidNotify().toString() : "false");
        result += updateSetting("notification", "orderCompletedNotify", notificationSetting.getOrderCompletedNotify() != null ? notificationSetting.getOrderCompletedNotify().toString() : "false");
        result += updateSetting("notification", "orderCancelledNotify", notificationSetting.getOrderCancelledNotify() != null ? notificationSetting.getOrderCancelledNotify().toString() : "false");

        return result;
    }

    @Override
    public SecuritySetting getSecuritySetting() {
        List<Setting> settings = settingMapper.selectByType("security");
        SecuritySetting securitySetting = new SecuritySetting();

        for (Setting setting : settings) {
            String key = setting.getSettingKey();
            String value = setting.getSettingValue();

            switch (key) {
                case "captchaEnabled":
                    securitySetting.setCaptchaEnabled(value != null ? Boolean.parseBoolean(value) : false);
                    break;
                case "ipRestrictionEnabled":
                    securitySetting.setIpRestrictionEnabled(value != null ? Boolean.parseBoolean(value) : false);
                    break;
                case "allowedIps":
                    securitySetting.setAllowedIps(value);
                    break;
                case "passwordPolicyEnabled":
                    securitySetting.setPasswordPolicyEnabled(value != null ? Boolean.parseBoolean(value) : false);
                    break;
                case "passwordMinLength":
                    securitySetting.setPasswordMinLength(value != null ? Integer.parseInt(value) : 8);
                    break;
                case "passwordRequireDigit":
                    securitySetting.setPasswordRequireDigit(value != null ? Boolean.parseBoolean(value) : false);
                    break;
                case "passwordRequireLowercase":
                    securitySetting.setPasswordRequireLowercase(value != null ? Boolean.parseBoolean(value) : false);
                    break;
                case "passwordRequireUppercase":
                    securitySetting.setPasswordRequireUppercase(value != null ? Boolean.parseBoolean(value) : false);
                    break;
                case "passwordRequireSpecialChar":
                    securitySetting.setPasswordRequireSpecialChar(value != null ? Boolean.parseBoolean(value) : false);
                    break;
                case "passwordExpiryDays":
                    securitySetting.setPasswordExpiryDays(value != null ? Integer.parseInt(value) : 90);
                    break;
                case "twoFactorAuthEnabled":
                    securitySetting.setTwoFactorAuthEnabled(value != null ? Boolean.parseBoolean(value) : false);
                    break;
            }
        }

        return securitySetting;
    }

    @Override
    @Transactional
    public int updateSecuritySetting(SecuritySetting securitySetting) {
        int result = 0;

        result += updateSetting("security", "captchaEnabled", securitySetting.getCaptchaEnabled() != null ? securitySetting.getCaptchaEnabled().toString() : "false");
        result += updateSetting("security", "ipRestrictionEnabled", securitySetting.getIpRestrictionEnabled() != null ? securitySetting.getIpRestrictionEnabled().toString() : "false");
        result += updateSetting("security", "allowedIps", securitySetting.getAllowedIps());
        result += updateSetting("security", "passwordPolicyEnabled", securitySetting.getPasswordPolicyEnabled() != null ? securitySetting.getPasswordPolicyEnabled().toString() : "false");
        result += updateSetting("security", "passwordMinLength", securitySetting.getPasswordMinLength() != null ? securitySetting.getPasswordMinLength().toString() : "8");
        result += updateSetting("security", "passwordRequireDigit", securitySetting.getPasswordRequireDigit() != null ? securitySetting.getPasswordRequireDigit().toString() : "false");
        result += updateSetting("security", "passwordRequireLowercase", securitySetting.getPasswordRequireLowercase() != null ? securitySetting.getPasswordRequireLowercase().toString() : "false");
        result += updateSetting("security", "passwordRequireUppercase", securitySetting.getPasswordRequireUppercase() != null ? securitySetting.getPasswordRequireUppercase().toString() : "false");
        result += updateSetting("security", "passwordRequireSpecialChar", securitySetting.getPasswordRequireSpecialChar() != null ? securitySetting.getPasswordRequireSpecialChar().toString() : "false");
        result += updateSetting("security", "passwordExpiryDays", securitySetting.getPasswordExpiryDays() != null ? securitySetting.getPasswordExpiryDays().toString() : "90");
        result += updateSetting("security", "twoFactorAuthEnabled", securitySetting.getTwoFactorAuthEnabled() != null ? securitySetting.getTwoFactorAuthEnabled().toString() : "false");

        return result;
    }

    @Override
    public boolean testMailSetting(MailSetting mailSetting, String testEmail) {
        // 这里实现邮件发送测试逻辑
        // 实际项目中，应该调用邮件发送服务来测试邮件配置是否正确
        try {
            // 模拟邮件发送测试
            Thread.sleep(1000);
            return true;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    @Override
    public List<Setting> getSettingsByType(String type) {
        return settingMapper.selectByType(type);
    }

    @Override
    public Map<String, String> getSettingsMapByType(String type) {
        List<Setting> settings = settingMapper.selectByType(type);
        Map<String, String> settingsMap = new HashMap<>();

        for (Setting setting : settings) {
            settingsMap.put(setting.getSettingKey(), setting.getSettingValue());
        }

        return settingsMap;
    }

    @Override
    public int updateSetting(String type, String key, String value) {
        Setting setting = settingMapper.selectByTypeAndKey(type, key);

        if (setting == null) {
            // 如果设置不存在，则创建新设置
            setting = new Setting();
            setting.setType(type);
            setting.setSettingKey(key);
            setting.setSettingValue(value);
            setting.setCreateTime(new Date());
            setting.setUpdateTime(new Date());
            return settingMapper.insert(setting);
        } else {
            // 如果设置已存在，则更新设置
            setting.setSettingValue(value);
            setting.setUpdateTime(new Date());
            return settingMapper.update(setting);
        }
    }
}
