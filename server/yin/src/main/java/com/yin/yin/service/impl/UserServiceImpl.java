package com.yin.yin.service.impl;

import com.yin.yin.common.PageResult;
import com.yin.yin.mapper.LoginLogMapper;
import com.yin.yin.mapper.UserMapper;
import com.yin.yin.model.LoginLog;
import com.yin.yin.model.User;
import com.yin.yin.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.text.SimpleDateFormat;
import java.util.*;

/**
 * 用户服务实现类
 */
@Service
public class UserServiceImpl implements UserService {

    // 最大登录失败次数
    private static final int MAX_LOGIN_FAIL_COUNT = 5;

    // 锁定时间（分钟）
    private static final int LOCK_TIME_MINUTES = 10;

    @Autowired
    private UserMapper userMapper;

    @Autowired
    private LoginLogMapper loginLogMapper;

    @Override
    public User getUserByUsername(String username) {
        return userMapper.selectByUsername(username);
    }

    @Override
    public User login(String username, String password) {
        User user = userMapper.selectByUsername(username);

        // 创建登录日志对象
        LoginLog loginLog = new LoginLog();
        loginLog.setUsername(username);
        loginLog.setLoginTime(new Date());
        // 这些字段在实际环境中应该从请求中获取
        loginLog.setIpAddress("127.0.0.1");
        loginLog.setLocation("未知");
        loginLog.setBrowser("未知");
        loginLog.setOs("未知");

        // 用户不存在
        if (user == null) {
            loginLog.setStatus(0); // 失败
            loginLog.setFailReason("用户不存在");
            loginLogMapper.insert(loginLog);
            return null;
        }

        // 检查账户是否被锁定
        if (isAccountLocked(user)) {
            loginLog.setUserId(user.getId());
            loginLog.setStatus(0); // 失败
            loginLog.setFailReason("账户已锁定");
            loginLogMapper.insert(loginLog);
            return null;
        }

        if (password.equals(user.getPassword())) {
            // 登录成功，重置失败计数
            resetLoginFailCount(user);

            // 登录成功
            loginLog.setUserId(user.getId());
            loginLog.setStatus(1); // 成功

            // 更新最后登录时间
            SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
            userMapper.updateLastLoginTime(user.getId(), sdf.format(new Date()));

            // 保存登录日志
            loginLogMapper.insert(loginLog);

            return user;
        } else {
            // 登录失败，处理失败计数
            handleLoginFailure(user);

            // 登录失败
            loginLog.setUserId(user.getId());
            loginLog.setStatus(0); // 失败
            loginLog.setFailReason("密码错误");

            // 保存登录日志
            loginLogMapper.insert(loginLog);

            return null;
        }
    }

    @Override
    public boolean isAccountLocked(User user) {
        // 如果没有锁定时间，则账户未锁定
        if (user.getLockTime() == null) {
            return false;
        }

        // 检查锁定时间是否已过期
        Date now = new Date();
        return now.before(user.getLockTime());
    }

    @Override
    public void handleLoginFailure(User user) {
        // 增加登录失败次数
        userMapper.incrementLoginFailCount(user.getId());

        // 重新获取用户信息，确保获取最新的失败次数
        user = userMapper.selectById(user.getId());

        // 如果失败次数达到阈值，锁定账户
        if (user.getLoginFailCount() != null && user.getLoginFailCount() >= MAX_LOGIN_FAIL_COUNT) {
            // 计算锁定截止时间
            Calendar calendar = Calendar.getInstance();
            calendar.add(Calendar.MINUTE, LOCK_TIME_MINUTES);
            Date lockTime = calendar.getTime();

            // 设置锁定时间
            userMapper.setLockTime(user.getId(), lockTime);
        }
    }

    @Override
    public void resetLoginFailCount(User user) {
        userMapper.resetLoginFailCount(user.getId());
        // 清除锁定时间
        userMapper.setLockTime(user.getId(), null);
    }

    @Override
    public User getUserInfo(Long userId) {
        return userMapper.selectById(userId);
    }

    @Override
    public PageResult<User> listUsers(String keyword, Integer status, String startDate, String endDate, Integer pageNum, Integer pageSize) {
        // 计算分页参数
        Integer offset = (pageNum - 1) * pageSize;
        Integer limit = pageSize;

        // 查询用户列表
        List<User> users = userMapper.selectList(keyword, status, startDate, endDate, offset, limit);

        // 查询总数
        Long total = userMapper.selectCount(keyword, status, startDate, endDate);

        return new PageResult<>(total, users);
    }

