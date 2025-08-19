import { useState, useEffect, useCallback } from 'react';
import { getPermissions, hasPermission as checkPermission, getCurrentUserId } from '../services/permissionCache';

/**
 * 权限Hook，用于检查用户是否拥有某个权限
 * @param userId 可选的用户ID，默认使用当前登录用户
 */
export const usePermission = (userId?: number) => {
  const [permissions, setPermissions] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // 获取用户权限（优先从缓存获取）
  useEffect(() => {
    const fetchPermissions = async () => {
      try {
        // 如果没有提供userId，则使用当前登录用户ID
        const currentUserId = userId || getCurrentUserId();
        const permissionData = await getPermissions(currentUserId);
        setPermissions(permissionData);
      } catch (error) {
        console.error('获取权限失败:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPermissions();
  }, [userId]);

  // 检查是否有权限
  const hasPermission = useCallback((permissionCode: string): boolean => {
    // 如果权限还在加载中，默认没有权限
    if (loading) {
      return false;
    }

    return checkPermission(permissionCode, permissions);
  }, [permissions, loading]);

  return { permissions, loading, hasPermission };
};
