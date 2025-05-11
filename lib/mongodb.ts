import { MongoClient } from "mongodb"

if (!process.env.MONGODB_URI) {
  throw new Error("Please add your MongoDB URI to .env.local")
}

const uri = process.env.MONGODB_URI
const options = {
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
  connectTimeoutMS: 10000,
  retryWrites: true,
  retryReads: true,
}

let client: MongoClient | null = null
let clientPromise: Promise<MongoClient> | null = null

async function connectToDatabase() {
  if (clientPromise) {
    return clientPromise
  }

  try {
    client = new MongoClient(uri, options)
    clientPromise = client.connect()
    console.log("MongoDB 연결 시도 중...")
    await clientPromise
    console.log("MongoDB 연결 성공!")
    return clientPromise
  } catch (error) {
    console.error("MongoDB 연결 실패:", error)
    client = null
    clientPromise = null
    throw error
  }
}

export async function getDb() {
  try {
    const client = await connectToDatabase()
    return client.db()
  } catch (error) {
    console.error("데이터베이스 연결 오류:", error)
    throw new Error("데이터베이스 연결에 실패했습니다")
  }
}

export async function testConnection() {
  try {
    const client = await connectToDatabase()
    await client.db().command({ ping: 1 })
    return true
  } catch (error) {
    console.error("MongoDB 연결 테스트 실패:", error)
    return false
  }
}

// 클라이언트 연결 종료 함수
export async function closeConnection() {
  if (client) {
    try {
      await client.close()
      console.log("MongoDB 연결 종료")
    } catch (error) {
      console.error("MongoDB 연결 종료 실패:", error)
    }
    client = null
    clientPromise = null
  }
}
