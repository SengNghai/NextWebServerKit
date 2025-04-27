import { NextResponse } from "next/server";

// OPTIONS 方法: 处理预检请求
export async function OPTIONS() {
  return new Response(null, {
    status: 204, // 使用 204 状态码表示无内容
    headers: {
      'Access-Control-Allow-Origin': '*', // 允许所有来源
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}

// GET 方法: 返回简单的 JSON 数据，同时支持跨域
export async function POST() {
  return new Response(
    JSON.stringify({ message: 'Hello, world!' }),
    {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*', // 确保允许跨域
      },
    }
  );
}
