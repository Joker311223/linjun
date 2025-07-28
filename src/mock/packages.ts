import Mock from 'mockjs';

const Random = Mock.Random;

// 套餐类型
const packageTypes = [
  { id: 1, name: '流量套餐', code: 'DATA' },
  { id: 2, name: '通话套餐', code: 'VOICE' },
  { id: 3, name: '短信套餐', code: 'SMS' },
  { id: 4, name: '增值服务', code: 'VAS' },
  { id: 5, name: '组合套餐', code: 'COMBO' }
];

// 套餐列表
Mock.mock(/\/api\/packages\/list(\?.*)?$/, 'get', (options: any) => {
  const packages = [];

  for (let i = 0; i < 50; i++) {
    const typeIndex = Random.integer(0, packageTypes.length - 1);
    const type = packageTypes[typeIndex];
    const price = Random.float(10, 500, 2, 2);
    const discountPrice = Random.float(price * 0.7, price * 0.95, 2, 2);

    let description = '';
    let features: string[] = [];

    switch (type.code) {
      case 'DATA':
        const dataSize = Random.integer(1, 100);
        const dataUnit = Random.pick(['GB', 'MB']);
        description = `${dataSize}${dataUnit}流量套餐`;
        features = [
          `${dataSize}${dataUnit}全国流量`,
          '全国无漫游',
          Random.boolean() ? '夜间流量翻倍' : '周末流量翻倍',
          Random.boolean() ? '可结转下月' : '当月有效'
        ];
        break;
      case 'VOICE':
        const minutes = Random.integer(100, 3000);
        description = `${minutes}分钟通话套餐`;
        features = [
          `${minutes}分钟全国通话`,
          '全国无漫游',
          Random.boolean() ? '可结转下月' : '当月有效'
        ];
        break;
      case 'SMS':
        const smsCount = Random.integer(50, 500);
        description = `${smsCount}条短信套餐`;
        features = [
          `${smsCount}条全国短信`,
          Random.boolean() ? '可结转下月' : '当月有效'
        ];
        break;
      case 'VAS':
        const vasType = Random.pick(['视频会员', '音乐会员', '阅读会员', '游戏会员']);
        description = `${vasType}增值服务`;
        features = [
          `${vasType}无限畅享`,
          Random.boolean() ? '专属客服' : '优先服务',
          Random.boolean() ? '额外积分' : '专属活动'
        ];
        break;
      case 'COMBO':
        const dataCombo = Random.integer(1, 50);
        const dataUnitCombo = Random.pick(['GB', 'MB']);
        const minutesCombo = Random.integer(100, 1000);
        const smsCombo = Random.integer(50, 200);
        description = `${dataCombo}${dataUnitCombo}+${minutesCombo}分钟+${smsCombo}条短信`;
        features = [
          `${dataCombo}${dataUnitCombo}全国流量`,
          `${minutesCombo}分钟全国通话`,
          `${smsCombo}条全国短信`,
          '全国无漫游',
          Random.boolean() ? '可结转下月' : '当月有效'
        ];
        break;
    }

    packages.push({
      id: i + 1,
      name: `拓天${type.name}${Random.integer(1, 100)}`,
      code: `${type.code}_${Random.string('upper', 6)}`,
      type: type.id,
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
      createTime: Random.datetime('yyyy-MM-dd HH:mm:ss'),
      updateTime: Random.datetime('yyyy-MM-dd HH:mm:ss')
    });
  }

  // 解析查询参数
  const url = new URL(options.url, 'http://localhost');
  const pageNum = parseInt(url.searchParams.get('pageNum') || '1');
  const pageSize = parseInt(url.searchParams.get('pageSize') || '10');
  const keyword = url.searchParams.get('keyword') || '';
  const type = url.searchParams.get('type') || '';

  // 过滤数据
  let filteredPackages = packages;
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

  const typeIndex = Random.integer(0, packageTypes.length - 1);
  const type = packageTypes[typeIndex];
  const price = Random.float(10, 500, 2, 2);
  const discountPrice = Random.float(price * 0.7, price * 0.95, 2, 2);

  let description = '';
  let features: string[] = [];

  switch (type.code) {
    case 'DATA':
      const dataSize = Random.integer(1, 100);
      const dataUnit = Random.pick(['GB', 'MB']);
      description = `${dataSize}${dataUnit}流量套餐`;
      features = [
        `${dataSize}${dataUnit}全国流量`,
        '全国无漫游',
        Random.boolean() ? '夜间流量翻倍' : '周末流量翻倍',
        Random.boolean() ? '可结转下月' : '当月有效'
      ];
      break;
    case 'VOICE':
      const minutes = Random.integer(100, 3000);
      description = `${minutes}分钟通话套餐`;
      features = [
        `${minutes}分钟全国通话`,
        '全国无漫游',
        Random.boolean() ? '可结转下月' : '当月有效'
      ];
      break;
    case 'SMS':
      const smsCount = Random.integer(50, 500);
      description = `${smsCount}条短信套餐`;
      features = [
        `${smsCount}条全国短信`,
        Random.boolean() ? '可结转下月' : '当月有效'
      ];
      break;
    case 'VAS':
      const vasType = Random.pick(['视频会员', '音乐会员', '阅读会员', '游戏会员']);
      description = `${vasType}增值服务`;
      features = [
        `${vasType}无限畅享`,
        Random.boolean() ? '专属客服' : '优先服务',
        Random.boolean() ? '额外积分' : '专属活动'
      ];
      break;
    case 'COMBO':
      const dataCombo = Random.integer(1, 50);
      const dataUnitCombo = Random.pick(['GB', 'MB']);
      const minutesCombo = Random.integer(100, 1000);
      const smsCombo = Random.integer(50, 200);
      description = `${dataCombo}${dataUnitCombo}+${minutesCombo}分钟+${smsCombo}条短信`;
      features = [
        `${dataCombo}${dataUnitCombo}全国流量`,
        `${minutesCombo}分钟全国通话`,
        `${smsCombo}条全国短信`,
        '全国无漫游',
        Random.boolean() ? '可结转下月' : '当月有效'
      ];
      break;
  }

  return {
    code: 200,
    message: '获取成功',
    data: {
      id,
      name: `拓天${type.name}${Random.integer(1, 100)}`,
      code: `${type.code}_${Random.string('upper', 6)}`,
      type: type.id,
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
