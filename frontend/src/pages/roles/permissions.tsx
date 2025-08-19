import React, { useState, useEffect } from 'react';
import { Card, Tree, Button, message, Space, Spin, Descriptions } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import { getRoleById } from '../../services/roleService';
import { getPermissionList, getPermissionsByRoleId, assignPermissionsToRole } from '../../services/permissionService';
import type { Key } from 'rc-tree/lib/interface';

interface Role {
  id: number;
  name: string;
  code: string;
  status: number;
  description: string;
}

interface Permission {
  id: number;
  name: string;
  code: string;
  type: number;
  path: string;
  parentId: number | null;
  children?: Permission[];
}

const RolePermissions: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [role, setRole] = useState<Role | null>(null);
  const [permissionTree, setPermissionTree] = useState<Permission[]>([]);
  const [checkedKeys, setCheckedKeys] = useState<React.Key[]>([]);
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([]);

  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  // 获取角色信息和权限树
  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;

      setLoading(true);
      try {
        // 获取角色信息
        const roleResponse = await getRoleById(parseInt(id));
        if (roleResponse.data.code === 200) {
          setRole(roleResponse.data.data);
        }

        // 获取所有权限
        const allPermissionsResponse = await getPermissionList();
        if (allPermissionsResponse.data.code === 200) {
          const permissions = allPermissionsResponse.data.data || [];
          // 构建权限树
          const tree = buildPermissionTree(permissions);
          setPermissionTree(tree);

          // 设置默认展开的节点
          const expandKeys = permissions
            .filter((p: Permission) => p.parentId === null || p.parentId === 0)
            .map((p: Permission) => p.id);
          setExpandedKeys(expandKeys);
        }

        // 获取角色已有权限
        const rolePermissionsResponse = await getPermissionsByRoleId(parseInt(id));
        if (rolePermissionsResponse.data.code === 200) {
          const rolePermissions = rolePermissionsResponse.data.data || [];
          // 设置选中的权限
          setCheckedKeys(rolePermissions.map((p: Permission) => p.id));
        }
      } catch (error) {
        console.error('获取数据失败:', error);
        message.error('获取数据失败');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  // 构建权限树
  const buildPermissionTree = (permissions: Permission[]): Permission[] => {
    // 创建一个映射表，用于快速查找
    const map: Record<number, Permission> = {};
    permissions.forEach(permission => {
      map[permission.id] = { ...permission, children: [] };
    });

    // 构建树结构
    const tree: Permission[] = [];
    permissions.forEach(permission => {
      const node = map[permission.id];
      if (permission.parentId === null || permission.parentId === 0) {
        // 根节点
        tree.push(node);
      } else if (map[permission.parentId]) {
        // 子节点
        if (!map[permission.parentId].children) {
          map[permission.parentId].children = [];
        }
        map[permission.parentId].children!.push(node);
      }
    });

    return tree;
  };

  // 处理权限选择变化
  const handleCheck = (checked: React.Key[] | { checked: React.Key[]; halfChecked: React.Key[] }) => {
    if (Array.isArray(checked)) {
      setCheckedKeys(checked);
    } else {
      setCheckedKeys(checked.checked);
    }
  };

  // 处理展开/收起节点
  const handleExpand = (expanded: React.Key[]) => {
    setExpandedKeys(expanded);
  };

  // 保存权限分配
  const handleSave = async () => {
    if (!id) return;

    setSubmitting(true);
    try {
      const response = await assignPermissionsToRole(parseInt(id), checkedKeys as number[]);
      if (response.data.code === 200) {
        message.success('权限分配成功');
        navigate('/roles/list');
      } else {
        message.error(response.data.message || '权限分配失败');
      }
    } catch (error) {
      console.error('权限分配失败:', error);
      message.error('权限分配失败');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card
      title="角色权限分配"
      extra={
        <Space>
          <Button type="primary" onClick={handleSave} loading={submitting} disabled={!role}>
            保存
          </Button>
          <Button onClick={() => navigate('/roles/list')}>
            返回
          </Button>
        </Space>
      }
    >
      {loading ? (
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <Spin size="large" />
        </div>
      ) : role ? (
        <>
          <Descriptions bordered column={2} style={{ marginBottom: 20 }}>
            <Descriptions.Item label="角色名称">{role.name}</Descriptions.Item>
            <Descriptions.Item label="角色编码">{role.code}</Descriptions.Item>
            <Descriptions.Item label="角色描述" span={2}>{role.description || '-'}</Descriptions.Item>
          </Descriptions>

          <Card title="权限列表" size="small">
            <Tree
              checkable
              checkedKeys={checkedKeys}
              expandedKeys={expandedKeys}
              onCheck={handleCheck}
              onExpand={handleExpand}
              treeData={permissionTree.map(item => ({
                key: item.id,
                title: `${item.name} (${item.code})`,
                children: item.children?.map(child => ({
                  key: child.id,
                  title: `${child.name} (${child.code})`,
                  children: child.children?.map(grandChild => ({
                    key: grandChild.id,
                    title: `${grandChild.name} (${grandChild.code})`,
                  }))
                }))
              }))}
            />
          </Card>
        </>
      ) : (
        <div>未找到角色信息</div>
      )}
    </Card>
  );
};

export default RolePermissions;
