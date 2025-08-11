-- 设置表
CREATE TABLE IF NOT EXISTS `t_setting` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '设置ID',
  `type` varchar(50) NOT NULL COMMENT '设置类型',
  `setting_key` varchar(100) NOT NULL COMMENT '设置键',
  `setting_value` text COMMENT '设置值',
  `description` varchar(255) DEFAULT NULL COMMENT '设置描述',
  `create_time` datetime NOT NULL COMMENT '创建时间',
  `update_time` datetime NOT NULL COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_type_key` (`type`, `setting_key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='系统设置表';

-- 初始化基本设置数据
INSERT INTO `t_setting` (`type`, `setting_key`, `setting_value`, `description`, `create_time`, `update_time`) VALUES
('basic', 'siteName', '营销平台', '网站名称', NOW(), NOW()),
('basic', 'logo', '/static/images/logo.png', '网站LOGO', NOW(), NOW()),
('basic', 'favicon', '/static/images/favicon.ico', '网站图标', NOW(), NOW()),
('basic', 'description', '营销平台是一个专业的营销管理系统', '网站描述', NOW(), NOW()),
('basic', 'keywords', '营销,平台,管理系统', '网站关键词', NOW(), NOW()),
('basic', 'copyright', '© 2023 营销平台 版权所有', '版权信息', NOW(), NOW()),
('basic', 'icp', '京ICP备12345678号', 'ICP备案号', NOW(), NOW()),
('basic', 'psr', '京公网安备11010102002019号', '公安备案号', NOW(), NOW()),
('basic', 'servicePhone', '400-123-4567', '客服电话', NOW(), NOW()),
('basic', 'serviceEmail', 'service@example.com', '客服邮箱', NOW(), NOW()),
('basic', 'address', '北京市朝阳区xxx大厦', '公司地址', NOW(), NOW());

-- 初始化邮件设置数据
INSERT INTO `t_setting` (`type`, `setting_key`, `setting_value`, `description`, `create_time`, `update_time`) VALUES
('mail', 'smtpServer', 'smtp.example.com', 'SMTP服务器', NOW(), NOW()),
('mail', 'smtpPort', '465', 'SMTP端口', NOW(), NOW()),
('mail', 'sslEnabled', 'true', '是否启用SSL', NOW(), NOW()),
('mail', 'fromEmail', 'noreply@example.com', '发件人邮箱', NOW(), NOW()),
('mail', 'fromName', '营销平台', '发件人名称', NOW(), NOW()),
('mail', 'username', 'noreply@example.com', '邮箱账号', NOW(), NOW()),
('mail', 'password', '123456', '邮箱密码', NOW(), NOW());

-- 初始化支付设置数据
INSERT INTO `t_setting` (`type`, `setting_key`, `setting_value`, `description`, `create_time`, `update_time`) VALUES
('payment', 'alipayAppId', '2021000000000000', '支付宝AppID', NOW(), NOW()),
('payment', 'alipayPrivateKey', 'MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC...', '支付宝私钥', NOW(), NOW()),
('payment', 'alipayPublicKey', 'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA...', '支付宝公钥', NOW(), NOW()),
('payment', 'alipayEnabled', 'true', '支付宝是否启用', NOW(), NOW()),
('payment', 'wxpayMchId', '1900000000', '微信支付商户ID', NOW(), NOW()),
('payment', 'wxpayAppId', 'wx8888888888888888', '微信支付AppID', NOW(), NOW()),
('payment', 'wxpayKey', 'abcdefghijklmnopqrstuvwxyz123456', '微信支付密钥', NOW(), NOW()),
('payment', 'wxpayEnabled', 'true', '微信支付是否启用', NOW(), NOW());

-- 初始化通知设置数据
INSERT INTO `t_setting` (`type`, `setting_key`, `setting_value`, `description`, `create_time`, `update_time`) VALUES
('notification', 'emailEnabled', 'true', '是否启用邮件通知', NOW(), NOW()),
('notification', 'smsEnabled', 'true', '是否启用短信通知', NOW(), NOW()),
('notification', 'internalEnabled', 'true', '是否启用站内通知', NOW(), NOW()),
('notification', 'wechatEnabled', 'false', '是否启用微信通知', NOW(), NOW()),
('notification', 'orderCreatedNotify', 'true', '订单创建通知', NOW(), NOW()),
('notification', 'orderPaidNotify', 'true', '订单支付通知', NOW(), NOW()),
('notification', 'orderCompletedNotify', 'true', '订单完成通知', NOW(), NOW()),
('notification', 'orderCancelledNotify', 'true', '订单取消通知', NOW(), NOW());

-- 初始化安全设置数据
INSERT INTO `t_setting` (`type`, `setting_key`, `setting_value`, `description`, `create_time`, `update_time`) VALUES
('security', 'captchaEnabled', 'true', '是否启用验证码', NOW(), NOW()),
('security', 'ipRestrictionEnabled', 'false', '是否启用IP限制', NOW(), NOW()),
('security', 'allowedIps', '127.0.0.1,192.168.1.1', '允许的IP地址列表', NOW(), NOW()),
('security', 'passwordPolicyEnabled', 'true', '是否启用密码策略', NOW(), NOW()),
('security', 'passwordMinLength', '8', '密码最小长度', NOW(), NOW()),
('security', 'passwordRequireDigit', 'true', '密码是否需要包含数字', NOW(), NOW()),
('security', 'passwordRequireLowercase', 'true', '密码是否需要包含小写字母', NOW(), NOW()),
('security', 'passwordRequireUppercase', 'true', '密码是否需要包含大写字母', NOW(), NOW()),
('security', 'passwordRequireSpecialChar', 'false', '密码是否需要包含特殊字符', NOW(), NOW()),
('security', 'passwordExpiryDays', '90', '密码过期天数', NOW(), NOW()),
('security', 'twoFactorAuthEnabled', 'false', '是否启用两步验证', NOW(), NOW());
