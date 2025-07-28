import Mock from 'mockjs';

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
      createTime: Random.datetime('yyyy-MM-dd HH:mm:ss')
    }
  };
});

// 获取用户列表
Mock.mock(/\/api\/users\/list(\?.*)?$/, 'get', (options: any) => {
  const users = [];
  const levels = [
    { id: 1, name: '普通会员' },
    { id: 2, name: '银卡会员' },
    { id: 3, name: '金卡会员' },
    { id: 4, name: '钻石会员' },
    { id: 5, name: '至尊会员' }
  ];

  for (let i = 0; i < 100; i++) {
    const level = levels[Random.integer(0, levels.length - 1)];
    const gender = Random.integer(0, 2); // 0: 未知, 1: 男, 2: 女
    const status = Random.integer(0, 2); // 0: 未激活, 1: 正常, 2: 已禁用
    const registerTime = Random.datetime('yyyy-MM-dd HH:mm:ss');
    const lastLoginTime = Random.boolean() ? Random.datetime('yyyy-MM-dd HH:mm:ss') : null;
    const totalSpent = Random.float(0, 10000, 2, 2);
    const orderCount = Random.integer(0, 50);

    users.push({
      id: i + 1,
      username: `user${Random.string('lower', 5)}${i + 1}`,
      nickname: Random.cname(),
      avatar: Random.image('100x100', Random.color(), 'Avatar'),
      email: Random.email(),
      phone: Random.string('number', 11),
      gender,
      status,
      level: level.id,
      levelName: level.name,
      registerTime,
      lastLoginTime,
      totalSpent,
      orderCount
    });
  }

  // 解析查询参数
  const url = new URL(options.url, 'http://localhost');
  const pageNum = parseInt(url.searchParams.get('pageNum') || '1');
  const pageSize = parseInt(url.searchParams.get('pageSize') || '10');
  const keyword = url.searchParams.get('keyword') || '';
  const status = url.searchParams.get('status') || '';
  const level = url.searchParams.get('level') || '';
  const startDate = url.searchParams.get('startDate') || '';
  const endDate = url.searchParams.get('endDate') || '';

  // 过滤数据
  let filteredUsers = users;
  if (keyword) {
    filteredUsers = users.filter(user =>
      user.username.includes(keyword) ||
      user.nickname.includes(keyword) ||
      user.email.includes(keyword) ||
      user.phone.includes(keyword)
    );
  }

  if (status) {
    filteredUsers = filteredUsers.filter(user => user.status.toString() === status);
  }

  if (level) {
    filteredUsers = filteredUsers.filter(user => user.level.toString() === level);
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
  // 解析查询参数
  const url = new URL(options.url, 'http://localhost');
  const startDate = url.searchParams.get('startDate') || '';
  const endDate = url.searchParams.get('endDate') || '';
  const timeUnit = url.searchParams.get('timeUnit') || 'day';

  // 生成日期数组
  const dates = [];
  const totalUsers = [];
  const newUsers = [];
  const activeUsers = [];
  const retentionRates = [];

  // 根据时间单位生成不同的日期范围
  let daysCount = 30; // 默认30天

  if (timeUnit === 'week') {
    daysCount = 12; // 12周
  } else if (timeUnit === 'month') {
    daysCount = 12; // 12个月
  }

  let baseTotal = Random.integer(5000, 10000);

  for (let i = 0; i < daysCount; i++) {
    const date = new Date();
    if (timeUnit === 'day') {
      date.setDate(date.getDate() - (daysCount - 1 - i));
      dates.push(date.toISOString().split('T')[0]);
    } else if (timeUnit === 'week') {
      date.setDate(date.getDate() - (daysCount - 1 - i) * 7);
      dates.push(`第${i + 1}周`);
    } else if (timeUnit === 'month') {
      date.setMonth(date.getMonth() - (daysCount - 1 - i));
      dates.push(`${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`);
    }

    // 生成递增的总用户数
    const newUserCount = Random.integer(50, 200);
    baseTotal += newUserCount;
    totalUsers.push(baseTotal);
    newUsers.push(newUserCount);
    activeUsers.push(Random.integer(baseTotal * 0.3, baseTotal * 0.7));
    retentionRates.push(Random.float(60, 95, 1, 1));
  }

  // 生成性别分布数据
  const genderData = {
    labels: ['男', '女', '未知'],
    values: [
      Random.integer(3000, 6000),
      Random.integer(2000, 5000),
      Random.integer(100, 500)
    ]
  };

  // 生成年龄分布数据
  const ageData = {
    labels: ['18岁以下', '18-24岁', '25-34岁', '35-44岁', '45-54岁', '55岁以上'],
    values: [
      Random.integer(100, 500),
      Random.integer(1000, 2000),
      Random.integer(2000, 4000),
      Random.integer(1500, 3000),
      Random.integer(800, 1500),
      Random.integer(300, 800)
    ]
  };

  // 生成等级分布数据
  const levelData = {
    labels: ['普通会员', '银卡会员', '金卡会员', '钻石会员', '至尊会员'],
    values: [
      Random.integer(3000, 5000),
      Random.integer(1000, 2000),
      Random.integer(500, 1000),
      Random.integer(200, 500),
      Random.integer(50, 200)
    ]
  };

  // 生成地区分布数据
  const regionData = {
    regions: ['华东', '华南', '华北', '华中', '西南', '西北', '东北'],
    values: [
      Random.integer(1000, 2000),
      Random.integer(800, 1500),
      Random.integer(1200, 1800),
      Random.integer(700, 1200),
      Random.integer(500, 1000),
      Random.integer(300, 800),
      Random.integer(200, 600)
    ]
  };

  return {
    code: 200,
    message: '获取成功',
    data: {
      totalUsers: baseTotal,
      newUsers: newUsers.reduce((sum, val) => sum + val, 0),
      activeUsers: Random.integer(baseTotal * 0.4, baseTotal * 0.6),
      retentionRate: Random.float(70, 90, 1, 1),
      comparedToLastPeriod: {
        totalUsers: Random.float(5, 20, 1, 1),
        newUsers: Random.float(-10, 30, 1, 1),
        activeUsers: Random.float(-5, 25, 1, 1),
        retentionRate: Random.float(-3, 10, 1, 1)
      },
      timeData: {
        dates,
        totalUsers,
        newUsers,
        activeUsers,
        retentionRates
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
