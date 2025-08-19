import React, { useState, useEffect } from 'react';
import { Card, Form, Input, Button, Switch, message, Space, Spin } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import { getRoleById, updateRole } from '../../services/roleService';

const RoleEdit: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  // 获取角色信息
  useEffect(() => {
    const fetchRole = async () => {
      if (!id) return;

      setLoading(true);
      try {
        const response = await getRoleById(parseInt(id));
        if (response.data.code === 200) {
          const roleData = response.data.data;
          // 设置表单初始值
          form.setFieldsValue({
            ...roleData,
            status: roleData.status === 1,
          });
        } else {
          message.error(response.data.message || '获取角色信息失败');
        }
      } catch (error) {
        console.error('获取角色信息失败:', error);
        message.error('获取角色信息失败');
      } finally {
        setLoading(false);
      }
    };

    fetchRole();
  }, [id, form]);

  // 提交表单
  const handleSubmit = async (values: any) => {
    setSubmitting(true);
    try {
      // 转换状态值
      const roleData = {
        ...values,
        id: parseInt(id as string),
        status: values.status ? 1 : 0,
      };

      const response = await updateRole(roleData);
      if (response.data.code === 200) {
        message.success('更新角色成功');
        navigate('/roles/list');
      } else {
        message.error(response.data.message || '更新角色失败');
      }
    } catch (error) {
      console.error('更新角色失败:', error);
      message.error('更新角色失败');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card title="编辑角色">
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
            <Input placeholder="请输入角色编码" disabled={form.getFieldValue('code') === 'admin'} />
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
            <Switch
              checkedChildren="启用"
              unCheckedChildren="禁用"
              disabled={form.getFieldValue('code') === 'admin'}
            />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit" loading={submitting}>
                保存
              </Button>
              <Button onClick={() => navigate('/roles/list')}>
                取消
              </Button>
            </Space>
          </Form.Item>
        </Form>
      )}
    </Card>
  );
};

export default RoleEdit;
