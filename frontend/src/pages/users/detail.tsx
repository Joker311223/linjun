import React, { useState, useEffect } from 'react';
import { Card, Descriptions, Button, Tag, Spin, message, Space, Tabs, Table } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import { getUserById } from '../../services/userService';
import { getRolesByUserId } from '../../services/roleService';
import { getPermissionsByUserId } from '../../services/permissionService';
import dayjs from 'dayjs';

const { TabPane } = Tabs;

interface User {
  id: number;
  username: string;
  realName: string;
  email: string;
  phone: string;
  status: number;
  department: string;
  position: string;
  roles: string;
  registerTime: string;
  lastLoginTime: string;
  createTime: string;
  updateTime: string;
}

interface Role {
  id: number;
  name: string;
  code: string;
  description: string;
}

interface Permission {
  id: number;
  name: string;
  code: string;
  type: number;
  path: string;
}

const UserDetail: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [roles, setRoles] = useState<Role[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  // 获取用户详情、角色和权限信息
  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;

      setLoading(true);
      try {
        // 获取用户详情
        const userResponse = await getUserById(parseInt(id));
        if (userResponse.data.code === 200) {
          setUser(userResponse.data.data);
        }

        // 获取用户角色
        const rolesResponse = await getRolesByUserId(parseInt(id));
        if (rolesResponse.data.code === 200) {
          setRoles(rolesResponse.data.data || []);
        }

        // 获取用户权限
        const permissionsResponse = await getPermissionsByUserId(parseInt(id));
        if (permissionsResponse.data.code === 200) {
          setPermissions(permissionsResponse.data.data || []);
        }
      } catch (error) {
        console.error('获取用户详情失败:', error);
        message.error('获取用户详情失败');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  // 获取状态标签
  const getStatusTag = (status: number) => {
    switch (status) {
      case 1:
        return <Tag color="success">正常</Tag>;
      case 0:
        return <Tag color="default">禁用</Tag>;
      default:
        return <Tag color="default">未知</Tag>;
    }
  };

  // 角色表格列定义
  const roleColumns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
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
      title: '描述',
      dataIndex: 'description',
      key: 'description',
    }
  ];

  // 权限表格列定义
  const permissionColumns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
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
      render: (type: number) => (
        type === 1 ? <Tag color="blue">菜单</Tag> : <Tag color="green">按钮</Tag>
      )
    },
    {
      title: '路径',
      dataIndex: 'path',
      key: 'path',
    }
  ];

  // 编辑用户
  const handleEdit = () => {
    navigate(`/users/edit/${id}`);
  };

  // 返回列表
  const handleBack = () => {
    navigate('/users/list');
  };

  return (
    <Card
      title="用户详情"
      extra={
        <Space>
          <Button type="primary" onClick={handleEdit}>编辑</Button>
          <Button onClick={handleBack}>返回</Button>
        </Space>
      }
    >
      {loading ? (
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <Spin size="large" />
        </div>
      ) : user ? (
        <Tabs defaultActiveKey="basic">
          <TabPane tab="基本信息" key="basic">
            <Descriptions bordered column={2}>
              <Descriptions.Item label="用户ID">{user.id}</Descriptions.Item>
              <Descriptions.Item label="用户名">{user.username}</Descriptions.Item>
              <Descriptions.Item label="真实姓名">{user.realName}</Descriptions.Item>
              <Descriptions.Item label="状态">{getStatusTag(user.status)}</Descriptions.Item>
              <Descriptions.Item label="邮箱">{user.email}</Descriptions.Item>
              <Descriptions.Item label="手机号">{user.phone}</Descriptions.Item>
              <Descriptions.Item label="部门">{user.department || '-'}</Descriptions.Item>
              <Descriptions.Item label="职位">{user.position || '-'}</Descriptions.Item>
              <Descriptions.Item label="注册时间">
                {user.registerTime ? dayjs(user.registerTime).format('YYYY-MM-DD HH:mm:ss') : '-'}
              </Descriptions.Item>
              <Descriptions.Item label="最后登录时间">
                {user.lastLoginTime ? dayjs(user.lastLoginTime).format('YYYY-MM-DD HH:mm:ss') : '-'}
              </Descriptions.Item>
              <Descriptions.Item label="创建时间">
                {user.createTime ? dayjs(user.createTime).format('YYYY-MM-DD HH:mm:ss') : '-'}
              </Descriptions.Item>
              <Descriptions.Item label="更新时间">
                {user.updateTime ? dayjs(user.updateTime).format('YYYY-MM-DD HH:mm:ss') : '-'}
              </Descriptions.Item>
            </Descriptions>
          </TabPane>
          <TabPane tab="角色信息" key="roles">
            <Table
              columns={roleColumns}
              dataSource={roles}
              rowKey="id"
              pagination={false}
            />
          </TabPane>
          <TabPane tab="权限信息" key="permissions">
            <Table
              columns={permissionColumns}
              dataSource={permissions}
              rowKey="id"
              pagination={{ pageSize: 10 }}
            />
          </TabPane>
        </Tabs>
      ) : (
        <div>未找到用户信息</div>
      )}
    </Card>
  );
};

export default UserDetail;
