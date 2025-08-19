package com.yin.yin.mapper;

import com.yin.yin.model.Role;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * 角色Mapper接口
 */
@Mapper
public interface RoleMapper {
    /**
     * 根据ID查询角色
     */
    Role selectById(Long id);

    /**
     * 查询所有角色
     */
    List<Role> selectAll();

    /**
     * 根据用户ID查询角色列表
     */
    List<Role> selectByUserId(Long userId);

    /**
     * 插入角色
     */
    int insert(Role role);

    /**
     * 更新角色
     */
    int update(Role role);

    /**
     * 删除角色
     */
    int deleteById(Long id);
}
