import React, { useState, useEffect } from 'react';
import { Table, Card, Button, Input, Select, Tag, Space, DatePicker, Badge, Avatar, Tooltip } from 'antd';
import { EyeOutlined, SearchOutlined, UserOutlined, DownloadOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import dayjs from 'dayjs';

const { Search } = Input;
const { Option } = Select;
const { RangePicker } = DatePicker;

interface User {
  id: number;
  username: string;
  nickname: string;
  avatar: string;
  email: string;
  phone: string;
  gender: number;
  status: number;
  level: number;
  levelName: string;
  registerTime: string;
  lastLoginTime: string;
  totalSpent: number;
  orderCount: number;
}

const UserList: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [total, setTotal] = useState(0);
  const [pageNum, setPageNum] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [keyword, setKeyword] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const [selectedLevel, setSelectedLevel] = useState<string>('');
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs | null, dayjs.Dayjs | null]>([null, null]);

  const navigate = useNavigate();

  // 获取用户列表
  useEffect(() => {
    const fetchUsers = async () => {
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

        if (selectedLevel) {
          params.level = selectedLevel;
        }

        if (dateRange[0] && dateRange[1]) {
          params.startDate = dateRange[0].format('YYYY-MM-DD');
          params.endDate = dateRange[1].format('YYYY-MM-DD');
        }

        const response = await axios.get('/api/users/list', { params });

        if (response.data.code === 200) {
          setUsers(response.data.data.list);
          setTotal(response.data.data.total);
        }
      } catch (error) {
        console.error('获取用户列表失败:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [pageNum, pageSize, keyword, selectedStatus, selectedLevel, dateRange]);

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

  // 处理等级筛选
  const handleLevelChange = (value: string) => {
    setSelectedLevel(value);
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
    navigate(`/users/detail/${id}`);
  };

  // 导出用户数据
  const handleExport = () => {
    // 实际项目中应该调用后端接口导出数据
    console.log('导出用户数据');
  };

  // 获取用户状态标签
  const getStatusTag = (status: number) => {
    switch (status) {
      case 1:
        return <Tag color="success">正常</Tag>;
      case 0:
        return <Tag color="default">未激活</Tag>;
      case 2:
        return <Tag color="error">已禁用</Tag>;
      default:
        return <Tag color="default">未知</Tag>;
    }
  };

  // 获取用户等级标签
  const getLevelTag = (level: number, levelName: string) => {
    const colors = ['default', 'blue', 'cyan', 'green', 'gold', 'orange', 'volcano'];
    const color = colors[level % colors.length];
    return <Tag color={color}>{levelName}</Tag>;
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
      title: '用户信息',
      key: 'userInfo',
      width: 200,
      render: (record: User) => (
        <Space>
          <Avatar
            src={record.avatar}
            icon={<UserOutlined />}
            size="large"
          />
          <div>
            <div style={{ fontWeight: 'bold' }}>{record.nickname}</div>
            <div style={{ fontSize: 12, color: '#999' }}>{record.username}</div>
          </div>
        </Space>
      )
    },
    {
      title: '联系方式',
      key: 'contact',
      width: 180,
      render: (record: User) => (
        <div>
          <div>{record.email}</div>
          <div>{record.phone}</div>
        </div>
      )
    },
    {
      title: '性别',
      dataIndex: 'gender',
      key: 'gender',
      width: 80,
      render: (gender: number) => (
        gender === 1 ? '男' : gender === 2 ? '女' : '未知'
      )
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: number) => getStatusTag(status)
    },
    {
      title: '等级',
      key: 'level',
      width: 100,
      render: (record: User) => getLevelTag(record.level, record.levelName)
    },
    {
      title: '消费情况',
      key: 'consumption',
      width: 150,
      render: (record: User) => (
        <div>
          <div>总消费: ¥{record.totalSpent.toFixed(2)}</div>
          <div>订单数: {record.orderCount}</div>
        </div>
      )
    },
    {
      title: '注册时间',
      dataIndex: 'registerTime',
      key: 'registerTime',
      width: 180,
      render: (text: string) => dayjs(text).format('YYYY-MM-DD HH:mm:ss')
    },
    {
      title: '最后登录',
      dataIndex: 'lastLoginTime',
      key: 'lastLoginTime',
      width: 180,
      render: (text: string) => text ? dayjs(text).format('YYYY-MM-DD HH:mm:ss') : '-'
    },
    {
      title: '操作',
      key: 'action',
      width: 100,
      render: (record: User) => (
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
        <Space size="large" wrap>
          <Search
            placeholder="搜索用户名/昵称/邮箱/手机"
            allowClear
            enterButton={<SearchOutlined />}
            onSearch={handleSearch}
            style={{ width: 250 }}
          />
          <Select
            placeholder="用户状态"
            allowClear
            style={{ width: 120 }}
            onChange={handleStatusChange}
          >
            <Option value="1">正常</Option>
            <Option value="0">未激活</Option>
            <Option value="2">已禁用</Option>
          </Select>
          <Select
            placeholder="用户等级"
            allowClear
            style={{ width: 120 }}
            onChange={handleLevelChange}
          >
            <Option value="1">普通会员</Option>
            <Option value="2">银卡会员</Option>
            <Option value="3">金卡会员</Option>
            <Option value="4">钻石会员</Option>
            <Option value="5">至尊会员</Option>
          </Select>
          <RangePicker
            placeholder={['注册开始日期', '注册结束日期']}
            onChange={handleDateRangeChange}
          />
          <Button
            icon={<DownloadOutlined />}
            onClick={handleExport}
          >
            导出数据
          </Button>
        </Space>
      </div>
      <Table
        columns={columns}
        dataSource={users}
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

export default UserList;
