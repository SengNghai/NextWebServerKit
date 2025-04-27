import { NextRequest } from "next/server";

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

// OPTIONS 方法: 处理预检请求
export async function OPTIONS() {
  return new Response(null, {
    status: 204, // 使用 204 状态码表示无内容
    headers: {
      'Access-Control-Allow-Origin': '*', // 允许所有来源
      'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS', // 增加 DELETE 方法支持
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}

// POST 方法: 返回简单的 JSON 数据，同时支持跨域
export async function POST() {
  return createResponse(200, { message: 'Hello, world!' });
}

// DELETE 方法: 取消订阅
export async function DELETE(request: NextRequest) {
  try {
    // 从请求体中解析订阅信息
    const { subscription }: { subscription: IPushSubscription } = await request.json();
    console.log('取消订阅请求:', subscription);

    // 验证订阅信息
    if (!subscription || !subscription.endpoint) {
      return createResponse(400, { success: false, error: '无效的订阅信息' });
    }

    // 检查订阅是否在无效列表中
    const index = invalidSubscriptions.findIndex(sub => sub.endpoint === subscription.endpoint);
    if (index === -1) {
      return createResponse(404, { success: false, error: '未找到匹配的订阅记录, 订阅可能已过期或被用户取消, 请检查订阅信息或者重新订阅!!!' });
    }

    // 从无效订阅列表中移除
    invalidSubscriptions.splice(index, 1);
    console.log('取消订阅成功:', subscription.endpoint);

    return createResponse(200, { success: true, message: '订阅已成功取消' });

  } catch (error) {
    console.error('取消订阅失败:', error);
    return createResponse(500, { success: false, error: '取消订阅失败，请检查日志' });
  }
}
