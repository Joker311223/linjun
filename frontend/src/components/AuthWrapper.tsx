import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { message } from 'antd';
import { getUserPermissions } from '../services/userService';

interface AuthWrapperProps {
  permissionCode: string;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

/**
 * 权限控制包装组件
 * @param permissionCode 需要的权限代码
 * @param children 子组件
 * @param fallback 无权限时显示的内容，默认重定向到首页
 */
const AuthWrapper: React.FC<AuthWrapperProps> = ({ permissionCode, children, fallback }) => {
  const [hasPermission, setHasPermission] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const checkPermission = async () => {
      try {
        const response = await getUserPermissions();
        if (response.data.code === 200) {
          const permissions = response.data.data || [];

          // 检查是否有所需权限
          const hasRequiredPermission = permissions.some((permission: any) => {
            // 如果有通配符权限，直接返回true
            if (permission.code === '*:*:*') {
              return true;
            }

            // 检查具体权限
            return permission.code === permissionCode;
          });

          setHasPermission(hasRequiredPermission);
        } else {
          message.error('获取权限信息失败');
          setHasPermission(false);
        }
      } catch (error) {
        console.error('权限检查错误:', error);
        setHasPermission(false);
      } finally {
        setLoading(false);
      }
    };

    checkPermission();
  }, [permissionCode]);

  if (loading) {
    return <div>加载中...</div>;
  }

  if (!hasPermission) {
    return fallback ? <>{fallback}</> : <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default AuthWrapper;
