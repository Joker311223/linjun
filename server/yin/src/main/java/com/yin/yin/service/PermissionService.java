package com.yin.yin.service;

import com.yin.yin.common.PageResult;
import com.yin.yin.model.Permission;

import java.util.List;

/**
 * 权限服务接口
 */
public interface PermissionService {
    /**
     * 获取权限列表
     */
    List<Permission> listPermissions();

    /**
     * 分页查询权限列表
     */
    PageResult<Permission> pagePermissions(String keyword, Integer type, Integer pageNum, Integer pageSize);

    /**
     * 根据ID获取权限
     */
    Permission getPermissionById(Long id);

    /**
     * 根据用户ID获取权限列表
     */
    List<Permission> getPermissionsByUserId(Long userId);

    /**
     * 根据角色ID获取权限列表
     */
    List<Permission> getPermissionsByRoleId(Long roleId);

    /**
     * 添加权限
     */
    int addPermission(Permission permission);

    /**
     * 更新权限
     */
    int updatePermission(Permission permission);

    /**
     * 删除权限
     */
    int deletePermission(Long id);

    /**
     * 为角色分配权限
     */
    int assignPermissionsToRole(Long roleId, List<Long> permissionIds);
}
