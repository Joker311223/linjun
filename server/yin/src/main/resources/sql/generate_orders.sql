-- TODO 还需要处理
-- 生成更多订单数据的SQL脚本
-- 基于图片中的商品信息生成订单

-- 清空现有订单数据（谨慎使用）
-- TRUNCATE TABLE t_order;
-- TRUNCATE TABLE t_order_log;

-- 确保订单状态表有数据
INSERT IGNORE INTO t_order_status (id, name, color) VALUES
(0, '待支付', '#FFA500'),
(1, '已支付', '#52C41A'),
(2, '已取消', '#FF4D4F'),
(3, '已退款', '#1890FF'),
(4, '已完成', '#52C41A');

-- 确保支付方式表有数据
INSERT IGNORE INTO t_payment_method (id, name, icon) VALUES
(1, '微信支付', 'wechat'),
(2, '支付宝', 'alipay'),
(3, '银行卡', 'bank-card');

-- 确保订单来源表有数据
INSERT IGNORE INTO t_order_source (id, name, color, icon) VALUES
('douyin', '抖音', '#FF0050', 'douyin'),
('wechat', '微信', '#07C160', 'wechat'),
('taobao', '淘宝', '#FF6A00', 'taobao'),
('xiaohongshu', '小红书', '#FF2442', 'xiaohongshu'),
('website', '官网', '#1890FF', 'global'),
('other', '其他', '#8C8C8C', 'ellipsis');

-- 确保套餐类型表有数据
INSERT IGNORE INTO t_package_type (id, name, code) VALUES
(1, '基础套餐', 'basic'),
(2, '高级套餐', 'premium'),
(3, '专业套餐', 'professional'),
(4, '企业套餐', 'enterprise');

-- 确保套餐表有数据（基于图片中的商品）
INSERT IGNORE INTO t_package (id, name, code, type, description, price, discount_price, features, content, rules, duration, duration_unit, status, is_hot, is_recommended, sales_count, create_time, update_time) VALUES
(1, '小米蓝牙耳机 AirDots 青春版', 'xiaomi-airdots', 1, '入耳式设计，支持蓝牙连接，适合日常音乐播放和通话', 199, 199, '入耳式设计,蓝牙连接,轻巧便携', '包含耳机一对，充电盒一个，说明书一份', '保修一年', 12, '月', 1, 1, 1, 0, NOW(), NOW()),
(2, '小米手环 4', 'xiaomi-band-4', 2, '彩色大屏，支持 50 米防水、心率监测、睡眠监测，续航 20 天', 299, 299, '彩色大屏,50米防水,心率监测,睡眠监测', '包含手环一个，充电器一个，说明书一份', '保修一年', 12, '月', 1, 1, 1, 0, NOW(), NOW()),
(3, '小米移动电源 3', 'xiaomi-powerbank-3', 1, '通用分体式，多容量可选，支持快充，方便外出为手机等设备充电', 79, 79, '通用分体式,多容量可选,支持快充', '包含移动电源一个，充电线一根，说明书一份', '保修一年', 12, '月', 1, 0, 0, 0, NOW(), NOW()),
(4, 'AUN 迷你投影仪', 'aun-projector', 3, '体积小巧，支持高清投影，适用于家庭娱乐和简单商务演示', 300, 300, '体积小巧,高清投影,家庭娱乐', '包含投影仪一台，电源适配器一个，遥控器一个，说明书一份', '保修一年', 12, '月', 1, 0, 0, 0, NOW(), NOW()),
(5, '小米路由器 4A', 'xiaomi-router-4a', 1, '双频（2.4GHz/5GHz），4 根天线，信号稳定，覆盖范围广，满足家庭网络需求', 79, 79, '双频,4根天线,信号稳定,覆盖范围广', '包含路由器一台，电源适配器一个，网线一根，说明书一份', '保修一年', 12, '月', 1, 0, 0, 0, NOW(), NOW()),
(6, 'Redmi AirDots', 'redmi-airdots', 1, '真无线设计，蓝牙 5.0，支持双边通话和语音助手功能，搭配充电盒使用', 99.9, 99.9, '真无线设计,蓝牙5.0,双边通话', '包含耳机一对，充电盒一个，说明书一份', '保修一年', 12, '月', 1, 1, 1, 0, NOW(), NOW()),
(7, '小爱音箱 Play', 'xiaoai-speaker-play', 1, '支持语音控制音乐播放、智能设备，性价比高，适合入门级智能音箱用户', 89, 89, '语音控制,音乐播放,智能设备控制', '包含音箱一个，电源适配器一个，说明书一份', '保修一年', 12, '月', 1, 0, 0, 0, NOW(), NOW()),
(8, '米家智能小夜灯（感应版）', 'mijia-night-light', 1, '人体感应触发，可吸附在金属表面，光线柔和，方便夜间行动', 49, 49, '人体感应,金属吸附,柔和光线', '包含夜灯一个，说明书一份', '保修一年', 12, '月', 1, 0, 0, 0, NOW(), NOW()),
(9, '米家智能台灯 1S', 'mijia-desk-lamp-1s', 2, '全光谱灯光，光线柔和，支持手机 APP / 语音控制，适合阅读、办公场景', 169, 169, '全光谱灯光,APP控制,语音控制', '包含台灯一个，电源适配器一个，说明书一份', '保修一年', 12, '月', 1, 0, 0, 0, NOW(), NOW()),
(10, '小米天然气卫士', 'xiaomi-gas-monitor', 2, '实时监测天然气泄漏，遇漏时自动报警，保障家庭用气安全', 215, 215, '实时监测,自动报警,家庭安全', '包含气体监测器一个，安装配件，说明书一份', '保修一年', 12, '月', 1, 0, 0, 0, NOW(), NOW());

