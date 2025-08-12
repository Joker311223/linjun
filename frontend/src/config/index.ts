// 环境配置
const env = process.env.NODE_ENV || 'development';

// 配置对象
const config = {
  // 开发环境配置
  development: {
    apiBaseUrl: 'http://localhost:9090', // 开发环境API地址
    mockEnabled: false, // 是否启用mock数据
  },
  // 测试环境配置
  test: {
    apiBaseUrl: 'http://test-api.example.com', // 测试环境API地址
    mockEnabled: false,
  },
  // 生产环境配置
  production: {
    apiBaseUrl: 'https://api.example.com', // 生产环境API地址
    mockEnabled: false,
  }
};

// 导出当前环境的配置
export default config[env as keyof typeof config];
