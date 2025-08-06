-- 创建数据库
CREATE DATABASE IF NOT EXISTS marketing_platform DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE marketing_platform;

-- 用户表
CREATE TABLE IF NOT EXISTS `t_user` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '用户ID',
  `username` varchar(50) NOT NULL COMMENT '用户名',
  `password` varchar(100) NOT NULL COMMENT '密码',
  `real_name` varchar(50) DEFAULT NULL COMMENT '真实姓名',
  `avatar` varchar(255) DEFAULT NULL COMMENT '头像',
  `roles` varchar(255) DEFAULT NULL COMMENT '角色',
  `permissions` varchar(255) DEFAULT NULL COMMENT '权限',
  `email` varchar(100) DEFAULT NULL COMMENT '邮箱',
  `phone` varchar(20) DEFAULT NULL COMMENT '手机号',
  `department` varchar(50) DEFAULT NULL COMMENT '部门',
  `position` varchar(50) DEFAULT NULL COMMENT '职位',
  `status` tinyint(1) DEFAULT '1' COMMENT '状态：0-禁用，1-启用',
  `source` varchar(50) DEFAULT NULL COMMENT '来源',
  `order_count` int(11) DEFAULT '0' COMMENT '订单数量',
  `total_spent` decimal(10,2) DEFAULT '0.00' COMMENT '消费总额',
  `register_time` datetime DEFAULT NULL COMMENT '注册时间',
  `last_login_time` datetime DEFAULT NULL COMMENT '最后登录时间',
  `create_time` datetime DEFAULT NULL COMMENT '创建时间',
  `update_time` datetime DEFAULT NULL COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_username` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户表';

-- 套餐类型表
CREATE TABLE IF NOT EXISTS `t_package_type` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '类型ID',
  `name` varchar(50) NOT NULL COMMENT '类型名称',
  `code` varchar(50) NOT NULL COMMENT '类型编码',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_code` (`code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='套餐类型表';

-- 套餐表
CREATE TABLE IF NOT EXISTS `t_package` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '套餐ID',
  `name` varchar(100) NOT NULL COMMENT '套餐名称',
  `code` varchar(50) NOT NULL COMMENT '套餐编码',
  `type` int(11) DEFAULT NULL COMMENT '套餐类型ID',
  `type_name` varchar(50) DEFAULT NULL COMMENT '套餐类型名称',
  `description` varchar(500) DEFAULT NULL COMMENT '套餐描述',
  `price` decimal(10,2) NOT NULL COMMENT '原价',
  `discount_price` decimal(10,2) DEFAULT NULL COMMENT '折扣价',
  `features` text COMMENT '套餐特点列表',
  `content` text COMMENT '套餐内容',
  `rules` text COMMENT '套餐规则',
  `duration` int(11) DEFAULT NULL COMMENT '套餐时长',
  `duration_unit` varchar(10) DEFAULT NULL COMMENT '时长单位',
  `status` tinyint(1) DEFAULT '1' COMMENT '状态：0-下架，1-上架',
  `is_hot` tinyint(1) DEFAULT '0' COMMENT '是否热门',
  `is_recommended` tinyint(1) DEFAULT '0' COMMENT '是否推荐',
  `sales_count` int(11) DEFAULT '0' COMMENT '销售数量',
  `create_time` datetime DEFAULT NULL COMMENT '创建时间',
  `update_time` datetime DEFAULT NULL COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_code` (`code`),
  KEY `idx_type` (`type`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='套餐表';

-- 活动类型表
CREATE TABLE IF NOT EXISTS `t_campaign_type` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '类型ID',
  `name` varchar(50) NOT NULL COMMENT '类型名称',
  `code` varchar(50) NOT NULL COMMENT '类型编码',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_code` (`code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='活动类型表';

-- 活动状态表
CREATE TABLE IF NOT EXISTS `t_campaign_status` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '状态ID',
  `name` varchar(50) NOT NULL COMMENT '状态名称',
  `color` varchar(20) DEFAULT NULL COMMENT '状态颜色',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='活动状态表';

-- 活动表
CREATE TABLE IF NOT EXISTS `t_campaign` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '活动ID',
  `name` varchar(100) NOT NULL COMMENT '活动名称',
  `code` varchar(50) NOT NULL COMMENT '活动编码',
  `type` int(11) DEFAULT NULL COMMENT '活动类型ID',
  `type_name` varchar(50) DEFAULT NULL COMMENT '活动类型名称',
  `description` varchar(500) DEFAULT NULL COMMENT '活动描述',
  `rules` text COMMENT '活动规则',
  `content` text COMMENT '活动内容',
  `start_time` datetime DEFAULT NULL COMMENT '开始时间',
  `end_time` datetime DEFAULT NULL COMMENT '结束时间',
  `status` tinyint(1) DEFAULT '0' COMMENT '活动状态：0-未开始，1-进行中，2-已结束，3-已取消',
  `status_name` varchar(20) DEFAULT NULL COMMENT '活动状态名称',
  `create_user` varchar(50) DEFAULT NULL COMMENT '创建人',
  `create_time` datetime DEFAULT NULL COMMENT '创建时间',
  `update_time` datetime DEFAULT NULL COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_code` (`code`),
  KEY `idx_type` (`type`),
  KEY `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='活动表';

-- 活动关联套餐表
CREATE TABLE IF NOT EXISTS `t_campaign_package` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `campaign_id` bigint(20) NOT NULL COMMENT '活动ID',
  `package_id` bigint(20) NOT NULL COMMENT '套餐ID',
  `name` varchar(100) DEFAULT NULL COMMENT '套餐名称',
  `price` decimal(10,2) DEFAULT NULL COMMENT '原价',
  `discount_price` decimal(10,2) DEFAULT NULL COMMENT '折扣价',
  `discount` decimal(10,2) DEFAULT NULL COMMENT '折扣',
  PRIMARY KEY (`id`),
  KEY `idx_campaign_id` (`campaign_id`),
  KEY `idx_package_id` (`package_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='活动关联套餐表';

-- 订单状态表
CREATE TABLE IF NOT EXISTS `t_order_status` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '状态ID',
  `name` varchar(50) NOT NULL COMMENT '状态名称',
  `color` varchar(20) DEFAULT NULL COMMENT '状态颜色',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='订单状态表';

-- 支付方式表
CREATE TABLE IF NOT EXISTS `t_payment_method` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '支付方式ID',
  `name` varchar(50) NOT NULL COMMENT '支付方式名称',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='支付方式表';

-- 订单来源表
CREATE TABLE IF NOT EXISTS `t_order_source` (
  `id` varchar(20) NOT NULL COMMENT '来源ID',
  `name` varchar(50) NOT NULL COMMENT '来源名称',
  `color` varchar(20) DEFAULT NULL COMMENT '来源颜色',
  `icon` varchar(50) DEFAULT NULL COMMENT '来源图标',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='订单来源表';

-- 订单表
CREATE TABLE IF NOT EXISTS `t_order` (
  `id` varchar(32) NOT NULL COMMENT '订单ID',
  `order_no` varchar(32) NOT NULL COMMENT '订单编号',
  `user_id` bigint(20) DEFAULT NULL COMMENT '用户ID',
  `user_name` varchar(50) DEFAULT NULL COMMENT '用户名',
  `package_id` bigint(20) DEFAULT NULL COMMENT '套餐ID',
  `package_name` varchar(100) DEFAULT NULL COMMENT '套餐名称',
  `package_type` varchar(50) DEFAULT NULL COMMENT '套餐类型',
  `price` decimal(10,2) DEFAULT NULL COMMENT '单价',
  `quantity` int(11) DEFAULT '1' COMMENT '数量',
  `amount` decimal(10,2) DEFAULT NULL COMMENT '总金额',
  `pay_amount` decimal(10,2) DEFAULT NULL COMMENT '实付金额',
  `discount` decimal(10,2) DEFAULT '0.00' COMMENT '折扣金额',
  `payment_method_id` int(11) DEFAULT NULL COMMENT '支付方式ID',
  `payment_method` varchar(50) DEFAULT NULL COMMENT '支付方式',
  `source` varchar(50) DEFAULT NULL COMMENT '订单来源',
  `source_id` varchar(20) DEFAULT NULL COMMENT '来源ID',
  `status` tinyint(1) DEFAULT '0' COMMENT '订单状态：0-待支付，1-已支付，2-已取消，3-已退款，4-已完成',
  `status_name` varchar(20) DEFAULT NULL COMMENT '状态名称',
  `status_color` varchar(20) DEFAULT NULL COMMENT '状态颜色',
  `remark` varchar(500) DEFAULT NULL COMMENT '备注',
  `create_time` datetime DEFAULT NULL COMMENT '创建时间',
  `pay_time` datetime DEFAULT NULL COMMENT '支付时间',
  `complete_time` datetime DEFAULT NULL COMMENT '完成时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_order_no` (`order_no`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_package_id` (`package_id`),
  KEY `idx_status` (`status`),
  KEY `idx_create_time` (`create_time`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='订单表';

-- 订单日志表
CREATE TABLE IF NOT EXISTS `t_order_log` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '日志ID',
  `order_id` varchar(32) NOT NULL COMMENT '订单ID',
  `action` varchar(50) NOT NULL COMMENT '操作类型',
  `operator` varchar(50) DEFAULT NULL COMMENT '操作人',
  `operate_time` datetime DEFAULT NULL COMMENT '操作时间',
  `details` varchar(500) DEFAULT NULL COMMENT '操作详情',
  PRIMARY KEY (`id`),
  KEY `idx_order_id` (`order_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='订单日志表';
