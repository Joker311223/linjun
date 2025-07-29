import Mock from 'mockjs';

const Random = Mock.Random;

// 定义Package接口
interface Package {
  id: number;
  name: string;
  code: string;
  type: number;
  typeName: string;
  description: string;
  price: number;
  discountPrice: number;
  features: string[];
  duration: number;
  durationUnit: string;
  status: number;
  isHot: boolean;
  isRecommended: boolean;
  salesCount: number;
  createTime: string;
  updateTime: string;
}

// 定义产品接口
interface Product {
  id: number;
  name: string;
  type: number;
  price: number;
  description: string;
}

// 套餐类型 - 根据图片中的实际数据更新
const packageTypes = [
  { id: 1, name: '小米蓝牙耳机', code: 'XIAOMI_EARPHONE' },
  { id: 2, name: '小米手环', code: 'XIAOMI_BAND' },
  { id: 3, name: '小米移动电源', code: 'XIAOMI_POWER' },
  { id: 4, name: 'AUN 迷你投影仪', code: 'AUN_PROJECTOR' },
  { id: 5, name: '小米路由器', code: 'XIAOMI_ROUTER' },
  { id: 6, name: 'Redmi AirDots', code: 'REDMI_AIRDOTS' },
  { id: 7, name: '小爱音箱', code: 'XIAOMI_SPEAKER' },
  { id: 8, name: '米家智能床灯', code: 'MIJIA_LIGHT' },
  { id: 9, name: '米家智能台灯', code: 'MIJIA_DESK_LIGHT' },
  { id: 10, name: '小米无线充电器', code: 'XIAOMI_CHARGER' }
];

