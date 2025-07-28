import React, { useState, useEffect } from 'react';
import { Card, Tabs, Form, Input, Switch, Button, message, Space, Select, InputNumber, Upload, Divider, Row, Col } from 'antd';
import { SaveOutlined, UploadOutlined, ReloadOutlined } from '@ant-design/icons';
import type { UploadFile } from 'antd/es/upload/interface';
import type { RcFile } from 'antd/es/upload';
import axios from 'axios';

const { TabPane } = Tabs;
const { Option } = Select;
const { TextArea } = Input;

interface SystemSettings {
  basic: {
    siteName: string;
    siteDescription: string;
    logo: string;
    favicon: string;
    contactEmail: string;
    contactPhone: string;
    icp: string;
    address: string;
  };
  mail: {
    smtpServer: string;
    smtpPort: number;
    smtpUsername: string;
    smtpPassword: string;
    senderEmail: string;
    senderName: string;
    enableSsl: boolean;
  };
  payment: {
    alipayEnabled: boolean;
    alipayAppId: string;
    alipayPrivateKey: string;
    alipayPublicKey: string;
    wechatEnabled: boolean;
    wechatAppId: string;
    wechatMchId: string;
    wechatApiKey: string;
  };
  notification: {
    emailNotification: boolean;
    smsNotification: boolean;
    orderCreatedNotify: boolean;
    orderPaidNotify: boolean;
    orderCompletedNotify: boolean;
    userRegisteredNotify: boolean;
  };
  security: {
    loginAttempts: number;
    lockoutDuration: number;
    passwordMinLength: number;
    passwordRequireDigit: boolean;
    passwordRequireLowercase: boolean;
    passwordRequireUppercase: boolean;
    passwordRequireSpecialChar: boolean;
    sessionTimeout: number;
  };
}

