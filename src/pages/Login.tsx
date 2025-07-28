import React, { useState } from 'react';
import { Form, Input, Button, Card, Image, message, Typography } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const { Title } = Typography;

interface LoginFormData {
  username: string;
  password: string;
}

const Login: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values: LoginFormData) => {
    setLoading(true);
    try {
      const response = await axios.post('/api/user/login', values);
      if (response.data.code === 200) {
        // 登录成功
        localStorage.setItem('token', response.data.data.token);
        localStorage.setItem('userInfo', JSON.stringify(response.data.data));
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
          {/* <Title level={2} style={{ color: '#1890ff' }}>拓天科技</Title> */}
          <Title level={4} style={{ marginTop: 8 }}>营销管理平台</Title>
        </div>
        <Form
          name="login"
          initialValues={{ remember: true }}
          onFinish={onFinish}
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

          <div style={{ textAlign: 'center' }}>
            {/* <p>用户名: admin / 密码: admin123</p> */}
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default Login;
