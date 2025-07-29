import Mock from 'mockjs';

const Random = Mock.Random;

// 定义接口
interface OrderStatus {
  id: number;
  name: string;
  color: string;
}

interface PaymentMethod {
  id: number;
  name: string;
}

interface OrderSource {
  id: number;
  name: string;
}

interface Product {
  id: number;
  name: string;
  type: string;
  price: number;
  description: string;
}

interface Order {
  id: string;
  orderNo: string;
  userId: number;
  userName: string;
  packageId: number;
  packageName: string;
  packageType: string;
  price: number;
  quantity: number;
  amount: number;
  payAmount: number;
  discount: number;
  paymentMethodId: number;
  paymentMethod: string;
  source: string;
  sourceId: number;
  status: number;
  statusName: string;
  statusColor: string;
  createTime: string;
  payTime: string | null;
  completeTime: string | null;
  remark: string | null;
}

// 订单状态
const orderStatus: OrderStatus[] = [
  { id: 0, name: '待支付', color: 'warning' },
  { id: 1, name: '已支付', color: 'success' },
  { id: 2, name: '已取消', color: 'default' },
  { id: 3, name: '已退款', color: 'error' },
  { id: 4, name: '已完成', color: 'processing' }
];

// 支付方式
const paymentMethods: PaymentMethod[] = [
  { id: 1, name: '微信支付' },
  { id: 2, name: '支付宝' },
  { id: 3, name: '银行卡' },
  { id: 4, name: '余额支付' }
];

// 订单来源
const orderSources: OrderSource[] = [
  { id: 1, name: '抖音' },
  { id: 2, name: '微信' },
  { id: 3, name: '淘宝' },
  { id: 4, name: '小红书' },
  { id: 5, name: '官网' },
  { id: 6, name: '其他' }
];

// 产品数据（与packages.ts中保持一致）
const products: Product[] = [
  { id: 1, name: '小米蓝牙耳机 Air2 青春版', type: '小米蓝牙耳机', price: 199, description: '入耳式设计，支持蓝牙5.0，适合日常音乐播放和通话，性价比高。' },
  { id: 2, name: '小米手环 4', type: '小米手环', price: 299, description: '彩色大屏，支持心率监测，运动追踪，睡眠监测，续航20天，适合运动。' },
  { id: 3, name: '小米移动电源 3', type: '小米移动电源', price: 79, description: '通用分体式，多容量可选，支持快充，方便外出手机紧急充电。' },
  { id: 4, name: 'AUN 迷你投影仪', type: 'AUN 迷你投影仪', price: 300, description: '体积小巧，支持无线投影，适用于家庭娱乐，投影效果清晰。' },
  { id: 5, name: '小米路由器 4A', type: '小米路由器', price: 79, description: '双频（2.4GHz/5GHz），4根天线，信号稳定，覆盖范围广，满足家庭网络需求。' },
  { id: 6, name: 'Redmi AirDots', type: 'Redmi AirDots', price: 99.9, description: '真无线设计，蓝牙 5.0，支持双边通话和语音助手手势操作，充电盒续航长。' },
  { id: 7, name: '小爱音箱 Play', type: '小爱音箱', price: 89, description: '支持语音控制音乐播放，智能设备，性价比高，适合智能家居用户。' },
  { id: 8, name: '米家智能床灯（磁吸版）', type: '米家智能床灯', price: 49, description: '人体感应触发，可贴附在金属表面，光线柔和不刺眼，节能环保。' },
  { id: 9, name: '米家智能台灯 1S', type: '米家智能台灯', price: 169, description: '全光谱灯珠，亮度柔和，支持手机 APP 语音控制，适合阅读，分为多档亮度，保护家人用眼健康。' },
  { id: 10, name: '小米无线充电器', type: '小米无线充电器', price: 215, description: '多时器温度保护，高效散热，兼容性好，适合多种手机无线充电。' },
  { id: 11, name: '米家即热饮水机 S1', type: '米家即热饮水机', price: 258, description: '即热式出水，支持多档温度调节，小巧不占地，方便日常饮用热水。' },
  { id: 12, name: '米家随手吸尘器', type: '米家随手吸尘器', price: 209, description: '手持轻便，适合清洁缝隙，沙发，车内等小细节处，操作简单收纳方便。' },
  { id: 13, name: '倍思 65W 氮化镓充电头', type: '倍思充电头', price: 99, description: '体积小巧，兼容多种协议，可快速为手机、平板充电。' },
  { id: 14, name: '红米手环 3 Pro', type: '红米手环', price: 129, description: '支持心率监测，运动计步，多种运动模式，外观时尚，适合日常健康管理。' },
  { id: 15, name: '联想小新蓝牙耳机', type: '联想蓝牙耳机', price: 79, description: '半入耳式设计，佩戴舒适，稳定性好，适合搭配笔记本电脑使用，性价比高。' },
  { id: 16, name: 'QCY T13 ANC 真无线耳机', type: 'QCY 耳机', price: 149, description: '具有主动降噪功能，减少外界干扰，音质好，续航时间长。' },
  { id: 17, name: '小米挂脖风扇', type: '小米风扇', price: 89, description: '挂脖式设计，便携可随身携带，续航长，适合夏季户外使用。' },
  { id: 18, name: '科普园家手机补光灯', type: '补光灯', price: 59, description: '可调节亮度和色温，提升手机拍摄画面光线，适合自拍。' },
  { id: 19, name: '360 智能门锁（二手）', type: '智能门锁', price: 99, description: '支持手机 APP 查看开门记录，访客模式，视频监控，指纹解锁，保障居家安全。' },
  { id: 20, name: '绿联手机散热背夹', type: '手机散热器', price: 79, description: '贴合手机背部，通过半导体制冷，避免热量积聚，适合长时间游戏。' }
];

// 订单列表
Mock.mock(/\/api\/orders\/list(\?.*)?$/, 'get', (options: any) => {
  const orders: Order[] = [];

  for (let i = 0; i < 100; i++) {
    const statusIndex = Random.integer(0, orderStatus.length - 1);
    const status = orderStatus[statusIndex];
    const paymentMethodIndex = Random.integer(0, paymentMethods.length - 1);
    const paymentMethod = paymentMethods[paymentMethodIndex];
    const sourceIndex = Random.integer(0, orderSources.length - 1);
    const source = orderSources[sourceIndex];

    // 随机选择一个产品
    const productIndex = Random.integer(0, products.length - 1);
    const product = products[productIndex];
    const price = product.price;
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
      packageId: product.id,
      packageName: product.name,
      packageType: product.type,
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

  // 随机选择一个产品
  const productIndex = Random.integer(0, products.length - 1);
  const product = products[productIndex];
  const price = product.price;
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
      packageId: product.id,
      packageName: product.name,
      packageType: product.type,
      packageDescription: product.description,
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
    names: ['耳机/音箱', '智能穿戴', '充电设备', '智能家居', '其他配件'],
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
