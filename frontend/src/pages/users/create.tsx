import React, { useState, useEffect } from 'react';
import { Card, Form, Input, Button, Select, Switch, message, Space } from 'antd';
import { useNavigate } from 'react-router-dom';
import { addUser } from '../../services/userService';
import { getRoleList } from '../../services/roleService';

const { Option } = Select;

interface Role {
  id: number;
  name: string;
  code: string;
}

const UserCreate: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [roles, setRoles] = useState<Role[]>([]);
  const navigate = useNavigate();

  // 获取角色列表
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await getRoleList();
        if (response.data.code === 200) {
          setRoles(response.data.data || []);
        }
      } catch (error) {
        console.error('获取角色列表失败:', error);
        message.error('获取角色列表失败');
      }
    };

    fetchRoles();
  }, []);

  // 提交表单
  const handleSubmit = async (values: any) => {
    setLoading(true);
    try {
      const response = await addUser(values);
      if (response.data.code === 200) {
        message.success('创建用户成功');
        navigate('/users/list');
      } else {
        message.error(response.data.message || '创建用户失败');
      }
    } catch (error) {
      console.error('创建用户失败:', error);
      message.error('创建用户失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card title="创建用户">
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{
          status: 1,
        }}
      >
        <Form.Item
          name="username"
          label="用户名"
          rules={[{ required: true, message: '请输入用户名' }]}
        >
          <Input placeholder="请输入用户名" />
        </Form.Item>

        <Form.Item
          name="password"
          label="密码"
          rules={[
            { required: true, message: '请输入密码' },
            { min: 6, message: '密码长度不能小于6位' }
          ]}
        >
          <Input.Password placeholder="请输入密码" />
        </Form.Item>

        <Form.Item
          name="confirmPassword"
          label="确认密码"
          dependencies={['password']}
          rules={[
            { required: true, message: '请确认密码' },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('password') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error('两次输入的密码不一致'));
              },
            }),
          ]}
        >
          <Input.Password placeholder="请确认密码" />
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
            <Button type="primary" htmlType="submit" loading={loading}>
              创建
            </Button>
            <Button onClick={() => navigate('/users/list')}>
              取消
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default UserCreate;
