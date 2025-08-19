import React, { useState } from 'react';
import { Form, Input, Button, Card, Image, message, Typography, Tabs } from 'antd';
import { UserOutlined, LockOutlined, PhoneOutlined, MailOutlined, KeyOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { login, register, getUserPermissions } from '../services/userService';
import { setCachedPermissions } from '../services/permissionCache';

const { Title } = Typography;
const { TabPane } = Tabs;

interface LoginFormData {
  username: string;
  password: string;
}

interface RegisterFormData {
  username: string;
  password: string;
  confirmPassword: string;
  phone: string;
  inviteCode: string;
  email?: string;
}

const Login: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('login');
  const navigate = useNavigate();

  // 获取并缓存用户权限
  const fetchAndCachePermissions = async (userId: number) => {
    try {
      const response = await getUserPermissions(userId);
      if (response.data.code === 200) {
        const permissions = response.data.data || [];
        const permissionCodes = permissions.map((p: any) => p.code);
        // 缓存权限，指定用户ID
        setCachedPermissions(permissionCodes, userId);
      }
    } catch (error) {
      console.error('获取权限失败:', error);
    }
  };

  const onLoginFinish = async (values: LoginFormData) => {
    setLoading(true);
    try {
      const response = await login(values.username, values.password);
      if (response.data.code === 200) {
        // 登录成功
        const userData = response.data.data;
        localStorage.setItem('token', userData.token);
        localStorage.setItem('userInfo', JSON.stringify(userData));

        // 获取并缓存用户权限
        if (userData.userId) {
          await fetchAndCachePermissions(userData.userId);
        }

        message.success('登录成功');
        navigate('/');
      } else {
        message.error(response.data.message || '登录失败');
      }
    } catch (error) {
      message.error('登录失败，请稍后再试');
      console.error('登录错误:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRegisterFinish = async (values: RegisterFormData) => {
    if (values.password !== values.confirmPassword) {
      message.error('两次输入的密码不一致');
      return;
    }

    setLoading(true);
    try {
      const response = await register(values);
      if (response.data.code === 200) {
        message.success('注册成功，请登录');
        setActiveTab('login');
      } else {
        message.error(response.data.message || '注册失败');
      }
    } catch (error) {
      message.error('注册失败，请稍后再试');
      console.error('注册错误:', error);
    } finally {
      setLoading(false);
    }
  };

  // 密码校验规则
  const validatePassword = (_: any, value: string) => {
    if (!value) {
      return Promise.reject(new Error('请输入密码'));
    }

    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
    if (!passwordRegex.test(value)) {
      return Promise.reject(new Error('密码必须包含字母、数字和特殊字符，且长度至少为8位'));
    }

    return Promise.resolve();
  };

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      background: '#f0f2f5'
    }}>
      <Card style={{ width: 400, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <Image width={200} src="/logo2.png" />
          <Title level={4} style={{ marginTop: 8 }}>互联网线上营销管理平台</Title>
        </div>

        <Tabs activeKey={activeTab} onChange={setActiveTab} centered>
          <TabPane tab="登录" key="login">
            <Form
              name="login"
              initialValues={{ remember: true }}
              onFinish={onLoginFinish}
              size="large"
            >
              <Form.Item
                name="username"
                rules={[{ required: true, message: '请输入用户名!' }]}
              >
                <Input
                  prefix={<UserOutlined />}
                  placeholder="用户名"
                />
              </Form.Item>

              <Form.Item
                name="password"
                rules={[{ required: true, message: '请输入密码!' }]}
              >
                <Input.Password
                  prefix={<LockOutlined />}
                  placeholder="密码"
                />
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  style={{ width: '100%' }}
                  loading={loading}
                >
                  登录
                </Button>
              </Form.Item>
            </Form>
          </TabPane>

          <TabPane tab="注册" key="register">
            <Form
              name="register"
              initialValues={{ remember: true }}
              onFinish={onRegisterFinish}
              size="large"
            >
              <Form.Item
                name="username"
                rules={[{ required: true, message: '请输入用户名!' }]}
              >
                <Input
                  prefix={<UserOutlined />}
                  placeholder="用户名"
                />
              </Form.Item>

              <Form.Item
                name="password"
                rules={[
                  { required: true, message: '请输入密码!' },
                  { validator: validatePassword }
                ]}
              >
                <Input.Password
                  prefix={<LockOutlined />}
                  placeholder="密码（至少8位，包含字母、数字和特殊字符）"
                />
              </Form.Item>

              <Form.Item
                name="confirmPassword"
                rules={[
                  { required: true, message: '请确认密码!' },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue('password') === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error('两次输入的密码不一致!'));
                    },
                  }),
                ]}
              >
                <Input.Password
                  prefix={<LockOutlined />}
                  placeholder="确认密码"
                />
              </Form.Item>

              <Form.Item
                name="phone"
                rules={[
                  { required: true, message: '请输入手机号!' },
                  { pattern: /^1[3-9]\d{9}$/, message: '请输入有效的手机号码!' }
                ]}
              >
                <Input
                  prefix={<PhoneOutlined />}
                  placeholder="手机号"
                />
              </Form.Item>

              <Form.Item
                name="inviteCode"
                rules={[
                  { required: true, message: '请输入邀请码!' }
                ]}
              >
                <Input
                  prefix={<KeyOutlined />}
                  placeholder="邀请码"
                />
              </Form.Item>

              <Form.Item
                name="email"
                rules={[
                  { type: 'email', message: '请输入有效的邮箱地址!' }
                ]}
              >
                <Input
                  prefix={<MailOutlined />}
                  placeholder="邮箱（可选）"
                />
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  style={{ width: '100%' }}
                  loading={loading}
                >
                  注册
                </Button>
              </Form.Item>
            </Form>
          </TabPane>
        </Tabs>
      </Card>
    </div>
  );
};

export default Login;
