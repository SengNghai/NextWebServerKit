import { NextRequest, NextResponse } from "next/server";
import webpush from 'web-push';
import { privateVapidKey, publicVapidKey } from '~/utils/pushNotification';

// 设置 VAPID 密钥
webpush.setVapidDetails(
  'mailto:youremail@example.com', // 替换为你的邮箱
  publicVapidKey,
  privateVapidKey!
);

// 定义订阅信息接口
interface IPushSubscription {
  endpoint: string;
  keys: {
    p256dh: string;
    auth: string;
  };
}

// 存储无效的订阅信息（仅在内存中）
const invalidSubscriptions: IPushSubscription[] = [];

// 通用函数：生成响应
const createResponse = (status: number, body: object) => {
  return new Response(
    JSON.stringify(body),
    {
      status,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*', // 允许所有来源
      },
    }
  );
};

// 通用函数：验证订阅信息
const validateSubscription = (subscription: IPushSubscription | undefined): string | null => {
  if (!subscription || !subscription.endpoint || !subscription.keys) {
    return '无效的订阅信息';
  }
  if (invalidSubscriptions.some(sub => sub.endpoint === subscription.endpoint)) {
    return '订阅已过期或被用户取消';
  }
  return null;
};

// OPTIONS 方法: 处理预检请求
export async function OPTIONS() {
  return new Response(null, {
    status: 204, // 预检请求使用 204 无内容
    headers: {
      'Access-Control-Allow-Origin': '*', // 允许所有来源
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}

// POST 方法: 处理推送通知
export async function POST(request: NextRequest) {
  try {
    // 解析请求体数据
    const payload: { subscription: IPushSubscription; title: string; message: string; url: string } = await request.json();
    console.log('Received payload:', payload);

    // 验证订阅信息
    const validationError = validateSubscription(payload.subscription);
    if (validationError) {
      const status = validationError === '订阅已过期或被用户取消' ? 410 : 400;
      return createResponse(status, { success: false, error: validationError });
    }

    // 构建推送通知内容
    const notificationPayload = JSON.stringify({
      title: payload.title,
      body: payload.message,
      icon: '/icon.png', // 替换为实际图标路径
      url: payload.url,
    });
    console.log('正在推送通知到订阅:', payload.subscription.endpoint);

    // 发送推送通知
    await webpush.sendNotification(payload.subscription, notificationPayload);
    console.log('推送成功:', payload.subscription.endpoint);

    // 成功响应
    return createResponse(200, { success: true, message: '通知发送成功' });

  } catch (error) {
    const pushError = error as Error & { statusCode?: number };
    console.error('通知推送失败:', pushError.message);

    // 如果订阅已取消或过期，将其标记为无效
    if (pushError.statusCode === 410) {
      console.warn('订阅已过期或被用户取消:', pushError.message);
      const payload: { subscription: IPushSubscription } = await request.json();
      invalidSubscriptions.push(payload.subscription);
      console.log('存储无效订阅:', invalidSubscriptions);
    }

    // 返回推送失败的错误响应
    return createResponse(500, { success: false, error: '通知推送失败，请检查订阅信息或服务器日志' });
  }
}
