import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Statistic, DatePicker, Select, Divider, Spin, Radio, Tabs } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined, UserOutlined, TeamOutlined, RiseOutlined, LineChartOutlined } from '@ant-design/icons';
import axios from 'axios';
import dayjs from 'dayjs';
import ReactECharts from 'echarts-for-react';

const { RangePicker } = DatePicker;
const { Option } = Select;
const { TabPane } = Tabs;

interface StatisticsData {
  totalUsers: number;
  newUsers: number;
  activeUsers: number;
  retentionRate: number;
  comparedToLastPeriod: {
    totalUsers: number;
    newUsers: number;
    activeUsers: number;
    retentionRate: number;
  };
  timeData: {
    dates: string[];
    totalUsers: number[];
    newUsers: number[];
    activeUsers: number[];
    retentionRates: number[];
  };
  genderData: {
    labels: string[];
    values: number[];
  };
  ageData: {
    labels: string[];
    values: number[];
  };
  levelData: {
    labels: string[];
    values: number[];
  };
  regionData: {
    regions: string[];
    values: number[];
  };
}

const UserStatistics: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs, dayjs.Dayjs]>([
    dayjs().subtract(30, 'day'),
    dayjs()
  ]);
  const [timeUnit, setTimeUnit] = useState<string>('day');
  const [chartType, setChartType] = useState<string>('total');
  const [activeTab, setActiveTab] = useState<string>('trend');
  const [statisticsData, setStatisticsData] = useState<StatisticsData | null>(null);

  // 获取统计数据
  useEffect(() => {
    const fetchStatisticsData = async () => {
      setLoading(true);
      try {
        const params = {
          startDate: dateRange[0].format('YYYY-MM-DD'),
          endDate: dateRange[1].format('YYYY-MM-DD'),
          timeUnit
        };

        const response = await axios.get('/api/users/statistics', { params });

        if (response.data.code === 200) {
          setStatisticsData(response.data.data);
        }
      } catch (error) {
        console.error('获取统计数据失败:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStatisticsData();
  }, [dateRange, timeUnit]);

  // 处理日期范围变化
  const handleDateRangeChange = (dates: any) => {
    if (dates && dates.length === 2) {
      setDateRange(dates);
    }
  };

  // 处理时间单位变化
  const handleTimeUnitChange = (value: string) => {
    setTimeUnit(value);
  };

  // 处理图表类型变化
  const handleChartTypeChange = (e: any) => {
    setChartType(e.target.value);
  };

  // 处理标签页变化
  const handleTabChange = (key: string) => {
    setActiveTab(key);
  };

  // 获取趋势图表配置
  const getTrendChartOption = () => {
    if (!statisticsData) return {};

    const { timeData } = statisticsData;
    let seriesData: any[] = [];

    if (chartType === 'total') {
      seriesData = [
        {
          name: '总用户数',
          type: 'line',
          data: timeData.totalUsers,
          smooth: true,
          areaStyle: {
            opacity: 0.2
          },
          lineStyle: {
            width: 3
          },
          itemStyle: {
            color: '#1890ff'
          }
        }
      ];
    } else if (chartType === 'new') {
      seriesData = [
        {
          name: '新增用户',
          type: 'line',
          data: timeData.newUsers,
          smooth: true,
          areaStyle: {
            opacity: 0.2
          },
          lineStyle: {
            width: 3
          },
          itemStyle: {
            color: '#52c41a'
          }
        }
      ];
    } else if (chartType === 'active') {
      seriesData = [
        {
          name: '活跃用户',
          type: 'line',
          data: timeData.activeUsers,
          smooth: true,
          areaStyle: {
            opacity: 0.2
          },
          lineStyle: {
            width: 3
          },
          itemStyle: {
            color: '#fa8c16'
          }
        }
      ];
    } else if (chartType === 'retention') {
      seriesData = [
        {
          name: '留存率',
          type: 'line',
          data: timeData.retentionRates,
          smooth: true,
          areaStyle: {
            opacity: 0.2
          },
          lineStyle: {
            width: 3
          },
          itemStyle: {
            color: '#722ed1'
          }
        }
      ];
    } else if (chartType === 'all') {
      seriesData = [
        {
          name: '总用户数',
          type: 'line',
          data: timeData.totalUsers,
          smooth: true,
          lineStyle: {
            width: 2
          },
          itemStyle: {
            color: '#1890ff'
          }
        },
        {
          name: '新增用户',
          type: 'line',
          data: timeData.newUsers,
          smooth: true,
          lineStyle: {
            width: 2
          },
          itemStyle: {
            color: '#52c41a'
          }
        },
        {
          name: '活跃用户',
          type: 'line',
          data: timeData.activeUsers,
          smooth: true,
          lineStyle: {
            width: 2
          },
          itemStyle: {
            color: '#fa8c16'
          }
        }
      ];
    }

    return {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          label: {
            backgroundColor: '#6a7985'
          }
        }
      },
      legend: {
        data: seriesData.map(item => item.name)
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: timeData.dates
      },
      yAxis: {
        type: 'value'
      },
      series: seriesData
    };
  };

  // 获取性别分布图表配置
  const getGenderChartOption = () => {
    if (!statisticsData) return {};

    const { genderData } = statisticsData;

    return {
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b}: {c} ({d}%)'
      },
      legend: {
        orient: 'vertical',
        left: 10,
        data: genderData.labels
      },
      series: [
        {
          name: '性别分布',
          type: 'pie',
          radius: ['50%', '70%'],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 10,
            borderColor: '#fff',
            borderWidth: 2
          },
          label: {
            show: false,
            position: 'center'
          },
          emphasis: {
            label: {
              show: true,
              fontSize: '18',
              fontWeight: 'bold'
            }
          },
          labelLine: {
            show: false
          },
          data: genderData.labels.map((label, index) => ({
            value: genderData.values[index],
            name: label
          }))
        }
      ]
    };
  };

  // 获取年龄分布图表配置
  const getAgeChartOption = () => {
    if (!statisticsData) return {};

    const { ageData } = statisticsData;

    return {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: ageData.labels
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          name: '用户数量',
          type: 'bar',
          data: ageData.values,
          itemStyle: {
            color: function(params: any) {
              const colorList = ['#1890ff', '#52c41a', '#fa8c16', '#f5222d', '#722ed1', '#13c2c2'];
              return colorList[params.dataIndex % colorList.length];
            }
          }
        }
      ]
    };
  };

  // 获取等级分布图表配置
  const getLevelChartOption = () => {
    if (!statisticsData) return {};

    const { levelData } = statisticsData;

    return {
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b}: {c} ({d}%)'
      },
      legend: {
        orient: 'vertical',
        left: 10,
        data: levelData.labels
      },
      series: [
        {
          name: '等级分布',
          type: 'pie',
          radius: '50%',
          data: levelData.labels.map((label, index) => ({
            value: levelData.values[index],
            name: label
          })),
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }
      ]
    };
  };

  // 获取地区分布图表配置
  const getRegionChartOption = () => {
    if (!statisticsData) return {};

    const { regionData } = statisticsData;

    return {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: {
        type: 'value'
      },
      yAxis: {
        type: 'category',
        data: regionData.regions
      },
      series: [
        {
          name: '用户数量',
          type: 'bar',
          data: regionData.values,
          itemStyle: {
            color: function(params: any) {
              const colorList = ['#1890ff', '#52c41a', '#fa8c16', '#f5222d', '#722ed1'];
              return colorList[params.dataIndex % colorList.length];
            }
          }
        }
      ]
    };
  };

  return (
    <div>
      <Card>
        <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
          <div>
            <RangePicker
              value={dateRange}
              onChange={handleDateRangeChange}
              style={{ marginRight: 16 }}
            />
            <Select
              value={timeUnit}
              onChange={handleTimeUnitChange}
              style={{ width: 120 }}
            >
              <Option value="day">按天</Option>
              <Option value="week">按周</Option>
              <Option value="month">按月</Option>
            </Select>
          </div>
          {activeTab === 'trend' && (
            <Radio.Group value={chartType} onChange={handleChartTypeChange}>
              <Radio.Button value="total">总用户</Radio.Button>
              <Radio.Button value="new">新增</Radio.Button>
              <Radio.Button value="active">活跃</Radio.Button>
              <Radio.Button value="retention">留存率</Radio.Button>
              <Radio.Button value="all">全部</Radio.Button>
            </Radio.Group>
          )}
        </div>

        <Spin spinning={loading}>
          {statisticsData && (
            <>
              <Row gutter={16}>
                <Col span={6}>
                  <Card>
                    <Statistic
                      title="总用户数"
                      value={statisticsData.totalUsers}
                      valueStyle={{ color: '#1890ff' }}
                      prefix={<TeamOutlined />}
                      suffix={
                        statisticsData.comparedToLastPeriod.totalUsers > 0 ? (
                          <ArrowUpOutlined style={{ color: '#3f8600' }} />
                        ) : (
                          <ArrowDownOutlined style={{ color: '#cf1322' }} />
                        )
                      }
                    />
                    <div style={{ fontSize: 12, color: '#999', marginTop: 8 }}>
                      较上期
                      <span style={{
                        color: statisticsData.comparedToLastPeriod.totalUsers > 0 ? '#3f8600' : '#cf1322',
                        marginLeft: 4
                      }}>
                        {statisticsData.comparedToLastPeriod.totalUsers > 0 ? '+' : ''}
                        {statisticsData.comparedToLastPeriod.totalUsers}%
                      </span>
                    </div>
                  </Card>
                </Col>
                <Col span={6}>
                  <Card>
                    <Statistic
                      title="新增用户"
                      value={statisticsData.newUsers}
                      valueStyle={{ color: '#52c41a' }}
                      prefix={<UserOutlined />}
                      suffix={
                        statisticsData.comparedToLastPeriod.newUsers > 0 ? (
                          <ArrowUpOutlined style={{ color: '#3f8600' }} />
                        ) : (
                          <ArrowDownOutlined style={{ color: '#cf1322' }} />
                        )
                      }
                    />
                    <div style={{ fontSize: 12, color: '#999', marginTop: 8 }}>
                      较上期
                      <span style={{
                        color: statisticsData.comparedToLastPeriod.newUsers > 0 ? '#3f8600' : '#cf1322',
                        marginLeft: 4
                      }}>
                        {statisticsData.comparedToLastPeriod.newUsers > 0 ? '+' : ''}
                        {statisticsData.comparedToLastPeriod.newUsers}%
                      </span>
                    </div>
                  </Card>
                </Col>
                <Col span={6}>
                  <Card>
                    <Statistic
                      title="活跃用户"
                      value={statisticsData.activeUsers}
                      valueStyle={{ color: '#fa8c16' }}
                      prefix={<RiseOutlined />}
                      suffix={
                        statisticsData.comparedToLastPeriod.activeUsers > 0 ? (
                          <ArrowUpOutlined style={{ color: '#3f8600' }} />
                        ) : (
                          <ArrowDownOutlined style={{ color: '#cf1322' }} />
                        )
                      }
                    />
                    <div style={{ fontSize: 12, color: '#999', marginTop: 8 }}>
                      较上期
                      <span style={{
                        color: statisticsData.comparedToLastPeriod.activeUsers > 0 ? '#3f8600' : '#cf1322',
                        marginLeft: 4
                      }}>
                        {statisticsData.comparedToLastPeriod.activeUsers > 0 ? '+' : ''}
                        {statisticsData.comparedToLastPeriod.activeUsers}%
                      </span>
                    </div>
                  </Card>
                </Col>
                <Col span={6}>
                  <Card>
                    <Statistic
                      title="留存率"
                      value={statisticsData.retentionRate}
                      precision={2}
                      valueStyle={{ color: '#722ed1' }}
                      prefix={<LineChartOutlined />}
                      suffix="%"
                    />
                    <div style={{ fontSize: 12, color: '#999', marginTop: 8 }}>
                      较上期
                      <span style={{
                        color: statisticsData.comparedToLastPeriod.retentionRate > 0 ? '#3f8600' : '#cf1322',
                        marginLeft: 4
                      }}>
                        {statisticsData.comparedToLastPeriod.retentionRate > 0 ? '+' : ''}
                        {statisticsData.comparedToLastPeriod.retentionRate}%
                      </span>
                    </div>
                  </Card>
                </Col>
              </Row>

              <Divider />

              <Tabs activeKey={activeTab} onChange={handleTabChange}>
                <TabPane tab="用户趋势" key="trend">
                  <Card>
                    <ReactECharts
                      option={getTrendChartOption()}
                      style={{ height: 400 }}
                    />
                  </Card>
                </TabPane>
                <TabPane tab="用户属性" key="attribute">
                  <Row gutter={16}>
                    <Col span={12}>
                      <Card title="性别分布">
                        <ReactECharts
                          option={getGenderChartOption()}
                          style={{ height: 300 }}
                        />
                      </Card>
                    </Col>
                    <Col span={12}>
                      <Card title="年龄分布">
                        <ReactECharts
                          option={getAgeChartOption()}
                          style={{ height: 300 }}
                        />
                      </Card>
                    </Col>
                  </Row>
                  <Divider />
                  <Row gutter={16}>
                    <Col span={12}>
                      <Card title="等级分布">
                        <ReactECharts
                          option={getLevelChartOption()}
                          style={{ height: 300 }}
                        />
                      </Card>
                    </Col>
                    <Col span={12}>
                      <Card title="地区分布">
                        <ReactECharts
                          option={getRegionChartOption()}
                          style={{ height: 300 }}
                        />
                      </Card>
                    </Col>
                  </Row>
                </TabPane>
              </Tabs>
            </>
          )}
        </Spin>
      </Card>
    </div>
  );
};

export default UserStatistics;
