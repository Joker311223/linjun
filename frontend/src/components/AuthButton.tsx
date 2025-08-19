import React from 'react';
import { Button } from 'antd';
import { ButtonProps } from 'antd/lib/button';
import { usePermission } from '../hooks/usePermission';

interface AuthButtonProps extends ButtonProps {
  permissionCode: string;
  children?: React.ReactNode;
}

/**
 * 权限按钮组件
 * 根据用户权限决定是否显示按钮
 */
const AuthButton: React.FC<AuthButtonProps> = ({
  permissionCode,
  children,
  ...props
}) => {
  const { hasPermission } = usePermission();

  // 如果没有权限，则不渲染按钮
  if (!hasPermission(permissionCode)) {
    return null;
  }

  return <Button {...props}>{children}</Button>;
};

export default AuthButton;
