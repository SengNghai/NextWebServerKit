/**
 * 日志配置
 * 日志系统的实现
 * 日志系统有助于记录用户操作和系统行为，以便调试和追踪问题。我们可以使用 Winston 库，这是一个功能强大的日志工具
 */

import winston from 'winston';

/**
 * 创建日志记录器
 */
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json() // 日志以 JSON 格式存储
  ),
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }), // 错误日志
    new winston.transports.File({ filename: 'logs/combined.log' }) // 综合日志
  ]
});

// 在开发环境下输出到控制台
if (process.env.NODE_ENV === 'development') {
  logger.add(
    new winston.transports.Console({
      format: winston.format.simple()
    })
  );
}

export default logger;
