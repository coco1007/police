'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

interface ExamInfo {
  id: string;
  title: string;
  timeLimit: number;
}

const exams: ExamInfo[] = [
  { id: '1', title: '순경 → 경장 진급시험', timeLimit: 20 },
  { id: '2', title: '경장 → 경사 진급시험', timeLimit: 30 },
  { id: '3', title: '경사 → 경위 진급시험', timeLimit: 40 },
];

export default function ExamSelection() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [idNumber, setIdNumber] = useState('');

  const handleExamSelect = (examId: string) => {
    if (!name.trim()) {
      toast.error('이름을 입력해주세요.');
      return;
    }
    if (!idNumber.trim()) {
      toast.error('고유번호를 입력해주세요.');
      return;
    }

    // 이름과 고유번호를 localStorage에 저장
    localStorage.setItem('examUserInfo', JSON.stringify({ name, idNumber }));
    router.push(`/exam/${examId}`);
  };

  return (
    <main className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">응시자 정보</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                이름
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="이름을 입력하세요"
                required
              />
            </div>
            <div>
              <label htmlFor="idNumber" className="block text-sm font-medium text-gray-700 mb-1">
                고유번호
              </label>
              <input
                type="text"
                id="idNumber"
                value={idNumber}
                onChange={(e) => setIdNumber(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="고유번호를 입력하세요"
                required
              />
            </div>
          </div>
        </div>

        <h1 className="text-2xl font-bold mb-6">시험 선택</h1>
        <div className="grid gap-4">
          {exams.map((exam) => (
            <div
              key={exam.id}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => handleExamSelect(exam.id)}
            >
              <h2 className="text-xl font-semibold mb-2">{exam.title}</h2>
              <p className="text-gray-600">제한시간: {exam.timeLimit}분</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
} 