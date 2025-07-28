import Mock from 'mockjs';

const Random = Mock.Random;

// 获取首页统计数据
Mock.mock('/api/statistics/dashboard', 'get', () => {
  // 生成最近7天的日期
  const days = [];
  const salesData = [];
  const ordersData = [];
  const usersData = [];

  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dateStr = `${date.getMonth() + 1}/${date.getDate()}`;
    days.push(dateStr);

    salesData.push(Random.float(10000, 50000, 2, 2));
    ordersData.push(Random.integer(100, 500));
    usersData.push(Random.integer(50, 200));
  }

  // 套餐类型销售占比
  const packageTypes = [
    { name: '流量套餐', value: Random.integer(30, 50) },
    { name: '通话套餐', value: Random.integer(10, 25) },
    { name: '短信套餐', value: Random.integer(5, 15) },
    { name: '增值服务', value: Random.integer(10, 20) },
    { name: '组合套餐', value: Random.integer(15, 30) }
  ];

  // 调整百分比总和为100%
  const totalPercentage = packageTypes.reduce((sum, type) => sum + type.value, 0);
  packageTypes.forEach(type => {
    type.value = Math.round((type.value / totalPercentage) * 100);
  });

  // 确保总和为100
  let sum = packageTypes.reduce((sum, type) => sum + type.value, 0);
  if (sum !== 100) {
    packageTypes[0].value += (100 - sum);
  }

  // 热门套餐排行
  const hotPackages = [];
  for (let i = 0; i < 5; i++) {
    hotPackages.push({
      id: Random.integer(1, 50),
      name: `拓天套餐${Random.integer(1, 100)}`,
      sales: Random.integer(1000, 10000),
      growth: Random.float(-30, 50, 1, 1)
    });
  }

  // 按销售量排序
  hotPackages.sort((a, b) => b.sales - a.sales);

  return {
    code: 200,
    message: '获取成功',
    data: {
      overview: {
        totalSales: Random.float(100000, 1000000, 2, 2),
        totalOrders: Random.integer(1000, 10000),
        totalUsers: Random.integer(5000, 20000),
        totalPackages: Random.integer(20, 100)
      },
      trend: {
        days,
        sales: salesData,
        orders: ordersData,
        users: usersData
      },
      packageTypes,
      hotPackages,
      recentOrders: generateRecentOrders(5)
    }
  };
});

