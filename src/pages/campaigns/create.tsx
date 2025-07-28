import React, { useState, useEffect } from 'react';
import { Card, Form, Input, InputNumber, Select, Button, Space, message, Divider, DatePicker, Radio, Upload, Row, Col } from 'antd';
import { PlusOutlined, UploadOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import type { UploadFile } from 'antd/es/upload/interface';
import type { RcFile } from 'antd/es/upload';
import axios from 'axios';
import dayjs from 'dayjs';

const { Option } = Select;
const { TextArea } = Input;
const { RangePicker } = DatePicker;

interface CampaignType {
  id: number;
  name: string;
}

const CampaignCreate: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [campaignTypes, setCampaignTypes] = useState<CampaignType[]>([]);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [previewImage, setPreviewImage] = useState('');
  const [previewVisible, setPreviewVisible] = useState(false);

  const navigate = useNavigate();

  // 获取活动类型
  useEffect(() => {
    const fetchCampaignTypes = async () => {
      try {
        const response = await axios.get('/api/campaigns/types');
        if (response.data.code === 200) {
          setCampaignTypes(response.data.data);
        }
      } catch (error) {
        console.error('获取活动类型失败:', error);
        message.error('获取活动类型失败');
      }
    };

    fetchCampaignTypes();
  }, []);

  // 处理表单提交
  const handleSubmit = async (values: any) => {
    try {
      setLoading(true);

      // 处理日期范围
      const [startTime, endTime] = values.dateRange;

      // 构建提交数据
      const campaignData = {
        ...values,
        startTime: startTime.format('YYYY-MM-DD'),
        endTime: endTime.format('YYYY-MM-DD'),
        // 移除日期范围字段
        dateRange: undefined,
        // 添加图片列表
        images: fileList.map(file => file.response?.url || '')
      };

      // 发送创建请求
      const response = await axios.post('/api/campaigns/create', campaignData);

      if (response.data.code === 200) {
        message.success('活动创建成功');
        navigate('/campaigns/list');
      } else {
        message.error(response.data.message || '创建失败');
      }
    } catch (error) {
      console.error('创建活动失败:', error);
      message.error('创建活动失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  // 处理取消
  const handleCancel = () => {
    navigate('/campaigns/list');
  };

  // 处理图片上传前的验证
  const beforeUpload = (file: RcFile) => {
    const isImage = file.type.startsWith('image/');
    if (!isImage) {
      message.error('只能上传图片文件!');
    }

    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('图片大小不能超过2MB!');
    }

    return isImage && isLt2M;
  };

  // 处理图片上传状态变化
  const handleChange = ({ fileList }: { fileList: UploadFile[] }) => {
    setFileList(fileList);
  };

  // 处理图片预览
  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as RcFile);
    }

    setPreviewImage(file.url || (file.preview as string));
    setPreviewVisible(true);
  };

  // 将文件转换为Base64
  const getBase64 = (file: RcFile): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  return (
    <Card title="创建营销活动">
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{
          status: 0,
          targetType: 'all',
          budget: 0
        }}
      >
        <Row gutter={24}>
          <Col span={12}>
            <Form.Item
              name="name"
              label="活动名称"
              rules={[{ required: true, message: '请输入活动名称' }]}
            >
              <Input placeholder="请输入活动名称" maxLength={50} />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              name="type"
              label="活动类型"
              rules={[{ required: true, message: '请选择活动类型' }]}
            >
              <Select placeholder="请选择活动类型">
                {campaignTypes.map(type => (
                  <Option key={type.id} value={type.id}>{type.name}</Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={24}>
          <Col span={12}>
            <Form.Item
              name="dateRange"
              label="活动时间"
              rules={[{ required: true, message: '请选择活动时间范围' }]}
            >
              <RangePicker
                style={{ width: '100%' }}
                format="YYYY-MM-DD"
                disabledDate={(current) => current && current < dayjs().startOf('day')}
              />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              name="status"
              label="活动状态"
            >
              <Radio.Group>
                <Radio value={0}>草稿</Radio>
                <Radio value={1}>立即开始</Radio>
              </Radio.Group>
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          name="description"
          label="活动描述"
          rules={[{ required: true, message: '请输入活动描述' }]}
        >
          <TextArea rows={4} placeholder="请输入活动描述" maxLength={500} />
        </Form.Item>

        <Row gutter={24}>
          <Col span={12}>
            <Form.Item
              name="budget"
              label="活动预算"
              rules={[{ required: true, message: '请输入活动预算' }]}
            >
              <InputNumber
                min={0}
                precision={2}
                style={{ width: '100%' }}
                addonBefore="¥"
                placeholder="请输入活动预算"
              />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              name="targetType"
              label="目标受众"
              rules={[{ required: true, message: '请选择目标受众' }]}
            >
              <Select placeholder="请选择目标受众">
                <Option value="all">所有用户</Option>
                <Option value="new">新用户</Option>
                <Option value="old">老用户</Option>
                <Option value="vip">VIP用户</Option>
                <Option value="custom">自定义</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          name="targetCondition"
          label="受众条件"
          tooltip="当目标受众为自定义时，请填写筛选条件"
        >
          <TextArea rows={2} placeholder="请输入受众筛选条件，如：年龄>25且消费金额>1000" />
        </Form.Item>

        <Form.Item
          name="images"
          label="活动图片"
          valuePropName="fileList"
        >
          <Upload
            listType="picture-card"
            fileList={fileList}
            beforeUpload={beforeUpload}
            onChange={handleChange}
            onPreview={handlePreview}
            action="/api/upload"
            multiple
            maxCount={5}
          >
            {fileList.length >= 5 ? null : (
              <div>
                <PlusOutlined />
                <div style={{ marginTop: 8 }}>上传图片</div>
              </div>
            )}
          </Upload>
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

export default CampaignCreate;
