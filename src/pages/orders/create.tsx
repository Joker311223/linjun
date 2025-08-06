import React, { useState, useEffect } from 'react';
import { Card, Form, Input, InputNumber, Select, Button, Space, message, Divider, Row, Col, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const { Option } = Select;
const { TextArea } = Input;
const { Title } = Typography;

interface Product {
  id: number;
  name: string;
  type: string;
  price: number;
  description: string;
}

interface User {
  id: number;
  name: string;
  phone: string;
}

interface PaymentMethod {
  id: number;
  name: string;
}

interface OrderSource {
  id: number;
  name: string;
}

const OrderCreate: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [orderSources, setOrderSources] = useState<OrderSource[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [discount, setDiscount] = useState<number>(0);

  const navigate = useNavigate();

  // 获取产品列表
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('/api/packages/list', {
          params: { pageSize: 100 }
        });
        if (response.data.code === 200) {
          setProducts(response.data.data.list);
        }
      } catch (error) {
        console.error('获取产品列表失败:', error);
        message.error('获取产品列表失败');
      }
    };

    fetchProducts();
  }, []);

  // 获取用户列表（模拟数据）
  useEffect(() => {
    // 在实际项目中，这里应该调用API获取用户列表
    const mockUsers = [
      { id: 1, name: '张三', phone: '13800138001' },
      { id: 2, name: '李四', phone: '13800138002' },
      { id: 3, name: '王五', phone: '13800138003' },
      { id: 4, name: '赵六', phone: '13800138004' },
      { id: 5, name: '钱七', phone: '13800138005' }
    ];
    setUsers(mockUsers);
  }, []);

  // 获取支付方式
  useEffect(() => {
    const fetchPaymentMethods = async () => {
      try {
        const response = await axios.get('/api/orders/payment-methods');
        if (response.data.code === 200) {
          setPaymentMethods(response.data.data);
        }
      } catch (error) {
        console.error('获取支付方式失败:', error);
        message.error('获取支付方式失败');
      }
    };

    fetchPaymentMethods();
  }, []);

  // 获取订单来源
  useEffect(() => {
    const fetchOrderSources = async () => {
      try {
        const response = await axios.get('/api/orders/sources');
        if (response.data.code === 200) {
          setOrderSources(response.data.data);
        }
      } catch (error) {
        console.error('获取订单来源失败:', error);
        message.error('获取订单来源失败');
      }
    };

    fetchOrderSources();
  }, []);

  // 处理产品选择变化
  const handleProductChange = (productId: number) => {
    const product = products.find(p => p.id === productId);
    if (product) {
      setSelectedProduct(product);

      // 设置默认折扣为每件商品10～20元
      const newQuantity = form.getFieldValue('quantity') || 1;
      const defaultDiscount = Math.floor(Math.random() * 11 + 10) * newQuantity; // 10～20元 * 数量

      form.setFieldsValue({
        price: product.price,
        discount: defaultDiscount,
        amount: product.price * newQuantity - defaultDiscount
      });

      setDiscount(defaultDiscount);
    }
  };

  // 处理数量变化
  const handleQuantityChange = (value: number | null) => {
    const newQuantity = value || 1;
    setQuantity(newQuantity);

    if (selectedProduct) {
      // 调整折扣，保持每件商品折扣在10～20元之间
      const perItemDiscount = Math.floor(Math.random() * 11 + 10); // 10～20元
      const newDiscount = perItemDiscount * newQuantity;

      form.setFieldsValue({
        discount: newDiscount,
        amount: selectedProduct.price * newQuantity - newDiscount
      });

      setDiscount(newDiscount);
    }
  };

  // 处理折扣变化
  const handleDiscountChange = (value: number | null) => {
    const newDiscount = value || 0;
    setDiscount(newDiscount);

    if (selectedProduct) {
      form.setFieldsValue({
        amount: selectedProduct.price * quantity - newDiscount
      });
    }
  };

  // 处理表单提交
  const handleSubmit = async (values: any) => {
    try {
      setLoading(true);

      // 构建订单数据
      const orderData = {
        ...values,
        orderNo: `ORD${Date.now()}${Math.floor(Math.random() * 1000)}`,
        status: 0, // 待支付
        createTime: new Date().toISOString()
      };

      // 发送创建请求
      const response = await axios.post('/api/orders/create', orderData);

      if (response.data.code === 200) {
        message.success('订单创建成功');
        navigate('/orders/list');
      } else {
        message.error(response.data.message || '创建失败');
      }
    } catch (error) {
      console.error('创建订单失败:', error);
      message.error('创建订单失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  // 处理取消
  const handleCancel = () => {
    navigate('/orders/list');
  };

  return (
    <Card title="订单录入">
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{
          quantity: 1,
          discount: 0
        }}
      >
        <Row gutter={24}>
          <Col span={12}>
            <Form.Item
              name="userId"
              label="选择用户"
              rules={[{ required: true, message: '请选择用户' }]}
            >
              <Select
                placeholder="请选择用户"
                showSearch
                optionFilterProp="children"
              >
                {users.map(user => (
                  <Option key={user.id} value={user.id}>
                    {user.name} ({user.phone})
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="packageId"
              label="选择产品"
              rules={[{ required: true, message: '请选择产品' }]}
            >
              <Select
                placeholder="请选择产品"
                showSearch
                optionFilterProp="children"
                onChange={handleProductChange}
              >
                {products.map(product => (
                  <Option key={product.id} value={product.id}>
                    {product.name} (¥{product.price})
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>

        {selectedProduct && (
          <div style={{ marginBottom: 24, padding: 16, background: '#f5f5f5', borderRadius: 4 }}>
            <Title level={5}>产品信息</Title>
            <Row gutter={24}>
              <Col span={8}>
                <div>产品名称：{selectedProduct.name}</div>
              </Col>
              <Col span={8}>
                <div>产品类型：{selectedProduct.type}</div>
              </Col>
              <Col span={8}>
                <div>单价：¥{selectedProduct.price}</div>
              </Col>
            </Row>
            <div style={{ marginTop: 8 }}>描述：{selectedProduct.description}</div>
          </div>
        )}

        <Row gutter={24}>
          <Col span={8}>
            <Form.Item
              name="quantity"
              label="数量"
              rules={[{ required: true, message: '请输入数量' }]}
            >
              <InputNumber
                min={1}
                style={{ width: '100%' }}
                onChange={handleQuantityChange}
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name="discount"
              label="折扣金额"
              rules={[{ required: true, message: '请输入折扣金额' }]}
              tooltip="每件商品折扣10～20元"
            >
              <InputNumber
                min={0}
                precision={2}
                style={{ width: '100%' }}
                addonBefore="¥"
                onChange={handleDiscountChange}
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name="amount"
              label="实付金额"
              rules={[{ required: true, message: '请输入实付金额' }]}
            >
              <InputNumber
                min={0}
                precision={2}
                style={{ width: '100%' }}
                addonBefore="¥"
                disabled
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={24}>
          <Col span={12}>
            <Form.Item
              name="paymentMethodId"
              label="支付方式"
              rules={[{ required: true, message: '请选择支付方式' }]}
            >
              <Select placeholder="请选择支付方式">
                {paymentMethods.map(method => (
                  <Option key={method.id} value={method.id}>{method.name}</Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="sourceId"
              label="订单来源"
              rules={[{ required: true, message: '请选择订单来源' }]}
            >
              <Select placeholder="请选择订单来源">
                {orderSources.map(source => (
                  <Option key={source.id} value={source.id}>{source.name}</Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          name="remark"
          label="备注"
        >
          <TextArea rows={4} placeholder="请输入备注信息" maxLength={200} />
        </Form.Item>

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

export default OrderCreate;
