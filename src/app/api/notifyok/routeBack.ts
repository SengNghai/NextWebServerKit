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

// OPTIONS 方法: 处理预检请求
export async function OPTIONS() {
  return new Response(null, {
    status: 204, // 使用 204 状态码表示无内容
    headers: {
      'Access-Control-Allow-Origin': '*', // 允许所有来源
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}


// 存储无效的订阅信息（仅在内存中）
const invalidSubscriptions: IPushSubscription[] = [];

// GET 方法: 返回简单的 JSON 数据，同时支持跨域
export async function POST(request: NextRequest) {
  const payload: { subscription: IPushSubscription; title: string; message: string; url: string } = await request.json();
  console.log('Received payload:', payload);

  if (!payload || !payload.subscription || !payload.subscription.endpoint || !payload.subscription.keys) {
    return new Response(
      JSON.stringify({ success: false, error: '无效的订阅信息' }),
      {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*', // 确保允许跨域
        },
      }
    );
  }


  // 检查订阅是否有效
  if (invalidSubscriptions.some(sub => sub.endpoint === payload.subscription.endpoint)) {
    return new Response(
      JSON.stringify({ success: false, error: '订阅已过期或被用户取消' }),
      {
        status: 410,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*', // 确保允许跨域
        },
      }
    );
  }

  // 构建推送通知内容
  const notificationPayload = JSON.stringify({
    title: payload.title,
    body: payload.message,
    icon: '/icon.png', // 替换为实际图标路径
    url: payload.url,
  });
  console.log('正在推送通知到订阅:', payload.subscription.endpoint);


  try {
    // 发送推送通知
    await webpush.sendNotification(payload.subscription, notificationPayload);
    console.log('推送成功:', payload.subscription.endpoint);
    return new Response(
      JSON.stringify({ message: '推送成功', success: true }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*', // 确保允许跨域
        },
      }
    );
  } catch (error) {
    // 处理推送失败的情况
    const pushError = error as Error & { statusCode?: number };

    console.error('通知推送失败:', pushError.message);

    if (pushError.statusCode === 410) {
      // 如果订阅已取消或过期
      console.warn('订阅已过期或被用户取消:', pushError.message);
      invalidSubscriptions.push((await request.json()).subscription);
      console.log('存储无效订阅:', invalidSubscriptions);
    }

    return NextResponse.json(
      { success: false, error: '通知推送失败，请检查订阅信息或服务器日志' },
      {
        status: 500,
        headers: {
          'Access-Control-Allow-Origin': '*', // 确保错误响应支持跨域
        },
      }
    );
  }

}
