import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import PackageList from './pages/packages/list';
import PackageCreate from './pages/packages/create';
import CampaignList from './pages/campaigns/list';
import CampaignCreate from './pages/campaigns/create';
import OrderList from './pages/orders/list';
import OrderCreate from './pages/orders/create';
import OrderStatistics from './pages/orders/statistics';
import UserList from './pages/users/list';
import UserCreate from './pages/users/create';
import UserEdit from './pages/users/edit';
import UserDetail from './pages/users/detail';
import UserStatistics from './pages/users/statistics';
import RoleList from './pages/roles/list';
import RoleCreate from './pages/roles/create';
import RoleEdit from './pages/roles/edit';
import RolePermissions from './pages/roles/permissions';
import PermissionList from './pages/permissions/list';
import PermissionCreate from './pages/permissions/create';
import PermissionEdit from './pages/permissions/edit';
import DouyinSource from './pages/sources/douyin';
import WechatSource from './pages/sources/wechat';
import TaobaoSource from './pages/sources/taobao';
import XiaohongshuSource from './pages/sources/xiaohongshu';
import OtherSource from './pages/sources/other';
import Settings from './pages/settings';
import AuthWrapper from './components/AuthWrapper';
import { getPermissions } from './services/permissionCache';
import { message } from 'antd';
import NoPermission from './pages/NoPermission';

// 路由守卫组件
const PrivateRoute: React.FC<{ element: React.ReactNode }> = ({ element }) => {
  const token = localStorage.getItem('token');

  if (!token) {
    // 未登录，重定向到登录页
    return <Navigate to="/login" replace />;
  }

  return <>{element}</>;
};

// 权限路由组件
const PermissionRoute: React.FC<{ element: React.ReactNode, permissionCode: string }> = ({ element, permissionCode }) => {
  return (
    <AuthWrapper
      permissionCode={permissionCode}
      fallback={<NoPermission />}
    >
      {element}
    </AuthWrapper>
  );
};

const App: React.FC = () => {
  const [userPermissions, setUserPermissions] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // 获取用户权限（从缓存获取）
    const fetchUserPermissions = async () => {
      try {
        const permissions = await getPermissions();
        setUserPermissions(permissions);
      } catch (error) {
        console.error('获取权限失败:', error);
        message.error('获取权限信息失败');
      } finally {
        setLoading(false);
      }
    };

    if (localStorage.getItem('token')) {
      fetchUserPermissions();
    } else {
      setLoading(false);
    }
  }, []);

  if (loading) {
    return <div>加载中...</div>;
  }

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/no-permission" element={<NoPermission />} />

        {/* 主布局路由 */}
        <Route path="/" element={<PrivateRoute element={<MainLayout />} />}>
          <Route index element={<Dashboard />} />

          {/* 套餐管理路由 */}
          <Route path="packages">
            <Route path="list" element={<PermissionRoute element={<PackageList />} permissionCode="packages:list" />} />
            <Route path="create" element={<PermissionRoute element={<PackageCreate />} permissionCode="packages:create" />} />
            <Route path="edit/:id" element={<PermissionRoute element={<div>编辑套餐页面</div>} permissionCode="packages:edit" />} />
            <Route path="detail/:id" element={<PermissionRoute element={<div>套餐详情页面</div>} permissionCode="packages:detail" />} />
          </Route>

          {/* 营销活动路由 */}
          <Route path="campaigns">
            <Route path="list" element={<PermissionRoute element={<CampaignList />} permissionCode="campaigns:list" />} />
            <Route path="create" element={<PermissionRoute element={<CampaignCreate />} permissionCode="campaigns:create" />} />
            <Route path="edit/:id" element={<PermissionRoute element={<div>编辑活动页面</div>} permissionCode="campaigns:edit" />} />
            <Route path="detail/:id" element={<PermissionRoute element={<div>活动详情页面</div>} permissionCode="campaigns:detail" />} />
          </Route>

          {/* 订单管理路由 */}
          <Route path="orders">
            <Route path="list" element={<PermissionRoute element={<OrderList />} permissionCode="orders:list" />} />
            <Route path="create" element={<PermissionRoute element={<OrderCreate />} permissionCode="orders:create" />} />
            <Route path="detail/:id" element={<PermissionRoute element={<div>订单详情页面</div>} permissionCode="orders:detail" />} />
            <Route path="statistics" element={<PermissionRoute element={<OrderStatistics />} permissionCode="orders:statistics" />} />
          </Route>

          {/* 订单来源路由 */}
          <Route path="sources">
            <Route path="douyin" element={<PermissionRoute element={<DouyinSource />} permissionCode="sources:douyin" />} />
            <Route path="wechat" element={<PermissionRoute element={<WechatSource />} permissionCode="sources:wechat" />} />
            <Route path="taobao" element={<PermissionRoute element={<TaobaoSource />} permissionCode="sources:taobao" />} />
            <Route path="xiaohongshu" element={<PermissionRoute element={<XiaohongshuSource />} permissionCode="sources:xiaohongshu" />} />
            <Route path="other" element={<PermissionRoute element={<OtherSource />} permissionCode="sources:other" />} />
          </Route>

          {/* 用户管理路由 */}
          <Route path="users">
            <Route path="list" element={<PermissionRoute element={<UserList />} permissionCode="users:list" />} />
            <Route path="create" element={<PermissionRoute element={<UserCreate />} permissionCode="users:create" />} />
            <Route path="edit/:id" element={<PermissionRoute element={<UserEdit />} permissionCode="users:edit" />} />
            <Route path="detail/:id" element={<PermissionRoute element={<UserDetail />} permissionCode="users:detail" />} />
            <Route path="statistics" element={<PermissionRoute element={<UserStatistics />} permissionCode="users:statistics" />} />
          </Route>

          {/* 角色管理路由 */}
          <Route path="roles">
            <Route path="list" element={<PermissionRoute element={<RoleList />} permissionCode="system:role:list" />} />
            <Route path="create" element={<PermissionRoute element={<RoleCreate />} permissionCode="system:role:create" />} />
            <Route path="edit/:id" element={<PermissionRoute element={<RoleEdit />} permissionCode="system:role:edit" />} />
            <Route path="permissions/:id" element={<PermissionRoute element={<RolePermissions />} permissionCode="system:role:permission" />} />
          </Route>

          {/* 权限管理路由 */}
          <Route path="permissions">
            <Route path="list" element={<PermissionRoute element={<PermissionList />} permissionCode="system:permission:list" />} />
            <Route path="create" element={<PermissionRoute element={<PermissionCreate />} permissionCode="system:permission:create" />} />
            <Route path="edit/:id" element={<PermissionRoute element={<PermissionEdit />} permissionCode="system:permission:edit" />} />
          </Route>

          {/* 系统设置路由 */}
          <Route path="settings" element={<PermissionRoute element={<Settings />} permissionCode="system:settings" />} />

          {/* 404页面 */}
          <Route path="*" element={<div>404 Not Found</div>} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