// 获取销售统计数据
Mock.mock(/\/api\/statistics\/sales(\?.*)?$/, 'get', (options: any) => {
  // 解析查询参数
  const url = new URL(options.url, 'http://localhost');
  const timeRange = url.searchParams.get('timeRange') || 'week';

  let days = [];
  let salesData = [];
  let ordersData = [];

  // 根据时间范围生成数据
  switch (timeRange) {
    case 'week':
      // 最近7天
      for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateStr = `${date.getMonth() + 1}/${date.getDate()}`;
        days.push(dateStr);

        salesData.push(Random.float(10000, 50000, 2, 2));
        ordersData.push(Random.integer(100, 500));
      }
      break;
    case 'month':
      // 最近30天
      for (let i = 29; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateStr = `${date.getMonth() + 1}/${date.getDate()}`;
        days.push(dateStr);

        salesData.push(Random.float(10000, 50000, 2, 2));
        ordersData.push(Random.integer(100, 500));
      }
      break;
    case 'quarter':
      // 最近3个月，按周汇总
      for (let i = 11; i >= 0; i--) {
        const weekNum = 12 - i;
        days.push(`第${weekNum}周`);

        salesData.push(Random.float(50000, 200000, 2, 2));
        ordersData.push(Random.integer(500, 2000));
      }
      break;
    case 'year':
      // 最近12个月
      for (let i = 11; i >= 0; i--) {
        const date = new Date();
        date.setMonth(date.getMonth() - i);
        const dateStr = `${date.getFullYear()}/${date.getMonth() + 1}`;
        days.push(dateStr);

        salesData.push(Random.float(200000, 800000, 2, 2));
        ordersData.push(Random.integer(2000, 8000));
      }
      break;
  }

  // 套餐类型销售占比
  const packageTypes = [
    { name: '流量套餐', value: Random.integer(30, 50), sales: Random.float(100000, 500000, 2, 2) },
    { name: '通话套餐', value: Random.integer(10, 25), sales: Random.float(50000, 200000, 2, 2) },
    { name: '短信套餐', value: Random.integer(5, 15), sales: Random.float(20000, 100000, 2, 2) },
    { name: '增值服务', value: Random.integer(10, 20), sales: Random.float(50000, 150000, 2, 2) },
    { name: '组合套餐', value: Random.integer(15, 30), sales: Random.float(80000, 300000, 2, 2) }
  ];

  // 调整百分比总和为100%
  const totalPercentage = packageTypes.reduce((sum, type) => sum + type.value, 0);
  packageTypes.forEach(type => {
    type.value = Math.round((type.value / totalPercentage) * 100);
  });

  // 确保总和为100
  let sum = packageTypes.reduce((sum, type) => sum + type.value, 0);
  if (sum !== 100) {
    packageTypes[0].value += (100 - sum);
  }

  // 热门套餐排行
  const hotPackages = [];
  for (let i = 0; i < 10; i++) {
    hotPackages.push({
      id: Random.integer(1, 50),
      name: `拓天套餐${Random.integer(1, 100)}`,
      sales: Random.float(10000, 100000, 2, 2),
      orders: Random.integer(100, 1000),
      growth: Random.float(-30, 50, 1, 1)
    });
  }

  // 按销售额排序
  hotPackages.sort((a, b) => b.sales - a.sales);

  // 销售渠道分布
  const channels = [
    { name: '官网', value: Random.integer(30, 50) },
    { name: '移动APP', value: Random.integer(20, 40) },
    { name: '微信小程序', value: Random.integer(10, 30) },
    { name: '线下门店', value: Random.integer(5, 20) },
    { name: '第三方平台', value: Random.integer(5, 15) }
  ];

  // 调整百分比总和为100%
  const totalChannelPercentage = channels.reduce((sum, channel) => sum + channel.value, 0);
  channels.forEach(channel => {
    channel.value = Math.round((channel.value / totalChannelPercentage) * 100);
  });

  // 确保总和为100
  let channelSum = channels.reduce((sum, channel) => sum + channel.value, 0);
  if (channelSum !== 100) {
    channels[0].value += (100 - channelSum);
  }

  return {
    code: 200,
    message: '获取成功',
    data: {
      overview: {
        totalSales: salesData.reduce((sum, sales) => sum + sales, 0),
        totalOrders: ordersData.reduce((sum, orders) => sum + orders, 0),
        averageOrderValue: (salesData.reduce((sum, sales) => sum + sales, 0) / ordersData.reduce((sum, orders) => sum + orders, 0)).toFixed(2),
        salesGrowth: Random.float(-20, 50, 1, 1)
      },
      trend: {
        days,
        sales: salesData,
        orders: ordersData
      },
      packageTypes,
      hotPackages,
      channels
    }
  };
});

