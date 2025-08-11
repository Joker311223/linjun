package com.yin.yin.controller;

import com.yin.yin.common.Result;
import com.yin.yin.model.*;
import com.yin.yin.service.SettingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * 设置控制器
 */
@RestController
@RequestMapping("/api/settings")
public class SettingController {

    @Autowired
    private SettingService settingService;

    /**
     * 获取所有设置类型
     */
    @GetMapping
    public Result<?> getAllSettingTypes() {
        List<String> types = settingService.getAllSettingTypes();
        return Result.success(types);
    }

    /**
     * 获取基本设置
     */
    @GetMapping("/basic")
    public Result<?> getBasicSetting() {
        BasicSetting basicSetting = settingService.getBasicSetting();
        return Result.success(basicSetting);
    }

    /**
     * 更新基本设置
     */
    @PostMapping("/basic")
    public Result<?> updateBasicSetting(@RequestBody BasicSetting basicSetting) {
        int result = settingService.updateBasicSetting(basicSetting);
        if (result > 0) {
            return Result.success(null, "更新成功");
        } else {
            return Result.failed("更新失败");
        }
    }

    /**
     * 获取邮件设置
     */
    @GetMapping("/mail")
    public Result<?> getMailSetting() {
        MailSetting mailSetting = settingService.getMailSetting();
        return Result.success(mailSetting);
    }

    /**
     * 更新邮件设置
     */
    @PostMapping("/mail")
    public Result<?> updateMailSetting(@RequestBody MailSetting mailSetting) {
        int result = settingService.updateMailSetting(mailSetting);
        if (result > 0) {
            return Result.success(null, "更新成功");
        } else {
            return Result.failed("更新失败");
        }
    }

    /**
     * 测试邮件设置
     */
    @PostMapping("/mail/test")
    public Result<?> testMailSetting(@RequestBody Map<String, Object> params) {
        MailSetting mailSetting = settingService.getMailSetting();
        String testEmail = (String) params.get("email");

        boolean success = settingService.testMailSetting(mailSetting, testEmail);
        if (success) {
            return Result.success(null, "测试邮件发送成功");
        } else {
            return Result.failed("测试邮件发送失败");
        }
    }

    /**
     * 获取支付设置
     */
    @GetMapping("/payment")
    public Result<?> getPaymentSetting() {
        PaymentSetting paymentSetting = settingService.getPaymentSetting();
        return Result.success(paymentSetting);
    }

    /**
     * 更新支付设置
     */
    @PostMapping("/payment")
    public Result<?> updatePaymentSetting(@RequestBody PaymentSetting paymentSetting) {
        int result = settingService.updatePaymentSetting(paymentSetting);
        if (result > 0) {
            return Result.success(null, "更新成功");
        } else {
            return Result.failed("更新失败");
        }
    }

    /**
     * 获取通知设置
     */
    @GetMapping("/notification")
    public Result<?> getNotificationSetting() {
        NotificationSetting notificationSetting = settingService.getNotificationSetting();
        return Result.success(notificationSetting);
    }

    /**
     * 更新通知设置
     */
    @PostMapping("/notification")
    public Result<?> updateNotificationSetting(@RequestBody NotificationSetting notificationSetting) {
        int result = settingService.updateNotificationSetting(notificationSetting);
        if (result > 0) {
            return Result.success(null, "更新成功");
        } else {
            return Result.failed("更新失败");
        }
    }

    /**
     * 获取安全设置
     */
    @GetMapping("/security")
    public Result<?> getSecuritySetting() {
        SecuritySetting securitySetting = settingService.getSecuritySetting();
        return Result.success(securitySetting);
    }

    /**
     * 更新安全设置
     */
    @PostMapping("/security")
    public Result<?> updateSecuritySetting(@RequestBody SecuritySetting securitySetting) {
        int result = settingService.updateSecuritySetting(securitySetting);
        if (result > 0) {
            return Result.success(null, "更新成功");
        } else {
            return Result.failed("更新失败");
        }
    }

    /**
     * 获取指定类型的设置
     */
    @GetMapping("/{type}")
    public Result<?> getSettingsByType(@PathVariable String type) {
        List<Setting> settings = settingService.getSettingsByType(type);
        return Result.success(settings);
    }

    /**
     * 获取指定类型的设置（Map格式）
     */
    @GetMapping("/{type}/map")
    public Result<?> getSettingsMapByType(@PathVariable String type) {
        Map<String, String> settingsMap = settingService.getSettingsMapByType(type);
        return Result.success(settingsMap);
    }

    /**
     * 更新设置
     */
    @PutMapping("/{type}/{key}")
    public Result<?> updateSetting(
            @PathVariable String type,
            @PathVariable String key,
            @RequestParam String value) {
        int result = settingService.updateSetting(type, key, value);
        if (result > 0) {
            return Result.success(null, "更新成功");
        } else {
            return Result.failed("更新失败");
        }
    }
}
