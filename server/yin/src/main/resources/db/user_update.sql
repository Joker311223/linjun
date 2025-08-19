-- 更新用户表，添加部门和职位字段
ALTER TABLE `user`
ADD COLUMN `department` varchar(100) DEFAULT NULL COMMENT '部门' AFTER `avatar`,
ADD COLUMN `position` varchar(100) DEFAULT NULL COMMENT '职位' AFTER `department`;

-- 创建超级管理员用户（如果不存在）
INSERT INTO `user` (`username`, `password`, `real_name`, `email`, `phone`, `avatar`, `department`, `position`, `status`, `roles`, `register_time`, `create_time`, `update_time`)
SELECT 'admin', 'Admin@123', '系统管理员', 'admin@example.com', '13800138000', NULL, '技术部', '系统管理员', 1, 'admin', NOW(), NOW(), NOW()
FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM `user` WHERE `username` = 'admin');

-- 获取管理员用户ID
SET @admin_id = (SELECT id FROM `user` WHERE username = 'admin' LIMIT 1);

-- 获取管理员角色ID
SET @admin_role_id = (SELECT id FROM `role` WHERE code = 'admin' LIMIT 1);

-- 为管理员用户分配管理员角色
INSERT INTO `user_role` (`user_id`, `role_id`, `create_time`)
SELECT @admin_id, @admin_role_id, NOW()
FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM `user_role` WHERE `user_id` = @admin_id AND `role_id` = @admin_role_id);

-- 创建普通用户（如果不存在）
INSERT INTO `user` (`username`, `password`, `real_name`, `email`, `phone`, `avatar`, `department`, `position`, `status`, `roles`, `register_time`, `create_time`, `update_time`)
SELECT 'user', 'User@123', '普通用户', 'user@example.com', '13900139000', NULL, '市场部', '营销专员', 1, 'user', NOW(), NOW(), NOW()
FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM `user` WHERE `username` = 'user');

-- 获取普通用户ID
SET @user_id = (SELECT id FROM `user` WHERE username = 'user' LIMIT 1);

-- 获取普通用户角色ID
SET @user_role_id = (SELECT id FROM `role` WHERE code = 'user' LIMIT 1);

-- 为普通用户分配普通用户角色
INSERT INTO `user_role` (`user_id`, `role_id`, `create_time`)
SELECT @user_id, @user_role_id, NOW()
FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM `user_role` WHERE `user_id` = @user_id AND `role_id` = @user_role_id);

-- 创建访客用户（如果不存在）
INSERT INTO `user` (`username`, `password`, `real_name`, `email`, `phone`, `avatar`, `department`, `position`, `status`, `roles`, `register_time`, `create_time`, `update_time`)
SELECT 'visitor', 'Visitor@123', '访客用户', 'visitor@example.com', '13700137000', NULL, '销售部', '访客', 1, 'visitor', NOW(), NOW(), NOW()
FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM `user` WHERE `username` = 'visitor');

-- 获取访客用户ID
SET @visitor_id = (SELECT id FROM `user` WHERE username = 'visitor' LIMIT 1);

-- 获取访客角色ID
SET @visitor_role_id = (SELECT id FROM `role` WHERE code = 'visitor' LIMIT 1);

-- 为访客用户分配访客角色
INSERT INTO `user_role` (`user_id`, `role_id`, `create_time`)
SELECT @visitor_id, @visitor_role_id, NOW()
FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM `user_role` WHERE `user_id` = @visitor_id AND `role_id` = @visitor_role_id);
