import { NextResponse } from 'next/server';
import connectDB from '../../../lib/mongodb';
import ExamRecord from '../../../models/ExamRecord';

export async function POST(request: Request) {
  try {
    await connectDB();
    const data = await request.json();
    const examRecord = await ExamRecord.create(data);
    return NextResponse.json(examRecord, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: '시험 기록 저장 실패' }, { status: 500 });
  }
}

export async function GET() {
  try {
    await connectDB();
    const examRecords = await ExamRecord.find().sort({ date: -1 });
    return NextResponse.json(examRecords);
  } catch (error) {
    return NextResponse.json({ error: '시험 기록 조회 실패' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ error: 'ID가 필요합니다' }, { status: 400 });
    }

    await ExamRecord.findByIdAndDelete(id);
    return NextResponse.json({ message: '기록이 삭제되었습니다' });
  } catch (error) {
    return NextResponse.json({ error: '시험 기록 삭제 실패' }, { status: 500 });
  }
} 