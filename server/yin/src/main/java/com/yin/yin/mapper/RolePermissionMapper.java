package com.yin.yin.mapper;

import com.yin.yin.model.RolePermission;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * 角色权限关联Mapper接口
 */
@Mapper
public interface RolePermissionMapper {
    /**
     * 根据角色ID查询角色权限关联
     */
    List<RolePermission> selectByRoleId(Long roleId);

    /**
     * 根据权限ID查询角色权限关联
     */
    List<RolePermission> selectByPermissionId(Long permissionId);

    /**
     * 插入角色权限关联
     */
    int insert(RolePermission rolePermission);

    /**
     * 批量插入角色权限关联
     */
    int batchInsert(@Param("rolePermissions") List<RolePermission> rolePermissions);

    /**
     * 根据角色ID删除角色权限关联
     */
    int deleteByRoleId(Long roleId);

    /**
     * 根据权限ID删除角色权限关联
     */
    int deleteByPermissionId(Long permissionId);

    /**
     * 根据角色ID和权限ID删除角色权限关联
     */
    int deleteByRoleIdAndPermissionId(@Param("roleId") Long roleId, @Param("permissionId") Long permissionId);
}
