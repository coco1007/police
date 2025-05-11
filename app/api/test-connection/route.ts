import { NextResponse } from 'next/server'
import { testConnection, closeConnection } from '@/lib/mongodb'

export async function GET() {
  try {
    const isConnected = await testConnection()
    if (isConnected) {
      return NextResponse.json({ 
        status: 'success', 
        message: 'MongoDB 연결 성공',
        timestamp: new Date().toISOString()
      })
    } else {
      return NextResponse.json(
        { 
          status: 'error', 
          message: 'MongoDB 연결 실패',
          timestamp: new Date().toISOString()
        },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('MongoDB 연결 테스트 중 오류 발생:', error)
    return NextResponse.json(
      { 
        status: 'error', 
        message: '서버 오류 발생',
        error: error instanceof Error ? error.message : '알 수 없는 오류',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  } finally {
    await closeConnection()
  }
} 