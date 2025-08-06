USE marketing_platform;

-- 初始化用户数据
INSERT INTO `t_user` (`id`, `username`, `password`, `real_name`, `avatar`, `roles`, `permissions`, `email`, `phone`, `department`, `position`, `status`, `source`, `register_time`, `create_time`, `update_time`)
VALUES
(1, 'admin', 'admin123', '管理员', 'https://via.placeholder.com/100x100.png?text=Admin', 'admin', '*:*:*', 'admin@example.com', '13800138000', '营销部', '部门经理', 1, '官网', '2025-07-21 10:00:00', '2025-07-21 10:00:00', '2025-07-21 10:00:00');

-- 初始化套餐类型数据
INSERT INTO `t_package_type` (`id`, `name`, `code`)
VALUES
(1, '小米蓝牙耳机', 'XIAOMI_EARPHONE'),
(2, '小米手环', 'XIAOMI_BAND'),
(3, '小米移动电源', 'XIAOMI_POWER'),
(4, 'AUN 迷你投影仪', 'AUN_PROJECTOR'),
(5, '小米路由器', 'XIAOMI_ROUTER'),
(6, 'Redmi AirDots', 'REDMI_AIRDOTS'),
(7, '小爱音箱', 'XIAOMI_SPEAKER'),
(8, '米家智能床灯', 'MIJIA_LIGHT'),
(9, '米家智能台灯', 'MIJIA_DESK_LIGHT'),
(10, '小米无线充电器', 'XIAOMI_CHARGER');

-- 初始化套餐数据
INSERT INTO `t_package` (`id`, `name`, `code`, `type`, `type_name`, `description`, `price`, `discount_price`, `features`, `content`, `rules`, `duration`, `duration_unit`, `status`, `is_hot`, `is_recommended`, `sales_count`, `create_time`, `update_time`)
VALUES
(1, '小米蓝牙耳机 Air2 青春版', 'XIAOMI_EARPHONE_A2YOUTH', 1, '小米蓝牙耳机', '入耳式设计，支持蓝牙5.0，适合日常音乐播放和通话，性价比高。', 199.00, 179.00, '入耳式设计,支持蓝牙5.0,适合日常音乐播放和通话,性价比高', '小米蓝牙耳机 Air2 青春版是小米推出的一款性价比极高的蓝牙耳机，采用入耳式设计，支持蓝牙5.0，音质清晰，通话稳定，续航时间长，适合日常使用。', '产品保修期为1年，电池保修期为6个月。\n非人为损坏可享受免费保修服务。\n请保留好购买凭证和包装。', 12, '月', 1, 1, 1, 1258, '2025-07-21 10:00:00', '2025-07-21 10:00:00'),
(2, '小米手环 4', 'XIAOMI_BAND_4', 2, '小米手环', '彩色大屏，支持心率监测，运动追踪，睡眠监测，续航20天，适合运动。', 299.00, 279.00, '彩色大屏,支持心率监测,运动追踪,睡眠监测,续航20天,适合运动', '小米手环4采用0.95英寸AMOLED彩色触摸屏，支持心率监测、运动追踪、睡眠监测等功能，续航时间长达20天，防水深度达50米，是运动健身的理想伴侣。', '产品保修期为1年。\n非人为损坏可享受免费保修服务。\n请保留好购买凭证和包装。', 12, '月', 1, 1, 1, 2356, '2025-07-21 10:00:00', '2025-07-21 10:00:00'),
(3, '小米移动电源 3', 'XIAOMI_POWER_3', 3, '小米移动电源', '通用分体式，多容量可选，支持快充，方便外出手机紧急充电。', 79.00, 69.00, '通用分体式,多容量可选,支持快充,方便外出手机紧急充电', '小米移动电源3采用高密度锂聚合物电芯，支持双向快充，兼容多种设备，是出行必备的充电神器。', '产品保修期为6个月。\n非人为损坏可享受免费保修服务。\n请保留好购买凭证和包装。', 6, '月', 1, 0, 1, 3567, '2025-07-21 10:00:00', '2025-07-21 10:00:00'),
(4, 'AUN 迷你投影仪', 'AUN_PROJECTOR_MINI', 4, 'AUN 迷你投影仪', '体积小巧，支持无线投影，适用于家庭娱乐，投影效果清晰。', 300.00, 280.00, '体积小巧,支持无线投影,适用于家庭娱乐,投影效果清晰', 'AUN迷你投影仪采用先进的LED光源技术，支持1080P高清投影，内置多媒体系统，可连接手机、电脑等设备，是家庭影院的理想选择。', '产品保修期为1年。\n非人为损坏可享受免费保修服务。\n请保留好购买凭证和包装。', 12, '月', 1, 0, 0, 987, '2025-07-21 10:00:00', '2025-07-21 10:00:00'),
(5, '小米路由器 4A', 'XIAOMI_ROUTER_4A', 5, '小米路由器', '双频（2.4GHz/5GHz），4根天线，信号稳定，覆盖范围广，满足家庭网络需求。', 79.00, 69.00, '双频（2.4GHz/5GHz）,4根天线,信号稳定,覆盖范围广,满足家庭网络需求', '小米路由器4A采用四天线设计，支持双频并发，覆盖范围更广，穿墙能力更强，适合家庭使用。', '产品保修期为1年。\n非人为损坏可享受免费保修服务。\n请保留好购买凭证和包装。', 12, '月', 1, 0, 0, 1456, '2025-07-21 10:00:00', '2025-07-21 10:00:00');

