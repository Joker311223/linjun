import React, { useState, useEffect } from "react";
import {
  Table,
  Card,
  Button,
  Input,
  Select,
  Tag,
  Space,
  DatePicker,
  Badge,
  Avatar,
  Tooltip,
  Modal,
  message,
} from "antd";
import {
  EyeOutlined,
  SearchOutlined,
  UserOutlined,
  DownloadOutlined,
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import { getUserList, deleteUser, changeUserStatus } from "../../services/userService";
import AuthButton from "../../components/AuthButton";

const { Search } = Input;
const { Option } = Select;
const { RangePicker } = DatePicker;
const { confirm } = Modal;

interface User {
  id: number;
  username: string;
  realName: string;
  email: string;
  phone: string;
  status: number;
  roles: string;
  department: string;
  position: string;
  registerTime: string;
  lastLoginTime: string | null;
  source: string;
  orderCount: number;
  totalSpent: number;
}

const UserList: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [total, setTotal] = useState(0);
  const [pageNum, setPageNum] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [keyword, setKeyword] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [dateRange, setDateRange] = useState<
    [dayjs.Dayjs | null, dayjs.Dayjs | null]
  >([null, null]);

  const navigate = useNavigate();

  // 获取用户列表
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        // 构建查询参数
        const params: any = {
          pageNum,
          pageSize,
          keyword,
        };

        if (selectedStatus) {
          params.status = selectedStatus;
        }

        if (dateRange[0] && dateRange[1]) {
          params.startDate = dateRange[0].format("YYYY-MM-DD");
          params.endDate = dateRange[1].format("YYYY-MM-DD");
        }

        const response = await getUserList(params);

        if (response.data.code === 200) {
          setUsers(response.data.data.list);
          setTotal(response.data.data.total);
        }
      } catch (error) {
        console.error("获取用户列表失败:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [pageNum, pageSize, keyword, selectedStatus, dateRange]);

  // 处理搜索
  const handleSearch = (value: string) => {
    setKeyword(value);
    setPageNum(1);
  };

  // 处理状态筛选
  const handleStatusChange = (value: string) => {
    setSelectedStatus(value);
    setPageNum(1);
  };

  // 处理日期范围变化
  const handleDateRangeChange = (dates: any) => {
    setDateRange(dates);
    setPageNum(1);
  };

  // 处理分页变化
  const handleTableChange = (pagination: any) => {
    setPageNum(pagination.current);
    setPageSize(pagination.pageSize);
  };

  // 处理查看详情
  const handleView = (id: number) => {
    navigate(`/users/detail/${id}`);
  };

  // 处理编辑用户
  const handleEdit = (id: number) => {
    navigate(`/users/edit/${id}`);
  };

  // 处理删除用户
  const handleDelete = (id: number, username: string) => {
    confirm({
      title: '确定要删除该用户吗?',
      icon: <ExclamationCircleOutlined />,
      content: `用户名: ${username}`,
      okText: '确定',
      okType: 'danger',
      cancelText: '取消',
      onOk: async () => {
        try {
          const response = await deleteUser(id);
          if (response.data.code === 200) {
            message.success('删除用户成功');
            // 重新加载数据
            const newPageNum = users.length === 1 && pageNum > 1 ? pageNum - 1 : pageNum;
            setPageNum(newPageNum);
          } else {
            message.error(response.data.message || '删除用户失败');
          }
        } catch (error) {
          console.error('删除用户失败:', error);
          message.error('删除用户失败');
        }
      },
    });
  };

  // 处理修改用户状态
  const handleChangeStatus = (id: number, status: number) => {
    const newStatus = status === 1 ? 0 : 1;
    const statusText = newStatus === 1 ? '启用' : '禁用';

    confirm({
      title: `确定要${statusText}该用户吗?`,
      icon: <ExclamationCircleOutlined />,
      okText: '确定',
      cancelText: '取消',
      onOk: async () => {
        try {
          const response = await changeUserStatus(id, newStatus);
          if (response.data.code === 200) {
            message.success(`${statusText}用户成功`);
            // 更新本地数据
            setUsers(users.map(user =>
              user.id === id ? { ...user, status: newStatus } : user
            ));
          } else {
            message.error(response.data.message || `${statusText}用户失败`);
          }
        } catch (error) {
          console.error(`${statusText}用户失败:`, error);
          message.error(`${statusText}用户失败`);
        }
      },
    });
  };

  // 导出用户数据
  const handleExport = () => {
    // 实际项目中应该调用后端接口导出数据
    console.log("导出用户数据");
  };

  // 创建用户
  const handleCreate = () => {
    navigate('/users/create');
  };

  // 获取用户状态标签
  const getStatusTag = (status: number) => {
    switch (status) {
      case 1:
        return <Tag color="success">正常</Tag>;
      case 0:
        return <Tag color="default">禁用</Tag>;
      default:
        return <Tag color="default">未知</Tag>;
    }
  };

  // 获取用户角色标签
  const getRoleTags = (roles: string) => {
    if (!roles) return <Tag color="default">无角色</Tag>;

    const roleList = roles.split(',');
    return (
      <Space>
        {roleList.map(role => {
          let color = 'default';
          if (role === 'admin') color = 'red';
          else if (role === 'user') color = 'blue';
          else if (role === 'visitor') color = 'green';

          return (
            <Tag key={role} color={color}>
              {role}
            </Tag>
          );
        })}
      </Space>
    );
  };

  // 表格列定义
  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 60,
    },
    {
      title: "用户信息",
      key: "userInfo",
      width: 200,
      render: (record: User) => (
        <Space>
          <Avatar icon={<UserOutlined />} size="large" />
          <div>
            <div style={{ fontWeight: "bold" }}>{record.realName}</div>
            <div style={{ fontSize: 12, color: "#999" }}>{record.username}</div>
          </div>
        </Space>
      ),
    },
    {
      title: "联系方式",
      key: "contact",
      width: 180,
      render: (record: User) => (
        <div>
          <div>{record.email}</div>
          <div>{record.phone}</div>
        </div>
      ),
    },
    {
      title: "部门/职位",
      key: "department",
      width: 150,
      render: (record: User) => (
        <div>
          <div>{record.department || '-'}</div>
          <div style={{ fontSize: 12, color: "#999" }}>{record.position || '-'}</div>
        </div>
      ),
    },
    {
      title: "状态",
      dataIndex: "status",
      key: "status",
      width: 100,
      render: (status: number) => getStatusTag(status),
    },
    {
      title: "角色",
      key: "roles",
      width: 120,
      render: (record: User) => getRoleTags(record.roles),
    },
    {
      title: "注册时间",
      dataIndex: "registerTime",
      key: "registerTime",
      width: 180,
      render: (text: string) => text ? dayjs(text).format("YYYY-MM-DD HH:mm:ss") : "-",
    },
    {
      title: "最后登录",
      dataIndex: "lastLoginTime",
      key: "lastLoginTime",
      width: 180,
      render: (text: string) =>
        text ? dayjs(text).format("YYYY-MM-DD HH:mm:ss") : "-",
    },
    {
      title: "操作",
      key: "action",
      width: 200,
      render: (record: User) => (
        <Space>
          <Button
            type="text"
            icon={<EyeOutlined />}
            onClick={() => handleView(record.id)}
          >
            查看
          </Button>
          <AuthButton
            type="text"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record.id)}
            permissionCode="users:edit"
          >
            编辑
          </AuthButton>
          <AuthButton
            type="text"
            danger
            icon={record.status === 1 ? <DeleteOutlined /> : <UserOutlined />}
            onClick={() => handleChangeStatus(record.id, record.status)}
            permissionCode="users:edit"
          >
            {record.status === 1 ? '禁用' : '启用'}
          </AuthButton>
          <AuthButton
            type="text"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.id, record.username)}
            permissionCode="users:delete"
            disabled={record.username === 'admin'} // 禁止删除管理员账号
          >
            删除
          </AuthButton>
        </Space>
      ),
    },
  ];

  return (
    <Card>
      <div style={{ marginBottom: 16 }}>
        <Space size="large" wrap>
          <Search
            placeholder="搜索用户名/姓名/邮箱/手机"
            allowClear
            enterButton={<SearchOutlined />}
            onSearch={handleSearch}
            style={{ width: 250 }}
          />
          <Select
            placeholder="用户状态"
            allowClear
            style={{ width: 120 }}
            onChange={handleStatusChange}
          >
            <Option value="1">正常</Option>
            <Option value="0">禁用</Option>
          </Select>
          <RangePicker
            placeholder={["注册开始日期", "注册结束日期"]}
            onChange={handleDateRangeChange}
          />
          <AuthButton
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleCreate}
            permissionCode="users:create"
          >
            创建用户
          </AuthButton>
          <Button icon={<DownloadOutlined />} onClick={handleExport}>
            导出数据
          </Button>
        </Space>
      </div>
      <Table
        columns={columns}
        dataSource={users}
        rowKey="id"
        pagination={{
          current: pageNum,
          pageSize: pageSize,
          total: total,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total) => `共 ${total} 条记录`,
        }}
        onChange={handleTableChange}
        loading={loading}
        scroll={{ x: 1300 }}
      />
    </Card>
  );
};

export default UserList;
