'use client';

import { useRouter } from 'next/navigation';

export default function ExamSelect() {
  const router = useRouter();

  const exams = [
    {
      title: '순경 → 경장 진급시험',
      timeLimit: 20,
      path: '/exam/1'
    },
    {
      title: '경장 → 경사 진급시험',
      timeLimit: 30,
      path: '/exam/2'
    },
    {
      title: '경사 → 경위 진급시험',
      timeLimit: 40,
      path: '/exam/3'
    }
  ];

  return (
    <main className="min-h-screen bg-gray-100 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-8">진급시험 선택</h1>
        <div className="grid gap-6">
          {exams.map((exam, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => router.push(exam.path)}
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