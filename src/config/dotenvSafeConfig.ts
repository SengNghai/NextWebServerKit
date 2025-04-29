// 自动加载和校验环境变量
import 'dotenv-safe/config';

// 配置 Next.js 或其他功能
const dotenvSafeConfig = {
  MONGODB_URI: process.env.MONGODB_URI,
  JWT_SECRET: process.env.JWT_SECRET,
  REDIS_URL: process.env.REDIS_URL,
};

export default dotenvSafeConfig;
