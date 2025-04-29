import { MongoClient, ObjectId } from 'mongodb';

const uri = process.env.MONGODB_URI || ''; // 在环境变量中存储 MongoDB URI
const options = {}; // MongoDB 连接选项


let client: MongoClient; // MongoDB 客户端
let clientPromise: Promise<MongoClient>; // MongoDB 连接 Promise

// 检查 MongoDB URI 是否存在
if (!process.env.MONGODB_URI) {
  throw new Error('Please add your MongoDB URI to .env.local');
}

// 根据环境选择不同的连接方式
if (process.env.NODE_ENV === 'development') {
  // 在开发模式下重用 MongoClient
  if (!(global as any)._mongoClientPromise) {
    client = new MongoClient(uri, options);
    (global as any)._mongoClientPromise = client.connect();
  }
  clientPromise = (global as any)._mongoClientPromise;
} else {
  // 在生产模式中创建新的客户端
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}
// 导出 ObjectId
export { ObjectId };

// 导出 MongoDB 连接
export default clientPromise;
