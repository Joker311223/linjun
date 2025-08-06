import React, { useState, useEffect } from 'react';
import { Table, Card, Button, Input, Select, Tag, Space, Modal, message, Badge, DatePicker } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, ExclamationCircleOutlined, EyeOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import dayjs from 'dayjs';

const { Search } = Input;
const { Option } = Select;
const { confirm } = Modal;
const { RangePicker } = DatePicker;

interface Campaign {
  id: number;
  name: string;
  type: number;
  typeName: string;
  startTime: string;
  endTime: string;
  status: number;
  budget: number;
  spent: number;
  targetAudience: string;
  conversion: number;
  createTime: string;
}

const CampaignList: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [total, setTotal] = useState(0);
  const [pageNum, setPageNum] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [keyword, setKeyword] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs | null, dayjs.Dayjs | null]>([null, null]);

  const navigate = useNavigate();

  // 获取活动列表
  useEffect(() => {
    const fetchCampaigns = async () => {
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

        if (dateRange[0] && dateRange[1]) {
          params.startDate = dateRange[0].format('YYYY-MM-DD');
          params.endDate = dateRange[1].format('YYYY-MM-DD');
        }

        const response = await axios.get('/api/campaigns/list', { params });

        if (response.data.code === 200) {
          setCampaigns(response.data.data.list);
          setTotal(response.data.data.total);
        }
      } catch (error) {
        console.error('获取活动列表失败:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCampaigns();
  }, [pageNum, pageSize, keyword, selectedStatus, dateRange]);

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
  const handleView = (id: number) => {
    navigate(`/campaigns/detail/${id}`);
  };

  // 处理编辑
  const handleEdit = (id: number) => {
    navigate(`/campaigns/edit/${id}`);
  };

  // 处理删除
  const handleDelete = (id: number) => {
    confirm({
      title: '确认删除',
      icon: <ExclamationCircleOutlined />,
      content: '确定要删除这个活动吗？此操作不可逆。',
      okText: '确认',
      okType: 'danger',
      cancelText: '取消',
      onOk() {
        message.success('删除成功');
      }
    });
  };

  // 获取活动状态标签
  const getStatusTag = (status: number) => {
    switch (status) {
      case 0:
        return <Tag color="default">草稿</Tag>;
      case 1:
        return <Tag color="processing">进行中</Tag>;
      case 2:
        return <Tag color="success">已完成</Tag>;
      case 3:
        return <Tag color="error">已暂停</Tag>;
      default:
        return <Tag color="default">未知</Tag>;
    }
  };

  // 表格列定义
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 60
    },
    {
      title: '活动名称',
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: '活动类型',
      dataIndex: 'typeName',
      key: 'typeName',
      width: 120
    },
    {
      title: '开始时间',
      dataIndex: 'startTime',
      key: 'startTime',
      width: 120,
      render: (text: string) => dayjs(text).format('YYYY-MM-DD')
    },
    {
      title: '结束时间',
      dataIndex: 'endTime',
      key: 'endTime',
      width: 120,
      render: (text: string) => dayjs(text).format('YYYY-MM-DD')
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: number) => getStatusTag(status)
    },
    {
      title: '预算/支出',
      key: 'budget',
      width: 120,
      render: (record: Campaign) => (
        <div>
          <div>预算: ¥{record.budget ? record.budget.toFixed(2) : '0.00'}</div>
          <div>支出: ¥{record.spent ? record.spent.toFixed(2) : '0.00'}</div>
        </div>
      )
    },
    {
      title: '转化率',
      dataIndex: 'conversion',
      key: 'conversion',
      width: 80,
      render: (conversion: number) => `${conversion}%`
    },
    {
      title: '操作',
      key: 'action',
      width: 180,
      render: (record: Campaign) => (
        <Space size="small">
          <Button
            type="text"
            icon={<EyeOutlined />}
            onClick={() => handleView(record.id)}
          />
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record.id)}
          />
          <Button
            type="text"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.id)}
          />
        </Space>
      )
    }
  ];

  return (
    <Card>
      <div style={{ marginBottom: 16 }}>
        <Space size="large" wrap>
          <Search
            placeholder="搜索活动名称"
            allowClear
            enterButton
            onSearch={handleSearch}
            style={{ width: 250 }}
          />
          <Select
            placeholder="活动状态"
            allowClear
            style={{ width: 150 }}
            onChange={handleStatusChange}
          >
            <Option value="0">草稿</Option>
            <Option value="1">进行中</Option>
            <Option value="2">已完成</Option>
            <Option value="3">已暂停</Option>
          </Select>
          <RangePicker
            placeholder={['开始日期', '结束日期']}
            onChange={handleDateRangeChange}
          />
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => navigate('/campaigns/create')}
          >
            新增活动
          </Button>
        </Space>
      </div>
      <Table
        columns={columns}
        dataSource={campaigns}
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

export default CampaignList;
