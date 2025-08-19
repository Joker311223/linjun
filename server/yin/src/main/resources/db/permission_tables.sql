-- 创建权限表
CREATE TABLE IF NOT EXISTS `permission` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '权限ID',
  `name` varchar(100) NOT NULL COMMENT '权限名称',
  `code` varchar(100) NOT NULL COMMENT '权限编码',
  `type` tinyint(4) NOT NULL DEFAULT '1' COMMENT '权限类型：1-菜单，2-按钮',
  `path` varchar(200) DEFAULT NULL COMMENT '权限路径',
  `parent_id` bigint(20) DEFAULT NULL COMMENT '父权限ID',
  `sort` int(11) DEFAULT '0' COMMENT '排序',
  `icon` varchar(100) DEFAULT NULL COMMENT '图标',
  `status` tinyint(4) NOT NULL DEFAULT '1' COMMENT '状态：0-禁用，1-启用',
  `description` varchar(500) DEFAULT NULL COMMENT '描述',
  `create_time` datetime DEFAULT NULL COMMENT '创建时间',
  `update_time` datetime DEFAULT NULL COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_code` (`code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='权限表';

-- 创建角色表
CREATE TABLE IF NOT EXISTS `role` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '角色ID',
  `name` varchar(100) NOT NULL COMMENT '角色名称',
  `code` varchar(100) NOT NULL COMMENT '角色编码',
  `status` tinyint(4) NOT NULL DEFAULT '1' COMMENT '状态：0-禁用，1-启用',
  `description` varchar(500) DEFAULT NULL COMMENT '描述',
  `create_time` datetime DEFAULT NULL COMMENT '创建时间',
  `update_time` datetime DEFAULT NULL COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_code` (`code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='角色表';

