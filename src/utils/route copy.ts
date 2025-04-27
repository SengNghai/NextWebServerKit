import { NextRequest, NextResponse } from 'next/server';

type Subscription = {
  endpoint: string;
  expirationTime: null | number;
  keys: {
    p256dh: string;
    auth: string;
  };
};

let subscriptions: Subscription[] = []; // 用于存储订阅信息

export async function POST(request: NextRequest) {
  const subscription: Subscription = await request.json();

  // 检查重复订阅
  const isSubscribed = subscriptions.some((sub) => sub.endpoint === subscription.endpoint);

  if (!isSubscribed) {
    subscriptions.push(subscription); // 保存订阅信息
  }

  console.log('当前订阅:', subscriptions);
  return NextResponse.json({ message: 'Subscription saved successfully' });
}
