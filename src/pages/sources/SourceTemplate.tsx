import React, { useState, useEffect } from 'react';
import { Card, Table, Tag, Statistic, Row, Col, DatePicker, Button, Space, Progress, Divider, Typography } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined, DownloadOutlined, ReloadOutlined } from '@ant-design/icons';
import axios from 'axios';
import dayjs from 'dayjs';

const { Title } = Typography;
const { RangePicker } = DatePicker;

interface SourcePageProps {
  sourceName: string;
  sourceId: string;
}

interface SourceData {
  overview: {
    totalOrders: number;
    totalSales: number;
    conversion: number;
    growth: number;
  };
  timeData: {
    dates: string[];
    orders: number[];
    sales: number[];
  };
  topProducts: {
    id: number;
    name: string;
    sales: number;
    orders: number;
    growth: number;
  }[];
  recentOrders: {
    id: string;
    orderNo: string;
    userName: string;
    packageName: string;
    amount: number;
    status: number;
    statusName: string;
    statusColor: string;
    createTime: string;
  }[];
}

const SourceTemplate: React.FC<SourcePageProps> = ({ sourceName, sourceId }) => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<SourceData | null>(null);
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs, dayjs.Dayjs]>([
    dayjs().subtract(30, 'day'),
    dayjs()
  ]);

  useEffect(() => {
    fetchData();
  }, [sourceName, dateRange]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`/api/sources/${sourceId}`, {
        params: {
          startDate: dateRange[0].format('YYYY-MM-DD'),
          endDate: dateRange[1].format('YYYY-MM-DD')
        }
      });
      if (response.data.code === 200) {
        setData(response.data.data);
      }
    } catch (error) {
      console.error(`获取${sourceName}数据失败:`, error);
    } finally {
      setLoading(false);
    }
  };

  const handleDateChange = (dates: any) => {
    if (dates && dates.length === 2) {
      setDateRange(dates);
    }
  };

  const handleRefresh = () => {
    fetchData();
  };

  const handleExport = () => {
    console.log(`导出${sourceName}数据`);
    // 实际项目中应该调用后端接口导出数据
  };

  // 获取订单状态标签
  const getStatusTag = (status: number, statusName: string, statusColor: string) => {
    return <Tag color={statusColor}>{statusName}</Tag>;
  };

  // 表格列定义
  const columns = [
    {
      title: '订单号',
      dataIndex: 'orderNo',
      key: 'orderNo',
      width: 180,
    },
    {
      title: '用户',
      dataIndex: 'userName',
      key: 'userName',
      width: 120
    },
    {
      title: '套餐名称',
      dataIndex: 'packageName',
      key: 'packageName',
      width: 150
    },
    {
      title: '金额',
      dataIndex: 'amount',
      key: 'amount',
      width: 120,
      render: (amount: number) => `¥${amount.toFixed(2)}`
    },
    {
      title: '订单状态',
      key: 'status',
      width: 100,
      render: (record: any) => getStatusTag(record.status, record.statusName, record.statusColor)
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
      width: 180,
      render: (text: string) => dayjs(text).format('YYYY-MM-DD HH:mm:ss')
    }
  ];

  if (loading || !data) {
    return (
      <Card loading={loading}>
        <div style={{ minHeight: 400 }}></div>
      </Card>
    );
  }

  return (
    <div>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Title level={4}>{sourceName}订单数据</Title>
        <Space>
          <RangePicker
            value={dateRange}
            onChange={handleDateChange}
            allowClear={false}
          />
          <Button icon={<ReloadOutlined />} onClick={handleRefresh}>刷新</Button>
          <Button icon={<DownloadOutlined />} onClick={handleExport}>导出数据</Button>
        </Space>
      </div>

      <Row gutter={16}>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="总订单数"
              value={data.overview.totalOrders}
              valueStyle={{ color: '#1890ff' }}
              suffix={
                <div style={{ fontSize: '14px', color: data.overview.growth >= 0 ? '#3f8600' : '#cf1322' }}>
                  {data.overview.growth >= 0 ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
                  {Math.abs(data.overview.growth)}%
                </div>
              }
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="总销售额"
              value={data.overview.totalSales}
              precision={2}
              valueStyle={{ color: '#3f8600' }}
              prefix="¥"
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="转化率"
              value={data.overview.conversion}
              precision={2}
              valueStyle={{ color: '#722ed1' }}
              suffix="%"
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="环比增长"
              value={data.overview.growth}
              precision={2}
              valueStyle={{ color: data.overview.growth >= 0 ? '#3f8600' : '#cf1322' }}
              prefix={data.overview.growth >= 0 ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
              suffix="%"
            />
          </Card>
        </Col>
      </Row>

      <Divider />

      <Title level={4}>热门产品</Title>
      <Row gutter={16}>
        {data.topProducts.map((product) => (
          <Col xs={24} sm={12} md={8} key={product.id}>
            <Card size="small" title={product.name} style={{ marginBottom: 16 }}>
              <div style={{ marginBottom: 10 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>销售额:</span>
                  <span>¥{product.sales.toFixed(2)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>订单量:</span>
                  <span>{product.orders}单</span>
                </div>
              </div>
              <Progress
                percent={product.growth}
                status={product.growth >= 0 ? "success" : "exception"}
                format={(percent) => `${percent}%`}
              />
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
        pagination={{ pageSize: 5 }}
        scroll={{ x: 800 }}
      />
    </div>
  );
};

export default SourceTemplate;
