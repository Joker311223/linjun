import React, { useState } from 'react';
import { Card, Form, Input, Button, Switch, message, Space } from 'antd';
import { useNavigate } from 'react-router-dom';
import { addRole } from '../../services/roleService';

const RoleCreate: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // 提交表单
  const handleSubmit = async (values: any) => {
    setLoading(true);
    try {
      // 转换状态值
      const roleData = {
        ...values,
        status: values.status ? 1 : 0,
      };

      const response = await addRole(roleData);
      if (response.data.code === 200) {
        message.success('创建角色成功');
        navigate('/roles/list');
      } else {
        message.error(response.data.message || '创建角色失败');
      }
    } catch (error) {
      console.error('创建角色失败:', error);
      message.error('创建角色失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card title="创建角色">
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{
          status: true,
        }}
      >
        <Form.Item
          name="name"
          label="角色名称"
          rules={[{ required: true, message: '请输入角色名称' }]}
        >
          <Input placeholder="请输入角色名称" />
        </Form.Item>

        <Form.Item
          name="code"
          label="角色编码"
          rules={[
            { required: true, message: '请输入角色编码' },
            { pattern: /^[a-zA-Z0-9_]+$/, message: '角色编码只能包含字母、数字和下划线' }
          ]}
        >
          <Input placeholder="请输入角色编码" />
        </Form.Item>

        <Form.Item
          name="description"
          label="角色描述"
        >
          <Input.TextArea rows={4} placeholder="请输入角色描述" />
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
            <Button onClick={() => navigate('/roles/list')}>
              取消
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default RoleCreate;
