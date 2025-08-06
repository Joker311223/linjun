import Mock from 'mockjs';
import { generateFutureDateTime, generateFutureDate, generateDateAfter, formatDate } from './utils';

const Random = Mock.Random;

// 登录接口
Mock.mock('/api/user/login', 'post', (options: any) => {
  const body = JSON.parse(options.body);
  if (body.username === 'admin' && body.password === 'admin123') {
    return {
      code: 200,
      message: '登录成功',
      data: {
        token: Random.guid(),
        userId: '1',
        username: 'admin',
        realName: '管理员',
        avatar: Random.image('100x100', '#4A7BF7', 'Avatar'),
        roles: ['admin'],
        permissions: ['*:*:*']
      }
    };
  } else {
    return {
      code: 400,
      message: '用户名或密码错误',
      data: null
    };
  }
});

// 获取用户信息
Mock.mock('/api/user/info', 'get', () => {
  return {
    code: 200,
    message: '获取成功',
    data: {
      userId: '1',
      username: 'admin',
      realName: '管理员',
      avatar: Random.image('100x100', '#4A7BF7', 'Avatar'),
      roles: ['admin'],
      permissions: ['*:*:*'],
      email: Random.email(),
      phone: Random.string('number', 11),
      department: '营销部',
      position: '部门经理',
      createTime: generateFutureDateTime() // 使用2025年7月20日之后的日期
    }
  };
});

