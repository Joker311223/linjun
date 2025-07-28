import React, { useState, useEffect } from 'react';
import { Card, Form, Input, InputNumber, Select, Switch, Button, Space, message, Divider, Tag, Tooltip } from 'antd';
import { PlusOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const { Option } = Select;
const { TextArea } = Input;

interface PackageType {
  id: number;
  name: string;
  code: string;
}

const PackageCreate: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [packageTypes, setPackageTypes] = useState<PackageType[]>([]);
  const [features, setFeatures] = useState<string[]>([]);
  const [inputVisible, setInputVisible] = useState(false);
  const [inputValue, setInputValue] = useState('');

  const navigate = useNavigate();

  // 获取套餐类型
  useEffect(() => {
    const fetchPackageTypes = async () => {
      try {
        const response = await axios.get('/api/packages/types');
        if (response.data.code === 200) {
          setPackageTypes(response.data.data);
        }
      } catch (error) {
        console.error('获取套餐类型失败:', error);
        message.error('获取套餐类型失败');
      }
    };

    fetchPackageTypes();
  }, []);

  // 处理表单提交
  const handleSubmit = async (values: any) => {
    try {
      setLoading(true);

      // 添加特性列表到表单数据
      const packageData = {
        ...values,
        features
      };

      // 发送创建请求
      const response = await axios.post('/api/packages/create', packageData);

      if (response.data.code === 200) {
        message.success('套餐创建成功');
        navigate('/packages/list');
      } else {
        message.error(response.data.message || '创建失败');
      }
    } catch (error) {
      console.error('创建套餐失败:', error);
      message.error('创建套餐失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  // 处理取消
  const handleCancel = () => {
    navigate('/packages/list');
  };

  // 处理特性标签的显示和添加
  const handleClose = (removedTag: string) => {
    const newFeatures = features.filter(tag => tag !== removedTag);
    setFeatures(newFeatures);
  };

  const showInput = () => {
    setInputVisible(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleInputConfirm = () => {
    if (inputValue && !features.includes(inputValue)) {
      setFeatures([...features, inputValue]);
    }
    setInputVisible(false);
    setInputValue('');
  };

  return (
    <Card title="创建套餐">
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{
          status: 0,
          isHot: false,
          isRecommended: false,
          durationUnit: '天',
          price: 0,
          discountPrice: 0,
          duration: 30
        }}
      >
        <Form.Item
          name="name"
          label="套餐名称"
          rules={[{ required: true, message: '请输入套餐名称' }]}
        >
          <Input placeholder="请输入套餐名称" maxLength={50} />
        </Form.Item>

        <Form.Item
          name="code"
          label="套餐代码"
          rules={[{ required: true, message: '请输入套餐代码' }]}
        >
          <Input placeholder="请输入套餐代码" maxLength={20} />
        </Form.Item>

        <Form.Item
          name="type"
          label="套餐类型"
          rules={[{ required: true, message: '请选择套餐类型' }]}
        >
          <Select placeholder="请选择套餐类型">
            {packageTypes.map(type => (
              <Option key={type.id} value={type.id}>{type.name}</Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="description"
          label="套餐描述"
          rules={[{ required: true, message: '请输入套餐描述' }]}
        >
          <TextArea rows={4} placeholder="请输入套餐描述" maxLength={200} />
        </Form.Item>

        <Form.Item label="套餐特性">
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {features.map((feature, index) => (
              <Tag
                key={feature}
                closable
                onClose={() => handleClose(feature)}
              >
                {feature}
              </Tag>
            ))}
            {inputVisible ? (
              <Input
                type="text"
                size="small"
                style={{ width: 100 }}
                value={inputValue}
                onChange={handleInputChange}
                onBlur={handleInputConfirm}
                onPressEnter={handleInputConfirm}
                autoFocus
              />
            ) : (
              <Tag onClick={showInput} style={{ borderStyle: 'dashed' }}>
                <PlusOutlined /> 添加特性
              </Tag>
            )}
          </div>
        </Form.Item>

        <div style={{ display: 'flex', gap: '16px' }}>
          <Form.Item
            name="price"
            label="原价"
            rules={[{ required: true, message: '请输入原价' }]}
            style={{ flex: 1 }}
          >
            <InputNumber
              min={0}
              precision={2}
              style={{ width: '100%' }}
              addonBefore="¥"
              placeholder="请输入原价"
            />
          </Form.Item>

          <Form.Item
            name="discountPrice"
            label="优惠价"
            rules={[{ required: true, message: '请输入优惠价' }]}
            style={{ flex: 1 }}
          >
            <InputNumber
              min={0}
              precision={2}
              style={{ width: '100%' }}
              addonBefore="¥"
              placeholder="请输入优惠价"
            />
          </Form.Item>
        </div>

        <div style={{ display: 'flex', gap: '16px' }}>
          <Form.Item
            name="duration"
            label="有效期"
            rules={[{ required: true, message: '请输入有效期' }]}
            style={{ flex: 1 }}
          >
            <InputNumber min={1} style={{ width: '100%' }} placeholder="请输入有效期" />
          </Form.Item>

          <Form.Item
            name="durationUnit"
            label="时间单位"
            rules={[{ required: true, message: '请选择时间单位' }]}
            style={{ flex: 1 }}
          >
            <Select>
              <Option value="天">天</Option>
              <Option value="月">月</Option>
              <Option value="年">年</Option>
            </Select>
          </Form.Item>
        </div>

        <Divider />

        <div style={{ display: 'flex', gap: '24px' }}>
          <Form.Item
            name="status"
            label={
              <span>
                状态
                <Tooltip title="上架后套餐将在前台展示">
                  <QuestionCircleOutlined style={{ marginLeft: 4 }} />
                </Tooltip>
              </span>
            }
            valuePropName="checked"
          >
            <Switch checkedChildren="上架" unCheckedChildren="下架" />
          </Form.Item>

          <Form.Item
            name="isHot"
            label="热门"
            valuePropName="checked"
          >
            <Switch checkedChildren="是" unCheckedChildren="否" />
          </Form.Item>

          <Form.Item
            name="isRecommended"
            label="推荐"
            valuePropName="checked"
          >
            <Switch checkedChildren="是" unCheckedChildren="否" />
          </Form.Item>
        </div>

        <Divider />

        <Form.Item>
          <Space>
            <Button type="primary" htmlType="submit" loading={loading}>
              提交
            </Button>
            <Button onClick={handleCancel}>取消</Button>
          </Space>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default PackageCreate;
