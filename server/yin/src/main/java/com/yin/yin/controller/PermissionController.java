package com.yin.yin.controller;

import com.yin.yin.common.PageResult;
import com.yin.yin.common.Result;
import com.yin.yin.model.Permission;
import com.yin.yin.service.PermissionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * 权限控制器
 */
@RestController
@RequestMapping("/api/permission")
public class PermissionController {

    @Autowired
    private PermissionService permissionService;

    /**
     * 获取权限列表
     */
    @GetMapping("/list")
    public Result<?> listPermissions() {
        List<Permission> permissions = permissionService.listPermissions();
        return Result.success(permissions);
    }

    /**
     * 分页查询权限列表
     */
    @GetMapping("/page")
    public Result<?> pagePermissions(
            @RequestParam(value = "keyword", required = false) String keyword,
            @RequestParam(value = "type", required = false) Integer type,
            @RequestParam(value = "pageNum", defaultValue = "1") Integer pageNum,
            @RequestParam(value = "pageSize", defaultValue = "10") Integer pageSize) {
        PageResult<Permission> pageResult = permissionService.pagePermissions(keyword, type, pageNum, pageSize);
        return Result.success(pageResult);
    }

    /**
     * 根据ID获取权限
     */
    @GetMapping("/{id}")
    public Result<?> getPermissionById(@PathVariable Long id) {
        Permission permission = permissionService.getPermissionById(id);
        return Result.success(permission);
    }

    /**
     * 根据用户ID获取权限列表
     */
    @GetMapping("/user/{userId}")
    public Result<?> getPermissionsByUserId(@PathVariable Long userId) {
        List<Permission> permissions = permissionService.getPermissionsByUserId(userId);
        return Result.success(permissions);
    }

    /**
     * 根据角色ID获取权限列表
     */
    @GetMapping("/role/{roleId}")
    public Result<?> getPermissionsByRoleId(@PathVariable Long roleId) {
        List<Permission> permissions = permissionService.getPermissionsByRoleId(roleId);
        return Result.success(permissions);
    }

    /**
     * 添加权限
     */
    @PostMapping
    public Result<?> addPermission(@RequestBody Permission permission) {
        int result = permissionService.addPermission(permission);
        return result > 0 ? Result.success(permission) : Result.failed("添加权限失败");
    }

    /**
     * 更新权限
     */
    @PutMapping
    public Result<?> updatePermission(@RequestBody Permission permission) {
        int result = permissionService.updatePermission(permission);
        return result > 0 ? Result.success(permission) : Result.failed("更新权限失败");
    }

    /**
     * 删除权限
     */
    @DeleteMapping("/{id}")
    public Result<?> deletePermission(@PathVariable Long id) {
        int result = permissionService.deletePermission(id);
        return result > 0 ? Result.success(id) : Result.failed("删除权限失败");
    }

    /**
     * 为角色分配权限
     */
    @PostMapping("/assign")
    public Result<?> assignPermissionsToRole(@RequestBody Map<String, Object> params) {
        Long roleId = Long.valueOf(params.get("roleId").toString());
        @SuppressWarnings("unchecked")
        List<Long> permissionIds = (List<Long>) params.get("permissionIds");
        int result = permissionService.assignPermissionsToRole(roleId, permissionIds);
        return Result.success(result);
    }
}
