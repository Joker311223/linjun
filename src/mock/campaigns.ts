import Mock from 'mockjs';

const Random = Mock.Random;

// 活动类型
const campaignTypes = [
  { id: 1, name: '限时折扣', code: 'DISCOUNT' },
  { id: 2, name: '满减活动', code: 'FULLCUT' },
  { id: 3, name: '新用户专享', code: 'NEWUSER' },
  { id: 4, name: '老用户回馈', code: 'OLDUSER' },
  { id: 5, name: '节日特惠', code: 'HOLIDAY' }
];

// 活动状态
const campaignStatus = [
  { id: 0, name: '未开始' },
  { id: 1, name: '进行中' },
  { id: 2, name: '已结束' },
  { id: 3, name: '已取消' }
];

// 活动列表
Mock.mock(/\/api\/campaigns\/list(\?.*)?$/, 'get', (options: any) => {
  const campaigns = [];

  for (let i = 0; i < 50; i++) {
    const typeIndex = Random.integer(0, campaignTypes.length - 1);
    const type = campaignTypes[typeIndex];
    const statusIndex = Random.integer(0, campaignStatus.length - 1);
    const status = campaignStatus[statusIndex];

    // 生成开始和结束时间
    const now = new Date();
    let startTime, endTime;

    if (status.id === 0) { // 未开始
      startTime = new Date(now.getTime() + Random.integer(1, 30) * 24 * 60 * 60 * 1000);
      endTime = new Date(startTime.getTime() + Random.integer(1, 60) * 24 * 60 * 60 * 1000);
    } else if (status.id === 1) { // 进行中
      startTime = new Date(now.getTime() - Random.integer(1, 15) * 24 * 60 * 60 * 1000);
      endTime = new Date(now.getTime() + Random.integer(1, 30) * 24 * 60 * 60 * 1000);
    } else { // 已结束或已取消
      endTime = new Date(now.getTime() - Random.integer(1, 15) * 24 * 60 * 60 * 1000);
      startTime = new Date(endTime.getTime() - Random.integer(15, 60) * 24 * 60 * 60 * 1000);
    }

    let description = '';
    let rules: string[] = [];

    switch (type.code) {
      case 'DISCOUNT':
        const discount = Random.float(1, 9.5, 1, 1);
        description = `全场${discount}折`;
        rules = [
          `活动期间，所有套餐${discount}折优惠`,
          '不与其他优惠同享',
          Random.boolean() ? '限购1次' : '每人限购3次'
        ];
        break;
      case 'FULLCUT':
        const full = Random.integer(50, 500);
        const cut = Random.integer(10, Math.floor(full / 2));
        description = `满${full}减${cut}`;
        rules = [
          `单笔订单满${full}元减${cut}元`,
          '不与其他优惠同享',
          Random.boolean() ? '无使用次数限制' : '每人限用3次'
        ];
        break;
      case 'NEWUSER':
        const newUserDiscount = Random.float(1, 5, 1, 1);
        description = `新用户${newUserDiscount}折`;
        rules = [
          `新注册用户首单${newUserDiscount}折`,
          '注册30天内有效',
          '仅限首单使用'
        ];
        break;
      case 'OLDUSER':
        const oldUserDiscount = Random.float(5, 9, 1, 1);
        description = `老用户${oldUserDiscount}折回馈`;
        rules = [
          `注册满1年用户专享${oldUserDiscount}折`,
          '不与其他优惠同享',
          Random.boolean() ? '限购1次' : '每人限购3次'
        ];
        break;
      case 'HOLIDAY':
        const holiday = Random.pick(['春节', '五一', '国庆', '双十一', '双十二', '618']);
        const holidayDiscount = Random.float(1, 9, 1, 1);
        description = `${holiday}特惠${holidayDiscount}折`;
        rules = [
          `${holiday}期间，特选套餐${holidayDiscount}折起`,
          '部分套餐赠送额外服务',
          '不与其他优惠同享'
        ];
        break;
    }

    campaigns.push({
      id: i + 1,
      name: `拓天${type.name}${Random.integer(1, 100)}`,
      code: `${type.code}_${Random.string('upper', 6)}`,
      type: type.id,
      typeName: type.name,
      description,
      rules,
      startTime: Random.datetime('yyyy-MM-dd HH:mm:ss'),
      endTime: Random.datetime('yyyy-MM-dd HH:mm:ss'),
      status: status.id,
      statusName: status.name,
      priority: Random.integer(1, 10),
      isEnabled: status.id === 1 ? 1 : 0,
      participantsCount: Random.integer(0, 10000),
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
  const status = url.searchParams.get('status') || '';

  // 过滤数据
  let filteredCampaigns = campaigns;
  if (keyword) {
    filteredCampaigns = campaigns.filter(campaign =>
      campaign.name.includes(keyword) ||
      campaign.code.includes(keyword) ||
      campaign.description.includes(keyword)
    );
  }

  if (type) {
    filteredCampaigns = filteredCampaigns.filter(campaign => campaign.type.toString() === type);
  }

  if (status) {
    filteredCampaigns = filteredCampaigns.filter(campaign => campaign.status.toString() === status);
  }

  // 分页
  const startIndex = (pageNum - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const pagedCampaigns = filteredCampaigns.slice(startIndex, endIndex);

  return {
    code: 200,
    message: '获取成功',
    data: {
      total: filteredCampaigns.length,
      list: pagedCampaigns
    }
  };
});

// 获取活动类型
Mock.mock('/api/campaigns/types', 'get', () => {
  return {
    code: 200,
    message: '获取成功',
    data: campaignTypes
  };
});

// 获取活动状态
Mock.mock('/api/campaigns/status', 'get', () => {
  return {
    code: 200,
    message: '获取成功',
    data: campaignStatus
  };
});

// 获取活动详情
Mock.mock(/\/api\/campaigns\/detail\/\d+$/, 'get', (options: any) => {
  const url = options.url;
  const id = parseInt(url.substring(url.lastIndexOf('/') + 1));

  const typeIndex = Random.integer(0, campaignTypes.length - 1);
  const type = campaignTypes[typeIndex];
  const statusIndex = Random.integer(0, campaignStatus.length - 1);
  const status = campaignStatus[statusIndex];

  let description = '';
  let rules: string[] = [];

  switch (type.code) {
    case 'DISCOUNT':
      const discount = Random.float(1, 9.5, 1, 1);
      description = `全场${discount}折`;
      rules = [
        `活动期间，所有套餐${discount}折优惠`,
        '不与其他优惠同享',
        Random.boolean() ? '限购1次' : '每人限购3次'
      ];
      break;
    case 'FULLCUT':
      const full = Random.integer(50, 500);
      const cut = Random.integer(10, Math.floor(full / 2));
      description = `满${full}减${cut}`;
      rules = [
        `单笔订单满${full}元减${cut}元`,
        '不与其他优惠同享',
        Random.boolean() ? '无使用次数限制' : '每人限用3次'
      ];
      break;
    case 'NEWUSER':
      const newUserDiscount = Random.float(1, 5, 1, 1);
      description = `新用户${newUserDiscount}折`;
      rules = [
        `新注册用户首单${newUserDiscount}折`,
        '注册30天内有效',
        '仅限首单使用'
      ];
      break;
    case 'OLDUSER':
      const oldUserDiscount = Random.float(5, 9, 1, 1);
      description = `老用户${oldUserDiscount}折回馈`;
      rules = [
        `注册满1年用户专享${oldUserDiscount}折`,
        '不与其他优惠同享',
        Random.boolean() ? '限购1次' : '每人限购3次'
      ];
      break;
    case 'HOLIDAY':
      const holiday = Random.pick(['春节', '五一', '国庆', '双十一', '双十二', '618']);
      const holidayDiscount = Random.float(1, 9, 1, 1);
      description = `${holiday}特惠${holidayDiscount}折`;
      rules = [
        `${holiday}期间，特选套餐${holidayDiscount}折起`,
        '部分套餐赠送额外服务',
        '不与其他优惠同享'
      ];
      break;
  }

  // 生成关联套餐
  const relatedPackages = [];
  const packageCount = Random.integer(3, 10);
  for (let i = 0; i < packageCount; i++) {
    relatedPackages.push({
      id: Random.integer(1, 50),
      name: `拓天套餐${Random.integer(1, 100)}`,
      code: `PKG_${Random.string('upper', 6)}`,
      price: Random.float(10, 500, 2, 2),
      discountPrice: Random.float(10, 500, 2, 2) * 0.8,
      discount: Random.float(1, 9.5, 1, 1)
    });
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
      rules,
      content: Random.paragraph(5, 10),
      startTime: Random.datetime('yyyy-MM-dd HH:mm:ss'),
      endTime: Random.datetime('yyyy-MM-dd HH:mm:ss'),
      status: status.id,
      statusName: status.name,
      priority: Random.integer(1, 10),
      isEnabled: status.id === 1 ? 1 : 0,
      participantsCount: Random.integer(0, 10000),
      relatedPackages,
      createTime: Random.datetime('yyyy-MM-dd HH:mm:ss'),
      updateTime: Random.datetime('yyyy-MM-dd HH:mm:ss')
    }
  };
});
