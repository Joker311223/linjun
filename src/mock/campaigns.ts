import Mock from 'mockjs';
import { generateFutureDate, generateFutureDateTime, generateDateAfter, formatDate } from './utils';

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
    const statusIndex = Random.integer(0, campaignStatus.length - 1);
    const status = campaignStatus[statusIndex];
    const typeIndex = Random.integer(0, campaignTypes.length - 1);
    const type = campaignTypes[typeIndex];

    // 生成活动时间，确保在2025年7月20日之后
    let startTime, endTime;

    // 开始时间：2025年7月20日之后的随机日期
    startTime = generateFutureDate(0, 180);

    // 结束时间：开始时间之后的30-180天
    endTime = generateDateAfter(startTime, 30, 180);
    let description = '';
    let rules = '';

    switch (type.code) {
      case 'DISCOUNT':
        const discount = Random.float(1, 9.5, 1, 1);
        description = `全场${discount}折`;
        rules = [
          `活动期间，所有套餐${discount}折优惠`,
          '每个用户限购一次',
          '不与其他优惠同享'
        ].join('\n');
        break;
      case 'GIFT':
        description = '购买套餐送好礼';
      rules = [
          '活动期间，购买任意套餐即送精美礼品一份',
          '礼品数量有限，先到先得',
          '每个用户限领一次'
        ].join('\n');
      break;
      case 'CASHBACK':
        const cashback = Random.integer(10, 100);
        description = `消费满额返${cashback}元`;
      rules = [
          `活动期间，单笔消费满300元返${cashback}元`,
          '返现金额将在订单完成后3个工作日内到账',
          '每个用户限参与一次'
        ].join('\n');
      break;
    case 'NEWUSER':
        description = '新用户专享优惠';
      rules = [
          '活动仅限新注册用户参与',
          '注册后7天内有效',
          '每个用户限参与一次'
        ].join('\n');
      break;
      case 'GROUPBUY':
        description = '套餐拼团优惠';
      rules = [
          '活动期间，3人成团可享受套餐8折优惠',
          '5人成团可享受套餐7折优惠',
          '团购需在24小时内完成'
        ].join('\n');
      break;
    }

    campaigns.push({
      id: i + 1,
      name: `${type.name}${Random.integer(1, 100)}`,
      code: `${type.code}_${Random.string('upper', 6)}`,
      type: type.id,
      typeName: type.name,
      description,
      rules,
      startTime: formatDate(startTime),
      endTime: formatDate(endTime),
      status: status.id,
      statusName: status.name,
      createUser: Random.cname(),
      createTime: formatDate(generateFutureDate(0, 30)), // 创建时间在2025年7月20日之后，且早于开始时间
      updateTime: formatDate(generateFutureDate(30, 60)) // 更新时间在创建时间之后
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

  const statusIndex = Random.integer(0, campaignStatus.length - 1);
  const status = campaignStatus[statusIndex];
  const typeIndex = Random.integer(0, campaignTypes.length - 1);
  const type = campaignTypes[typeIndex];

  // 生成活动时间，确保在2025年7月20日之后
  let startTime, endTime;

  // 开始时间：2025年7月20日之后的随机日期
  startTime = generateFutureDate(0, 180);

  // 结束时间：开始时间之后的30-180天
  endTime = generateDateAfter(startTime, 30, 180);

  let description = '';
  let rules = '';

  switch (type.code) {
    case 'DISCOUNT':
      const discount = Random.float(1, 9.5, 1, 1);
      description = `全场${discount}折`;
      rules = [
        `活动期间，所有套餐${discount}折优惠`,
        '每个用户限购一次',
        '不与其他优惠同享'
      ].join('\n');
      break;
    case 'GIFT':
      description = '购买套餐送好礼';
      rules = [
        '活动期间，购买任意套餐即送精美礼品一份',
        '礼品数量有限，先到先得',
        '每个用户限领一次'
      ].join('\n');
      break;
    case 'CASHBACK':
      const cashback = Random.integer(10, 100);
      description = `消费满额返${cashback}元`;
      rules = [
        `活动期间，单笔消费满300元返${cashback}元`,
        '返现金额将在订单完成后3个工作日内到账',
        '每个用户限参与一次'
      ].join('\n');
      break;
    case 'NEWUSER':
      description = '新用户专享优惠';
      rules = [
        '活动仅限新注册用户参与',
        '注册后7天内有效',
        '每个用户限参与一次'
      ].join('\n');
      break;
    case 'GROUPBUY':
      description = '套餐拼团优惠';
      rules = [
        '活动期间，3人成团可享受套餐8折优惠',
        '5人成团可享受套餐7折优惠',
        '团购需在24小时内完成'
      ].join('\n');
      break;
  }

  // 生成关联套餐
  const relatedPackages = [];
  const packageCount = Random.integer(3, 10);

  for (let i = 0; i < packageCount; i++) {
    relatedPackages.push({
      id: Random.integer(1, 50),
      name: `套餐${Random.integer(1, 100)}`,
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
      name: `${type.name}${Random.integer(1, 100)}`,
      code: `${type.code}_${Random.string('upper', 6)}`,
      type: type.id,
      typeName: type.name,
      description,
      rules,
      content: Random.paragraph(3, 7),
      startTime: formatDate(startTime),
      endTime: formatDate(endTime),
      status: status.id,
      statusName: status.name,
      createUser: Random.cname(),
      createTime: formatDate(generateFutureDate(0, 30)), // 创建时间在2025年7月20日之后，且早于开始时间
      updateTime: formatDate(generateFutureDate(30, 60)), // 更新时间在创建时间之后
      packages: relatedPackages
    }
  };
});
