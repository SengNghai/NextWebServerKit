import type { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcrypt';
import { z } from 'zod'; // Zod
import { connectDb } from '~/lib/databases/mongodb/mongodb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  // Zod 验证
  const registerSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
  });

  // 在 API 处理逻辑中验证
  const validationResult = registerSchema.safeParse(req.body);
  if (!validationResult.success) {
    return res.status(400).json({ message: 'Invalid request data' });
  }

  // 获取请求体
  const { email, password } = validationResult.data;

  // 验证必填字段
  if (!email || !password) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    // 连接数据库
    const { collection } = await connectDb('expoWebAppDB', 'Users');

    // 查询用户
    const existingUser = await collection.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // 加密密码
    const hashedPassword = await bcrypt.hash(password, 10);

    // 插入用户
    await collection.insertOne({
      email,
      password: hashedPassword,
      createdAt: new Date(),
    });

    // 返回注册成功
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    // 返回错误信息
    console.error('Error registering user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
