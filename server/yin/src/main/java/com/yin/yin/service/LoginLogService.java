package com.yin.yin.service;

import com.yin.yin.common.PageResult;
import com.yin.yin.model.LoginLog;

/**
 * 登录日志服务接口
 */
public interface LoginLogService {
    /**
     * 添加登录日志
     */
    int addLoginLog(LoginLog loginLog);

    /**
     * 分页查询登录日志列表
     */
    PageResult<LoginLog> listLoginLogs(String username, Integer status, String startDate, String endDate, Integer pageNum, Integer pageSize);
}