-- 继续插入剩余商品
INSERT IGNORE INTO t_package (id, name, code, type, description, price, discount_price, features, content, rules, duration, duration_unit, status, is_hot, is_recommended, sales_count, create_time, update_time) VALUES
(11, '米家即热饮水机 S1', 'mijia-water-heater-s1', 2, '即热式出水，支持多水温调节，小巧不占空间，方便日常饮用热水', 258, 258, '即热式出水,多水温调节,小巧节省空间', '包含饮水机一台，电源线一根，说明书一份', '保修一年', 12, '月', 1, 0, 0, 0, NOW(), NOW()),
(12, '米家随手吸尘器', 'mijia-vacuum-cleaner', 2, '手持轻便，适合清洁桌面，沙发，车内等小面积灰尘，操作简单易收纳', 209, 209, '手持轻便,小面积清洁,简单操作', '包含吸尘器一台，充电线一根，吸头配件，说明书一份', '保修一年', 12, '月', 1, 0, 0, 0, NOW(), NOW()),
(13, '倍思 65W 氮化镓充电头', 'baseus-65w-charger', 1, '体积小巧，兼容 PD/PPS 等快充协议，可快速为手机、平板充电', 99, 99, '体积小巧,多协议兼容,快速充电', '包含充电头一个，说明书一份', '保修一年', 12, '月', 1, 0, 0, 0, NOW(), NOW()),
(14, '红米手环 3 Pro', 'redmi-band-3-pro', 2, '支持心率、睡眠监测，记录多种运动数据，防水设计，适合日常健康管理', 129, 129, '心率监测,睡眠监测,运动记录,防水设计', '包含手环一个，充电器一个，说明书一份', '保修一年', 12, '月', 1, 0, 0, 0, NOW(), NOW()),
(15, '联想小新蓝牙鼠标', 'lenovo-bluetooth-mouse', 1, '无线蓝牙连接，手感舒适，稳定性强，适合配笔记本电脑使用，便携易带', 79, 79, '无线蓝牙,手感舒适,稳定性强', '包含鼠标一个，说明书一份', '保修一年', 12, '月', 1, 0, 0, 0, NOW(), NOW());

