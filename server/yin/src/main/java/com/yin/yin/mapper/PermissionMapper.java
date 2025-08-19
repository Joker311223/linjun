package com.yin.yin.mapper;

import com.yin.yin.model.Permission;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * 权限Mapper接口
 */
@Mapper
public interface PermissionMapper {
    /**
     * 根据ID查询权限
     */
    Permission selectById(Long id);

    /**
     * 查询所有权限
     */
    List<Permission> selectAll();

    /**
     * 根据角色ID查询权限列表
     */
    List<Permission> selectByRoleId(Long roleId);

    /**
     * 根据用户ID查询权限列表
     */
    List<Permission> selectByUserId(Long userId);

    /**
     * 插入权限
     */
    int insert(Permission permission);

    /**
     * 更新权限
     */
    int update(Permission permission);

    /**
     * 删除权限
     */
    int deleteById(Long id);
}
