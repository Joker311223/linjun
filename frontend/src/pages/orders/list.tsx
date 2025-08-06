import React, { useState, useEffect } from 'react';
import { Table, Card, Button, Input, Select, Tag, Space, DatePicker, Badge, Tooltip } from 'antd';
import { EyeOutlined, DownloadOutlined, SearchOutlined, PlusOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import dayjs from 'dayjs';

const { Search } = Input;
const { Option } = Select;
const { RangePicker } = DatePicker;

interface Order {
  id: string;
  orderNo: string;
  userId: number;
  userName: string;
  packageId: number;
  packageName: string;
  amount: number;
  payAmount: number;
  status: number;
  payMethod: string;
  createTime: string;
  payTime: string;
  expireTime: string;
  source: string; // 添加订单来源字段
}

const OrderList: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [total, setTotal] = useState(0);
  const [pageNum, setPageNum] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [keyword, setKeyword] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs | null, dayjs.Dayjs | null]>([null, null]);
  const [payMethod, setPayMethod] = useState<string>('');
  const [source, setSource] = useState<string>(''); // 添加订单来源状态

  const navigate = useNavigate();

  // 获取订单列表
  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        // 构建查询参数
        const params: any = {
          pageNum,
          pageSize,
          keyword
        };

        if (selectedStatus) {
          params.status = selectedStatus;
        }

        if (payMethod) {
          params.payMethod = payMethod;
        }

        if (source) {
          params.source = source;
        }

        if (dateRange[0] && dateRange[1]) {
          params.startDate = dateRange[0].format('YYYY-MM-DD');
          params.endDate = dateRange[1].format('YYYY-MM-DD');
        }

        const response = await axios.get('/api/orders/list', { params });

        if (response.data.code === 200) {
          setOrders(response.data.data.list);
          setTotal(response.data.data.total);
        }
      } catch (error) {
        console.error('获取订单列表失败:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [pageNum, pageSize, keyword, selectedStatus, dateRange, payMethod, source]);

  // 处理搜索
  const handleSearch = (value: string) => {
    setKeyword(value);
    setPageNum(1);
  };

  // 处理状态筛选
  const handleStatusChange = (value: string) => {
    setSelectedStatus(value);
    setPageNum(1);
  };

  // 处理支付方式筛选
  const handlePayMethodChange = (value: string) => {
    setPayMethod(value);
    setPageNum(1);
  };

  // 处理订单来源筛选
  const handleSourceChange = (value: string) => {
    setSource(value);
    setPageNum(1);
  };

  // 处理日期范围变化
  const handleDateRangeChange = (dates: any) => {
    setDateRange(dates);
    setPageNum(1);
  };

  // 处理分页变化
  const handleTableChange = (pagination: any) => {
    setPageNum(pagination.current);
    setPageSize(pagination.pageSize);
  };

  // 处理查看详情
  const handleView = (id: string) => {
    navigate(`/orders/detail/${id}`);
  };

  // 导出订单数据
  const handleExport = () => {
    // 实际项目中应该调用后端接口导出数据
    console.log('导出订单数据');
  };

  // 处理新增订单
  const handleAddOrder = () => {
    navigate('/orders/create');
  };

  // 获取订单状态标签
  const getStatusTag = (status: number) => {
    switch (status) {
      case 0:
        return <Tag color="default">待支付</Tag>;
      case 1:
        return <Tag color="processing">已支付</Tag>;
      case 2:
        return <Tag color="success">已完成</Tag>;
      case 3:
        return <Tag color="error">已取消</Tag>;
      case 4:
        return <Tag color="warning">已过期</Tag>;
      default:
        return <Tag color="default">未知</Tag>;
    }
  };

  // 获取订单来源标签
  const getSourceTag = (source: string) => {
    switch (source) {
      case '抖音':
        return <Tag color="volcano">{source}</Tag>;
      case '微信':
        return <Tag color="green">{source}</Tag>;
      case '淘宝':
        return <Tag color="orange">{source}</Tag>;
      case '小红书':
        return <Tag color="red">{source}</Tag>;
      default:
        return <Tag color="default">{source || '未知'}</Tag>;
    }
  };

  // 表格列定义
  const columns = [
    {
      title: '订单号',
      dataIndex: 'orderNo',
      key: 'orderNo',
      width: 180,
      render: (text: string) => (
        text ? (
          <Tooltip title={text}>
            <span>{text.length > 12 ? `${text.substring(0, 12)}...` : text}</span>
          </Tooltip>
        ) : '-'
      )
    },
    {
      title: '用户',
      dataIndex: 'userName',
      key: 'userName',
      width: 120
    },
    {
      title: '商品名称',
      dataIndex: 'packageName',
      key: 'packageName',
      width: 150
    },
    {
      title: '金额',
      key: 'amount',
      width: 120,
      render: (record: Order) => (
        <div>
          <div>原价: ¥{record.amount ? record.amount.toFixed(2) : '0.00'}</div>
          {record.amount && record.payAmount && record.payAmount < record.amount && (
            <div>实付: <span style={{ color: '#f50' }}>¥{record.payAmount.toFixed(2)}</span></div>
          )}
        </div>
      )
    },
    {
      title: '支付方式',
      dataIndex: 'payMethod',
      key: 'payMethod',
      width: 100
    },
    {
      title: '订单来源',
      dataIndex: 'source',
      key: 'source',
      width: 100,
      render: (source: string) => getSourceTag(source)
    },
    {
      title: '订单状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: number) => getStatusTag(status)
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
      width: 180,
      render: (text: string) => dayjs(text).format('YYYY-MM-DD HH:mm:ss')
    },
    {
      title: '支付时间',
      dataIndex: 'payTime',
      key: 'payTime',
      width: 180,
      render: (text: string) => text ? dayjs(text).format('YYYY-MM-DD HH:mm:ss') : '-'
    },
    {
      title: '操作',
      key: 'action',
      width: 100,
      render: (record: Order) => (
        <Button
          type="text"
          icon={<EyeOutlined />}
          onClick={() => handleView(record.id)}
        />
      )
    }
  ];

  return (
    <Card>
      <div style={{ marginBottom: 16 }}>
        <Space size="large" wrap style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Space size="large" wrap>
            <Search
              placeholder="搜索订单号/用户名/商品名称"
              allowClear
              enterButton={<SearchOutlined />}
              onSearch={handleSearch}
              style={{ width: 250 }}
            />
            <Select
              placeholder="订单状态"
              allowClear
              style={{ width: 120 }}
              onChange={handleStatusChange}
            >
              <Option value="0">待支付</Option>
              <Option value="1">已支付</Option>
              <Option value="2">已完成</Option>
              <Option value="3">已取消</Option>
              <Option value="4">已过期</Option>
            </Select>
            <Select
              placeholder="支付方式"
              allowClear
              style={{ width: 120 }}
              onChange={handlePayMethodChange}
            >
              <Option value="alipay">支付宝</Option>
              <Option value="wechat">微信</Option>
              <Option value="creditCard">信用卡</Option>
              <Option value="bankTransfer">银行转账</Option>
            </Select>
            <Select
              placeholder="订单来源"
              allowClear
              style={{ width: 120 }}
              onChange={handleSourceChange}
            >
              <Option value="抖音">抖音</Option>
              <Option value="微信">微信</Option>
              <Option value="淘宝">淘宝</Option>
              <Option value="小红书">小红书</Option>
              <Option value="其他">其他</Option>
            </Select>
            <RangePicker
              placeholder={['开始日期', '结束日期']}
              onChange={handleDateRangeChange}
            />
            <Button
              icon={<DownloadOutlined />}
              onClick={handleExport}
            >
              导出数据
            </Button>
          </Space>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleAddOrder}
          >
            新增订单
          </Button>
        </Space>
      </div>
      <Table
        columns={columns}
        dataSource={orders}
        rowKey="id"
        pagination={{
          current: pageNum,
          pageSize: pageSize,
          total: total,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total) => `共 ${total} 条记录`
        }}
        onChange={handleTableChange}
        loading={loading}
      />
    </Card>
  );
};

export default OrderList;