-- 继续插入更多商品
INSERT IGNORE INTO t_package (id, name, code, type, description, price, discount_price, features, content, rules, duration, duration_unit, status, is_hot, is_recommended, sales_count, create_time, update_time) VALUES
(16, 'QCY T13 ANC 真无线耳机', 'qcy-t13-anc', 2, '具备主动降噪功能，减少外界干扰，音质较好，续航能力不错', 149, 149, '主动降噪,外界干扰减少,音质好', '包含耳机一对，充电盒一个，说明书一份', '保修一年', 12, '月', 1, 0, 0, 0, NOW(), NOW()),
(17, '小米挂脖小风扇', 'xiaomi-neck-fan', 1, '挂脖式设计，便携可随身携带，续航较长，适合夏季户外或室内时降温', 89, 89, '挂脖式设计,便携随身,续航长', '包含风扇一个，充电线一根，说明书一份', '保修一年', 12, '月', 1, 0, 0, 0, NOW(), NOW()),
(18, '科音同款手机补光灯', 'keyou-fill-light', 1, '可调节亮度和色温，提升手机拍摄画面亮度，适合直播、自拍等场景', 59, 59, '亮度色温可调,提升拍摄亮度', '包含补光灯一个，充电线一根，说明书一份', '保修一年', 12, '月', 1, 0, 0, 0, NOW(), NOW()),
(19, '360 智能门锁（二手）', '360-smart-lock-used', 1, '支持手机 APP 查看门锁状况，访客提醒 + 视频录制，二手价格实惠，保障居家安全', 99, 99, '手机APP查看,访客提醒,视频录制', '包含门锁一套，安装配件，说明书一份', '保修三个月', 3, '月', 1, 0, 0, 0, NOW(), NOW()),
(20, '绿联手机散热背夹', 'ugreen-phone-cooler', 1, '夹在手机背部，有效降低手机温度，避免游戏影响性能，适合长时间游戏', 79, 79, '手机背部散热,降低温度,游戏适用', '包含散热背夹一个，充电线一根，说明书一份', '保修一年', 12, '月', 1, 0, 0, 0, NOW(), NOW());

-- 继续插入剩余商品
INSERT IGNORE INTO t_package (id, name, code, type, description, price, discount_price, features, content, rules, duration, duration_unit, status, is_hot, is_recommended, sales_count, create_time, update_time) VALUES
(21, '名创优品电子单词本', 'miniso-dictionary', 1, '小巧便携，支持单词记忆、测试，电子屏显示，适合英语学习', 69, 69, '小巧便携,单词记忆,电子屏显示', '包含单词本一个，充电线一根，说明书一份', '保修一年', 12, '月', 1, 0, 0, 0, NOW(), NOW()),
(22, '罗技 MX Anywhere 3 鼠标', 'logitech-mx-anywhere-3', 3, '带 MagSpeed 无限滚轮，支持罗技 Flow 跨设备控制，适合办公场景', 399, 399, 'MagSpeed滚轮,Flow跨设备控制', '包含鼠标一个，接收器一个，充电线一根，说明书一份', '保修一年', 12, '月', 1, 1, 1, 0, NOW(), NOW()),
(23, 'Keychron K3 蓝牙有线键盘键盘', 'keychron-k3', 3, '矮轴设计，键程短，84 键布局，支持蓝牙有线连接，适合外出办公', 448, 448, '矮轴设计,84键布局,蓝牙有线连接', '包含键盘一个，充电线一根，说明书一份', '保修一年', 12, '月', 1, 0, 0, 0, NOW(), NOW()),
(24, 'Windows Hello 指纹模块', 'windows-hello-fingerprint', 1, '为电脑添加指纹解锁功能，提升系统使用便捷性，适合多 USB-A 接口设备', 70, 70, '指纹解锁,系统便捷,USB-A接口', '包含指纹模块一个，说明书一份', '保修一年', 12, '月', 1, 0, 0, 0, NOW(), NOW()),
(25, '艾金狼 35W 氮化镓充电器', 'aijinlang-35w-charger', 2, '兼容多种快充协议，屏幕显示实时功率，为 iPhone 等设备充电效率高', 149, 149, '多协议兼容,实时功率显示,高效充电', '包含充电器一个，说明书一份', '保修一年', 12, '月', 1, 0, 0, 0, NOW(), NOW());

