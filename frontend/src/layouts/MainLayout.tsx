import React, { useState, useEffect } from 'react';
import { Layout, Menu, Image, Avatar, Dropdown, Button, theme, Breadcrumb } from 'antd';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  DashboardOutlined,
  AppstoreOutlined,
  ShoppingCartOutlined,
  UserOutlined,
  SettingOutlined,
  LogoutOutlined,
  BellOutlined,
  ShopOutlined,
  TagOutlined
} from '@ant-design/icons';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import '../assets/styles/global.css';
import Logo from '../assets/images/logo';
import { getUserPermissions } from '../services/userService';

const { Header, Sider, Content } = Layout;

const MainLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [selectedKeys, setSelectedKeys] = useState<string[]>(['dashboard']);
  const [breadcrumbs, setBreadcrumbs] = useState<{ title: string; path: string }[]>([]);
  const [userPermissions, setUserPermissions] = useState<string[]>([]);
  const navigate = useNavigate();
  const location = useLocation();
  const { token } = theme.useToken();

  // 菜单项配置
  const menuItems = [
    {
      key: 'dashboard',
      icon: <DashboardOutlined />,
      label: '仪表盘',
      path: '/',
      permission: 'dashboard:view'
    },
    {
      key: 'packages',
      icon: <AppstoreOutlined />,
      label: '套餐管理',
      path: '/packages',
      permission: 'packages:view',
      children: [
        {
          key: 'packages-list',
          label: '套餐列表',
          path: '/packages/list',
          permission: 'packages:list'
        },
        {
          key: 'packages-create',
          label: '创建套餐',
          path: '/packages/create',
          permission: 'packages:create'
        }
      ]
    },
    {
      key: 'campaigns',
      icon: <ShoppingCartOutlined />,
      label: '营销活动',
      path: '/campaigns',
      permission: 'campaigns:view',
      children: [
        {
          key: 'campaigns-list',
          label: '活动列表',
          path: '/campaigns/list',
          permission: 'campaigns:list'
        },
        {
          key: 'campaigns-create',
          label: '创建活动',
          path: '/campaigns/create',
          permission: 'campaigns:create'
        }
      ]
    },
    {
      key: 'orders',
      icon: <ShoppingCartOutlined />,
      label: '订单管理',
      path: '/orders',
      permission: 'orders:view',
      children: [
        {
          key: 'orders-list',
          label: '订单列表',
          path: '/orders/list',
          permission: 'orders:list'
        },
        {
          key: 'orders-statistics',
          label: '订单统计',
          path: '/orders/statistics',
          permission: 'orders:statistics'
        }
      ]
    },
    {
      key: 'sources',
      icon: <ShopOutlined />,
      label: '订单来源',
      path: '/sources',
      permission: 'sources:view',
      children: [
        {
          key: 'sources-douyin',
          label: '抖音',
          path: '/sources/douyin',
          permission: 'sources:douyin'
        },
        {
          key: 'sources-wechat',
          label: '微信',
          path: '/sources/wechat',
          permission: 'sources:wechat'
        },
        {
          key: 'sources-taobao',
          label: '淘宝',
          path: '/sources/taobao',
          permission: 'sources:taobao'
        },
        {
          key: 'sources-xiaohongshu',
          label: '小红书',
          path: '/sources/xiaohongshu',
          permission: 'sources:xiaohongshu'
        },
        {
          key: 'sources-other',
          label: '其他渠道',
          path: '/sources/other',
          permission: 'sources:other'
        }
      ]
    },
    {
      key: 'users',
      icon: <UserOutlined />,
      label: '用户管理',
      path: '/users',
      permission: 'users:view',
      children: [
        {
          key: 'users-list',
          label: '用户列表',
          path: '/users/list',
          permission: 'users:list'
        },
        {
          key: 'users-statistics',
          label: '用户统计',
          path: '/users/statistics',
          permission: 'users:statistics'
        }
      ]
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: '系统设置',
      path: '/settings',
      permission: 'system:settings'
    }
  ];

  // 获取用户权限
  useEffect(() => {
    const fetchUserPermissions = async () => {
      try {
        const response = await getUserPermissions();
        if (response.data.code === 200) {
          const permissions = response.data.data || [];
          setUserPermissions(permissions.map((p: any) => p.code));
        }
      } catch (error) {
        console.error('获取权限失败:', error);
      }
    };

    fetchUserPermissions();
  }, []);

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

  // 检查用户是否有权限访问菜单项
  const hasPermission = (permission: string): boolean => {
    // 如果没有设置权限要求，或者用户有通配符权限，则允许访问
    if (!permission || userPermissions.includes('*:*:*')) {
      return true;
    }

    return userPermissions.includes(permission);
  };

  // 过滤菜单项，只显示用户有权限的菜单
  const filterMenuItems = (items: any[]): any[] => {
    return items
      .filter(item => hasPermission(item.permission))
      .map(item => {
        const newItem = { ...item };
        if (newItem.children) {
          const filteredChildren = filterMenuItems(newItem.children);
          if (filteredChildren.length > 0) {
            newItem.children = filteredChildren;
          } else {
            delete newItem.children;
          }
        }
        return newItem;
      });
  };

  // 将菜单项转换为Ant Design Menu组件需要的格式
  const getMenuItems = (items: any[]): any[] => {
    const filteredItems = filterMenuItems(items);

    return filteredItems.map(item => {
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