// 获取用户列表
Mock.mock(/\/api\/users\/list(\?.*)?$/, 'get', (options: any) => {
  const users = [];

  for (let i = 0; i < 100; i++) {
    const registerTime = generateFutureDateTime(); // 使用2025年7月20日之后的日期
    const lastLoginTime = Random.boolean() ? generateFutureDateTime(undefined, 30, 60) : null; // 最后登录时间在注册时间之后
    users.push({
      id: i + 1,
      username: `user${i + 1}`,
      realName: Random.cname(),
      email: Random.email(),
      phone: Random.string('number', 11),
      status: Random.boolean() ? 1 : 0,
      roles: Random.boolean() ? ['user'] : ['user', 'editor'],
      registerTime,
      lastLoginTime,
      source: Random.pick(['官网', '微信', '抖音', '小红书', '淘宝', '其他']),
      orderCount: Random.integer(0, 50),
      totalSpent: Random.float(0, 10000, 2, 2)
    });
  }

  // 解析查询参数
  const url = new URL(options.url, 'http://localhost');
  const pageNum = parseInt(url.searchParams.get('pageNum') || '1');
  const pageSize = parseInt(url.searchParams.get('pageSize') || '10');
  const keyword = url.searchParams.get('keyword') || '';
  const status = url.searchParams.get('status') || '';
  const startDate = url.searchParams.get('startDate') || '';
  const endDate = url.searchParams.get('endDate') || '';

  // 过滤数据
  let filteredUsers = users;
  if (keyword) {
    filteredUsers = users.filter(user =>
      user.username.includes(keyword) ||
      user.realName.includes(keyword) ||
      user.email.includes(keyword) ||
      user.phone.includes(keyword)
    );
  }

  if (status) {
    filteredUsers = filteredUsers.filter(user => user.status.toString() === status);
  }

  if (startDate && endDate) {
    const start = new Date(startDate).getTime();
    const end = new Date(endDate).getTime();
    filteredUsers = filteredUsers.filter(user => {
      const registerTime = new Date(user.registerTime).getTime();
      return registerTime >= start && registerTime <= end;
    });
  }

  // 分页
  const startIndex = (pageNum - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const pagedUsers = filteredUsers.slice(startIndex, endIndex);

  return {
    code: 200,
    message: '获取成功',
    data: {
      total: filteredUsers.length,
      list: pagedUsers
    }
  };
});

// 获取用户统计数据
Mock.mock(/\/api\/users\/statistics(\?.*)?$/, 'get', (options: any) => {
  // 基础数据
  const totalUsers = Random.integer(5000, 20000);
  const activeUsers = Random.integer(Math.floor(totalUsers * 0.4), Math.floor(totalUsers * 0.6));
  const newUsers = Random.integer(Math.floor(totalUsers * 0.05), Math.floor(totalUsers * 0.2));
  const retentionRate = Random.float(60, 90, 1, 1);

  // 与上期比较的数据
  const comparedToLastPeriod = {
    totalUsers: Random.float(-10, 20, 1, 1),
    newUsers: Random.float(-15, 30, 1, 1),
    activeUsers: Random.float(-12, 25, 1, 1),
    retentionRate: Random.float(-5, 10, 1, 1)
  };

  // 性别分布
  const maleCount = Random.integer(Math.floor(totalUsers * 0.3), Math.floor(totalUsers * 0.6));
  const femaleCount = Random.integer(Math.floor(totalUsers * 0.3), Math.floor(totalUsers * 0.6));
  const unknownCount = totalUsers - maleCount - femaleCount;

  const genderData = {
    labels: ['男', '女', '未知'],
    values: [maleCount, femaleCount, unknownCount]
  };

  // 年龄分布
  const ageData = {
    labels: ['18岁以下', '18-24岁', '25-34岁', '35-44岁', '45岁以上'],
    values: [
      Random.integer(Math.floor(totalUsers * 0.05), Math.floor(totalUsers * 0.15)),
      Random.integer(Math.floor(totalUsers * 0.15), Math.floor(totalUsers * 0.25)),
      Random.integer(Math.floor(totalUsers * 0.25), Math.floor(totalUsers * 0.35)),
      Random.integer(Math.floor(totalUsers * 0.15), Math.floor(totalUsers * 0.25)),
      Random.integer(Math.floor(totalUsers * 0.05), Math.floor(totalUsers * 0.15))
    ]
  };

  // 会员等级分布
  const levelData = {
    labels: ['普通会员', '银卡会员', '金卡会员', '钻石会员', '至尊会员'],
    values: [
      Random.integer(Math.floor(totalUsers * 0.5), Math.floor(totalUsers * 0.7)),
      Random.integer(Math.floor(totalUsers * 0.15), Math.floor(totalUsers * 0.25)),
      Random.integer(Math.floor(totalUsers * 0.05), Math.floor(totalUsers * 0.15)),
      Random.integer(Math.floor(totalUsers * 0.02), Math.floor(totalUsers * 0.08)),
      Random.integer(Math.floor(totalUsers * 0.01), Math.floor(totalUsers * 0.05))
    ]
  };

  // 地区分布
  const regionData = {
    regions: ['华东', '华南', '华北', '华中', '西南', '西北', '东北', '其他'],
    values: [
      Random.integer(Math.floor(totalUsers * 0.2), Math.floor(totalUsers * 0.3)),
      Random.integer(Math.floor(totalUsers * 0.15), Math.floor(totalUsers * 0.25)),
      Random.integer(Math.floor(totalUsers * 0.15), Math.floor(totalUsers * 0.25)),
      Random.integer(Math.floor(totalUsers * 0.1), Math.floor(totalUsers * 0.2)),
      Random.integer(Math.floor(totalUsers * 0.05), Math.floor(totalUsers * 0.15)),
      Random.integer(Math.floor(totalUsers * 0.05), Math.floor(totalUsers * 0.1)),
      Random.integer(Math.floor(totalUsers * 0.05), Math.floor(totalUsers * 0.1)),
      Random.integer(Math.floor(totalUsers * 0.01), Math.floor(totalUsers * 0.05))
    ]
  };

  // 生成最近日期数据
  const dates = [];
  const newUsersData = [];
  const activeUsersData = [];
  const totalUsersData = [];
  const retentionRatesData = [];

  // 初始总用户数
  let runningTotalUsers = totalUsers - Random.integer(500, 2000);

  for (let i = 29; i >= 0; i--) {
    // 生成2025年7月20日之后的日期
    const futureDate = generateFutureDate(i, 0); // 从基准日期开始，每天递增
    const dateStr = `${futureDate.getMonth() + 1}/${futureDate.getDate()}`;
    dates.push(dateStr);

    const dailyNewUsers = Random.integer(10, 100);
    newUsersData.push(dailyNewUsers);

    // 累加总用户数
    runningTotalUsers += dailyNewUsers;
    totalUsersData.push(runningTotalUsers);

    activeUsersData.push(Random.integer(50, 500));
    retentionRatesData.push(Random.float(60, 95, 1, 1));
  }

  return {
    code: 200,
    message: '获取成功',
    data: {
      totalUsers,
      newUsers,
      activeUsers,
      retentionRate,
      comparedToLastPeriod,
      timeData: {
        dates,
        totalUsers: totalUsersData,
        newUsers: newUsersData,
        activeUsers: activeUsersData,
        retentionRates: retentionRatesData
      },
      genderData,
      ageData,
      levelData,
      regionData
    }
  };
});

// 退出登录
Mock.mock('/api/user/logout', 'post', () => {
  return {
    code: 200,
    message: '退出成功',
    data: null
  };
});
