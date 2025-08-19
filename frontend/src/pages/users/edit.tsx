import React, { useState, useEffect } from 'react';
import { Card, Form, Input, Button, Select, Switch, message, Space, Spin } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import { getUserById, updateUser } from '../../services/userService';
import { getRoleList } from '../../services/roleService';

const { Option } = Select;

interface Role {
  id: number;
  name: string;
  code: string;
}

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
  roleIds: number[];
}

const UserEdit: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [roles, setRoles] = useState<Role[]>([]);
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  // 获取角色列表和用户信息
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // 获取角色列表
        const rolesResponse = await getRoleList();
        if (rolesResponse.data.code === 200) {
          setRoles(rolesResponse.data.data || []);
        }

        // 获取用户信息
        if (id) {
          const userResponse = await getUserById(parseInt(id));
          if (userResponse.data.code === 200) {
            const userData = userResponse.data.data;
            // 设置表单初始值
            form.setFieldsValue({
              ...userData,
              status: userData.status === 1,
            });
          }
        }
      } catch (error) {
        console.error('获取数据失败:', error);
        message.error('获取数据失败');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, form]);

  // 提交表单
  const handleSubmit = async (values: any) => {
    setSubmitting(true);
    try {
      // 转换状态值
      const userData = {
        ...values,
        id: parseInt(id as string),
        status: values.status ? 1 : 0,
      };

      // 如果没有修改密码，则删除密码字段
      if (!userData.password) {
        delete userData.password;
        delete userData.confirmPassword;
      }

      const response = await updateUser(userData);
      if (response.data.code === 200) {
        message.success('更新用户成功');
        navigate('/users/list');
      } else {
        message.error(response.data.message || '更新用户失败');
      }
    } catch (error) {
      console.error('更新用户失败:', error);
      message.error('更新用户失败');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card title="编辑用户">
      {loading ? (
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <Spin size="large" />
        </div>
      ) : (
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Form.Item
            name="username"
            label="用户名"
            rules={[{ required: true, message: '请输入用户名' }]}
          >
            <Input placeholder="请输入用户名" disabled />
          </Form.Item>

          <Form.Item
            name="password"
            label="密码"
            rules={[
              { min: 6, message: '密码长度不能小于6位' }
            ]}
            extra="如不修改密码，请留空"
          >
            <Input.Password placeholder="请输入新密码" />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            label="确认密码"
            dependencies={['password']}
            rules={[
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!getFieldValue('password') || !value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('两次输入的密码不一致'));
                },
              }),
            ]}
          >
            <Input.Password placeholder="请确认新密码" />
          </Form.Item>

          <Form.Item
            name="realName"
            label="真实姓名"
            rules={[{ required: true, message: '请输入真实姓名' }]}
          >
            <Input placeholder="请输入真实姓名" />
          </Form.Item>

          <Form.Item
            name="email"
            label="邮箱"
            rules={[
              { required: true, message: '请输入邮箱' },
              { type: 'email', message: '请输入有效的邮箱地址' }
            ]}
          >
            <Input placeholder="请输入邮箱" />
          </Form.Item>

          <Form.Item
            name="phone"
            label="手机号"
            rules={[
              { required: true, message: '请输入手机号' },
              { pattern: /^1[3-9]\d{9}$/, message: '请输入有效的手机号' }
            ]}
          >
            <Input placeholder="请输入手机号" />
          </Form.Item>

          <Form.Item
            name="roleIds"
            label="角色"
            rules={[{ required: true, message: '请选择角色' }]}
          >
            <Select
              mode="multiple"
              placeholder="请选择角色"
              optionFilterProp="children"
            >
              {roles.map(role => (
                <Option key={role.id} value={role.id}>
                  {role.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="department"
            label="部门"
          >
            <Input placeholder="请输入部门" />
          </Form.Item>

          <Form.Item
            name="position"
            label="职位"
          >
            <Input placeholder="请输入职位" />
          </Form.Item>

          <Form.Item
            name="status"
            label="状态"
            valuePropName="checked"
          >
            <Switch checkedChildren="启用" unCheckedChildren="禁用" />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit" loading={submitting}>
                保存
              </Button>
              <Button onClick={() => navigate('/users/list')}>
                取消
              </Button>
            </Space>
          </Form.Item>
        </Form>
      )}
    </Card>
  );
};

export default UserEdit;