-- 创建用户角色关联表
CREATE TABLE IF NOT EXISTS `user_role` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `user_id` bigint(20) NOT NULL COMMENT '用户ID',
  `role_id` bigint(20) NOT NULL COMMENT '角色ID',
  `create_time` datetime DEFAULT NULL COMMENT '创建时间',
  PRIMARY KEY (`id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_role_id` (`role_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户角色关联表';

-- 创建角色权限关联表
CREATE TABLE IF NOT EXISTS `role_permission` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `role_id` bigint(20) NOT NULL COMMENT '角色ID',
  `permission_id` bigint(20) NOT NULL COMMENT '权限ID',
  `create_time` datetime DEFAULT NULL COMMENT '创建时间',
  PRIMARY KEY (`id`),
  KEY `idx_role_id` (`role_id`),
  KEY `idx_permission_id` (`permission_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='角色权限关联表';

-- 插入初始角色数据
INSERT INTO `role` (`name`, `code`, `status`, `description`, `create_time`, `update_time`) VALUES
('超级管理员', 'admin', 1, '系统超级管理员，拥有所有权限', NOW(), NOW()),
('普通用户', 'user', 1, '普通用户，拥有基本权限', NOW(), NOW()),
('访客', 'visitor', 1, '访客，只有查看权限', NOW(), NOW());

-- 插入初始权限数据
-- 仪表盘权限
INSERT INTO `permission` (`name`, `code`, `type`, `path`, `parent_id`, `sort`, `icon`, `status`, `description`, `create_time`, `update_time`) VALUES
('仪表盘查看', 'dashboard:view', 1, '/', NULL, 1, 'dashboard', 1, '查看仪表盘', NOW(), NOW());

-- 套餐管理权限
INSERT INTO `permission` (`name`, `code`, `type`, `path`, `parent_id`, `sort`, `icon`, `status`, `description`, `create_time`, `update_time`) VALUES
('套餐管理', 'packages:view', 1, '/packages', NULL, 2, 'appstore', 1, '套餐管理菜单', NOW(), NOW()),
('套餐列表', 'packages:list', 1, '/packages/list', NULL, 3, NULL, 1, '查看套餐列表', NOW(), NOW()),
('创建套餐', 'packages:create', 1, '/packages/create', NULL, 4, NULL, 1, '创建新套餐', NOW(), NOW()),
('编辑套餐', 'packages:edit', 1, '/packages/edit', NULL, 5, NULL, 1, '编辑套餐', NOW(), NOW()),
('套餐详情', 'packages:detail', 1, '/packages/detail', NULL, 6, NULL, 1, '查看套餐详情', NOW(), NOW());

-- 营销活动权限
INSERT INTO `permission` (`name`, `code`, `type`, `path`, `parent_id`, `sort`, `icon`, `status`, `description`, `create_time`, `update_time`) VALUES
('营销活动', 'campaigns:view', 1, '/campaigns', NULL, 7, 'shopping-cart', 1, '营销活动菜单', NOW(), NOW()),
('活动列表', 'campaigns:list', 1, '/campaigns/list', NULL, 8, NULL, 1, '查看活动列表', NOW(), NOW()),
('创建活动', 'campaigns:create', 1, '/campaigns/create', NULL, 9, NULL, 1, '创建新活动', NOW(), NOW()),
('编辑活动', 'campaigns:edit', 1, '/campaigns/edit', NULL, 10, NULL, 1, '编辑活动', NOW(), NOW()),
('活动详情', 'campaigns:detail', 1, '/campaigns/detail', NULL, 11, NULL, 1, '查看活动详情', NOW(), NOW());

-- 订单管理权限
INSERT INTO `permission` (`name`, `code`, `type`, `path`, `parent_id`, `sort`, `icon`, `status`, `description`, `create_time`, `update_time`) VALUES
('订单管理', 'orders:view', 1, '/orders', NULL, 12, 'shopping-cart', 1, '订单管理菜单', NOW(), NOW()),
('订单列表', 'orders:list', 1, '/orders/list', NULL, 13, NULL, 1, '查看订单列表', NOW(), NOW()),
('创建订单', 'orders:create', 1, '/orders/create', NULL, 14, NULL, 1, '创建新订单', NOW(), NOW()),
('订单详情', 'orders:detail', 1, '/orders/detail', NULL, 15, NULL, 1, '查看订单详情', NOW(), NOW()),
('订单统计', 'orders:statistics', 1, '/orders/statistics', NULL, 16, NULL, 1, '查看订单统计', NOW(), NOW());

-- 订单来源权限
INSERT INTO `permission` (`name`, `code`, `type`, `path`, `parent_id`, `sort`, `icon`, `status`, `description`, `create_time`, `update_time`) VALUES
('订单来源', 'sources:view', 1, '/sources', NULL, 17, 'shop', 1, '订单来源菜单', NOW(), NOW()),
('抖音来源', 'sources:douyin', 1, '/sources/douyin', NULL, 18, NULL, 1, '查看抖音来源', NOW(), NOW()),
('微信来源', 'sources:wechat', 1, '/sources/wechat', NULL, 19, NULL, 1, '查看微信来源', NOW(), NOW()),
('淘宝来源', 'sources:taobao', 1, '/sources/taobao', NULL, 20, NULL, 1, '查看淘宝来源', NOW(), NOW()),
('小红书来源', 'sources:xiaohongshu', 1, '/sources/xiaohongshu', NULL, 21, NULL, 1, '查看小红书来源', NOW(), NOW()),
('其他来源', 'sources:other', 1, '/sources/other', NULL, 22, NULL, 1, '查看其他来源', NOW(), NOW());

-- 用户管理权限
INSERT INTO `permission` (`name`, `code`, `type`, `path`, `parent_id`, `sort`, `icon`, `status`, `description`, `create_time`, `update_time`) VALUES
('用户管理', 'users:view', 1, '/users', NULL, 23, 'user', 1, '用户管理菜单', NOW(), NOW()),
('用户列表', 'users:list', 1, '/users/list', NULL, 24, NULL, 1, '查看用户列表', NOW(), NOW()),
('用户详情', 'users:detail', 1, '/users/detail', NULL, 25, NULL, 1, '查看用户详情', NOW(), NOW()),
('用户统计', 'users:statistics', 1, '/users/statistics', NULL, 26, NULL, 1, '查看用户统计', NOW(), NOW());

-- 系统设置权限
INSERT INTO `permission` (`name`, `code`, `type`, `path`, `parent_id`, `sort`, `icon`, `status`, `description`, `create_time`, `update_time`) VALUES
('系统设置', 'system:settings', 1, '/settings', NULL, 27, 'setting', 1, '系统设置菜单', NOW(), NOW());

-- 为超级管理员角色分配所有权限
INSERT INTO `permission` (`name`, `code`, `type`, `path`, `parent_id`, `sort`, `icon`, `status`, `description`, `create_time`, `update_time`) VALUES
('所有权限', '*:*:*', 1, NULL, NULL, 0, NULL, 1, '所有权限', NOW(), NOW());

-- 获取超级管理员角色ID
SET @admin_role_id = (SELECT id FROM `role` WHERE code = 'admin' LIMIT 1);

-- 获取所有权限ID
SET @all_permission_id = (SELECT id FROM `permission` WHERE code = '*:*:*' LIMIT 1);

-- 为超级管理员角色分配所有权限
INSERT INTO `role_permission` (`role_id`, `permission_id`, `create_time`) VALUES
(@admin_role_id, @all_permission_id, NOW());

-- 为普通用户角色分配基本权限
SET @user_role_id = (SELECT id FROM `role` WHERE code = 'user' LIMIT 1);

-- 获取基本权限ID
SET @dashboard_view_id = (SELECT id FROM `permission` WHERE code = 'dashboard:view' LIMIT 1);
SET @packages_list_id = (SELECT id FROM `permission` WHERE code = 'packages:list' LIMIT 1);
SET @campaigns_list_id = (SELECT id FROM `permission` WHERE code = 'campaigns:list' LIMIT 1);
SET @orders_list_id = (SELECT id FROM `permission` WHERE code = 'orders:list' LIMIT 1);

-- 为普通用户角色分配基本权限
INSERT INTO `role_permission` (`role_id`, `permission_id`, `create_time`) VALUES
(@user_role_id, @dashboard_view_id, NOW()),
(@user_role_id, @packages_list_id, NOW()),
(@user_role_id, @campaigns_list_id, NOW()),
(@user_role_id, @orders_list_id, NOW());

-- 为访客角色分配只读权限
SET @visitor_role_id = (SELECT id FROM `role` WHERE code = 'visitor' LIMIT 1);

-- 为访客角色分配只读权限
INSERT INTO `role_permission` (`role_id`, `permission_id`, `create_time`) VALUES
(@visitor_role_id, @dashboard_view_id, NOW());
