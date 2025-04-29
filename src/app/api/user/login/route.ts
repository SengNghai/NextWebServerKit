import type { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcrypt';
import { z } from 'zod'; // Zod
import { connectDb } from '~/lib/databases/mongodb/mongodb';
import { generateToken } from '~/utils/auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed...' });
  }

  // Zod 验证
  const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
  });

  // 在 API 处理逻辑中验证
  const validationResult = loginSchema.safeParse(req.body);
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
    const user = await collection.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // 验证密码
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // 生成 Token
    const token = generateToken({ email: user.email });

    // 返回登录成功
    res.status(200).json({ message: 'Login successful', token });
  } catch (error) {
    // 返回错误信息
    console.error('Error logging in user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
