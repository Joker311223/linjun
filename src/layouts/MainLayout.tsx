import React, { useState, useEffect } from 'react';
import { Layout, Menu,Image, Avatar, Dropdown, Button, theme, Breadcrumb } from 'antd';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  DashboardOutlined,
  AppstoreOutlined,
  ShoppingCartOutlined,
  UserOutlined,
  SettingOutlined,
  LogoutOutlined,
  BellOutlined
} from '@ant-design/icons';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import '../assets/styles/global.css';
import Logo from '../assets/images/logo';

const { Header, Sider, Content } = Layout;

const MainLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [selectedKeys, setSelectedKeys] = useState<string[]>(['dashboard']);
  const [breadcrumbs, setBreadcrumbs] = useState<{ title: string; path: string }[]>([]);
  const navigate = useNavigate();
  const location = useLocation();
  const { token } = theme.useToken();

  // 菜单项配置
  const menuItems = [
    {
      key: 'dashboard',
      icon: <DashboardOutlined />,
      label: '仪表盘',
      path: '/'
    },
    {
      key: 'packages',
      icon: <AppstoreOutlined />,
      label: '套餐管理',
      path: '/packages',
      children: [
        {
          key: 'packages-list',
          label: '套餐列表',
          path: '/packages/list'
        },
        {
          key: 'packages-create',
          label: '创建套餐',
          path: '/packages/create'
        }
      ]
    },
    {
      key: 'campaigns',
      icon: <ShoppingCartOutlined />,
      label: '营销活动',
      path: '/campaigns',
      children: [
        {
          key: 'campaigns-list',
          label: '活动列表',
          path: '/campaigns/list'
        },
        {
          key: 'campaigns-create',
          label: '创建活动',
          path: '/campaigns/create'
        }
      ]
    },
    {
      key: 'orders',
      icon: <ShoppingCartOutlined />,
      label: '订单管理',
      path: '/orders',
      children: [
        {
          key: 'orders-list',
          label: '订单列表',
          path: '/orders/list'
        },
        {
          key: 'orders-statistics',
          label: '订单统计',
          path: '/orders/statistics'
        }
      ]
    },
    {
      key: 'users',
      icon: <UserOutlined />,
      label: '用户管理',
      path: '/users',
      children: [
        {
          key: 'users-list',
          label: '用户列表',
          path: '/users/list'
        },
        {
          key: 'users-statistics',
          label: '用户统计',
          path: '/users/statistics'
        }
      ]
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: '系统设置',
      path: '/settings'
    }
  ];

  // 根据路径更新选中的菜单项和面包屑
  useEffect(() => {
    const path = location.pathname;

    // 查找当前路径对应的菜单项
    let currentKey = 'dashboard';
    let currentBreadcrumbs: { title: string; path: string }[] = [{ title: '首页', path: '/' }];

    // 遍历菜单项查找匹配的路径
    for (const item of menuItems) {
      if (item.path === path) {
        currentKey = item.key;
        currentBreadcrumbs = [
          { title: '首页', path: '/' },
          { title: item.label, path: item.path }
        ];
        break;
      }

      // 检查子菜单
      if (item.children) {
        for (const child of item.children) {
          if (child.path === path) {
            currentKey = child.key;
            currentBreadcrumbs = [
              { title: '首页', path: '/' },
              { title: item.label, path: item.path },
              { title: child.label, path: child.path }
            ];
            break;
          }
        }
      }
    }

    setSelectedKeys([currentKey]);
    setBreadcrumbs(currentBreadcrumbs);
  }, [location.pathname]);

  // 处理菜单点击事件
  const handleMenuClick = (key: string) => {
    // 查找对应的路径
    for (const item of menuItems) {
      if (item.key === key) {
        navigate(item.path);
        return;
      }

      // 检查子菜单
      if (item.children) {
        for (const child of item.children) {
          if (child.key === key) {
            navigate(child.path);
            return;
          }
        }
      }
    }
  };

  // 处理退出登录
  const handleLogout = () => {
    // 清除登录信息
    localStorage.removeItem('token');
    navigate('/login');
  };

  // 用户下拉菜单
  const userMenu = (
    <Menu
      items={[
        {
          key: '1',
          icon: <UserOutlined />,
          label: '个人中心'
        },
        {
          key: '2',
          icon: <SettingOutlined />,
          label: '账号设置'
        },
        {
          type: 'divider'
        },
        {
          key: '3',
          icon: <LogoutOutlined />,
          label: '退出登录',
          onClick: handleLogout
        }
      ]}
    />
  );

  // 将菜单项转换为Ant Design Menu组件需要的格式
  const getMenuItems = (items: any[]): any[] => {
    return items.map(item => {
      if (item.children) {
        return {
          key: item.key,
          icon: item.icon,
          label: item.label,
          children: getMenuItems(item.children)
        };
      }
      return {
        key: item.key,
        icon: item.icon,
        label: item.label
      };
    });
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider trigger={null} collapsible collapsed={collapsed} theme="light">
        <div style={{ height: 64, display: 'flex', alignItems: 'center', justifyContent: 'center', borderBottom: '1px solid #f0f0f0', padding: '0 16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: collapsed ? 'center' : 'flex-start', width: '100%' }}>
            <Image width={200} src="/logo2.png" />
            {!collapsed && <h1 style={{ color: token.colorPrimary, fontSize: '18px', margin: '0 0 0 12px' }}>线上营销平台</h1>}
          </div>
        </div>
        <Menu
          theme="light"
          mode="inline"
          selectedKeys={selectedKeys}
          onClick={({ key }) => handleMenuClick(key)}
          items={getMenuItems(menuItems)}
        />
      </Sider>
      <Layout>
        <Header style={{ padding: 0, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{ fontSize: '16px', width: 64, height: 64 }}
          />
          <div style={{ display: 'flex', alignItems: 'center', marginRight: 20 }}>
            <Button
              type="text"
              icon={<BellOutlined />}
              style={{ fontSize: '16px', marginRight: 10 }}
            />
            <Dropdown overlay={userMenu} placement="bottomRight">
              <div style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                <Avatar icon={<UserOutlined />} />
                <span style={{ marginLeft: 8 }}>管理员</span>
              </div>
            </Dropdown>
          </div>
        </Header>
        <Content style={{ margin: '16px' }}>
          <Breadcrumb style={{ marginBottom: '16px' }}>
            {breadcrumbs.map((item, index) => (
              <Breadcrumb.Item key={index}>
                {item.path ? (
                  <a href="#" onClick={(e) => { e.preventDefault(); navigate(item.path); }}>
                    {item.title}
                  </a>
                ) : (
                  item.title
                )}
              </Breadcrumb.Item>
            ))}
          </Breadcrumb>
          <div style={{ padding: 24, background: '#fff', minHeight: 360 }}>
            <Outlet />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout;
