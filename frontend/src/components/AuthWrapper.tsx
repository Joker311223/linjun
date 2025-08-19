import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { message } from 'antd';
import { getPermissions, hasPermission as checkPermission, getCurrentUserId } from '../services/permissionCache';

interface AuthWrapperProps {
  permissionCode: string;
  children: React.ReactNode;
  fallback?: React.ReactNode;
  userId?: number;
}

/**
 * 权限控制包装组件
 * @param permissionCode 需要的权限代码
 * @param children 子组件
 * @param fallback 无权限时显示的内容，默认重定向到首页
 * @param userId 可选的用户ID，默认使用当前登录用户
 */
const AuthWrapper: React.FC<AuthWrapperProps> = ({ permissionCode, children, fallback, userId }) => {
  const [hasPermission, setHasPermission] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const checkUserPermission = async () => {
      try {
        // 如果没有提供userId，则使用当前登录用户ID
        const currentUserId = userId || getCurrentUserId();
        const permissions = await getPermissions(currentUserId);
        const hasRequiredPermission = checkPermission(permissionCode, permissions);
        setHasPermission(hasRequiredPermission);
      } catch (error) {
        console.error('权限检查错误:', error);
        setHasPermission(false);
      } finally {
        setLoading(false);
      }
    };

    checkUserPermission();
  }, [permissionCode, userId]);

  if (loading) {
    return <div>加载中...</div>;
  }

  if (!hasPermission) {
    return fallback ? <>{fallback}</> : <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default AuthWrapper;