-- 初始化活动类型数据
INSERT INTO `t_campaign_type` (`id`, `name`, `code`)
VALUES
(1, '限时折扣', 'DISCOUNT'),
(2, '满减活动', 'FULLCUT'),
(3, '新用户专享', 'NEWUSER'),
(4, '老用户回馈', 'OLDUSER'),
(5, '节日特惠', 'HOLIDAY');

-- 初始化活动状态数据
INSERT INTO `t_campaign_status` (`id`, `name`, `color`)
VALUES
(0, '未开始', 'default'),
(1, '进行中', 'success'),
(2, '已结束', 'warning'),
(3, '已取消', 'error');

-- 初始化活动数据
INSERT INTO `t_campaign` (`id`, `name`, `code`, `type`, `type_name`, `description`, `rules`, `content`, `start_time`, `end_time`, `status`, `status_name`, `create_user`, `create_time`, `update_time`)
VALUES
(1, '限时折扣活动1', 'DISCOUNT_ABC123', 1, '限时折扣', '全场8.5折', '活动期间，所有套餐8.5折优惠\n每个用户限购一次\n不与其他优惠同享', '限时折扣活动，全场8.5折，快来抢购吧！', '2025-08-01 00:00:00', '2025-08-31 23:59:59', 0, '未开始', '管理员', '2025-07-21 10:00:00', '2025-07-21 10:00:00'),
(2, '新用户专享活动1', 'NEWUSER_DEF456', 3, '新用户专享', '新用户专享优惠', '活动仅限新注册用户参与\n注册后7天内有效\n每个用户限参与一次', '新用户专享优惠，注册即可享受特惠价格！', '2025-08-01 00:00:00', '2025-09-30 23:59:59', 0, '未开始', '管理员', '2025-07-21 10:00:00', '2025-07-21 10:00:00');

-- 初始化活动关联套餐数据
INSERT INTO `t_campaign_package` (`campaign_id`, `package_id`, `name`, `price`, `discount_price`, `discount`)
VALUES
(1, 1, '小米蓝牙耳机 Air2 青春版', 199.00, 169.15, 8.5),
(1, 2, '小米手环 4', 299.00, 254.15, 8.5),
(1, 3, '小米移动电源 3', 79.00, 67.15, 8.5),
(2, 1, '小米蓝牙耳机 Air2 青春版', 199.00, 149.00, 7.5),
(2, 2, '小米手环 4', 299.00, 224.25, 7.5);

-- 初始化订单状态数据
INSERT INTO `t_order_status` (`id`, `name`, `color`)
VALUES
(0, '待支付', 'warning'),
(1, '已支付', 'success'),
(2, '已取消', 'default'),
(3, '已退款', 'error'),
(4, '已完成', 'processing');

-- 初始化支付方式数据
INSERT INTO `t_payment_method` (`id`, `name`)
VALUES
(1, '微信支付'),
(2, '支付宝'),
(3, '银行卡'),
(4, '余额支付');

-- 初始化订单来源数据
INSERT INTO `t_order_source` (`id`, `name`, `color`, `icon`)
VALUES
('douyin', '抖音', 'volcano', 'douyin'),
('wechat', '微信', 'green', 'wechat'),
('taobao', '淘宝', 'orange', 'taobao'),
('xiaohongshu', '小红书', 'red', 'xiaohongshu'),
('other', '其他渠道', 'default', 'other');

-- 初始化订单数据
INSERT INTO `t_order` (`id`, `order_no`, `user_id`, `user_name`, `package_id`, `package_name`, `package_type`, `price`, `quantity`, `amount`, `pay_amount`, `discount`, `payment_method_id`, `payment_method`, `source`, `source_id`, `status`, `status_name`, `status_color`, `create_time`, `pay_time`, `complete_time`)
VALUES
('ORD123456789012345678901234567890', 'ORD202507210001', 1, '管理员', 1, '小米蓝牙耳机 Air2 青春版', '小米蓝牙耳机', 199.00, 1, 199.00, 179.00, 20.00, 1, '微信支付', '官网', 'other', 1, '已支付', 'success', '2025-07-21 10:30:00', '2025-07-21 10:35:00', NULL),
('ORD123456789012345678901234567891', 'ORD202507210002', 1, '管理员', 2, '小米手环 4', '小米手环', 299.00, 1, 299.00, 279.00, 20.00, 2, '支付宝', '官网', 'other', 4, '已完成', 'processing', '2025-07-21 11:00:00', '2025-07-21 11:05:00', '2025-07-21 11:10:00');

-- 初始化订单日志数据
INSERT INTO `t_order_log` (`order_id`, `action`, `operator`, `operate_time`, `details`)
VALUES
('ORD123456789012345678901234567890', '创建订单', '系统', '2025-07-21 10:30:00', '用户通过官网创建订单'),
('ORD123456789012345678901234567890', '支付订单', '管理员', '2025-07-21 10:35:00', '用户通过微信支付支付订单'),
('ORD123456789012345678901234567891', '创建订单', '系统', '2025-07-21 11:00:00', '用户通过官网创建订单'),
('ORD123456789012345678901234567891', '支付订单', '管理员', '2025-07-21 11:05:00', '用户通过支付宝支付订单'),
('ORD123456789012345678901234567891', '完成订单', '系统', '2025-07-21 11:10:00', '订单服务已完成');
