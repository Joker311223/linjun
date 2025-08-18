package com.yin.yin.service.impl;

import com.yin.yin.common.PageResult;
import com.yin.yin.mapper.LoginLogMapper;
import com.yin.yin.model.LoginLog;
import com.yin.yin.service.LoginLogService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * 登录日志服务实现类
 */
@Service
public class LoginLogServiceImpl implements LoginLogService {

    @Autowired
    private LoginLogMapper loginLogMapper;

    @Override
    public int addLoginLog(LoginLog loginLog) {
        return loginLogMapper.insert(loginLog);
    }

    @Override
    public PageResult<LoginLog> listLoginLogs(String username, Integer status, String startDate, String endDate, Integer pageNum, Integer pageSize) {
        // 计算分页参数
        Integer offset = (pageNum - 1) * pageSize;
        Integer limit = pageSize;

        // 查询登录日志列表
        List<LoginLog> loginLogs = loginLogMapper.selectList(username, status, startDate, endDate, offset, limit);

        // 查询总数
        Long total = loginLogMapper.selectCount(username, status, startDate, endDate);

        return new PageResult<>(total, loginLogs);
    }
}
