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
Mock.mock(/\/api\/user\/list(\?.*)?$/, 'get', (options: any) => {
  const users = [];
  const roles = ['admin', 'operator', 'viewer'];
  const departments = ['营销部', '技术部', '客服部', '财务部'];
  const positions = ['部门经理', '主管', '专员', '助理'];

  for (let i = 0; i < 100; i++) {
    users.push({
      userId: i + 1,
      username: `user${i + 1}`,
      realName: Random.cname(),
      avatar: Random.image('100x100', Random.color(), 'Avatar'),
      roles: [roles[Random.integer(0, roles.length - 1)]],
      email: Random.email(),
      phone: Random.string('number', 11),
      department: departments[Random.integer(0, departments.length - 1)],
      position: positions[Random.integer(0, positions.length - 1)],
      status: Random.boolean() ? 1 : 0,
      createTime: Random.datetime('yyyy-MM-dd HH:mm:ss'),
      lastLoginTime: Random.datetime('yyyy-MM-dd HH:mm:ss')
    });
  }

  // 解析查询参数
  const url = new URL(options.url, 'http://localhost');
  const pageNum = parseInt(url.searchParams.get('pageNum') || '1');
  const pageSize = parseInt(url.searchParams.get('pageSize') || '10');
  const keyword = url.searchParams.get('keyword') || '';

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

// 退出登录
Mock.mock('/api/user/logout', 'post', () => {
  return {
    code: 200,
    message: '退出成功',
    data: null
  };
});
