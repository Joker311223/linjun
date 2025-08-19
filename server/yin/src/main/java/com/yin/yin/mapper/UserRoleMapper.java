package com.yin.yin.mapper;

import com.yin.yin.model.UserRole;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * 用户角色关联Mapper接口
 */
@Mapper
public interface UserRoleMapper {
    /**
     * 根据用户ID查询用户角色关联
     */
    List<UserRole> selectByUserId(Long userId);

    /**
     * 根据角色ID查询用户角色关联
     */
    List<UserRole> selectByRoleId(Long roleId);

    /**
     * 插入用户角色关联
     */
    int insert(UserRole userRole);

    /**
     * 批量插入用户角色关联
     */
    int batchInsert(@Param("userRoles") List<UserRole> userRoles);

    /**
     * 根据用户ID删除用户角色关联
     */
    int deleteByUserId(Long userId);

    /**
     * 根据角色ID删除用户角色关联
     */
    int deleteByRoleId(Long roleId);

    /**
     * 根据用户ID和角色ID删除用户角色关联
     */
    int deleteByUserIdAndRoleId(@Param("userId") Long userId, @Param("roleId") Long roleId);
}
