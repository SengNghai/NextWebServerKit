import { NextRequest, NextResponse } from 'next/server';
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

// 存储订阅信息的数组
let subscriptions: IPushSubscription[] = [];

// OPTIONS 方法: 支持预检请求，处理 CORS 问题
export async function OPTIONS() {
  return NextResponse.json(
    {},
    {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*', // 允许所有来源
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    }
  );
}

// POST 方法: 处理订阅
export async function POST(request: NextRequest) {
  try {
    // 从请求体中解析订阅数据
    const payload: { subscription: IPushSubscription; title: string; message: string; url: string } = await request.json();

    // 验证收到的订阅信息是否有效
    if (!payload || !payload.subscription || !payload.subscription.endpoint || !payload.subscription.keys) {
      throw new Error('请求体数据格式错误或缺失必要字段');
    }

    const newSubscription = payload.subscription;
    console.log('收到的订阅:', newSubscription);

    // 检查是否存在相同的订阅
    const existingIndex = subscriptions.findIndex((sub) => sub.endpoint === newSubscription.endpoint);

    if (existingIndex !== -1) {
      // 如果订阅已存在，移除旧的订阅
      console.log('发现重复订阅，删除旧的订阅:', subscriptions[existingIndex]);
      subscriptions.splice(existingIndex, 1);
    }

    // 保存新的订阅
    subscriptions.push(newSubscription);
    console.log('保存新的订阅:', newSubscription);

    // 构建推送通知内容
    const notificationPayload = JSON.stringify({
      title: payload.title,
      body: payload.message,
      icon: '/icon.png', // 替换为实际图标路径
      url: payload.url,
    });

    // 发送推送通知
    await webpush.sendNotification(newSubscription, notificationPayload);
    console.log('确认推送通知发送成功:', newSubscription.endpoint);

    return NextResponse.json(
      { success: true, message: '订阅已成功更新并发送确认推送' },
      {
        status: 200,
        headers: {
          'Access-Control-Allow-Origin': '*', // 允许跨域
        },
      }
    );
  } catch (error) {
    // 打印详细错误信息
    console.error('处理订阅时发生错误:', (error as Error).message);

    return NextResponse.json(
      { success: false, error: `订阅处理失败: ${(error as Error).message}` },
      {
        status: 500,
        headers: {
          'Access-Control-Allow-Origin': '*', // 确保错误响应支持跨域
        },
      }
    );
  }
}

/*
navigator.serviceWorker.ready.then(async (registration) => {
        // 将 VAPID 公钥转换为 base64url
        const vapidPublicKey = 'BI1DH5Pe73fMpZWhXOohot5UB85QlttiTW5CBgDflA_d3FM7iAX2LdPU7ZtaNMXIKFUuyBHkH2FEkHAuLqE4950'; // 用生成的 VAPID 公钥替换
        const applicationServerKey = base64ToUint8Array(vapidPublicKey);
      
        const subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey,
        });
      
        console.log('Push Subscription:', JSON.stringify(subscription, null, 2));
      
        // 将订阅信息发送到服务端保存
        fetch('http://localhost:3000/api/subscribe', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            subscription,
            title: '测试通知',
            message: '测试订阅通知的内容',
            url: 'https://example.com',
          }),
        })
          .then((response) => response.json())
          .then((data) => console.log('订阅成功:', data))
          .catch((error) => console.error('订阅失败:', error));
      });
      */
