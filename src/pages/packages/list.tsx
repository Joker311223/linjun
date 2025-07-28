import React, { useState, useEffect } from 'react';
import { Table, Card, Button, Input, Select, Tag, Space, Modal, message, Tooltip, Badge } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, ExclamationCircleOutlined, EyeOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const { Search } = Input;
const { Option } = Select;
const { confirm } = Modal;

interface PackageType {
  id: number;
  name: string;
  code: string;
}

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

const PackageList: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [packages, setPackages] = useState<Package[]>([]);
  const [total, setTotal] = useState(0);
  const [pageNum, setPageNum] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [keyword, setKeyword] = useState('');
  const [selectedType, setSelectedType] = useState<string>('');
  const [packageTypes, setPackageTypes] = useState<PackageType[]>([]);

  const navigate = useNavigate();

  // 获取套餐类型
  useEffect(() => {
    const fetchPackageTypes = async () => {
      try {
        const response = await axios.get('/api/packages/types');
        if (response.data.code === 200) {
          setPackageTypes(response.data.data);
        }
      } catch (error) {
        console.error('获取套餐类型失败:', error);
      }
    };

    fetchPackageTypes();
  }, []);

  // 获取套餐列表
  useEffect(() => {
    const fetchPackages = async () => {
      setLoading(true);
      try {
        const response = await axios.get('/api/packages/list', {
          params: {
            pageNum,
            pageSize,
            keyword,
            type: selectedType
          }
        });
        if (response.data.code === 200) {
          setPackages(response.data.data.list);
          setTotal(response.data.data.total);
        }
      } catch (error) {
        console.error('获取套餐列表失败:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPackages();
  }, [pageNum, pageSize, keyword, selectedType]);

  // 处理搜索
  const handleSearch = (value: string) => {
    setKeyword(value);
    setPageNum(1);
  };

  // 处理类型筛选
  const handleTypeChange = (value: string) => {
    setSelectedType(value);
    setPageNum(1);
  };

  // 处理分页变化
  const handleTableChange = (pagination: any) => {
    setPageNum(pagination.current);
    setPageSize(pagination.pageSize);
  };

  // 处理查看详情
  const handleView = (id: number) => {
    navigate(`/packages/detail/${id}`);
  };

  // 处理编辑
  const handleEdit = (id: number) => {
    navigate(`/packages/edit/${id}`);
  };

  // 处理删除
  const handleDelete = (id: number) => {
    confirm({
      title: '确认删除',
      icon: <ExclamationCircleOutlined />,
      content: '确定要删除这个套餐吗？此操作不可逆。',
      okText: '确认',
      okType: 'danger',
      cancelText: '取消',
      onOk() {
        message.success('删除成功');
      }
    });
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
      title: '套餐名称',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: Package) => (
        <Space>
          {text}
          {record.isHot && <Badge color="red" text="热门" />}
          {record.isRecommended && <Badge color="blue" text="推荐" />}
        </Space>
      )
    },
    {
      title: '套餐类型',
      dataIndex: 'typeName',
      key: 'typeName',
      width: 120
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
      ellipsis: {
        showTitle: false
      },
      render: (description: string) => (
        <Tooltip placement="topLeft" title={description}>
          {description}
        </Tooltip>
      )
    },
    {
      title: '价格',
      dataIndex: 'price',
      key: 'price',
      width: 100,
      render: (price: number, record: Package) => (
        <div>
          <div>¥{record.discountPrice.toFixed(2)}</div>
          {record.discountPrice < price && (
            <div style={{ textDecoration: 'line-through', color: '#999' }}>
              ¥{price.toFixed(2)}
            </div>
          )}
        </div>
      )
    },
    {
      title: '时长',
      key: 'duration',
      width: 80,
      render: (record: Package) => `${record.duration}${record.durationUnit}`
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 80,
      render: (status: number) => (
        <Tag color={status === 1 ? 'success' : 'default'}>
          {status === 1 ? '上架' : '下架'}
        </Tag>
      )
    },
    {
      title: '销量',
      dataIndex: 'salesCount',
      key: 'salesCount',
      width: 80
    },
    {
      title: '操作',
      key: 'action',
      width: 180,
      render: (record: Package) => (
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
        <Space size="large">
          <Search
            placeholder="搜索套餐名称或描述"
            allowClear
            enterButton
            onSearch={handleSearch}
            style={{ width: 300 }}
          />
          <Select
            placeholder="套餐类型"
            allowClear
            style={{ width: 200 }}
            onChange={handleTypeChange}
          >
            {packageTypes.map(type => (
              <Option key={type.id} value={type.id.toString()}>{type.name}</Option>
            ))}
          </Select>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => navigate('/packages/create')}
          >
            新增套餐
          </Button>
        </Space>
      </div>
      <Table
        columns={columns}
        dataSource={packages}
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

export default PackageList;
