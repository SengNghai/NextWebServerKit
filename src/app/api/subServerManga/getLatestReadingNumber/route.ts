import type { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod'; // Zod
import clientPromise, { ObjectId } from '~/lib/databases/mongodb/mongodb'; // MongoDB 连接
import { verifyToken } from '~/utils/auth'; // JWT 验证
import connectRedis from '~/utils/redis'; // Redis 连接
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
    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    // 验证请求数据
    const getReadingSchema = z.object({
        userId: z.string(),
        readingNumber: z.number(),
        token: z.string()
    });

    // 在 API 处理逻辑中验证
    const validationResult = getReadingSchema.safeParse(req.body);
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
    if (!userId || typeof userId !== 'string') {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    // 验证 Token
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized access' });
    }

    try {
        // Redis 连接
        const redis = await connectRedis();
        // 检查缓存中是否存在数据
        const cachedData = await redis.get(userId);
        if (cachedData) {
            return res.status(200).json(JSON.parse(cachedData));
        }

        // 验证 JWT Token
        const decoded = verifyToken(token);
        if (!decoded || decoded.userId !== userId) {
            return res.status(403).json({ message: 'Unauthorized access' });
        }
        // 连接数据库
        const client = await clientPromise; // MongoDB 连接
        const db = client.db(); // MongoDB 数据库
        const collection = db.collection('UserReadProgress'); // MongoDB 集合

        // 查找用户阅读号
        const userProgress = await collection.findOne({ _id: new ObjectId(userId) });

        // 如果用户不存在
        if (!userProgress) {
            return res.status(404).json({ message: 'User not found' });
        }

        // 返回数据
        const responseData = {
            readingNumber: userProgress.latestReadingNumber,
            updatedAt: userProgress.updatedAt,
        };

        logger.info(`User ${userId} fetched reading number: ${readingNumber}`); // 记录用户行为

        // 将数据存入 Redis 缓存，设置有效期（例如 5 分钟）
        await redis.set(userId, JSON.stringify(responseData), { EX: 300 });

        // 返回数据
        res.status(200).json(responseData);
    } catch (error) {
        logger.error(`Error fetching reading number for user ${userId}: ${(error as Error).message}`); // 记录错误
        console.error('Error fetching reading number:', error); // 记录错误
        res.status(500).json({ message: 'Internal server error' }); // 返回错误信息
    }
}
