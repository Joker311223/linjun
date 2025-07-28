import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Statistic, Table, Tag, Spin, Typography, Divider } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined, UserOutlined, ShoppingCartOutlined, DollarOutlined, AppstoreOutlined } from '@ant-design/icons';
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
    status: string;
    createTime: string;
  }[];
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

      <Title level={4}>热门套餐</Title>
      <Row gutter={16}>
        {data.hotPackages.map((pkg) => (
          <Col xs={24} sm={12} md={8} lg={6} key={pkg.id}>
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
