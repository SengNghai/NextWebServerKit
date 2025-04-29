import { MongoClient, ObjectId } from 'mongodb';

/*
{
  "_id": "uniqueUserId",
  "email": "user@example.com",
  "password": "hashedPassword",
  "createdAt": "2025-04-30T00:04:00.000Z"
}
*/

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017'; // 在环境变量中存储 MongoDB URI
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


// 连接数据库
export const connectDb = async (databaseName: string, collectionName: string) => {
  const client = await clientPromise; // MongoDB 连接
  const db = client.db(databaseName); // MongoDB 数据库
  const collection = db.collection(collectionName); // MongoDB 集合
  return { 
    client, // MongoDB 连接
    db, // MongoDB 数据库
    collection, // MongoDB 集合
    ObjectId // ObjectId
  };
};

