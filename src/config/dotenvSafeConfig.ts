// 自动加载和校验环境变量
import 'dotenv-safe/config';

// 配置 Next.js 或其他功能
const dotenvSafeConfig = {
  mongoUri: process.env.MONGODB_URI,
  jwtSecret: process.env.JWT_SECRET,
  redisUrl: process.env.REDIS_URL,
};

export default dotenvSafeConfig;