-- 插入最后一批商品
INSERT IGNORE INTO t_package (id, name, code, type, description, price, discount_price, features, content, rules, duration, duration_unit, status, is_hot, is_recommended, sales_count, create_time, update_time) VALUES
(26, 'inCharge 6 合 1 数据线', 'incharge-6in1', 2, '支持 Lightning/USB-C 等多接口，充电数据传输一体，方便收纳携带', 139, 139, '多接口支持,充电传输一体,便携收纳', '包含数据线一根，说明书一份', '保修一年', 12, '月', 1, 0, 0, 0, NOW(), NOW()),
(27, '几颗充电宝', 'portable-charger', 1, '容量随日常需求，多输出接口，可同时为多设备充电，外观简约', 84, 84, '容量适中,多输出接口,简约设计', '包含充电宝一个，充电线一根，说明书一份', '保修一年', 12, '月', 1, 0, 0, 0, NOW(), NOW()),
(28, '山水 S8 开放式耳机', 'sansui-s8-earphones', 1, '开放式佩戴，舒适不压耳，可兼外界声音，适合运动场景', 100, 100, '开放式佩戴,舒适不压耳,运动适用', '包含耳机一副，收纳盒一个，说明书一份', '保修一年', 12, '月', 1, 0, 0, 0, NOW(), NOW()),
(29, '黑盖磁吸散热器青春版', 'magnetic-cooler', 1, '磁吸固定，散热效果好，降低手机温度，提升游戏体验', 97.2, 97.2, '磁吸固定,散热效果好,降温提升体验', '包含散热器一个，说明书一份', '保修一年', 12, '月', 1, 0, 0, 0, NOW(), NOW()),
(30, '品胜手机消毒盒', 'pisen-sterilizer-box', 1, '紫外线杀菌，消毒手机表面细菌，兼具收纳功能，保障使用卫生', 100, 100, '紫外线杀菌,表面消毒,收纳功能', '包含消毒盒一个，充电线一根，说明书一份', '保修一年', 12, '月', 1, 0, 0, 0, NOW(), NOW());

-- 插入最后几个商品
INSERT IGNORE INTO t_package (id, name, code, type, description, price, discount_price, features, content, rules, duration, duration_unit, status, is_hot, is_recommended, sales_count, create_time, update_time) VALUES
(31, '绿之源迷你款紫外线消毒灯', 'uv-sterilizer-lamp', 1, '小巧设计，可消毒衣物、玩具、杀菌效果好，操作简单', 100, 100, '小巧设计,多用途消毒,操作简单', '包含消毒灯一个，说明书一份', '保修一年', 12, '月', 1, 0, 0, 0, NOW(), NOW()),
(32, '得力磁浮灯创意板', 'deli-magnetic-lamp', 1, '灯体悬浮旋转，灯光柔和，兼具装饰和照明功能', 100, 100, '磁浮旋转,柔和灯光,装饰照明', '包含磁浮灯一套，电源适配器一个，说明书一份', '保修一年', 12, '月', 1, 0, 0, 0, NOW(), NOW()),
(33, '倍思 20 倍放大镜头', 'baseus-magnifier', 1, '可安装在手机上，放大微观世界，适合观察植物细胞、昆虫和珠宝等学习', 100, 100, '手机安装,20倍放大,观察学习', '包含放大镜头一个，收纳盒一个，说明书一份', '保修一年', 12, '月', 1, 0, 0, 0, NOW(), NOW()),
(34, '微麦 M100S 口袋投影', 'weimai-m100s-projector', 1, '超迷你体积，可随身携带，支持手机 / 平板内容投影，适合个人娱乐成小型分享', 100, 100, '迷你体积,随身携带,多设备投影', '包含投影仪一台，充电线一根，说明书一份', '保修一年', 12, '月', 1, 0, 0, 0, NOW(), NOW()),
(35, '雷神 V10 超级电能充电宝', 'raytheon-v10-powerbank', 2, '10000mAh 容量，2C1A 接口，支持快充，外观设计精巧，便携易用', 149, 149, '大容量,多接口,快充支持', '包含充电宝一个，充电线一根，说明书一份', '保修一年', 12, '月', 1, 0, 0, 0, NOW(), NOW());

