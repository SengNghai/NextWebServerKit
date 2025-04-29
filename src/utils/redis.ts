import { createClient } from 'redis';

/**
 * Redis 连接
 */
const client = createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379', // 替换为你的 Redis 连接地址
});

client.on('error', (err) => console.error('Redis Client Error', err));

const connectRedis = async () => {
  if (!client.isOpen) {
    await client.connect();
  }
  return client;
};

export default connectRedis;
