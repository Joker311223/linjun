import Mock from 'mockjs';

const Random = Mock.Random;

// 订单状态
const orderStatus = [
  { id: 0, name: '待支付', color: 'warning' },
  { id: 1, name: '已支付', color: 'success' },
  { id: 2, name: '已取消', color: 'default' },
  { id: 3, name: '已退款', color: 'error' },
  { id: 4, name: '已完成', color: 'processing' }
];

// 订单来源
const orderSources = [
  { id: 'douyin', name: '抖音', color: 'volcano', icon: 'douyin' },
  { id: 'wechat', name: '微信', color: 'green', icon: 'wechat' },
  { id: 'taobao', name: '淘宝', color: 'orange', icon: 'taobao' },
  { id: 'xiaohongshu', name: '小红书', color: 'red', icon: 'xiaohongshu' },
  { id: 'other', name: '其他渠道', color: 'default', icon: 'other' }
];

// 套餐类型
const packageTypes = ['流量套餐', '通话套餐', '短信套餐', '增值服务', '组合套餐'];

// 生成订单来源数据
const generateSourceData = (sourceId: string) => {
  // 根据不同来源设置不同的数据范围
  let orderRange = [100, 500];
  let salesRange = [10000, 50000];
  let conversionRange = [10, 30];
  let growthRange = [-20, 40];

  switch (sourceId) {
    case 'douyin':
      orderRange = [300, 800];
      salesRange = [30000, 80000];
      conversionRange = [15, 35];
      growthRange = [10, 50];
      break;
    case 'wechat':
      orderRange = [200, 600];
      salesRange = [20000, 60000];
      conversionRange = [12, 28];
      growthRange = [5, 30];
      break;
    case 'taobao':
      orderRange = [150, 450];
      salesRange = [15000, 45000];
      conversionRange = [8, 25];
      growthRange = [-5, 20];
      break;
    case 'xiaohongshu':
      orderRange = [100, 400];
      salesRange = [10000, 40000];
      conversionRange = [10, 30];
      growthRange = [0, 35];
      break;
    default:
      orderRange = [50, 200];
      salesRange = [5000, 20000];
      conversionRange = [5, 20];
      growthRange = [-10, 15];
  }

  // 生成概览数据
  const totalOrders = Random.integer(orderRange[0], orderRange[1]);
  const totalSales = Random.float(salesRange[0], salesRange[1], 2, 2);
  const conversion = Random.float(conversionRange[0], conversionRange[1], 1, 2);
  const growth = Random.float(growthRange[0], growthRange[1], 1, 2);

  // 生成时间序列数据
  const dates = [];
  const orders = [];
  const sales = [];

  for (let i = 29; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    dates.push(`${date.getMonth() + 1}/${date.getDate()}`);

    // 根据来源特性生成不同的数据趋势
    let orderFactor = 1;
    let salesFactor = 1;

    if (sourceId === 'douyin') {
      // 抖音订单在周末增加
      const dayOfWeek = date.getDay();
      orderFactor = (dayOfWeek === 0 || dayOfWeek === 6) ? 1.5 : 1;
    } else if (sourceId === 'wechat') {
      // 微信订单在工作日更多
      const dayOfWeek = date.getDay();
      orderFactor = (dayOfWeek >= 1 && dayOfWeek <= 5) ? 1.3 : 0.8;
    }

    // 生成当天订单数和销售额
    const dailyOrders = Math.round(Random.integer(orderRange[0] / 30, orderRange[1] / 30) * orderFactor);
    orders.push(dailyOrders);

    const dailySales = Random.float(salesRange[0] / 30, salesRange[1] / 30, 2, 2) * orderFactor;
    sales.push(dailySales);
  }

  // 生成热门产品数据
  const topProducts = [];
  for (let i = 0; i < 6; i++) {
    const productGrowth = Random.float(-30, 60, 1, 1);
    topProducts.push({
      id: Random.integer(1, 100),
      name: `${Random.pick(packageTypes)}${Random.integer(1, 100)}`,
      sales: Random.float(1000, 10000, 2, 2),
      orders: Random.integer(10, 100),
      growth: productGrowth
    });
  }

  // 按销售额排序
  topProducts.sort((a, b) => b.sales - a.sales);

  // 生成最近订单数据
  const recentOrders = [];
  for (let i = 0; i < 10; i++) {
    const statusIndex = Random.integer(0, orderStatus.length - 1);
    const status = orderStatus[statusIndex];

    recentOrders.push({
      id: `ORD${Random.string('number', 8)}`,
      orderNo: `ORD${Random.string('number', 12)}`,
      userName: Random.cname(),
      packageName: `${Random.pick(packageTypes)}${Random.integer(1, 100)}`,
      amount: Random.float(10, 500, 2, 2),
      status: status.id,
      statusName: status.name,
      statusColor: status.color,
      createTime: Random.datetime('yyyy-MM-dd HH:mm:ss')
    });
  }

  // 按创建时间排序，最新的在前
  recentOrders.sort((a, b) => new Date(b.createTime).getTime() - new Date(a.createTime).getTime());

  return {
    overview: {
      totalOrders,
      totalSales,
      conversion,
      growth
    },
    timeData: {
      dates,
      orders,
      sales
    },
    topProducts,
    recentOrders
  };
};

// 获取订单来源列表
Mock.mock('/api/sources/list', 'get', () => {
  return {
    code: 200,
    message: '获取成功',
    data: orderSources
  };
});

// 获取特定订单来源数据
Mock.mock(/\/api\/sources\/\w+(\?.*)?$/, 'get', (options: any) => {
  const url = options.url;
  const sourceId = url.match(/\/api\/sources\/(\w+)/)[1];

  // 检查是否是有效的来源ID
  const source = orderSources.find(s => s.id === sourceId);
  if (!source) {
    return {
      code: 404,
      message: '未找到该来源数据',
      data: null
    };
  }

  return {
    code: 200,
    message: '获取成功',
    data: generateSourceData(sourceId)
  };
});

// 获取订单来源统计数据
Mock.mock('/api/sources/statistics', 'get', () => {
  const sourceStats = orderSources.map(source => {
    return {
      id: source.id,
      name: source.name,
      orders: Random.integer(100, 1000),
      sales: Random.float(10000, 100000, 2, 2),
      conversion: Random.float(5, 35, 1, 2),
      growth: Random.float(-20, 50, 1, 2)
    };
  });

  // 按订单量排序
  sourceStats.sort((a, b) => b.orders - a.orders);

  return {
    code: 200,
    message: '获取成功',
    data: sourceStats
  };
});
