import jwt from 'jsonwebtoken';

/**
 * JWT 密钥
 */
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret'; // 替换为安全的环境变量

// 生成 JWT Token
export const generateToken = (payload: object): string => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' }); // Token有效期为1小时
};

// 验证 JWT Token
export const verifyToken = (token: string): any => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
};


