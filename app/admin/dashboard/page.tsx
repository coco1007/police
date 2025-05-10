'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

interface ExamRecord {
  _id: string;
  examId: string;
  title: string;
  date: string;
  answers: Record<number, string>;
  submissionReason?: string;
  name: string;
  idNumber: string;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [examRecords, setExamRecords] = useState<ExamRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 로그인 상태 확인
    const isLoggedIn = localStorage.getItem('adminLoggedIn');
    if (isLoggedIn !== 'true') {
      router.push('/admin/login');
      return;
    }

    // 시험 기록 가져오기
    const fetchRecords = async () => {
      try {
        const response = await fetch('/api/exam-records');
        if (!response.ok) {
          throw new Error('시험 기록 조회 실패');
        }
        const data = await response.json();
        setExamRecords(data);
      } catch (error) {
        console.error('시험 기록 조회 중 오류 발생:', error);
        toast.error('시험 기록을 불러오는데 실패했습니다.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecords();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('adminLoggedIn');
    toast.success('로그아웃되었습니다.');
    router.push('/admin/login');
  };

  const handleDeleteRecord = async (id: string) => {
    try {
      const response = await fetch(`/api/exam-records?id=${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('기록 삭제 실패');
      }

      setExamRecords(examRecords.filter(record => record._id !== id));
      toast.success('기록이 삭제되었습니다.');
    } catch (error) {
      console.error('기록 삭제 중 오류 발생:', error);
      toast.error('기록 삭제에 실패했습니다.');
    }
  };

  const handleClearAllRecords = async () => {
    if (window.confirm('모든 시험 기록을 삭제하시겠습니까?')) {
      try {
        // 각 기록을 개별적으로 삭제
        await Promise.all(examRecords.map(record => 
          fetch(`/api/exam-records?id=${record._id}`, {
            method: 'DELETE',
          })
        ));

        setExamRecords([]);
        toast.success('모든 기록이 삭제되었습니다.');
      } catch (error) {
        console.error('기록 삭제 중 오류 발생:', error);
        toast.error('기록 삭제에 실패했습니다.');
      }
    }
  };

  if (isLoading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-xl">로딩 중...</div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">관리자 대시보드</h1>
          <div className="space-x-4">
            <button
              onClick={handleClearAllRecords}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              모든 기록 삭제
            </button>
            <button
              onClick={handleLogout}
              className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
            >
              로그아웃
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold mb-4">시험 기록</h2>
          {examRecords.length === 0 ? (
            <p className="text-gray-500">아직 시험 기록이 없습니다.</p>
          ) : (
            <div className="space-y-4">
              {examRecords.map((record) => (
                <div key={record._id} className="border-b pb-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-semibold">{record.title}</h3>
                      <p className="text-gray-600">제출일시: {new Date(record.date).toLocaleString()}</p>
                      <p className="text-gray-600">응시자: {record.name} (고유번호: {record.idNumber})</p>
                      {record.submissionReason && (
                        <p className="text-red-600 mt-1">제출 사유: {record.submissionReason}</p>
                      )}
                    </div>
                    <div className="space-x-2">
                      <button
                        onClick={() => {
                          const answers = Object.entries(record.answers)
                            .map(([question, answer]) => `${Number(question) + 1}번: ${answer}`)
                            .join('\n');
                          const blob = new Blob([answers], { type: 'text/plain' });
                          const url = URL.createObjectURL(blob);
                          const link = document.createElement('a');
                          link.href = url;
                          link.download = `답안지_${record.title}_${record.name}_${record.idNumber}_${new Date(record.date).toLocaleDateString()}.txt`;
                          document.body.appendChild(link);
                          link.click();
                          document.body.removeChild(link);
                          URL.revokeObjectURL(url);
                        }}
                        className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                      >
                        답안지 다운로드
                      </button>
                      <button
                        onClick={() => handleDeleteRecord(record._id)}
                        className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                      >
                        삭제
                      </button>
                    </div>
                  </div>
                  <div className="mt-2">
                    <h4 className="font-medium mb-2">답안:</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {Object.entries(record.answers).map(([question, answer]) => (
                        <div key={question} className="text-sm">
                          <span className="font-medium">{Number(question) + 1}번:</span> {answer}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
} 