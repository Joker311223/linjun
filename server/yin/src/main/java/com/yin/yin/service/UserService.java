package com.yin.yin.service;

import com.yin.yin.common.PageResult;
import com.yin.yin.model.User;

/**
 * 用户服务接口
 */
public interface UserService {
    /**
     * 用户登录
     */
    User login(String username, String password);

    /**
     * 获取用户信息
     */
    User getUserInfo(Long userId);

    /**
     * 分页查询用户列表
     */
    PageResult<User> listUsers(String keyword, Integer status, String startDate, String endDate, Integer pageNum, Integer pageSize);

    /**
     * 获取用户统计数据
     */
    Object getUserStatistics();

    /**
     * 添加用户
     */
    int addUser(User user);

    /**
     * 更新用户
     */
    int updateUser(User user);

    /**
     * 删除用户
     */
    int deleteUser(Long id);
}
