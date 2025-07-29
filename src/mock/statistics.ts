import Mock from 'mockjs';

const Random = Mock.Random;

// 定义接口
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

interface ProductType {
  name: string;
  value: number;
}

interface HotPackage {
  id: number;
  name: string;
  sales: number;
  growth: number;
  orders?: number;
}

interface RecentOrder {
  id: string;
  packageName: string;
  packageType: string;
  amount: number;
  paymentMethod: string;
  source: string;
  status: string;
  createTime: string;
}

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
  { id: 10, name: '小米无线充电器', type: '小米无线充电器', price: 215, description: '多时器温度保护，高效散热，兼容性好，适合多种手机无线充电。' }
];

// 产品类型分组
const productTypes: ProductType[] = [
  { name: '耳机/音箱', value: 30 },
  { name: '智能穿戴', value: 25 },
  { name: '充电设备', value: 20 },
  { name: '智能家居', value: 15 },
  { name: '其他配件', value: 10 }
];

// 获取首页统计数据
Mock.mock('/api/statistics/dashboard', 'get', () => {
  // 生成最近7天的日期
  const days: string[] = [];
  const salesData: number[] = [];
  const ordersData: number[] = [];
  const usersData: number[] = [];

  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dateStr = `${date.getMonth() + 1}/${date.getDate()}`;
    days.push(dateStr);

    salesData.push(Random.float(10000, 50000, 2, 2));
    ordersData.push(Random.integer(100, 500));
    usersData.push(Random.integer(50, 200));
  }

  // 热门套餐排行
  const hotPackages: HotPackage[] = [
    { id: 1, name: '小米蓝牙耳机 Air2 青春版', sales: Random.integer(1000, 10000), growth: Random.float(-30, 50, 1, 1) },
    { id: 2, name: '小米手环 4', sales: Random.integer(1000, 9000), growth: Random.float(-30, 50, 1, 1) },
    { id: 4, name: 'AUN 迷你投影仪', sales: Random.integer(1000, 8000), growth: Random.float(-30, 50, 1, 1) },
    { id: 6, name: 'Redmi AirDots', sales: Random.integer(1000, 7000), growth: Random.float(-30, 50, 1, 1) },
    { id: 9, name: '米家智能台灯 1S', sales: Random.integer(1000, 6000), growth: Random.float(-30, 50, 1, 1) }
  ];

  // 按销售量排序
  hotPackages.sort((a, b) => b.sales - a.sales);

  // 订单来源数据
  const sourceData = {
    sources: orderSources.map(source => source.name),
    values: orderSources.map(() => Random.integer(50, 300))
  };

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
      packageTypes: productTypes,
      hotPackages,
      sourceData,
      recentOrders: generateRecentOrders(5)
    }
  };
});

// 获取销售统计数据
Mock.mock(/\/api\/statistics\/sales(\?.*)?$/, 'get', (options: any) => {
  // 解析查询参数
  const url = new URL(options.url, 'http://localhost');
  const timeRange = url.searchParams.get('timeRange') || 'week';

  let days: string[] = [];
  let salesData: number[] = [];
  let ordersData: number[] = [];

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

  // 热门套餐排行
  const hotPackages: HotPackage[] = [
    { id: 1, name: '小米蓝牙耳机 Air2 青春版', sales: Random.float(10000, 100000, 2, 2), orders: Random.integer(100, 1000), growth: Random.float(-30, 50, 1, 1) },
    { id: 2, name: '小米手环 4', sales: Random.float(9000, 90000, 2, 2), orders: Random.integer(90, 900), growth: Random.float(-30, 50, 1, 1) },
    { id: 4, name: 'AUN 迷你投影仪', sales: Random.float(8000, 80000, 2, 2), orders: Random.integer(80, 800), growth: Random.float(-30, 50, 1, 1) },
    { id: 6, name: 'Redmi AirDots', sales: Random.float(7000, 70000, 2, 2), orders: Random.integer(70, 700), growth: Random.float(-30, 50, 1, 1) },
    { id: 9, name: '米家智能台灯 1S', sales: Random.float(6000, 60000, 2, 2), orders: Random.integer(60, 600), growth: Random.float(-30, 50, 1, 1) },
    { id: 10, name: '小米无线充电器', sales: Random.float(5000, 50000, 2, 2), orders: Random.integer(50, 500), growth: Random.float(-30, 50, 1, 1) },
    { id: 3, name: '小米移动电源 3', sales: Random.float(4000, 40000, 2, 2), orders: Random.integer(40, 400), growth: Random.float(-30, 50, 1, 1) },
    { id: 5, name: '小米路由器 4A', sales: Random.float(3000, 30000, 2, 2), orders: Random.integer(30, 300), growth: Random.float(-30, 50, 1, 1) },
    { id: 7, name: '小爱音箱 Play', sales: Random.float(2000, 20000, 2, 2), orders: Random.integer(20, 200), growth: Random.float(-30, 50, 1, 1) },
    { id: 8, name: '米家智能床灯（磁吸版）', sales: Random.float(1000, 10000, 2, 2), orders: Random.integer(10, 100), growth: Random.float(-30, 50, 1, 1) }
  ];

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

  // 订单来源数据
  const sourceData = {
    sources: orderSources.map(source => source.name),
    values: orderSources.map(() => Random.integer(50, 300))
  };

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
      packageTypes: productTypes,
      hotPackages,
      channels,
      sourceData
    }
  };
});

// 获取用户统计数据
Mock.mock(/\/api\/statistics\/users(\?.*)?$/, 'get', (options: any) => {
  // 解析查询参数
  const url = new URL(options.url, 'http://localhost');
  const timeRange = url.searchParams.get('timeRange') || 'week';

  let days: string[] = [];
  let newUsersData: number[] = [];
  let activeUsersData: number[] = [];

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
function generateRecentOrders(count: number): RecentOrder[] {
  const orders: RecentOrder[] = [];
  const paymentMethods = ['微信支付', '支付宝', '银行卡', '余额支付'];
  const orderStatus = ['待支付', '已支付', '已取消', '已退款'];

  for (let i = 0; i < count; i++) {
    // 随机选择一个产品
    const productIndex = Random.integer(0, products.length - 1);
    const product = products[productIndex];

    orders.push({
      id: `ORD${Random.string('number', 8)}`,
      packageName: product.name,
      packageType: product.type,
      amount: product.price,
      paymentMethod: Random.pick(paymentMethods),
      source: Random.pick(orderSources.map(source => source.name)),
      status: Random.pick(orderStatus),
      createTime: Random.datetime('yyyy-MM-dd HH:mm:ss')
    });
  }

  return orders;
}
