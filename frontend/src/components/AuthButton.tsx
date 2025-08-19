import React, { useEffect, useState } from 'react';
import { Button, ButtonProps } from 'antd';
import { getUserPermissions } from '../services/userService';

interface AuthButtonProps extends ButtonProps {
  permissionCode: string;
}

/**
 * 权限按钮组件
 * 根据用户权限决定是否显示按钮
 */
const AuthButton: React.FC<AuthButtonProps> = ({ permissionCode, children, ...props }) => {
  const [hasPermission, setHasPermission] = useState<boolean>(false);

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
        }
      } catch (error) {
        console.error('权限检查错误:', error);
        setHasPermission(false);
      }
    };

    checkPermission();
  }, [permissionCode]);

  // 如果没有权限，不渲染按钮
  if (!hasPermission) {
    return null;
  }

  return <Button {...props}>{children}</Button>;
};

export default AuthButton;
