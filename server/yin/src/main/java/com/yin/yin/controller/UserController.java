package com.yin.yin.controller;

import com.yin.yin.common.PageResult;
import com.yin.yin.common.Result;
import com.yin.yin.model.Permission;
import com.yin.yin.model.Role;
import com.yin.yin.model.User;
import com.yin.yin.service.PermissionService;
import com.yin.yin.service.RoleService;
import com.yin.yin.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.regex.Pattern;

/**
 * 用户控制器
 */
@RestController
@RequestMapping("/api/user")
public class UserController {

    // 邀请码常量
    private static final String INVITE_CODE = "admin123";

    // 密码正则表达式：至少8位，包含字母、数字和特殊字符
    private static final Pattern PASSWORD_PATTERN =
        Pattern.compile("^(?=.*[A-Za-z])(?=.*\\d)(?=.*[@$!%*#?&])[A-Za-z\\d@$!%*#?&]{8,}$");

    @Autowired
    private UserService userService;

    @Autowired
    private RoleService roleService;

    @Autowired
    private PermissionService permissionService;

    /**
     * 用户注册
     */
    @PostMapping("/register")
    public Result<?> register(@RequestBody Map<String, String> registerParams) {
        String username = registerParams.get("username");
        String password = registerParams.get("password");
        String confirmPassword = registerParams.get("confirmPassword");
        String phone = registerParams.get("phone");
        String inviteCode = registerParams.get("inviteCode");
        String email = registerParams.get("email");

        // 参数校验
        if (username == null || username.trim().isEmpty()) {
            return Result.failed("用户名不能为空");
        }

        if (password == null || password.trim().isEmpty()) {
            return Result.failed("密码不能为空");
        }

        if (!password.equals(confirmPassword)) {
            return Result.failed("两次输入的密码不一致");
        }

        if (phone == null || !phone.matches("^1[3-9]\\d{9}$")) {
            return Result.failed("请输入有效的手机号码");
        }

        if (inviteCode == null || !INVITE_CODE.equals(inviteCode)) {
            return Result.failed("邀请码无效");
        }

        // 密码强度校验
        if (!PASSWORD_PATTERN.matcher(password).matches()) {
            return Result.failed("密码必须包含字母、数字和特殊字符，且长度至少为8位");
        }

        // 检查用户名是否已存在
        User existingUser = userService.getUserByUsername(username);
        if (existingUser != null) {
            return Result.failed("用户名已存在");
        }

        // 创建用户对象
        User user = new User();
        user.setUsername(username);
        user.setPassword(password); // 实际应用中应该对密码进行加密
        user.setPhone(phone);
        user.setEmail(email);
        user.setStatus(1); // 默认启用
        user.setRegisterTime(new Date());
        user.setCreateTime(new Date());
        user.setUpdateTime(new Date());

        // 保存用户
        int result = userService.addUser(user);
        if (result > 0) {
            return Result.success(null, "注册成功");
        } else {
            return Result.failed("注册失败，请稍后再试");
        }
    }

    /**
     * 用户登录
     */
    @PostMapping("/login")
    public Result<?> login(@RequestBody Map<String, String> loginParams) {
        String username = loginParams.get("username");
        String password = loginParams.get("password");

        // 先查询用户是否存在
        User user = userService.getUserByUsername(username);
        if (user == null) {
            return Result.failed("用户名或密码错误");
        }

        // 检查账户是否被锁定
        if (userService.isAccountLocked(user)) {
            SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
            String unlockTimeStr = sdf.format(user.getLockTime());
            return Result.failed("账户已被锁定，将在 " + unlockTimeStr + " 后解锁，请稍后再试");
        }

        // 尝试登录
        user = userService.login(username, password);
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
            // 重新获取用户信息，以获取最新的失败次数
            user = userService.getUserByUsername(username);
            int remainingAttempts = 5 - (user.getLoginFailCount() != null ? user.getLoginFailCount() : 0);

            if (remainingAttempts <= 0) {
                return Result.failed("用户名或密码错误，账户已被锁定，请10分钟后再试");
            } else {
                return Result.failed("用户名或密码错误，还剩 " + remainingAttempts + " 次尝试机会，连续5次失败将锁定账户10分钟");
            }
        }
    }

    /**
     * 获取用户信息
     */
    @GetMapping("/info")
    public Result<?> getUserInfo(@RequestParam(required = false) Long userId) {
        // 如果没有传入userId，则默认返回ID为1的用户
        if (userId == null) {
            userId = 1L;
        }

        User user = userService.getUserInfo(userId);
        if (user != null) {
            // 获取用户角色
            List<Role> roles = roleService.getRolesByUserId(userId);
            // 获取用户权限
            List<Permission> permissions = permissionService.getPermissionsByUserId(userId);

            Map<String, Object> userInfo = new HashMap<>();
            userInfo.put("user", user);
            userInfo.put("roles", roles);
            userInfo.put("permissions", permissions);

            return Result.success(userInfo);
        } else {
            return Result.failed("获取用户信息失败");
        }
    }

    /**
     * 获取当前用户的权限列表
     */
    @GetMapping("/permissions")
    public Result<?> getCurrentUserPermissions(@RequestParam(required = false) Long userId) {
        // 如果没有传入userId，则默认返回ID为1的用户
        if (userId == null) {
            userId = 1L;
        }

        List<Permission> permissions = permissionService.getPermissionsByUserId(userId);
        return Result.success(permissions);
    }

    /**
     * 获取当前用户的角色列表
     */
    @GetMapping("/roles")
    public Result<?> getCurrentUserRoles(@RequestParam(required = false) Long userId) {
        // 如果没有传入userId，则默认返回ID为1的用户
        if (userId == null) {
            userId = 1L;
        }

        List<Role> roles = roleService.getRolesByUserId(userId);
        return Result.success(roles);
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
     * 获取用户统计数据（带时间参数）
     */
    @GetMapping("/users/statistics/time")
    public Result<?> getUserStatisticsByTime(
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate,
            @RequestParam(defaultValue = "day") String timeUnit) {
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
