-- 添加登录失败次数和锁定时间字段
ALTER TABLE t_user ADD COLUMN login_fail_count INT DEFAULT 0 COMMENT '登录失败次数';
ALTER TABLE t_user ADD COLUMN lock_time DATETIME NULL COMMENT '账户锁定时间';
