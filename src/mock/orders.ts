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

// 订单列表
Mock.mock(/\/api\/orders\/list(\?.*)?$/, 'get', (options: any) => {
  const orders = [];
  const packageTypes = ['流量套餐', '通话套餐', '短信套餐', '增值服务', '组合套餐'];

  for (let i = 0; i < 100; i++) {
    const statusIndex = Random.integer(0, orderStatus.length - 1);
    const status = orderStatus[statusIndex];
    const paymentMethodIndex = Random.integer(0, paymentMethods.length - 1);
    const paymentMethod = paymentMethods[paymentMethodIndex];
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
      userId: Random.integer(1, 1000),
      userName: Random.cname(),
      packageId: Random.integer(1, 50),
      packageName: `拓天${packageType}${Random.integer(1, 100)}`,
      packageType,
      price,
      quantity,
      amount,
      discount: Random.float(0, price * 0.3, 2, 2),
      paymentMethodId: paymentMethod.id,
      paymentMethodName: paymentMethod.name,
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

// 获取订单详情
Mock.mock(/\/api\/orders\/detail\/\w+$/, 'get', (options: any) => {
  const url = options.url;
  const id = url.substring(url.lastIndexOf('/') + 1);

  const statusIndex = Random.integer(0, orderStatus.length - 1);
  const status = orderStatus[statusIndex];
  const paymentMethodIndex = Random.integer(0, paymentMethods.length - 1);
  const paymentMethod = paymentMethods[paymentMethodIndex];
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
    details: '用户创建订单'
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
