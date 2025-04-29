// 更新阅读号接口：/api/updateReadingNumber.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod'; // Zod
import clientPromise from '~/lib/databases/mongodb/mongodb';
import { verifyToken } from '~/utils/auth';
import logger from '~/utils/logger'; // 日志
import rateLimit from 'express-rate-limit'; // 限流


// 每个 IP 每分钟最多访问 100 次
export const limiter = rateLimit({
    windowMs: 60 * 1000, // 1 分钟
    max: 100,
    message: 'Too many requests, please try again later.'
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    await limiter(req, res, () => {}); // 将速率限制器应用到请求中

  // 验证请求方法
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }
      // 验证请求数据
      const updateReadingSchema = z.object({
        userId: z.string(),
        readingNumber: z.number(),
        token: z.string()
      });

  // 在 API 处理逻辑中验证
  const validationResult = updateReadingSchema.safeParse(req.body);
  if (!validationResult.success) {
    return res.status(400).json({ message: 'Invalid request data' });
  }

  // 获取请求体中的数据
  const { token, userId, readingNumber } = validationResult.data;

  // 验证请求数据
  if (!token || !userId || typeof readingNumber !== 'number') {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  // 验证用户ID
  if (!userId || typeof readingNumber !== 'number') {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    // 验证 JWT Token
    const decoded = verifyToken(token);
    if (!decoded || decoded.userId !== userId) {
      return res.status(403).json({ message: 'Unauthorized access' });
    }

    // 连接数据库
    const client = await clientPromise;
    const db = client.db(); // 默认数据库名取自 URI 配置
    const collection = db.collection('UserReadProgress');

    // 更新或插入用户阅读号
    const result = await collection.updateOne(
      { _id: userId }, // 使用 _id 作为用户唯一标识
      { 
        $set: {
          latestReadingNumber: readingNumber,
          updatedAt: new Date(),
        } 
      },
      { upsert: true } // 如果不存在则插入
    );

    logger.info(`User ${userId} updating reading number: ${readingNumber}`); // 记录用户行为
    // 返回结果
    res.status(200).json({ message: 'Reading number updated successfully' });
  } catch (error) {
    logger.error(`Error updating reading number for user ${userId}: ${(error as Error).message}`); // 记录错误
    console.error('Error updating reading number:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
