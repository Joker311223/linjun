package com.yin.yin.controller;

import com.yin.yin.common.PageResult;
import com.yin.yin.common.Result;
import com.yin.yin.model.Role;
import com.yin.yin.service.RoleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * 角色控制器
 */
@RestController
@RequestMapping("/api/role")
public class RoleController {

    @Autowired
    private RoleService roleService;

    /**
     * 获取角色列表
     */
    @GetMapping("/list")
    public Result<?> listRoles() {
        List<Role> roles = roleService.listRoles();
        return Result.success(roles);
    }

    /**
     * 分页查询角色列表
     */
    @GetMapping("/page")
    public Result<?> pageRoles(
            @RequestParam(value = "keyword", required = false) String keyword,
            @RequestParam(value = "status", required = false) Integer status,
            @RequestParam(value = "pageNum", defaultValue = "1") Integer pageNum,
            @RequestParam(value = "pageSize", defaultValue = "10") Integer pageSize) {
        PageResult<Role> pageResult = roleService.pageRoles(keyword, status, pageNum, pageSize);
        return Result.success(pageResult);
    }

    /**
     * 根据ID获取角色
     */
    @GetMapping("/{id}")
    public Result<?> getRoleById(@PathVariable Long id) {
        Role role = roleService.getRoleById(id);
        return Result.success(role);
    }

    /**
     * 根据用户ID获取角色列表
     */
    @GetMapping("/user/{userId}")
    public Result<?> getRolesByUserId(@PathVariable Long userId) {
        List<Role> roles = roleService.getRolesByUserId(userId);
        return Result.success(roles);
    }

    /**
     * 添加角色
     */
    @PostMapping
    public Result<?> addRole(@RequestBody Role role) {
        int result = roleService.addRole(role);
        return result > 0 ? Result.success(null) : Result.failed("添加角色失败");
    }

    /**
     * 更新角色
     */
    @PutMapping
    public Result<?> updateRole(@RequestBody Role role) {
        int result = roleService.updateRole(role);
        return result > 0 ? Result.success(null) : Result.failed("更新角色失败");
    }

    /**
     * 删除角色
     */
    @DeleteMapping("/{id}")
    public Result<?> deleteRole(@PathVariable Long id) {
        int result = roleService.deleteRole(id);
        return result > 0 ? Result.success(null) : Result.failed("删除角色失败");
    }

    /**
     * 为用户分配角色
     */
    @PostMapping("/assign")
    public Result<?> assignRolesToUser(@RequestBody Map<String, Object> params) {
        Long userId = Long.valueOf(params.get("userId").toString());
        @SuppressWarnings("unchecked")
        List<Long> roleIds = (List<Long>) params.get("roleIds");
        int result = roleService.assignRolesToUser(userId, roleIds);
        return Result.success(result);
    }
}
