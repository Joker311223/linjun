import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Statistic, Table, Tag, Spin, Typography, Divider, Progress } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined, UserOutlined, ShoppingCartOutlined, DollarOutlined, AppstoreOutlined, ShopOutlined } from '@ant-design/icons';
import axios from 'axios';

const { Title } = Typography;

interface StatisticsData {
  overview: {
    totalSales: number;
    totalOrders: number;
    totalUsers: number;
    totalPackages: number;
  };
  trend: {
    days: string[];
    sales: number[];
    orders: number[];
    users: number[];
  };
  packageTypes: {
    name: string;
    value: number;
  }[];
  hotPackages: {
    id: number;
    name: string;
    sales: number;
    growth: number;
  }[];
  recentOrders: {
    id: string;
    packageName: string;
    packageType: string;
    amount: number;
    paymentMethod: string;
    source: string; // 添加订单来源
    status: string;
    createTime: string;
  }[];
  sourceData?: {
    sources: string[];
    values: number[];
  };
}

const Dashboard: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<StatisticsData | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/api/statistics/dashboard');
        if (response.data.code === 200) {
          setData(response.data.data);
        }
      } catch (error) {
        console.error('获取仪表盘数据失败:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // 订单状态对应的标签颜色
  const statusColors: Record<string, string> = {
    '待支付': 'warning',
    '已支付': 'success',
    '已取消': 'default',
    '已退款': 'error'
  };

  // 订单来源对应的标签颜色和进度条颜色
  const sourceColors: Record<string, string> = {
    '抖音': 'volcano',
    '微信': 'green',
    '淘宝': 'orange',
    '小红书': 'red',
    '官网': 'blue',
    '其他': 'default'
  };

  // 表格列定义
  const columns = [
    {
      title: '订单号',
      dataIndex: 'id',
      key: 'id',
      width: 120,
    },
    {
      title: '套餐名称',
      dataIndex: 'packageName',
      key: 'packageName',
      ellipsis: true,
    },
    {
      title: '套餐类型',
      dataIndex: 'packageType',
      key: 'packageType',
      width: 100,
    },
    {
      title: '金额',
      dataIndex: 'amount',
      key: 'amount',
      width: 100,
      render: (amount: number) => `¥${amount.toFixed(2)}`
    },
    {
      title: '支付方式',
      dataIndex: 'paymentMethod',
      key: 'paymentMethod',
      width: 100,
    },
    {
      title: '订单来源',
      dataIndex: 'source',
      key: 'source',
      width: 100,
      render: (source: string) => (
        <Tag color={sourceColors[source] || 'default'}>
          {source}
        </Tag>
      )
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: string) => (
        <Tag color={statusColors[status] || 'default'}>
          {status}
        </Tag>
      )
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
      width: 180,
    }
  ];

  // 计算订单来源数据的总和
  const calculateTotal = () => {
    if (!data || !data.sourceData) return 0;
    return data.sourceData.values.reduce((sum, value) => sum + value, 0);
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!data) {
    return <div>暂无数据</div>;
  }

  const total = calculateTotal();

  return (
    <div>
      <Title level={4}>数据概览</Title>
      <Row gutter={16}>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="总销售额"
              value={data.overview.totalSales}
              precision={2}
              valueStyle={{ color: '#3f8600' }}
              prefix={<DollarOutlined />}
              suffix={<ArrowUpOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="总订单数"
              value={data.overview.totalOrders}
              valueStyle={{ color: '#1890ff' }}
              prefix={<ShoppingCartOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="用户总数"
              value={data.overview.totalUsers}
              valueStyle={{ color: '#722ed1' }}
              prefix={<UserOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="套餐数量"
              value={data.overview.totalPackages}
              valueStyle={{ color: '#fa8c16' }}
              prefix={<AppstoreOutlined />}
            />
          </Card>
        </Col>
      </Row>

      <Divider />

      <Row gutter={16}>
        <Col xs={24} md={12}>
          <Card title="订单来源分布" style={{ marginBottom: 16 }}>
            {data.sourceData && (
              <div style={{ padding: '20px 0' }}>
                {data.sourceData.sources.map((source, index) => {
                  const value = data.sourceData!.values[index];
                  const percentage = Math.round((value / total) * 100);
                  return (
                    <div key={source} style={{ marginBottom: 15 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                        <span>
                          <Tag color={sourceColors[source] || 'default'}>{source}</Tag>
                        </span>
                        <span>{value} 单 ({percentage}%)</span>
                      </div>
                      <Progress
                        percent={percentage}
                        showInfo={false}
                        strokeColor={
                          sourceColors[source] === 'volcano' ? '#ff4d4f' :
                          sourceColors[source] === 'green' ? '#52c41a' :
                          sourceColors[source] === 'orange' ? '#fa8c16' :
                          sourceColors[source] === 'red' ? '#f5222d' :
                          sourceColors[source] === 'blue' ? '#1890ff' : '#d9d9d9'
                        }
                      />
                    </div>
                  );
                })}
              </div>
            )}
          </Card>
        </Col>
        <Col xs={24} md={12}>
          <Title level={4}>热门套餐</Title>
          <Row gutter={16}>
            {data.hotPackages.slice(0, 4).map((pkg) => (
              <Col xs={24} sm={12} key={pkg.id}>
                <Card size="small" title={pkg.name} style={{ marginBottom: 16 }}>
                  <Statistic
                    title="销售量"
                    value={pkg.sales}
                    precision={0}
                    valueStyle={{ color: pkg.growth >= 0 ? '#3f8600' : '#cf1322' }}
                    suffix={
                      pkg.growth >= 0 ? (
                        <ArrowUpOutlined />
                      ) : (
                        <ArrowDownOutlined />
                      )
                    }
                  />
                  <div style={{ marginTop: 8 }}>
                    <Tag color={pkg.growth >= 0 ? 'success' : 'error'}>
                      {pkg.growth >= 0 ? '+' : ''}{pkg.growth}%
                    </Tag>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        </Col>
      </Row>

      <Divider />

      <Title level={4}>最近订单</Title>
      <Table
        columns={columns}
        dataSource={data.recentOrders}
        rowKey="id"
        pagination={false}
        size="small"
        scroll={{ x: 800 }}
      />
    </div>
  );
};

export default Dashboard;
