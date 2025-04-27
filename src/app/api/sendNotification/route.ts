import { NextRequest, NextResponse } from 'next/server';
import webpush from 'web-push';
import { privateVapidKey, publicVapidKey } from '~/utils/pushNotification';

// 设置 VAPID 密钥
webpush.setVapidDetails(
  'mailto:youremail@example.com', // 替换为你的邮箱
  publicVapidKey,
  privateVapidKey!
);

// OPTIONS 方法: 处理预检请求
export async function OPTIONS(request: NextRequest) {
  const origin = request.headers.get('origin') || '*'; // 获取请求的来源
  return new Response(null, {
    status: 204, // 预检请求使用 204
    headers: {
      'Access-Control-Allow-Origin': origin, // 返回请求来源
      'Access-Control-Allow-Methods': 'POST, OPTIONS', // 声明允许的方法
      'Access-Control-Allow-Headers': 'Content-Type', // 声明允许的头部
    },
  });
}

// POST 方法: 处理推送通知
export async function POST(request: NextRequest) {
  const origin = request.headers.get('origin') || '*'; // 获取请求的来源

  try {
    // 从请求体中解析订阅数据
    const payload: { subscription: any; title: string; message: string; url: string } = await request.json();

    // 验证请求体数据是否完整
    if (!payload || !payload.subscription || !payload.subscription.endpoint || !payload.subscription.keys) {
      throw new Error('无效的请求数据');
    }

    // 创建推送消息的 payload
    const notificationPayload = JSON.stringify({
      title: payload.title,
      body: payload.message,
      icon: '/icon.png', // 替换为实际图标路径
      url: payload.url,
    });

    console.log('发送通知至:', payload.subscription.endpoint);

    // 使用 web-push 发送通知
    await webpush.sendNotification(payload.subscription, notificationPayload);
    console.log('通知发送成功:', payload.subscription.endpoint);

    // 成功响应，附加 CORS 头部
    return new Response(
      JSON.stringify({ success: true, message: '通知发送成功' }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': origin, // 允许跨域来源
        },
      }
    );
  } catch (error) {
    console.error('通知发送失败:', error);

    // 错误响应，附加 CORS 头部
    return new Response(
      JSON.stringify({ success: false, error: '推送通知失败，请检查日志' }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': origin, // 确保错误响应也支持跨域
        },
      }
    );
  }
}
