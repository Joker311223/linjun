package com.yin.yin.service.impl;

import com.yin.yin.common.PageResult;
import com.yin.yin.mapper.PermissionMapper;
import com.yin.yin.mapper.RolePermissionMapper;
import com.yin.yin.model.Permission;
import com.yin.yin.model.RolePermission;
import com.yin.yin.service.PermissionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

/**
 * 权限服务实现类
 */
@Service
public class PermissionServiceImpl implements PermissionService {

    @Autowired
    private PermissionMapper permissionMapper;

    @Autowired
    private RolePermissionMapper rolePermissionMapper;

    @Override
    public List<Permission> listPermissions() {
        return permissionMapper.selectAll();
    }

    @Override
    public PageResult<Permission> pagePermissions(String keyword, Integer type, Integer pageNum, Integer pageSize) {
        // 这里需要实现分页查询，暂时返回空结果
        return new PageResult<>(0L, new ArrayList<>());
    }

    @Override
    public Permission getPermissionById(Long id) {
        return permissionMapper.selectById(id);
    }

    @Override
    public List<Permission> getPermissionsByUserId(Long userId) {
        return permissionMapper.selectByUserId(userId);
    }

    @Override
    public List<Permission> getPermissionsByRoleId(Long roleId) {
        return permissionMapper.selectByRoleId(roleId);
    }

    @Override
    public int addPermission(Permission permission) {
        permission.setCreateTime(new Date());
        permission.setUpdateTime(new Date());
        return permissionMapper.insert(permission);
    }

    @Override
    public int updatePermission(Permission permission) {
        permission.setUpdateTime(new Date());
        return permissionMapper.update(permission);
    }

    @Override
    public int deletePermission(Long id) {
        // 先删除角色权限关联
        rolePermissionMapper.deleteByPermissionId(id);
        // 再删除权限
        return permissionMapper.deleteById(id);
    }

    @Override
    @Transactional
    public int assignPermissionsToRole(Long roleId, List<Long> permissionIds) {
        // 先删除原有的角色权限关联
        rolePermissionMapper.deleteByRoleId(roleId);

        // 如果权限ID列表为空，则直接返回
        if (permissionIds == null || permissionIds.isEmpty()) {
            return 0;
        }

        // 批量插入新的角色权限关联
        List<RolePermission> rolePermissions = new ArrayList<>();
        for (Long permissionId : permissionIds) {
            RolePermission rolePermission = new RolePermission();
            rolePermission.setRoleId(roleId);
            rolePermission.setPermissionId(permissionId);
            rolePermission.setCreateTime(new Date());
            rolePermissions.add(rolePermission);
        }

        return rolePermissionMapper.batchInsert(rolePermissions);
    }
}
