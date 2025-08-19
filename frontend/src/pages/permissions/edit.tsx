import React, { useState, useEffect } from 'react';
import { Card, Form, Input, Button, Select, Switch, InputNumber, message, Space, Spin } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import { getPermissionById, updatePermission, getPermissionList } from '../../services/permissionService';

const { Option } = Select;

interface Permission {
  id: number;
  name: string;
  code: string;
  parentId: number | null;
}

const PermissionEdit: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  // 获取权限列表和当前权限信息
  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;

      setLoading(true);
      try {
        // 获取所有权限，用于选择父权限
        const allPermissionsResponse = await getPermissionList();
        if (allPermissionsResponse.data.code === 200) {
          // 过滤掉当前权限及其子权限，避免循环依赖
          const filteredPermissions = (allPermissionsResponse.data.data || []).filter(
            (p: Permission) => p.id !== parseInt(id)
          );
          setPermissions(filteredPermissions);
        }

        // 获取当前权限信息
        const permissionResponse = await getPermissionById(parseInt(id));
        if (permissionResponse.data.code === 200) {
          const permissionData = permissionResponse.data.data;
          // 设置表单初始值
          form.setFieldsValue({
            ...permissionData,
            status: permissionData.status === 1,
          });
        } else {
          message.error(permissionResponse.data.message || '获取权限信息失败');
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
      const permissionData = {
        ...values,
        id: parseInt(id as string),
        status: values.status ? 1 : 0,
        parentId: values.parentId || null,
      };

      const response = await updatePermission(permissionData);
      if (response.data.code === 200) {
        message.success('更新权限成功');
        navigate('/permissions/list');
      } else {
        message.error(response.data.message || '更新权限失败');
      }
    } catch (error) {
      console.error('更新权限失败:', error);
      message.error('更新权限失败');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card title="编辑权限">
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
            <Input
              placeholder="请输入权限编码"
              disabled={form.getFieldValue('code') === '*:*:*'}
            />
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
            <Switch
              checkedChildren="启用"
              unCheckedChildren="禁用"
              disabled={form.getFieldValue('code') === '*:*:*'}
            />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit" loading={submitting}>
                保存
              </Button>
              <Button onClick={() => navigate('/permissions/list')}>
                取消
              </Button>
            </Space>
          </Form.Item>
        </Form>
      )}
    </Card>
  );
};

export default PermissionEdit;
