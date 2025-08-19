import React, { useState, useEffect } from 'react';
import { Table, Card, Button, Input, Select, Tag, Space, Modal, message } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, ExclamationCircleOutlined, KeyOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { getRolePage, deleteRole } from '../../services/roleService';

const { Search } = Input;
const { Option } = Select;
const { confirm } = Modal;

interface Role {
  id: number;
  name: string;
  code: string;
  status: number;
  description: string;
  createTime: string;
  updateTime: string;
}

const RoleList: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [roles, setRoles] = useState<Role[]>([]);
  const [total, setTotal] = useState(0);
  const [pageNum, setPageNum] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [keyword, setKeyword] = useState('');
  const [status, setStatus] = useState<string>('');

  const navigate = useNavigate();

  // 获取角色列表
  useEffect(() => {
    const fetchRoles = async () => {
      setLoading(true);
      try {
        const params: any = {
          pageNum,
          pageSize,
          keyword,
        };

        if (status !== '') {
          params.status = status;
        }

        const response = await getRolePage(params);
        if (response.data.code === 200) {
          setRoles(response.data.data.list);
          setTotal(response.data.data.total);
        }
      } catch (error) {
        console.error('获取角色列表失败:', error);
        message.error('获取角色列表失败');
      } finally {
        setLoading(false);
      }
    };

    fetchRoles();
  }, [pageNum, pageSize, keyword, status]);

  // 处理搜索
  const handleSearch = (value: string) => {
    setKeyword(value);
    setPageNum(1);
  };

  // 处理状态筛选
  const handleStatusChange = (value: string) => {
    setStatus(value);
    setPageNum(1);
  };

  // 处理分页变化
  const handleTableChange = (pagination: any) => {
    setPageNum(pagination.current);
    setPageSize(pagination.pageSize);
  };

  // 新建角色
  const handleCreate = () => {
    navigate('/roles/create');
  };

  // 编辑角色
  const handleEdit = (id: number) => {
    navigate(`/roles/edit/${id}`);
  };

  // 分配权限
  const handleAssignPermissions = (id: number) => {
    navigate(`/roles/permissions/${id}`);
  };

  // 删除角色
  const handleDelete = (id: number) => {
    confirm({
      title: '确定要删除这个角色吗?',
      icon: <ExclamationCircleOutlined />,
      content: '删除后不可恢复，且会影响拥有该角色的用户权限。',
      okText: '确定',
      okType: 'danger',
      cancelText: '取消',
      onOk: async () => {
        try {
          const response = await deleteRole(id);
          if (response.data.code === 200) {
            message.success('删除角色成功');
            // 重新加载数据
            const newPageNum = roles.length === 1 && pageNum > 1 ? pageNum - 1 : pageNum;
            setPageNum(newPageNum);
          } else {
            message.error(response.data.message || '删除角色失败');
          }
        } catch (error) {
          console.error('删除角色失败:', error);
          message.error('删除角色失败');
        }
      },
    });
  };

  // 获取状态标签
  const getStatusTag = (status: number) => {
    return status === 1 ?
      <Tag color="success">启用</Tag> :
      <Tag color="default">禁用</Tag>;
  };

  // 表格列定义
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 60,
    },
    {
      title: '角色名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '角色编码',
      dataIndex: 'code',
      key: 'code',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: number) => getStatusTag(status),
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
    },
    {
      title: '操作',
      key: 'action',
      width: 200,
      render: (text: string, record: Role) => (
        <Space size="small">
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record.id)}
          >
            编辑
          </Button>
          <Button
            type="text"
            icon={<KeyOutlined />}
            onClick={() => handleAssignPermissions(record.id)}
          >
            权限
          </Button>
          <Button
            type="text"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.id)}
            disabled={record.code === 'admin'} // 禁止删除管理员角色
          >
            删除
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <Card
      title="角色管理"
      extra={
        <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
          新建角色
        </Button>
      }
    >
      <div style={{ marginBottom: 16 }}>
        <Space size="large">
          <Search
            placeholder="搜索角色名称/编码"
            allowClear
            onSearch={handleSearch}
            style={{ width: 250 }}
          />
          <Select
            placeholder="状态"
            allowClear
            style={{ width: 120 }}
            onChange={handleStatusChange}
          >
            <Option value="1">启用</Option>
            <Option value="0">禁用</Option>
          </Select>
        </Space>
      </div>
      <Table
        columns={columns}
        dataSource={roles}
        rowKey="id"
        pagination={{
          current: pageNum,
          pageSize: pageSize,
          total: total,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total) => `共 ${total} 条记录`,
        }}
        onChange={handleTableChange}
        loading={loading}
      />
    </Card>
  );
};

export default RoleList;
