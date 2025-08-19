package com.yin.yin.service.impl;

import com.yin.yin.common.PageResult;
import com.yin.yin.mapper.RoleMapper;
import com.yin.yin.mapper.UserRoleMapper;
import com.yin.yin.model.Role;
import com.yin.yin.model.UserRole;
import com.yin.yin.service.RoleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

/**
 * 角色服务实现类
 */
@Service
public class RoleServiceImpl implements RoleService {

    @Autowired
    private RoleMapper roleMapper;

    @Autowired
    private UserRoleMapper userRoleMapper;

    @Override
    public List<Role> listRoles() {
        return roleMapper.selectAll();
    }

    @Override
    public PageResult<Role> pageRoles(String keyword, Integer status, Integer pageNum, Integer pageSize) {
        // 这里需要实现分页查询，暂时返回空结果
        return new PageResult<>(0L, new ArrayList<>());
    }

    @Override
    public Role getRoleById(Long id) {
        return roleMapper.selectById(id);
    }

    @Override
    public List<Role> getRolesByUserId(Long userId) {
        return roleMapper.selectByUserId(userId);
    }

    @Override
    public int addRole(Role role) {
        role.setCreateTime(new Date());
        role.setUpdateTime(new Date());
        return roleMapper.insert(role);
    }

    @Override
    public int updateRole(Role role) {
        role.setUpdateTime(new Date());
        return roleMapper.update(role);
    }

    @Override
    public int deleteRole(Long id) {
        // 先删除用户角色关联
        userRoleMapper.deleteByRoleId(id);
        // 再删除角色
        return roleMapper.deleteById(id);
    }

    @Override
    @Transactional
    public int assignRolesToUser(Long userId, List<Long> roleIds) {
        // 先删除原有的用户角色关联
        userRoleMapper.deleteByUserId(userId);

        // 如果角色ID列表为空，则直接返回
        if (roleIds == null || roleIds.isEmpty()) {
            return 0;
        }

        // 批量插入新的用户角色关联
        List<UserRole> userRoles = new ArrayList<>();
        for (Long roleId : roleIds) {
            UserRole userRole = new UserRole();
            userRole.setUserId(userId);
            userRole.setRoleId(roleId);
            userRole.setCreateTime(new Date());
            userRoles.add(userRole);
        }

        return userRoleMapper.batchInsert(userRoles);
    }
}
