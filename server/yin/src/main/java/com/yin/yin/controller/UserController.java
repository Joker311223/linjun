package com.yin.yin.controller;

import com.yin.yin.common.PageResult;
import com.yin.yin.common.Result;
import com.yin.yin.model.User;
import com.yin.yin.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

/**
 * 用户控制器
 */
@RestController
@RequestMapping("/api/user")
public class UserController {

    @Autowired
    private UserService userService;

    /**
     * 用户登录
     */
    @PostMapping("/login")
    public Result<?> login(@RequestBody Map<String, String> loginParams) {
        String username = loginParams.get("username");
        String password = loginParams.get("password");

        User user = userService.login(username, password);
        if (user != null) {
            Map<String, Object> data = new HashMap<>();
            data.put("token", java.util.UUID.randomUUID().toString());
            data.put("userId", user.getId());
            data.put("username", user.getUsername());
            data.put("realName", user.getRealName());
            data.put("avatar", user.getAvatar());
            data.put("roles", user.getRoles());
            data.put("permissions", user.getPermissions());

            return Result.success(data, "登录成功");
        } else {
            return Result.failed("用户名或密码错误");
        }
    }

    /**
     * 获取用户信息
     */
    @GetMapping("/info")
    public Result<?> getUserInfo() {
        // 这里简化处理，直接返回ID为1的用户
        User user = userService.getUserInfo(1L);
        if (user != null) {
            return Result.success(user);
        } else {
            return Result.failed("获取用户信息失败");
        }
    }

    /**
     * 获取用户列表
     */
    @GetMapping("/users/list")
    public Result<?> listUsers(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) Integer status,
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate,
            @RequestParam(defaultValue = "1") Integer pageNum,
            @RequestParam(defaultValue = "10") Integer pageSize) {

        PageResult<User> pageResult = userService.listUsers(keyword, status, startDate, endDate, pageNum, pageSize);
        return Result.success(pageResult);
    }

    /**
     * 获取用户统计数据
     */
    @GetMapping("/users/statistics")
    public Result<?> getUserStatistics() {
        Object statistics = userService.getUserStatistics();
        return Result.success(statistics);
    }

    /**
     * 退出登录
     */
    @PostMapping("/logout")
    public Result<?> logout() {
        return Result.success(null, "退出成功");
    }
}
