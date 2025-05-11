import { NextResponse } from 'next/server'
import { testConnection } from '@/lib/mongodb'

export async function GET() {
  try {
    const isConnected = await testConnection()
    if (isConnected) {
      return NextResponse.json({ status: 'success', message: 'MongoDB 연결 성공' })
    } else {
      return NextResponse.json(
        { status: 'error', message: 'MongoDB 연결 실패' },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('MongoDB 연결 테스트 중 오류 발생:', error)
    return NextResponse.json(
      { status: 'error', message: '서버 오류 발생' },
      { status: 500 }
    )
  }
} 