// 获取用户统计数据
Mock.mock(/\/api\/statistics\/users(\?.*)?$/, 'get', (options: any) => {
  // 解析查询参数
  const url = new URL(options.url, 'http://localhost');
  const timeRange = url.searchParams.get('timeRange') || 'week';

  let days = [];
  let newUsersData = [];
  let activeUsersData = [];

  // 根据时间范围生成数据
  switch (timeRange) {
    case 'week':
      // 最近7天
      for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateStr = `${date.getMonth() + 1}/${date.getDate()}`;
        days.push(dateStr);

        newUsersData.push(Random.integer(50, 200));
        activeUsersData.push(Random.integer(500, 2000));
      }
      break;
    case 'month':
      // 最近30天
      for (let i = 29; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateStr = `${date.getMonth() + 1}/${date.getDate()}`;
        days.push(dateStr);

        newUsersData.push(Random.integer(50, 200));
        activeUsersData.push(Random.integer(500, 2000));
      }
      break;
    case 'quarter':
      // 最近3个月，按周汇总
      for (let i = 11; i >= 0; i--) {
        const weekNum = 12 - i;
        days.push(`第${weekNum}周`);

        newUsersData.push(Random.integer(300, 1000));
        activeUsersData.push(Random.integer(3000, 10000));
      }
      break;
    case 'year':
      // 最近12个月
      for (let i = 11; i >= 0; i--) {
        const date = new Date();
        date.setMonth(date.getMonth() - i);
        const dateStr = `${date.getFullYear()}/${date.getMonth() + 1}`;
        days.push(dateStr);

        newUsersData.push(Random.integer(1000, 3000));
        activeUsersData.push(Random.integer(10000, 30000));
      }
      break;
  }

  // 用户年龄分布
  const ageGroups = [
    { name: '18岁以下', value: Random.integer(5, 15) },
    { name: '18-24岁', value: Random.integer(15, 25) },
    { name: '25-34岁', value: Random.integer(25, 35) },
    { name: '35-44岁', value: Random.integer(15, 25) },
    { name: '45-54岁', value: Random.integer(10, 20) },
    { name: '55岁以上', value: Random.integer(5, 15) }
  ];

  // 调整百分比总和为100%
  const totalAgePercentage = ageGroups.reduce((sum, group) => sum + group.value, 0);
  ageGroups.forEach(group => {
    group.value = Math.round((group.value / totalAgePercentage) * 100);
  });

  // 确保总和为100
  let ageSum = ageGroups.reduce((sum, group) => sum + group.value, 0);
  if (ageSum !== 100) {
    ageGroups[0].value += (100 - ageSum);
  }

  // 用户性别分布
  const genderData = [
    { name: '男', value: Random.integer(40, 60) },
    { name: '女', value: Random.integer(40, 60) }
  ];

  // 调整百分比总和为100%
  const totalGenderPercentage = genderData.reduce((sum, gender) => sum + gender.value, 0);
  genderData.forEach(gender => {
    gender.value = Math.round((gender.value / totalGenderPercentage) * 100);
  });

  // 确保总和为100
  let genderSum = genderData.reduce((sum, gender) => sum + gender.value, 0);
  if (genderSum !== 100) {
    genderData[0].value += (100 - genderSum);
  }

  // 用户地区分布
  const regionData = [
    { name: '华东', value: Random.integer(20, 30) },
    { name: '华南', value: Random.integer(15, 25) },
    { name: '华北', value: Random.integer(15, 25) },
    { name: '华中', value: Random.integer(10, 20) },
    { name: '西南', value: Random.integer(10, 20) },
    { name: '西北', value: Random.integer(5, 15) },
    { name: '东北', value: Random.integer(5, 15) }
  ];

  // 调整百分比总和为100%
  const totalRegionPercentage = regionData.reduce((sum, region) => sum + region.value, 0);
  regionData.forEach(region => {
    region.value = Math.round((region.value / totalRegionPercentage) * 100);
  });

  // 确保总和为100
  let regionSum = regionData.reduce((sum, region) => sum + region.value, 0);
  if (regionSum !== 100) {
    regionData[0].value += (100 - regionSum);
  }

  return {
    code: 200,
    message: '获取成功',
    data: {
      overview: {
        totalUsers: Random.integer(10000, 50000),
        newUsers: newUsersData.reduce((sum, users) => sum + users, 0),
        activeUsers: activeUsersData.reduce((sum, users) => sum + users, 0),
        userGrowth: Random.float(-10, 30, 1, 1)
      },
      trend: {
        days,
        newUsers: newUsersData,
        activeUsers: activeUsersData
      },
      ageGroups,
      genderData,
      regionData
    }
  };
});

// 生成最近订单数据
function generateRecentOrders(count: number) {
  const orders = [];
  const packageTypes = ['流量套餐', '通话套餐', '短信套餐', '增值服务', '组合套餐'];
  const paymentMethods = ['微信支付', '支付宝', '银行卡', '余额支付'];
  const orderStatus = ['待支付', '已支付', '已取消', '已退款'];

  for (let i = 0; i < count; i++) {
    orders.push({
      id: `ORD${Random.string('number', 8)}`,
      packageName: `拓天${Random.pick(packageTypes)}${Random.integer(1, 100)}`,
      packageType: Random.pick(packageTypes),
      amount: Random.float(10, 500, 2, 2),
      paymentMethod: Random.pick(paymentMethods),
      status: Random.pick(orderStatus),
      createTime: Random.datetime('yyyy-MM-dd HH:mm:ss')
    });
  }

  return orders;
}