const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('basic');
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState<SystemSettings | null>(null);
  const [logoFile, setLogoFile] = useState<UploadFile[]>([]);
  const [faviconFile, setFaviconFile] = useState<UploadFile[]>([]);

  const [basicForm] = Form.useForm();
  const [mailForm] = Form.useForm();
  const [paymentForm] = Form.useForm();
  const [notificationForm] = Form.useForm();
  const [securityForm] = Form.useForm();

  // 获取系统设置
  useEffect(() => {
    const fetchSettings = async () => {
      setLoading(true);
      try {
        const response = await axios.get('/api/settings');

        if (response.data.code === 200) {
          const data = response.data.data;
          setSettings(data);

          // 设置表单初始值
          basicForm.setFieldsValue(data.basic);
          mailForm.setFieldsValue(data.mail);
          paymentForm.setFieldsValue(data.payment);
          notificationForm.setFieldsValue(data.notification);
          securityForm.setFieldsValue(data.security);

          // 设置图片预览
          if (data.basic.logo) {
            setLogoFile([{
              uid: '-1',
              name: 'logo.png',
              status: 'done',
              url: data.basic.logo
            }]);
          }

          if (data.basic.favicon) {
            setFaviconFile([{
              uid: '-1',
              name: 'favicon.ico',
              status: 'done',
              url: data.basic.favicon
            }]);
          }
        }
      } catch (error) {
        console.error('获取系统设置失败:', error);
        message.error('获取系统设置失败');
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, [basicForm, mailForm, paymentForm, notificationForm, securityForm]);

  // 处理标签页变化
  const handleTabChange = (key: string) => {
    setActiveTab(key);
  };

  // 处理基本设置保存
  const handleBasicSave = async (values: any) => {
    setLoading(true);
    try {
      // 添加图片URL
      if (logoFile.length > 0 && logoFile[0].response) {
        values.logo = logoFile[0].response.url;
      }

      if (faviconFile.length > 0 && faviconFile[0].response) {
        values.favicon = faviconFile[0].response.url;
      }

      const response = await axios.post('/api/settings/basic', values);

      if (response.data.code === 200) {
        message.success('基本设置保存成功');
      } else {
        message.error(response.data.message || '保存失败');
      }
    } catch (error) {
      console.error('保存基本设置失败:', error);
      message.error('保存基本设置失败');
    } finally {
      setLoading(false);
    }
  };

  // 处理邮件设置保存
  const handleMailSave = async (values: any) => {
    setLoading(true);
    try {
      const response = await axios.post('/api/settings/mail', values);

      if (response.data.code === 200) {
        message.success('邮件设置保存成功');
      } else {
        message.error(response.data.message || '保存失败');
      }
    } catch (error) {
      console.error('保存邮件设置失败:', error);
      message.error('保存邮件设置失败');
    } finally {
      setLoading(false);
    }
  };

  // 处理支付设置保存
  const handlePaymentSave = async (values: any) => {
    setLoading(true);
    try {
      const response = await axios.post('/api/settings/payment', values);

      if (response.data.code === 200) {
        message.success('支付设置保存成功');
      } else {
        message.error(response.data.message || '保存失败');
      }
    } catch (error) {
      console.error('保存支付设置失败:', error);
      message.error('保存支付设置失败');
    } finally {
      setLoading(false);
    }
  };

  // 处理通知设置保存
  const handleNotificationSave = async (values: any) => {
    setLoading(true);
    try {
      const response = await axios.post('/api/settings/notification', values);

      if (response.data.code === 200) {
        message.success('通知设置保存成功');
      } else {
        message.error(response.data.message || '保存失败');
      }
    } catch (error) {
      console.error('保存通知设置失败:', error);
      message.error('保存通知设置失败');
    } finally {
      setLoading(false);
    }
  };

  // 处理安全设置保存
  const handleSecuritySave = async (values: any) => {
    setLoading(true);
    try {
      const response = await axios.post('/api/settings/security', values);

      if (response.data.code === 200) {
        message.success('安全设置保存成功');
      } else {
        message.error(response.data.message || '保存失败');
      }
    } catch (error) {
      console.error('保存安全设置失败:', error);
      message.error('保存安全设置失败');
    } finally {
      setLoading(false);
    }
  };

  // 处理测试邮件发送
  const handleTestEmail = async () => {
    try {
      const values = mailForm.getFieldsValue();
      const response = await axios.post('/api/settings/mail/test', values);

      if (response.data.code === 200) {
        message.success('测试邮件发送成功');
      } else {
        message.error(response.data.message || '发送失败');
      }
    } catch (error) {
      console.error('发送测试邮件失败:', error);
      message.error('发送测试邮件失败');
    }
  };

  // 处理图片上传前的验证
  const beforeUpload = (file: RcFile) => {
    const isImage = file.type.startsWith('image/');
    if (!isImage) {
      message.error('只能上传图片文件!');
    }

    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('图片大小不能超过2MB!');
    }

    return isImage && isLt2M;
  };

  // 处理Logo上传状态变化
  const handleLogoChange = ({ fileList }: { fileList: UploadFile[] }) => {
    setLogoFile(fileList);
  };

  // 处理Favicon上传状态变化
  const handleFaviconChange = ({ fileList }: { fileList: UploadFile[] }) => {
    setFaviconFile(fileList);
  };

  return (
    <Card>
      <Tabs activeKey={activeTab} onChange={handleTabChange}>
        <TabPane tab="基本设置" key="basic">
          <Form
            form={basicForm}
            layout="vertical"
            onFinish={handleBasicSave}
            disabled={loading}
          >
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item
                  name="siteName"
                  label="网站名称"
                  rules={[{ required: true, message: '请输入网站名称' }]}
                >
                  <Input placeholder="请输入网站名称" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="contactEmail"
                  label="联系邮箱"
                  rules={[
                    { required: true, message: '请输入联系邮箱' },
                    { type: 'email', message: '请输入有效的邮箱地址' }
                  ]}
                >
                  <Input placeholder="请输入联系邮箱" />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={24}>
              <Col span={12}>
                <Form.Item
                  name="contactPhone"
                  label="联系电话"
                >
                  <Input placeholder="请输入联系电话" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="icp"
                  label="ICP备案号"
                >
                  <Input placeholder="请输入ICP备案号" />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              name="siteDescription"
              label="网站描述"
            >
              <TextArea rows={4} placeholder="请输入网站描述" />
            </Form.Item>

            <Form.Item
              name="address"
              label="公司地址"
            >
              <Input placeholder="请输入公司地址" />
            </Form.Item>

            <Row gutter={24}>
              <Col span={12}>
                <Form.Item
                  name="logo"
                  label="网站Logo"
                >
                  <Upload
                    name="file"
                    listType="picture"
                    maxCount={1}
                    fileList={logoFile}
                    beforeUpload={beforeUpload}
                    onChange={handleLogoChange}
                    action="/api/upload"
                  >
                    <Button icon={<UploadOutlined />}>上传Logo</Button>
                  </Upload>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="favicon"
                  label="网站图标"
                >
                  <Upload
                    name="file"
                    listType="picture"
                    maxCount={1}
                    fileList={faviconFile}
                    beforeUpload={beforeUpload}
                    onChange={handleFaviconChange}
                    action="/api/upload"
                  >
                    <Button icon={<UploadOutlined />}>上传Favicon</Button>
                  </Upload>
                </Form.Item>
              </Col>
            </Row>

            <Form.Item>
              <Button type="primary" htmlType="submit" loading={loading} icon={<SaveOutlined />}>
                保存设置
              </Button>
            </Form.Item>
          </Form>
        </TabPane>

        <TabPane tab="邮件设置" key="mail">
          <Form
            form={mailForm}
            layout="vertical"
            onFinish={handleMailSave}
            disabled={loading}
          >
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item
                  name="smtpServer"
                  label="SMTP服务器"
                  rules={[{ required: true, message: '请输入SMTP服务器' }]}
                >
                  <Input placeholder="例如: smtp.example.com" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="smtpPort"
                  label="SMTP端口"
                  rules={[{ required: true, message: '请输入SMTP端口' }]}
                >
                  <InputNumber min={1} max={65535} style={{ width: '100%' }} placeholder="例如: 465" />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={24}>
              <Col span={12}>
                <Form.Item
                  name="smtpUsername"
                  label="SMTP用户名"
                  rules={[{ required: true, message: '请输入SMTP用户名' }]}
                >
                  <Input placeholder="请输入SMTP用户名" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="smtpPassword"
                  label="SMTP密码"
                  rules={[{ required: true, message: '请输入SMTP密码' }]}
                >
                  <Input.Password placeholder="请输入SMTP密码" />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={24}>
              <Col span={12}>
                <Form.Item
                  name="senderEmail"
                  label="发件人邮箱"
                  rules={[
                    { required: true, message: '请输入发件人邮箱' },
                    { type: 'email', message: '请输入有效的邮箱地址' }
                  ]}
                >
                  <Input placeholder="请输入发件人邮箱" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="senderName"
                  label="发件人名称"
                  rules={[{ required: true, message: '请输入发件人名称' }]}
                >
                  <Input placeholder="请输入发件人名称" />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              name="enableSsl"
              label="启用SSL"
              valuePropName="checked"
            >
              <Switch />
            </Form.Item>

            <Form.Item>
              <Space>
                <Button type="primary" htmlType="submit" loading={loading} icon={<SaveOutlined />}>
                  保存设置
                </Button>
                <Button onClick={handleTestEmail} icon={<ReloadOutlined />}>
                  发送测试邮件
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </TabPane>

        <TabPane tab="支付设置" key="payment">
          <Form
            form={paymentForm}
            layout="vertical"
            onFinish={handlePaymentSave}
            disabled={loading}
          >
            <Divider orientation="left">支付宝设置</Divider>
            <Form.Item
              name="alipayEnabled"
              label="启用支付宝支付"
              valuePropName="checked"
            >
              <Switch />
            </Form.Item>

            <Row gutter={24}>
              <Col span={12}>
                <Form.Item
                  name="alipayAppId"
                  label="支付宝AppID"
                  rules={[{ required: true, message: '请输入支付宝AppID' }]}
                >
                  <Input placeholder="请输入支付宝AppID" />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              name="alipayPrivateKey"
              label="支付宝商户私钥"
              rules={[{ required: true, message: '请输入支付宝商户私钥' }]}
            >
              <TextArea rows={4} placeholder="请输入支付宝商户私钥" />
            </Form.Item>

            <Form.Item
              name="alipayPublicKey"
              label="支付宝公钥"
              rules={[{ required: true, message: '请输入支付宝公钥' }]}
            >
              <TextArea rows={4} placeholder="请输入支付宝公钥" />
            </Form.Item>

            <Divider orientation="left">微信支付设置</Divider>
            <Form.Item
              name="wechatEnabled"
              label="启用微信支付"
              valuePropName="checked"
            >
              <Switch />
            </Form.Item>

            <Row gutter={24}>
              <Col span={12}>
                <Form.Item
                  name="wechatAppId"
                  label="微信AppID"
                  rules={[{ required: true, message: '请输入微信AppID' }]}
                >
                  <Input placeholder="请输入微信AppID" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="wechatMchId"
                  label="微信商户号"
                  rules={[{ required: true, message: '请输入微信商户号' }]}
                >
                  <Input placeholder="请输入微信商户号" />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              name="wechatApiKey"
              label="微信API密钥"
              rules={[{ required: true, message: '请输入微信API密钥' }]}
            >
              <Input.Password placeholder="请输入微信API密钥" />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" loading={loading} icon={<SaveOutlined />}>
                保存设置
              </Button>
            </Form.Item>
          </Form>
        </TabPane>

        <TabPane tab="通知设置" key="notification">
          <Form
            form={notificationForm}
            layout="vertical"
            onFinish={handleNotificationSave}
            disabled={loading}
          >
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item
                  name="emailNotification"
                  label="启用邮件通知"
                  valuePropName="checked"
                >
                  <Switch />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="smsNotification"
                  label="启用短信通知"
                  valuePropName="checked"
                >
                  <Switch />
                </Form.Item>
              </Col>
            </Row>

            <Divider orientation="left">通知事件</Divider>

            <Row gutter={24}>
              <Col span={12}>
                <Form.Item
                  name="orderCreatedNotify"
                  label="订单创建通知"
                  valuePropName="checked"
                >
                  <Switch />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="orderPaidNotify"
                  label="订单支付通知"
                  valuePropName="checked"
                >
                  <Switch />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={24}>
              <Col span={12}>
                <Form.Item
                  name="orderCompletedNotify"
                  label="订单完成通知"
                  valuePropName="checked"
                >
                  <Switch />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="userRegisteredNotify"
                  label="用户注册通知"
                  valuePropName="checked"
                >
                  <Switch />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item>
              <Button type="primary" htmlType="submit" loading={loading} icon={<SaveOutlined />}>
                保存设置
              </Button>
            </Form.Item>
          </Form>
        </TabPane>

        <TabPane tab="安全设置" key="security">
          <Form
            form={securityForm}
            layout="vertical"
            onFinish={handleSecuritySave}
            disabled={loading}
          >
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item
                  name="loginAttempts"
                  label="最大登录尝试次数"
                  rules={[{ required: true, message: '请输入最大登录尝试次数' }]}
                >
                  <InputNumber min={1} max={10} style={{ width: '100%' }} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="lockoutDuration"
                  label="账户锁定时长(分钟)"
                  rules={[{ required: true, message: '请输入账户锁定时长' }]}
                >
                  <InputNumber min={5} max={1440} style={{ width: '100%' }} />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={24}>
              <Col span={12}>
                <Form.Item
                  name="passwordMinLength"
                  label="密码最小长度"
                  rules={[{ required: true, message: '请输入密码最小长度' }]}
                >
                  <InputNumber min={6} max={20} style={{ width: '100%' }} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="sessionTimeout"
                  label="会话超时时间(分钟)"
                  rules={[{ required: true, message: '请输入会话超时时间' }]}
                >
                  <InputNumber min={5} max={1440} style={{ width: '100%' }} />
                </Form.Item>
              </Col>
            </Row>

            <Divider orientation="left">密码复杂度要求</Divider>

            <Row gutter={24}>
              <Col span={12}>
                <Form.Item
                  name="passwordRequireDigit"
                  label="要求包含数字"
                  valuePropName="checked"
                >
                  <Switch />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="passwordRequireLowercase"
                  label="要求包含小写字母"
                  valuePropName="checked"
                >
                  <Switch />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={24}>
              <Col span={12}>
                <Form.Item
                  name="passwordRequireUppercase"
                  label="要求包含大写字母"
                  valuePropName="checked"
                >
                  <Switch />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="passwordRequireSpecialChar"
                  label="要求包含特殊字符"
                  valuePropName="checked"
                >
                  <Switch />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item>
              <Button type="primary" htmlType="submit" loading={loading} icon={<SaveOutlined />}>
                保存设置
              </Button>
            </Form.Item>
          </Form>
        </TabPane>
      </Tabs>
    </Card>
  );
};

export default Settings;
