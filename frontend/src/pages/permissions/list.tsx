import React, { useState, useEffect } from 'react';
import { Table, Card, Button, Input, Select, Tag, Space, Modal, message, Tree } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { getPermissionList, deletePermission } from '../../services/permissionService';

const { Search } = Input;
const { Option } = Select;
const { confirm } = Modal;

interface Permission {
  id: number;
  name: string;
  code: string;
  type: number;
  path: string;
  parentId: number | null;
  sort: number;
  icon: string;
  status: number;
  description: string;
  createTime: string;
  updateTime: string;
  children?: Permission[];
}

const PermissionList: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [keyword, setKeyword] = useState('');
  const [type, setType] = useState<string>('');
  const [treeView, setTreeView] = useState(true);

  const navigate = useNavigate();

  // 获取权限列表
  useEffect(() => {
    const fetchPermissions = async () => {
      setLoading(true);
      try {
        const response = await getPermissionList();
        if (response.data.code === 200) {
          const permissionData = response.data.data || [];

          // 如果是树形视图，构建权限树
          if (treeView) {
            setPermissions(buildPermissionTree(permissionData));
          } else {
            // 过滤权限
            let filteredPermissions = permissionData;

            if (keyword) {
              filteredPermissions = filteredPermissions.filter(
                (p: Permission) =>
                  p.name.includes(keyword) ||
                  p.code.includes(keyword)
              );
            }

            if (type) {
              filteredPermissions = filteredPermissions.filter(
                (p: Permission) => p.type === parseInt(type)
              );
            }

            setPermissions(filteredPermissions);
          }
        }
      } catch (error) {
        console.error('获取权限列表失败:', error);
        message.error('获取权限列表失败');
      } finally {
        setLoading(false);
      }
    };

    fetchPermissions();
  }, [keyword, type, treeView]);

  // 构建权限树
  const buildPermissionTree = (permissions: Permission[]): Permission[] => {
    // 创建一个映射表，用于快速查找
    const map: Record<number, Permission> = {};
    permissions.forEach(permission => {
      map[permission.id] = { ...permission, children: [] };
    });

    // 构建树结构
    const tree: Permission[] = [];
    permissions.forEach(permission => {
      const node = map[permission.id];
      if (permission.parentId === null || permission.parentId === 0) {
        // 根节点
        tree.push(node);
      } else if (map[permission.parentId]) {
        // 子节点
        if (!map[permission.parentId].children) {
          map[permission.parentId].children = [];
        }
        map[permission.parentId].children!.push(node);
      }
    });

    return tree;
  };

  // 处理搜索
  const handleSearch = (value: string) => {
    setKeyword(value);
  };

  // 处理类型筛选
  const handleTypeChange = (value: string) => {
    setType(value);
  };

  // 切换视图模式
  const toggleViewMode = () => {
    setTreeView(!treeView);
  };

  // 新建权限
  const handleCreate = () => {
    navigate('/permissions/create');
  };

  // 编辑权限
  const handleEdit = (id: number) => {
    navigate(`/permissions/edit/${id}`);
  };

  // 删除权限
  const handleDelete = (id: number) => {
    confirm({
      title: '确定要删除这个权限吗?',
      icon: <ExclamationCircleOutlined />,
      content: '删除后不可恢复，且会影响拥有该权限的角色。',
      okText: '确定',
      okType: 'danger',
      cancelText: '取消',
      onOk: async () => {
        try {
          const response = await deletePermission(id);
          if (response.data.code === 200) {
            message.success('删除权限成功');
            // 重新加载数据
            const newPermissions = await getPermissionList();
            if (newPermissions.data.code === 200) {
              if (treeView) {
                setPermissions(buildPermissionTree(newPermissions.data.data || []));
              } else {
                setPermissions(newPermissions.data.data || []);
              }
            }
          } else {
            message.error(response.data.message || '删除权限失败');
          }
        } catch (error) {
          console.error('删除权限失败:', error);
          message.error('删除权限失败');
        }
      },
    });
  };

  // 获取类型标签
  const getTypeTag = (type: number) => {
    return type === 1 ?
      <Tag color="blue">菜单</Tag> :
      <Tag color="green">按钮</Tag>;
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
      title: '权限名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '权限编码',
      dataIndex: 'code',
      key: 'code',
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      render: (type: number) => getTypeTag(type),
    },
    {
      title: '路径',
      dataIndex: 'path',
      key: 'path',
      ellipsis: true,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: number) => getStatusTag(status),
    },
    {
      title: '排序',
      dataIndex: 'sort',
      key: 'sort',
      width: 60,
    },
    {
      title: '操作',
      key: 'action',
      width: 150,
      render: (text: string, record: Permission) => (
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
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.id)}
            disabled={record.code === '*:*:*'} // 禁止删除通配符权限
          >
            删除
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <Card
      title="权限管理"
      extra={
        <Space>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
            新建权限
          </Button>
          <Button onClick={toggleViewMode}>
            {treeView ? '列表视图' : '树形视图'}
          </Button>
        </Space>
      }
    >
      <div style={{ marginBottom: 16 }}>
        <Space size="large">
          <Search
            placeholder="搜索权限名称/编码"
            allowClear
            onSearch={handleSearch}
            style={{ width: 250 }}
          />
          <Select
            placeholder="权限类型"
            allowClear
            style={{ width: 120 }}
            onChange={handleTypeChange}
          >
            <Option value="1">菜单</Option>
            <Option value="2">按钮</Option>
          </Select>
        </Space>
      </div>

      {treeView ? (
        <Table
          columns={columns}
          dataSource={permissions}
          rowKey="id"
          loading={loading}
          pagination={false}
          expandable={{
            defaultExpandAllRows: true
          }}
        />
      ) : (
        <Table
          columns={columns}
          dataSource={permissions}
          rowKey="id"
          loading={loading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条记录`,
          }}
        />
      )}
    </Card>
  );
};

export default PermissionList;
