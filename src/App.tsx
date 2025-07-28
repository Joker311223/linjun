import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import PackageList from './pages/packages/list';
import PackageCreate from './pages/packages/create';
import CampaignList from './pages/campaigns/list';
import CampaignCreate from './pages/campaigns/create';
import OrderList from './pages/orders/list';
import OrderStatistics from './pages/orders/statistics';
import UserList from './pages/users/list';
import UserStatistics from './pages/users/statistics';
import Settings from './pages/settings';
import './mock';

// 路由守卫组件
const PrivateRoute: React.FC<{ element: React.ReactNode }> = ({ element }) => {
  const token = localStorage.getItem('token');

  if (!token) {
    // 未登录，重定向到登录页
    return <Navigate to="/login" replace />;
  }

  return <>{element}</>;
};

const App: React.FC = () => {
  useEffect(() => {
    // 在这里可以进行一些全局初始化操作
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />

        {/* 主布局路由 */}
        <Route path="/" element={<PrivateRoute element={<MainLayout />} />}>
          <Route index element={<Dashboard />} />

          {/* 套餐管理路由 */}
          <Route path="packages">
            <Route path="list" element={<PackageList />} />
            <Route path="create" element={<PackageCreate />} />
            <Route path="edit/:id" element={<div>编辑套餐页面</div>} />
            <Route path="detail/:id" element={<div>套餐详情页面</div>} />
          </Route>

          {/* 营销活动路由 */}
          <Route path="campaigns">
            <Route path="list" element={<CampaignList />} />
            <Route path="create" element={<CampaignCreate />} />
            <Route path="edit/:id" element={<div>编辑活动页面</div>} />
            <Route path="detail/:id" element={<div>活动详情页面</div>} />
          </Route>

          {/* 订单管理路由 */}
          <Route path="orders">
            <Route path="list" element={<OrderList />} />
            <Route path="detail/:id" element={<div>订单详情页面</div>} />
            <Route path="statistics" element={<OrderStatistics />} />
          </Route>

          {/* 用户管理路由 */}
          <Route path="users">
            <Route path="list" element={<UserList />} />
            <Route path="detail/:id" element={<div>用户详情页面</div>} />
            <Route path="statistics" element={<UserStatistics />} />
          </Route>

          {/* 系统设置路由 */}
          <Route path="settings" element={<Settings />} />

          {/* 404页面 */}
          <Route path="*" element={<div>404 Not Found</div>} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
