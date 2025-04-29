import { NextApiRequest, NextApiResponse } from "next";
import { connectDb } from '~/lib/databases/mongodb/mongodb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    // 验证请求方法
    if (req.method !== 'POST') {
      return res.status(405).json({ message: 'Method not allowed' });
    }
  
    // 连接数据库
    const { collection } = await connectDb('expoWebAppDB', 'Users');
  
    // 删除 Token
    await collection.deleteOne({ token: req.body.token });
  
    res.status(200).json({ message: 'Logout successful' });
  }
  