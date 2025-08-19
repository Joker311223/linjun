import { useState, useEffect, useCallback } from 'react';
import { getUserPermissions } from '../services/userService';

/**
 * 权限Hook，用于检查用户是否拥有某个权限
 */
export const usePermission = () => {
  const [permissions, setPermissions] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // 获取用户权限
  useEffect(() => {
    const fetchPermissions = async () => {
      try {
        const response = await getUserPermissions();
        if (response.data.code === 200) {
          const permissionData = response.data.data || [];
          setPermissions(permissionData.map((p: any) => p.code));
        }
      } catch (error) {
        console.error('获取权限失败:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPermissions();
  }, []);

  // 检查是否有权限
  const hasPermission = useCallback((permissionCode: string): boolean => {
    // 如果权限还在加载中，默认没有权限
    if (loading) {
      return false;
    }

    // 如果没有设置权限要求，则允许访问
    if (!permissionCode) {
      return true;
    }

    // 如果用户有通配符权限，则允许访问
    if (permissions.includes('*:*:*')) {
      return true;
    }

    // 检查具体权限
    return permissions.includes(permissionCode);
  }, [permissions, loading]);

  return { permissions, loading, hasPermission };
};
