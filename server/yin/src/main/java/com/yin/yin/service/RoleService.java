package com.yin.yin.service;

import com.yin.yin.common.PageResult;
import com.yin.yin.model.Role;

import java.util.List;

/**
 * 角色服务接口
 */
public interface RoleService {
    /**
     * 获取角色列表
     */
    List<Role> listRoles();

    /**
     * 分页查询角色列表
     */
    PageResult<Role> pageRoles(String keyword, Integer status, Integer pageNum, Integer pageSize);

    /**
     * 根据ID获取角色
     */
    Role getRoleById(Long id);

    /**
     * 根据用户ID获取角色列表
     */
    List<Role> getRolesByUserId(Long userId);

    /**
     * 添加角色
     */
    int addRole(Role role);

    /**
     * 更新角色
     */
    int updateRole(Role role);

    /**
     * 删除角色
     */
    int deleteRole(Long id);

    /**
     * 为用户分配角色
     */
    int assignRolesToUser(Long userId, List<Long> roleIds);
}