-- 插入最后几个商品
INSERT IGNORE INTO t_package (id, name, code, type, description, price, discount_price, features, content, rules, duration, duration_unit, status, is_hot, is_recommended, sales_count, create_time, update_time) VALUES
(36, '闪极随行 10000mAh 充电宝', 'flash-powerbank', 1, '设计时尚，支持快充，充电速度快，满足日常外出充电需求', 94, 94, '时尚设计,快充支持,速度快', '包含充电宝一个，充电线一根，说明书一份', '保修一年', 12, '月', 1, 0, 0, 0, NOW(), NOW()),
(37, '惠普 4925 彩色无线喷墨打印机', 'hp-4925-printer', 4, '支持彩色打印，无线连接，手机 APP 直接打印，适合家庭办公和学习', 454.4, 454.4, '彩色打印,无线连接,APP直接打印', '包含打印机一台，墨盒一套，电源线一根，说明书一份', '保修一年', 12, '月', 1, 0, 0, 0, NOW(), NOW()),
(38, '爱立熊 P90 错题打印机', 'alibear-p90-printer', 2, '手机 APP 错题整理，快速打印，便于复习，小巧便携，适合学生使用', 237, 237, '错题整理,快速打印,学生适用', '包含打印机一台，热敏纸一卷，充电线一根，说明书一份', '保修一年', 12, '月', 1, 0, 0, 0, NOW(), NOW()),
(39, '大疆手持稳定器', 'dji-stabilizer', 4, '稳定手机拍摄画面，减少抖动，支持多种拍摄模式', 509.15, 509.15, '手机稳定,减少抖动,多种拍摄模式', '包含稳定器一个，充电线一根，说明书一份', '保修一年', 12, '月', 1, 1, 1, 0, NOW(), NOW());

-- 确保有用户数据
INSERT IGNORE INTO t_user (id, username, password, real_name, avatar, roles, email, phone, status, source, register_time, create_time, update_time) VALUES
(1, 'user1', '$2a$10$1/JBtYVEah.g5QhN1VF5U.R6A3DhCFCS.XCO/P1VJqZ.xRW.vwJWa', '张三', 'avatar1.jpg', 'user', 'user1@example.com', '13800138001', 1, 'website', DATE_SUB(NOW(), INTERVAL FLOOR(RAND() * 365) DAY), NOW(), NOW()),
(2, 'user2', '$2a$10$1/JBtYVEah.g5QhN1VF5U.R6A3DhCFCS.XCO/P1VJqZ.xRW.vwJWa', '李四', 'avatar2.jpg', 'user', 'user2@example.com', '13800138002', 1, 'wechat', DATE_SUB(NOW(), INTERVAL FLOOR(RAND() * 365) DAY), NOW(), NOW()),
(3, 'user3', '$2a$10$1/JBtYVEah.g5QhN1VF5U.R6A3DhCFCS.XCO/P1VJqZ.xRW.vwJWa', '王五', 'avatar3.jpg', 'user', 'user3@example.com', '13800138003', 1, 'douyin', DATE_SUB(NOW(), INTERVAL FLOOR(RAND() * 365) DAY), NOW(), NOW()),
(4, 'user4', '$2a$10$1/JBtYVEah.g5QhN1VF5U.R6A3DhCFCS.XCO/P1VJqZ.xRW.vwJWa', '赵六', 'avatar4.jpg', 'user', 'user4@example.com', '13800138004', 1, 'xiaohongshu', DATE_SUB(NOW(), INTERVAL FLOOR(RAND() * 365) DAY), NOW(), NOW()),
(5, 'user5', '$2a$10$1/JBtYVEah.g5QhN1VF5U.R6A3DhCFCS.XCO/P1VJqZ.xRW.vwJWa', '钱七', 'avatar5.jpg', 'user', 'user5@example.com', '13800138005', 1, 'taobao', DATE_SUB(NOW(), INTERVAL FLOOR(RAND() * 365) DAY), NOW(), NOW()),
(6, 'user6', '$2a$10$1/JBtYVEah.g5QhN1VF5U.R6A3DhCFCS.XCO/P1VJqZ.xRW.vwJWa', '孙八', 'avatar6.jpg', 'user', 'user6@example.com', '13800138006', 1, 'website', DATE_SUB(NOW(), INTERVAL FLOOR(RAND() * 365) DAY), NOW(), NOW()),
(7, 'user7', '$2a$10$1/JBtYVEah.g5QhN1VF5U.R6A3DhCFCS.XCO/P1VJqZ.xRW.vwJWa', '周九', 'avatar7.jpg', 'user', 'user7@example.com', '13800138007', 1, 'wechat', DATE_SUB(NOW(), INTERVAL FLOOR(RAND() * 365) DAY), NOW(), NOW()),
(8, 'user8', '$2a$10$1/JBtYVEah.g5QhN1VF5U.R6A3DhCFCS.XCO/P1VJqZ.xRW.vwJWa', '吴十', 'avatar8.jpg', 'user', 'user8@example.com', '13800138008', 1, 'douyin', DATE_SUB(NOW(), INTERVAL FLOOR(RAND() * 365) DAY), NOW(), NOW()),
(9, 'user9', '$2a$10$1/JBtYVEah.g5QhN1VF5U.R6A3DhCFCS.XCO/P1VJqZ.xRW.vwJWa', '郑十一', 'avatar9.jpg', 'user', 'user9@example.com', '13800138009', 1, 'xiaohongshu', DATE_SUB(NOW(), INTERVAL FLOOR(RAND() * 365) DAY), NOW(), NOW()),
(10, 'user10', '$2a$10$1/JBtYVEah.g5QhN1VF5U.R6A3DhCFCS.XCO/P1VJqZ.xRW.vwJWa', '王十二', 'avatar10.jpg', 'user', 'user10@example.com', '13800138010', 1, 'taobao', DATE_SUB(NOW(), INTERVAL FLOOR(RAND() * 365) DAY), NOW(), NOW());

