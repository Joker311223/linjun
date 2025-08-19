package com.yin.yin.service;

import com.yin.yin.common.PageResult;
import com.yin.yin.model.User;

/**
 * 用户服务接口
 */
public interface UserService {
    /**
     * 根据用户名查询用户
     */
    User getUserByUsername(String username);

    /**
     * 用户登录
     */
    User login(String username, String password);

    /**
     * 检查账户是否被锁定
     */
    boolean isAccountLocked(User user);

    /**
     * 获取用户信息
     */
    User getUserInfo(Long id);

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

    /**
     * 重置用户密码
     */
    int resetPassword(Long id, String password);

    /**
     * 修改用户状态
     */
    int changeStatus(Long id, Integer status);
}
