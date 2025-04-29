import type { NextApiRequest, NextApiResponse } from 'next';
import { verifyToken, generateToken } from '~/utils/auth';

/*
1. Token 续约的逻辑
工作流程
在用户访问受保护的页面或 API 时，验证现有 Token 的有效性。

如果 Token 即将过期（例如剩余不到 5 分钟），通过续约接口生成新的 Token。

客户端存储新的 Token，并继续请求。

实现关键点
使用当前 Token 验证用户身份，确保安全性。

重新生成 Token 时保持 payload 和过期时间一致。

避免频繁续约（例如只在临近过期时生成新 Token）。
*/

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { token } = req.body;

  if (!token) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    // 验证现有 Token
    const decoded = verifyToken(token);

    // 获取当前时间距离 Token 过期时间的差值
    const expirationTime = (decoded.exp as number) * 1000; // 转换为毫秒
    const remainingTime = expirationTime - Date.now();

    // 如果剩余时间大于 5 分钟，不续约
    if (remainingTime > 5 * 60 * 1000) {
      return res.status(200).json({ message: 'Token still valid' });
    }

    // 生成新的 Token，保持相同 payload
    const newToken = generateToken({ email: decoded.email });

    res.status(200).json({ message: 'Token refreshed', token: newToken });
  } catch (error) {
    console.error('Error refreshing token:', error);
    res.status(401).json({ message: 'Invalid or expired token' });
  }
}
