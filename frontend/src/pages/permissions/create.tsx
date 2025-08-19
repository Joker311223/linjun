import React, { useState, useEffect } from 'react';
import { Card, Form, Input, Button, Select, Switch, InputNumber, message, Space } from 'antd';
import { useNavigate } from 'react-router-dom';
import { addPermission, getPermissionList } from '../../services/permissionService';

const { Option } = Select;

interface Permission {
  id: number;
  name: string;
  code: string;
  parentId: number | null;
}

const PermissionCreate: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const navigate = useNavigate();

  // 获取权限列表，用于选择父权限
  useEffect(() => {
    const fetchPermissions = async () => {
      try {
        const response = await getPermissionList();
        if (response.data.code === 200) {
          setPermissions(response.data.data || []);
        }
      } catch (error) {
        console.error('获取权限列表失败:', error);
        message.error('获取权限列表失败');
      }
    };

    fetchPermissions();
  }, []);

  // 提交表单
  const handleSubmit = async (values: any) => {
    setLoading(true);
    try {
      // 转换状态值
      const permissionData = {
        ...values,
        status: values.status ? 1 : 0,
        parentId: values.parentId || null,
      };

      const response = await addPermission(permissionData);
      if (response.data.code === 200) {
        message.success('创建权限成功');
        navigate('/permissions/list');
      } else {
        message.error(response.data.message || '创建权限失败');
      }
    } catch (error) {
      console.error('创建权限失败:', error);
      message.error('创建权限失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card title="创建权限">
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{
          type: 1,
          status: true,
          sort: 0,
        }}
      >
        <Form.Item
          name="name"
          label="权限名称"
          rules={[{ required: true, message: '请输入权限名称' }]}
        >
          <Input placeholder="请输入权限名称" />
        </Form.Item>

        <Form.Item
          name="code"
          label="权限编码"
          rules={[
            { required: true, message: '请输入权限编码' },
            { pattern: /^[a-zA-Z0-9:_]+$/, message: '权限编码只能包含字母、数字、冒号和下划线' }
          ]}
          extra="建议使用模块:操作:资源格式，如 system:user:create"
        >
          <Input placeholder="请输入权限编码" />
        </Form.Item>

        <Form.Item
          name="type"
          label="权限类型"
          rules={[{ required: true, message: '请选择权限类型' }]}
        >
          <Select placeholder="请选择权限类型">
            <Option value={1}>菜单</Option>
            <Option value={2}>按钮</Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="path"
          label="权限路径"
          extra="菜单类型需要填写前端路由路径，按钮类型可以为空"
        >
          <Input placeholder="请输入权限路径" />
        </Form.Item>

        <Form.Item
          name="parentId"
          label="父权限"
        >
          <Select
            placeholder="请选择父权限"
            allowClear
            showSearch
            optionFilterProp="children"
          >
            {permissions.map(permission => (
              <Option key={permission.id} value={permission.id}>
                {permission.name} ({permission.code})
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="icon"
          label="图标"
          extra="菜单类型可以设置图标，按钮类型可以为空"
        >
          <Input placeholder="请输入图标名称" />
        </Form.Item>

        <Form.Item
          name="sort"
          label="排序"
        >
          <InputNumber min={0} placeholder="请输入排序值" style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item
          name="description"
          label="权限描述"
        >
          <Input.TextArea rows={4} placeholder="请输入权限描述" />
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
            <Button onClick={() => navigate('/permissions/list')}>
              取消
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default PermissionCreate;
