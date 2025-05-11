import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import ExamRecord from '@/models/ExamRecord';

export async function POST(request: Request) {
  try {
    console.log('MongoDB 연결 시도...');
    await connectDB();
    console.log('MongoDB 연결 성공!');
    
    const data = await request.json();
    console.log('받은 데이터:', data);
    
    const examRecord = await ExamRecord.create(data);
    console.log('생성된 레코드:', examRecord);
    
    return NextResponse.json(examRecord, { status: 201 });
  } catch (error) {
    console.error('시험 기록 저장 실패:', error);
    return NextResponse.json({ error: '시험 기록 저장 실패', details: error.message }, { status: 500 });
  }
}

export async function GET() {
  try {
    console.log('MongoDB 연결 시도...');
    await connectDB();
    console.log('MongoDB 연결 성공!');
    
    const examRecords = await ExamRecord.find().sort({ date: -1 });
    console.log('조회된 레코드 수:', examRecords.length);
    
    return NextResponse.json(examRecords);
  } catch (error) {
    console.error('시험 기록 조회 실패:', error);
    return NextResponse.json({ error: '시험 기록 조회 실패', details: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    console.log('MongoDB 연결 시도...');
    await connectDB();
    console.log('MongoDB 연결 성공!');
    
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ error: 'ID가 필요합니다' }, { status: 400 });
    }

    console.log('삭제할 레코드 ID:', id);
    await ExamRecord.findByIdAndDelete(id);
    console.log('레코드 삭제 완료');
    
    return NextResponse.json({ message: '기록이 삭제되었습니다' });
  } catch (error) {
    console.error('시험 기록 삭제 실패:', error);
    return NextResponse.json({ error: '시험 기록 삭제 실패', details: error.message }, { status: 500 });
  }
} 