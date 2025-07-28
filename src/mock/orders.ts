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

// 支付方式
const paymentMethods = [
  { id: 1, name: '微信支付' },
  { id: 2, name: '支付宝' },
  { id: 3, name: '银行卡' },
  { id: 4, name: '余额支付' }
];

// 订单来源
const orderSources = [
  { id: 1, name: '抖音' },
  { id: 2, name: '微信' },
  { id: 3, name: '淘宝' },
  { id: 4, name: '小红书' },
  { id: 5, name: '官网' },
  { id: 6, name: '其他' }
];

// 订单列表
Mock.mock(/\/api\/orders\/list(\?.*)?$/, 'get', (options: any) => {
  const orders = [];
  const packageTypes = ['流量套餐', '通话套餐', '短信套餐', '增值服务', '组合套餐'];

  for (let i = 0; i < 100; i++) {
    const statusIndex = Random.integer(0, orderStatus.length - 1);
    const status = orderStatus[statusIndex];
    const paymentMethodIndex = Random.integer(0, paymentMethods.length - 1);
    const paymentMethod = paymentMethods[paymentMethodIndex];
    const sourceIndex = Random.integer(0, orderSources.length - 1);
    const source = orderSources[sourceIndex];
    const packageType = Random.pick(packageTypes);
    const price = Random.float(10, 500, 2, 2);
    const quantity = Random.integer(1, 5);
    const amount = price * quantity;

    // 生成订单时间
    const now = new Date();
    let createTime, payTime, completeTime;

    createTime = new Date(now.getTime() - Random.integer(1, 90) * 24 * 60 * 60 * 1000);

    if (status.id === 0) { // 待支付
      payTime = null;
      completeTime = null;
    } else if (status.id === 2) { // 已取消
      payTime = null;
      completeTime = new Date(createTime.getTime() + Random.integer(1, 24) * 60 * 60 * 1000);
    } else { // 已支付、已退款、已完成
      payTime = new Date(createTime.getTime() + Random.integer(1, 24) * 60 * 60 * 1000);
      if (status.id === 1) { // 已支付
        completeTime = null;
      } else { // 已退款、已完成
        completeTime = new Date(payTime.getTime() + Random.integer(1, 48) * 60 * 60 * 1000);
      }
    }

    orders.push({
      id: `ORD${Random.string('number', 8)}`,
      orderNo: `ORD${Random.string('number', 12)}`,
      userId: Random.integer(1, 1000),
      userName: Random.cname(),
      packageId: Random.integer(1, 50),
      packageName: `拓天${packageType}${Random.integer(1, 100)}`,
      packageType,
      price,
      quantity,
      amount,
      payAmount: Random.float(price * 0.7, price, 2, 2),
      discount: Random.float(0, price * 0.3, 2, 2),
      paymentMethodId: paymentMethod.id,
      paymentMethod: paymentMethod.name,
      source: source.name,
      sourceId: source.id,
      status: status.id,
      statusName: status.name,
      statusColor: status.color,
      createTime: Random.datetime('yyyy-MM-dd HH:mm:ss'),
      payTime: payTime ? Random.datetime('yyyy-MM-dd HH:mm:ss') : null,
      completeTime: completeTime ? Random.datetime('yyyy-MM-dd HH:mm:ss') : null,
      remark: Random.boolean() ? Random.paragraph(1) : null
    });
  }

  // 解析查询参数
  const url = new URL(options.url, 'http://localhost');
  const pageNum = parseInt(url.searchParams.get('pageNum') || '1');
  const pageSize = parseInt(url.searchParams.get('pageSize') || '10');
  const keyword = url.searchParams.get('keyword') || '';
  const status = url.searchParams.get('status') || '';
  const dateRange = url.searchParams.get('dateRange') || '';
  const source = url.searchParams.get('source') || '';

  // 过滤数据
  let filteredOrders = orders;
  if (keyword) {
    filteredOrders = orders.filter(order =>
      order.id.includes(keyword) ||
      order.userName.includes(keyword) ||
      order.packageName.includes(keyword)
    );
  }

  if (status) {
    filteredOrders = filteredOrders.filter(order => order.status.toString() === status);
  }

  if (source) {
    filteredOrders = filteredOrders.filter(order => order.source === source);
  }

  if (dateRange) {
    const [startDate, endDate] = dateRange.split(',');
    if (startDate && endDate) {
      const start = new Date(startDate).getTime();
      const end = new Date(endDate).getTime();
      filteredOrders = filteredOrders.filter(order => {
        const orderTime = new Date(order.createTime).getTime();
        return orderTime >= start && orderTime <= end;
      });
    }
  }

  // 分页
  const startIndex = (pageNum - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const pagedOrders = filteredOrders.slice(startIndex, endIndex);

  return {
    code: 200,
    message: '获取成功',
    data: {
      total: filteredOrders.length,
      list: pagedOrders
    }
  };
});

// 获取订单状态
Mock.mock('/api/orders/status', 'get', () => {
  return {
    code: 200,
    message: '获取成功',
    data: orderStatus
  };
});

// 获取支付方式
Mock.mock('/api/orders/payment-methods', 'get', () => {
  return {
    code: 200,
    message: '获取成功',
    data: paymentMethods
  };
});

// 获取订单来源
Mock.mock('/api/orders/sources', 'get', () => {
  return {
    code: 200,
    message: '获取成功',
    data: orderSources
  };
});

// 获取订单详情
Mock.mock(/\/api\/orders\/detail\/\w+$/, 'get', (options: any) => {
  const url = options.url;
  const id = url.substring(url.lastIndexOf('/') + 1);

  const statusIndex = Random.integer(0, orderStatus.length - 1);
  const status = orderStatus[statusIndex];
  const paymentMethodIndex = Random.integer(0, paymentMethods.length - 1);
  const paymentMethod = paymentMethods[paymentMethodIndex];
  const sourceIndex = Random.integer(0, orderSources.length - 1);
  const source = orderSources[sourceIndex];
  const packageType = Random.pick(['流量套餐', '通话套餐', '短信套餐', '增值服务', '组合套餐']);
  const price = Random.float(10, 500, 2, 2);
  const quantity = Random.integer(1, 5);
  const amount = price * quantity;

  // 生成订单时间
  const now = new Date();
  let createTime, payTime, completeTime;

  createTime = new Date(now.getTime() - Random.integer(1, 90) * 24 * 60 * 60 * 1000);

  if (status.id === 0) { // 待支付
    payTime = null;
    completeTime = null;
  } else if (status.id === 2) { // 已取消
    payTime = null;
    completeTime = new Date(createTime.getTime() + Random.integer(1, 24) * 60 * 60 * 1000);
  } else { // 已支付、已退款、已完成
    payTime = new Date(createTime.getTime() + Random.integer(1, 24) * 60 * 60 * 1000);
    if (status.id === 1) { // 已支付
      completeTime = null;
    } else { // 已退款、已完成
      completeTime = new Date(payTime.getTime() + Random.integer(1, 48) * 60 * 60 * 1000);
    }
  }

  // 生成订单日志
  const logs = [];
  logs.push({
    id: 1,
    orderId: id,
    action: '创建订单',
    operator: '系统',
    operateTime: Random.datetime('yyyy-MM-dd HH:mm:ss'),
    details: `用户通过${source.name}创建订单`
  });

  if (status.id !== 0) {
    if (status.id === 2) { // 已取消
      logs.push({
        id: 2,
        orderId: id,
        action: '取消订单',
        operator: Random.boolean() ? '系统' : Random.cname(),
        operateTime: Random.datetime('yyyy-MM-dd HH:mm:ss'),
        details: Random.boolean() ? '用户取消订单' : '超时未支付，系统自动取消'
      });
    } else { // 已支付、已退款、已完成
      logs.push({
        id: 2,
        orderId: id,
        action: '支付订单',
        operator: Random.cname(),
        operateTime: Random.datetime('yyyy-MM-dd HH:mm:ss'),
        details: `用户通过${paymentMethod.name}支付订单`
      });

      if (status.id === 3) { // 已退款
        logs.push({
          id: 3,
          orderId: id,
          action: '退款订单',
          operator: Random.cname(),
          operateTime: Random.datetime('yyyy-MM-dd HH:mm:ss'),
          details: Random.boolean() ? '用户申请退款' : '系统自动退款'
        });
      } else if (status.id === 4) { // 已完成
        logs.push({
          id: 3,
          orderId: id,
          action: '完成订单',
          operator: '系统',
          operateTime: Random.datetime('yyyy-MM-dd HH:mm:ss'),
          details: '订单服务已完成'
        });
      }
    }
  }

  return {
    code: 200,
    message: '获取成功',
    data: {
      id,
      userId: Random.integer(1, 1000),
      userName: Random.cname(),
      userPhone: Random.string('number', 11),
      packageId: Random.integer(1, 50),
      packageName: `拓天${packageType}${Random.integer(1, 100)}`,
      packageType,
      packageDescription: `${packageType}描述信息`,
      price,
      quantity,
      amount,
      discount: Random.float(0, price * 0.3, 2, 2),
      paymentMethodId: paymentMethod.id,
      paymentMethodName: paymentMethod.name,
      source: source.name,
      sourceId: source.id,
      status: status.id,
      statusName: status.name,
      statusColor: status.color,
      createTime: Random.datetime('yyyy-MM-dd HH:mm:ss'),
      payTime: payTime ? Random.datetime('yyyy-MM-dd HH:mm:ss') : null,
      completeTime: completeTime ? Random.datetime('yyyy-MM-dd HH:mm:ss') : null,
      remark: Random.boolean() ? Random.paragraph(1) : null,
      logs
    }
  };
});

// 订单统计数据
Mock.mock(/\/api\/orders\/statistics(\?.*)?$/, 'get', (options: any) => {
  // 解析查询参数
  const url = new URL(options.url, 'http://localhost');
  const startDate = url.searchParams.get('startDate') || '';
  const endDate = url.searchParams.get('endDate') || '';
  const timeUnit = url.searchParams.get('timeUnit') || 'day';

  // 生成日期数组
  const dates = [];
  const amounts = [];
  const orders = [];
  const retentionRates = [];

  // 根据时间单位生成不同的日期范围
  let daysCount = 30; // 默认30天

  if (timeUnit === 'week') {
    daysCount = 12; // 12周
  } else if (timeUnit === 'month') {
    daysCount = 12; // 12个月
  }

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

    // 生成随机数据
    amounts.push(Random.float(10000, 50000, 2, 2));
    orders.push(Random.integer(100, 500));
    retentionRates.push(Random.float(60, 95, 1, 1));
  }

  // 生成套餐销售分布数据
  const packageData = {
    names: ['流量套餐', '通话套餐', '短信套餐', '增值服务', '组合套餐'],
    values: [
      Random.integer(100, 500),
      Random.integer(80, 400),
      Random.integer(50, 300),
      Random.integer(30, 200),
      Random.integer(70, 350)
    ]
  };

  // 生成支付方式分布数据
  const payMethodData = {
    methods: ['微信支付', '支付宝', '银行卡', '余额支付'],
    values: [
      Random.integer(200, 600),
      Random.integer(150, 500),
      Random.integer(50, 200),
      Random.integer(20, 100)
    ]
  };

  // 生成订单来源分布数据
  const sourceData = {
    sources: orderSources.map(source => source.name),
    values: orderSources.map(() => Random.integer(50, 300))
  };

  return {
    code: 200,
    message: '获取成功',
    data: {
      totalAmount: Random.float(100000, 500000, 2, 2),
      totalOrders: Random.integer(1000, 5000),
      activeUsers: Random.integer(500, 2000),
      retentionRate: Random.float(70, 90, 1, 1),
      comparedToLastPeriod: {
        amount: Random.float(-20, 50, 1, 1),
        orders: Random.float(-15, 40, 1, 1),
        activeUsers: Random.float(-10, 30, 1, 1),
        retentionRate: Random.float(-5, 15, 1, 1)
      },
      timeData: {
        dates,
        amounts,
        orders,
        retentionRates
      },
      packageData,
      payMethodData,
      sourceData,
      regionData: {
        regions: ['华东', '华南', '华北', '华中', '西南', '西北', '东北'],
        values: [
          Random.integer(100, 500),
          Random.integer(80, 400),
          Random.integer(120, 450),
          Random.integer(70, 350),
          Random.integer(60, 300),
          Random.integer(40, 200),
          Random.integer(30, 150)
        ]
      }
    }
  };
});