    @Override
    public Object getUserStatistics() {
        // 模拟用户统计数据
        Map<String, Object> result = new HashMap<>();

        // 基础数据
        int totalUsers = 15000;
        int activeUsers = 8000;
        int newUsers = 1200;
        double retentionRate = 75.5;

        Map<String, Double> comparedToLastPeriod = new HashMap<>();
        comparedToLastPeriod.put("totalUsers", 12.5);
        comparedToLastPeriod.put("newUsers", 18.2);
        comparedToLastPeriod.put("activeUsers", 15.8);
        comparedToLastPeriod.put("retentionRate", 5.2);

        // 性别分布
        Map<String, Object> genderData = new HashMap<>();
        List<String> genderLabels = Arrays.asList("男", "女", "未知");
        List<Integer> genderValues = Arrays.asList(7500, 6800, 700);
        genderData.put("labels", genderLabels);
        genderData.put("values", genderValues);

        // 年龄分布
        Map<String, Object> ageData = new HashMap<>();
        List<String> ageLabels = Arrays.asList("18岁以下", "18-24岁", "25-34岁", "35-44岁", "45岁以上");
        List<Integer> ageValues = Arrays.asList(1500, 3000, 5000, 3500, 2000);
        ageData.put("labels", ageLabels);
        ageData.put("values", ageValues);

        // 会员等级分布
        Map<String, Object> levelData = new HashMap<>();
        List<String> levelLabels = Arrays.asList("普通会员", "银卡会员", "金卡会员", "钻石会员", "至尊会员");
        List<Integer> levelValues = Arrays.asList(9000, 3000, 1500, 1000, 500);
        levelData.put("labels", levelLabels);
        levelData.put("values", levelValues);

        // 地区分布
        Map<String, Object> regionData = new HashMap<>();
        List<String> regions = Arrays.asList("华东", "华南", "华北", "华中", "西南", "西北", "东北", "其他");
        List<Integer> regionValues = Arrays.asList(4000, 3000, 3000, 2000, 1500, 800, 500, 200);
        regionData.put("regions", regions);
        regionData.put("values", regionValues);

        // 生成最近日期数据
        List<String> dates = new ArrayList<>();
        List<Integer> newUsersData = new ArrayList<>();
        List<Integer> activeUsersData = new ArrayList<>();
        List<Integer> totalUsersData = new ArrayList<>();
        List<Double> retentionRatesData = new ArrayList<>();

        // 初始总用户数
        int runningTotalUsers = totalUsers - 500;

        Random random = new Random();
        for (int i = 0; i < 30; i++) {
            // 生成日期
            Calendar calendar = Calendar.getInstance();
            calendar.add(Calendar.DAY_OF_MONTH, i - 29);
            int month = calendar.get(Calendar.MONTH) + 1;
            int day = calendar.get(Calendar.DAY_OF_MONTH);
            dates.add(month + "/" + day);

            // 生成数据
            int dailyNewUsers = 10 + random.nextInt(90);
            newUsersData.add(dailyNewUsers);

            runningTotalUsers += dailyNewUsers;
            totalUsersData.add(runningTotalUsers);

            activeUsersData.add(50 + random.nextInt(450));
            retentionRatesData.add(60.0 + random.nextDouble() * 35.0);
        }

        Map<String, Object> timeData = new HashMap<>();
        timeData.put("dates", dates);
        timeData.put("totalUsers", totalUsersData);
        timeData.put("newUsers", newUsersData);
        timeData.put("activeUsers", activeUsersData);
        timeData.put("retentionRates", retentionRatesData);

        // 组装结果
        result.put("totalUsers", totalUsers);
        result.put("newUsers", newUsers);
        result.put("activeUsers", activeUsers);
        result.put("retentionRate", retentionRate);
        result.put("comparedToLastPeriod", comparedToLastPeriod);
        result.put("timeData", timeData);
        result.put("genderData", genderData);
        result.put("ageData", ageData);
        result.put("levelData", levelData);
        result.put("regionData", regionData);

        return result;
    }

    @Override
    public int addUser(User user) {
        // 设置默认值
        if (user.getStatus() == null) {
            user.setStatus(1);
        }
        user.setCreateTime(new Date());
        user.setUpdateTime(new Date());
        user.setRegisterTime(new Date());

        return userMapper.insert(user);
    }

    @Override
    public int updateUser(User user) {
        user.setUpdateTime(new Date());
        return userMapper.update(user);
    }

    @Override
    public int deleteUser(Long id) {
        return userMapper.deleteById(id);
    }
}