-- 生成订单数据
-- 使用存储过程生成大量订单数据
DELIMITER //
CREATE PROCEDURE IF NOT EXISTS generate_orders(IN num_orders INT)
BEGIN
    DECLARE i INT DEFAULT 0;
    DECLARE order_id VARCHAR(20);
    DECLARE user_id INT;
    DECLARE package_id INT;
    DECLARE price DOUBLE;
    DECLARE quantity INT;
    DECLARE amount DOUBLE;
    DECLARE discount DOUBLE;
    DECLARE pay_amount DOUBLE;
    DECLARE payment_method_id INT;
    DECLARE payment_method_name VARCHAR(50);
    DECLARE source_id VARCHAR(20);
    DECLARE source_name VARCHAR(50);
    DECLARE status_id INT;
    DECLARE create_date DATETIME;
    DECLARE pay_date DATETIME;
    DECLARE complete_date DATETIME;

    -- 循环生成订单
    WHILE i < num_orders DO
        -- 生成订单ID
        SET order_id = CONCAT('ORD', LPAD(FLOOR(RAND() * 1000000), 6, '0'));

        -- 随机用户ID
        SET user_id = FLOOR(1 + RAND() * 10);

        -- 随机套餐ID
        SET package_id = FLOOR(1 + RAND() * 39);

        -- 获取套餐价格
        SELECT price, discount_price INTO price, pay_amount FROM t_package WHERE id = package_id;

        -- 随机数量
        SET quantity = FLOOR(1 + RAND() * 3);

        -- 计算金额
        SET amount = price * quantity;
        SET discount = FLOOR(RAND() * 50) / 10 * quantity;
        SET pay_amount = amount - discount;

        -- 随机支付方式
        SET payment_method_id = FLOOR(1 + RAND() * 3);
        SELECT name INTO payment_method_name FROM t_payment_method WHERE id = payment_method_id;

        -- 随机来源
        SET source_id = ELT(FLOOR(1 + RAND() * 6), 'douyin', 'wechat', 'taobao', 'xiaohongshu', 'website', 'other');
        SELECT name INTO source_name FROM t_order_source WHERE id = source_id;

        -- 随机状态
        SET status_id = FLOOR(RAND() * 5);

        -- 随机日期（过去一年内）
        SET create_date = DATE_SUB(NOW(), INTERVAL FLOOR(RAND() * 365) DAY);

        -- 如果已支付，设置支付时间
        IF status_id > 0 THEN
            SET pay_date = DATE_ADD(create_date, INTERVAL FLOOR(RAND() * 24) HOUR);
        ELSE
            SET pay_date = NULL;
        END IF;

        -- 如果已完成，设置完成时间
        IF status_id = 4 THEN
            SET complete_date = DATE_ADD(pay_date, INTERVAL FLOOR(RAND() * 72) HOUR);
        ELSE
            SET complete_date = NULL;
        END IF;

        -- 插入订单
        INSERT INTO t_order (
            id, order_no, user_id, user_name, package_id, package_name, package_type,
            price, quantity, amount, discount, pay_amount, payment_method_id, payment_method,
            source, source_id, status, remark, create_time, pay_time, complete_time
        )
        SELECT
            order_id, CONCAT('NO', order_id), user_id, u.real_name, package_id, p.name, pt.name,
            price, quantity, amount, discount, pay_amount, payment_method_id, payment_method_name,
            source_name, source_id, status_id, CONCAT('订单备注 ', i), create_date, pay_date, complete_date
        FROM
            t_user u, t_package p, t_package_type pt
        WHERE
            u.id = user_id AND p.id = package_id AND pt.id = p.type;

        -- 更新套餐销售数量
        UPDATE t_package SET sales_count = sales_count + quantity WHERE id = package_id;

        -- 更新用户订单数量和消费总额
        UPDATE t_user
        SET order_count = (SELECT COUNT(*) FROM t_order WHERE user_id = user_id),
            total_spent = (SELECT SUM(pay_amount) FROM t_order WHERE user_id = user_id AND status > 0)
        WHERE id = user_id;

        -- 插入订单日志
        INSERT INTO t_order_log (order_id, operator_id, operator_name, action, content, create_time)
        VALUES (order_id, user_id, (SELECT real_name FROM t_user WHERE id = user_id),
                '创建订单', '用户创建了订单', create_date);

        -- 如果已支付，添加支付日志
        IF status_id > 0 THEN
            INSERT INTO t_order_log (order_id, operator_id, operator_name, action, content, create_time)
            VALUES (order_id, user_id, (SELECT real_name FROM t_user WHERE id = user_id),
                    '支付订单', CONCAT('用户通过', payment_method_name, '支付了订单'), pay_date);
        END IF;

        -- 如果已取消，添加取消日志
        IF status_id = 2 THEN
            INSERT INTO t_order_log (order_id, operator_id, operator_name, action, content, create_time)
            VALUES (order_id, user_id, (SELECT real_name FROM t_user WHERE id = user_id),
                    '取消订单', '用户取消了订单', DATE_ADD(create_date, INTERVAL FLOOR(RAND() * 24) HOUR));
        END IF;

        -- 如果已退款，添加退款日志
        IF status_id = 3 THEN
            INSERT INTO t_order_log (order_id, operator_id, operator_name, action, content, create_time)
            VALUES (order_id, user_id, (SELECT real_name FROM t_user WHERE id = user_id),
                    '退款订单', '用户申请退款并已处理', DATE_ADD(pay_date, INTERVAL FLOOR(RAND() * 48) HOUR));
        END IF;

        -- 如果已完成，添加完成日志
        IF status_id = 4 THEN
            INSERT INTO t_order_log (order_id, operator_id, operator_name, action, content, create_time)
            VALUES (order_id, user_id, (SELECT real_name FROM t_user WHERE id = user_id),
                    '完成订单', '订单已完成', complete_date);
        END IF;

        SET i = i + 1;
    END WHILE;
END //
DELIMITER ;

-- 调用存储过程生成500个订单
CALL generate_orders(500);

-- 删除存储过程
DROP PROCEDURE IF EXISTS generate_orders;

-- 更新套餐销售数量统计
UPDATE t_package p
SET sales_count = (
    SELECT IFNULL(SUM(quantity), 0)
    FROM t_order o
    WHERE o.package_id = p.id AND o.status > 0
);

-- 更新用户订单数量和消费总额
UPDATE t_user u
SET order_count = (
    SELECT COUNT(*)
    FROM t_order o
    WHERE o.user_id = u.id
),
total_spent = (
    SELECT IFNULL(SUM(pay_amount), 0)
    FROM t_order o
    WHERE o.user_id = u.id AND o.status > 0
);
