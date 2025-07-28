import Mock from 'mockjs';
import './user';
import './packages';
import './campaigns';
import './statistics';
import './orders';

// 设置延迟时间
Mock.setup({
  timeout: '200-600'
});

export default Mock;