// 套餐列表
Mock.mock(/\/api\/packages\/list(\?.*)?$/, 'get', (options: any) => {
  const packages: Package[] = [];

  // 根据图片中的实际数据创建套餐
  const realProducts: Product[] = [
    { id: 1, name: '小米蓝牙耳机 Air2 青春版', type: 1, price: 199, description: '入耳式设计，支持蓝牙5.0，适合日常音乐播放和通话，性价比高。' },
    { id: 2, name: '小米手环 4', type: 2, price: 299, description: '彩色大屏，支持心率监测，运动追踪，睡眠监测，续航20天，适合运动。' },
    { id: 3, name: '小米移动电源 3', type: 3, price: 79, description: '通用分体式，多容量可选，支持快充，方便外出手机紧急充电。' },
    { id: 4, name: 'AUN 迷你投影仪', type: 4, price: 300, description: '体积小巧，支持无线投影，适用于家庭娱乐，投影效果清晰。' },
    { id: 5, name: '小米路由器 4A', type: 5, price: 79, description: '双频（2.4GHz/5GHz），4根天线，信号稳定，覆盖范围广，满足家庭网络需求。' },
    { id: 6, name: 'Redmi AirDots', type: 6, price: 99.9, description: '真无线设计，蓝牙 5.0，支持双边通话和语音助手手势操作，充电盒续航长。' },
    { id: 7, name: '小爱音箱 Play', type: 7, price: 89, description: '支持语音控制音乐播放，智能设备，性价比高，适合智能家居用户。' },
    { id: 8, name: '米家智能床灯（磁吸版）', type: 8, price: 49, description: '人体感应触发，可贴附在金属表面，光线柔和不刺眼，节能环保。' },
    { id: 9, name: '米家智能台灯 1S', type: 9, price: 169, description: '全光谱灯珠，亮度柔和，支持手机 APP 语音控制，适合阅读，分为多档亮度，保护家人用眼健康。' },
    { id: 10, name: '小米无线充电器', type: 10, price: 215, description: '多时器温度保护，高效散热，兼容性好，适合多种手机无线充电。' }
  ];

  // 添加更多产品以匹配图片中的数据
  const moreProducts: Product[] = [
    { id: 11, name: '米家即热饮水机 S1', type: 5, price: 258, description: '即热式出水，支持多档温度调节，小巧不占地，方便日常饮用热水。' },
    { id: 12, name: '米家随手吸尘器', type: 7, price: 209, description: '手持轻便，适合清洁缝隙，沙发，车内等小细节处，操作简单收纳方便。' },
    { id: 13, name: '倍思 65W 氮化镓充电头', type: 3, price: 99, description: '体积小巧，兼容多种协议，可快速为手机、平板充电。' },
    { id: 14, name: '红米手环 3 Pro', type: 2, price: 129, description: '支持心率监测，运动计步，多种运动模式，外观时尚，适合日常健康管理。' },
    { id: 15, name: '联想小新蓝牙耳机', type: 1, price: 79, description: '半入耳式设计，佩戴舒适，稳定性好，适合搭配笔记本电脑使用，性价比高。' },
    { id: 16, name: 'QCY T13 ANC 真无线耳机', type: 1, price: 149, description: '具有主动降噪功能，减少外界干扰，音质好，续航时间长。' },
    { id: 17, name: '小米挂脖风扇', type: 7, price: 89, description: '挂脖式设计，便携可随身携带，续航长，适合夏季户外使用。' },
    { id: 18, name: '科普园家手机补光灯', type: 9, price: 59, description: '可调节亮度和色温，提升手机拍摄画面光线，适合自拍。' },
    { id: 19, name: '360 智能门锁（二手）', type: 5, price: 99, description: '支持手机 APP 查看开门记录，访客模式，视频监控，指纹解锁，保障居家安全。' },
    { id: 20, name: '绿联手机散热背夹', type: 2, price: 79, description: '贴合手机背部，通过半导体制冷，避免热量积聚，适合长时间游戏。' },
    { id: 21, name: '多功能品牌手机卡槽', type: 7, price: 69, description: '小巧便携，支持多种卡槽，组织，电子产品配件整理，适合随身携带。' },
    { id: 22, name: '罗技 MX Anywhere 3 鼠标', type: 7, price: 399, description: '无线蓝牙鼠标，高精度，支持多设备 Flow 多设备切换，适合办公场景。' },
    { id: 23, name: 'Keychron K3 超薄有线蓝牙键盘', type: 7, price: 418, description: '矮轴设计，键程短，84 键布局，支持蓝牙/有线双连接，适合办公。' },
    { id: 24, name: 'Windows Hello 指纹模块', type: 5, price: 70, description: '为电脑添加指纹识别功能，提升系统登录便捷性，适合 Windows 设备。' },
    { id: 25, name: '安全魔 35W 氮化镓充电器', type: 3, price: 149, description: '兼容多种充电协议，屏幕显示实时功率，为 iPhone 等设备提供快速充电。' }
  ];

  // 合并所有产品
  const allProducts: Product[] = [...realProducts, ...moreProducts];

  // 将产品转换为套餐格式
  allProducts.forEach(product => {
    const typeObj = packageTypes.find(t => t.id === product.type) || packageTypes[0];

    packages.push({
      id: product.id,
      name: product.name,
      code: `${typeObj.code}_${Random.string('upper', 6)}`,
      type: product.type,
      typeName: typeObj.name,
      description: product.description,
      price: product.price,
      discountPrice: product.price * Random.float(0.8, 0.95, 2, 2),
      features: product.description.split('，'),
      duration: Random.pick([1, 3, 6, 12]),
      durationUnit: '月',
      status: Random.boolean() ? 1 : 0,
      isHot: Random.boolean(),
      isRecommended: Random.boolean(),
      salesCount: Random.integer(0, 10000),
      createTime: Random.datetime('yyyy-MM-dd HH:mm:ss'),
      updateTime: Random.datetime('yyyy-MM-dd HH:mm:ss')
    });
  });

  // 解析查询参数
  const url = new URL(options.url, 'http://localhost');
  const pageNum = parseInt(url.searchParams.get('pageNum') || '1');
  const pageSize = parseInt(url.searchParams.get('pageSize') || '10');
  const keyword = url.searchParams.get('keyword') || '';
  const type = url.searchParams.get('type') || '';

  // 过滤数据
  let filteredPackages: Package[] = packages;
  if (keyword) {
    filteredPackages = packages.filter(pkg =>
      pkg.name.includes(keyword) ||
      pkg.code.includes(keyword) ||
      pkg.description.includes(keyword)
    );
  }

  if (type) {
    filteredPackages = filteredPackages.filter(pkg => pkg.type.toString() === type);
  }

  // 分页
  const startIndex = (pageNum - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const pagedPackages = filteredPackages.slice(startIndex, endIndex);

  return {
    code: 200,
    message: '获取成功',
    data: {
      total: filteredPackages.length,
      list: pagedPackages
    }
  };
});

// 获取套餐类型
Mock.mock('/api/packages/types', 'get', () => {
  return {
    code: 200,
    message: '获取成功',
    data: packageTypes
  };
});

// 获取套餐详情
Mock.mock(/\/api\/packages\/detail\/\d+$/, 'get', (options: any) => {
  const url = options.url;
  const id = parseInt(url.substring(url.lastIndexOf('/') + 1));

  // 定义产品数据（与列表中相同）
  const realProducts: Product[] = [
    { id: 1, name: '小米蓝牙耳机 Air2 青春版', type: 1, price: 199, description: '入耳式设计，支持蓝牙5.0，适合日常音乐播放和通话，性价比高。' },
    { id: 2, name: '小米手环 4', type: 2, price: 299, description: '彩色大屏，支持心率监测，运动追踪，睡眠监测，续航20天，适合运动。' },
    { id: 3, name: '小米移动电源 3', type: 3, price: 79, description: '通用分体式，多容量可选，支持快充，方便外出手机紧急充电。' },
    { id: 4, name: 'AUN 迷你投影仪', type: 4, price: 300, description: '体积小巧，支持无线投影，适用于家庭娱乐，投影效果清晰。' },
    { id: 5, name: '小米路由器 4A', type: 5, price: 79, description: '双频（2.4GHz/5GHz），4根天线，信号稳定，覆盖范围广，满足家庭网络需求。' },
    { id: 6, name: 'Redmi AirDots', type: 6, price: 99.9, description: '真无线设计，蓝牙 5.0，支持双边通话和语音助手手势操作，充电盒续航长。' },
    { id: 7, name: '小爱音箱 Play', type: 7, price: 89, description: '支持语音控制音乐播放，智能设备，性价比高，适合智能家居用户。' },
    { id: 8, name: '米家智能床灯（磁吸版）', type: 8, price: 49, description: '人体感应触发，可贴附在金属表面，光线柔和不刺眼，节能环保。' },
    { id: 9, name: '米家智能台灯 1S', type: 9, price: 169, description: '全光谱灯珠，亮度柔和，支持手机 APP 语音控制，适合阅读，分为多档亮度，保护家人用眼健康。' },
    { id: 10, name: '小米无线充电器', type: 10, price: 215, description: '多时器温度保护，高效散热，兼容性好，适合多种手机无线充电。' }
  ];

  const moreProducts: Product[] = [
    { id: 11, name: '米家即热饮水机 S1', type: 5, price: 258, description: '即热式出水，支持多档温度调节，小巧不占地，方便日常饮用热水。' },
    { id: 12, name: '米家随手吸尘器', type: 7, price: 209, description: '手持轻便，适合清洁缝隙，沙发，车内等小细节处，操作简单收纳方便。' },
    { id: 13, name: '倍思 65W 氮化镓充电头', type: 3, price: 99, description: '体积小巧，兼容多种协议，可快速为手机、平板充电。' },
    { id: 14, name: '红米手环 3 Pro', type: 2, price: 129, description: '支持心率监测，运动计步，多种运动模式，外观时尚，适合日常健康管理。' },
    { id: 15, name: '联想小新蓝牙耳机', type: 1, price: 79, description: '半入耳式设计，佩戴舒适，稳定性好，适合搭配笔记本电脑使用，性价比高。' },
    { id: 16, name: 'QCY T13 ANC 真无线耳机', type: 1, price: 149, description: '具有主动降噪功能，减少外界干扰，音质好，续航时间长。' },
    { id: 17, name: '小米挂脖风扇', type: 7, price: 89, description: '挂脖式设计，便携可随身携带，续航长，适合夏季户外使用。' },
    { id: 18, name: '科普园家手机补光灯', type: 9, price: 59, description: '可调节亮度和色温，提升手机拍摄画面光线，适合自拍。' },
    { id: 19, name: '360 智能门锁（二手）', type: 5, price: 99, description: '支持手机 APP 查看开门记录，访客模式，视频监控，指纹解锁，保障居家安全。' },
    { id: 20, name: '绿联手机散热背夹', type: 2, price: 79, description: '贴合手机背部，通过半导体制冷，避免热量积聚，适合长时间游戏。' }
  ];

  const allProducts: Product[] = [...realProducts, ...moreProducts];

  // 查找对应ID的产品
  const product = allProducts.find(p => p.id === id) || allProducts[0];
  const type = packageTypes.find(t => t.id === product.type) || packageTypes[0];
  const price = product.price;
  const discountPrice = price * Random.float(0.8, 0.95, 2, 2);
  const description = product.description;
  const features = product.description.split('，');

  return {
    code: 200,
    message: '获取成功',
    data: {
      id,
      name: product.name,
      code: `${type.code}_${Random.string('upper', 6)}`,
      type: product.type,
      typeName: type.name,
      description,
      price,
      discountPrice,
      features,
      duration: Random.pick([1, 3, 6, 12]),
      durationUnit: '月',
      status: Random.boolean() ? 1 : 0,
      isHot: Random.boolean(),
      isRecommended: Random.boolean(),
      salesCount: Random.integer(0, 10000),
      content: Random.paragraph(5, 10),
      rules: Random.paragraph(3, 8),
      createTime: Random.datetime('yyyy-MM-dd HH:mm:ss'),
      updateTime: Random.datetime('yyyy-MM-dd HH:mm:ss')
    }
  };
});
