'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import html2canvas from 'html2canvas';

interface ExamQuestion {
  type: 'ox' | 'multiple' | 'essay';
  question: string;
  options?: string[];
  points: number;
}

interface ExamRecord {
  id: string;
  title: string;
  date: string;
  answers: Record<number, string>;
  submissionReason?: string;
  name: string;
  idNumber: string;
}

const examData: Record<string, { title: string; timeLimit: number; questions: ExamQuestion[] }> = {
  '1': {
    title: '순경 → 경장 진급시험',
    timeLimit: 20,
    questions: [
      { type: 'ox', question: '동승자가 도주자에게 최초PM 2회를 찍은 상태이다. 쫓아가서 운전자가 PM를 1회 찍었다. 경찰측에서 총기 발포가 가능한가?', points: 10 },
      { type: 'ox', question: '불법 주정차에 단속 기준은 5분이며, 도로교통법 집행이 가능하다.', points: 10 },
      { type: 'multiple', question: '제 3장 경찰기관 봉금에 관한 규정 중 초과근무 수당 지급 제외 대상자 에 대한 항목 중 틀린것은?', options: ['뇌물 수수 혐의 이력자', '전일 1회 이상 출근한 이력이 없는 경우', '내부경고 2회 누적자', '피크타임(23:00 ~) 이후 출근자'], points: 10 },
      { type: 'multiple', question: '조직과 도주RP중 양측이 총기를 발포하여 즉흥으로 전환됬을때 3블럭 이상으로 범위를 벗어나면 안된다 그러면 시민은 몇블럭 까지 가능한가?', options: ['2블럭', '3블럭', '5블럭', '전체'], points: 10 },
      { type: 'multiple', question: '영장 RP의 경찰이 참여할 수 있는 최대 인원 수를 고르시오', options: ['강도측 +1', '강도측 +2', '강도측 +3', '출근 중인 경찰 공무원 전부'], points: 10 },
      { type: 'multiple', question: '특공대 메뉴얼 무전 수칙 중 특공대가 아닌 인원이 마이크를 사용할 수 있을 때의 조건은 알맞지 않는 것을 고르시오.', options: ['지휘권자의 지시에 따른 진입대기가 준비 되었을 때', '본인이 다운 되었을 때', '부여 받은 위치의 대상을 제압 하였을 때', '내가 현재 어디 위치에 있는지 알려줄 때'], points: 10 },
      { type: 'essay', question: '본인은 교통사고 현장을 목격했다. A와 B는 서로 누구의 과실이 큰지 의견이 대립되고 있다. 경찰의 알맞는 행동을 쓰시오.', points: 10 },
      { type: 'essay', question: '도주 상황이 발생했을시, 운전자는 도주에 성공, 동승자는 제압하여 죽었을 때 어떻게 대처해야하는지 서술하시오', points: 10 },
      { type: 'essay', question: '경찰서 1차와 2차 털이시 사용 가능한 스나이퍼 갯수, 샷건 갯수를 서술하시오', points: 10 },
      { type: 'essay', question: '공무원 합동 RP는 어떤 것이 있는지 모두 서술하시오.', points: 10 },
    ]
  },
  '2': {
    title: '경장 → 경사 진급시험',
    timeLimit: 30,
    questions: [
      { type: 'ox', question: '경찰은 도주차량 추격 중, 정차 명령(E키) 3회 실시 후에도 정차하지 않으면 즉시 발포가 가능하다.', points: 10 },
      { type: 'ox', question: '스토리"전멸" 나온 이후에는 전술지휘권은 일반 상급 경찰에게 자동으로 이전된다.', points: 10 },
      { type: 'multiple', question: '다음 중 "즉흥RP" → 벌금/구금 집행까지의 절차가 올바르게 나열된 것은?', options: ['정차명령 → 도주 확인 → 즉각 발포 → 무기 압수 → 체포 → 집행', '무전전파 → 정차명령 3회 → 즉각 발포 → 무기 압수 → 체포 → 집행', '정차명령 3회 → 무전 전파 및 보고 → 지휘 하에 발포 → 무기 압수 → 체포 → 집행', '바로 총격전 진입 → 무기 압수 → 체포 → 집행'], points: 10 },
      { type: 'multiple', question: '다음 중 경찰청 내부 규칙상 경찰 복무 중 처벌 수위가 "중징계"에 해당하는 상황은?', options: ['퇴근 중 무전방 청취', '경찰복을 입고 잠수', '경찰 차량 문 단속 하지 않아 차량 탈취로 RP상 손해 발생', '체포 중 미란다 고지를 누락한 경우'], points: 10 },
      { type: 'multiple', question: '스토리RP 도중 경찰의 전멸이 확인되었을 때, 이후 경찰 측의 행동으로 적절한 것은?', options: ['즉시 복귀 후 재정비하여 재투입', '지휘자 판단 하 RP 즉흥으로 전환', '모든 경찰은 RP 구역에서 이탈', '경찰은 복귀 후 바로 총기 보급 후 재진입'], points: 10 },
      { type: 'multiple', question: '다음 중 수배RP 관련 법률에 알맞지 않는 것은?', options: ['출석 공지 작성 시, 출석자 닉네임만 적으면 충분하다', '지원콜 기능이 있는 팩션은 수배 공지가 올라오고 5분 이후에 지원이 가능하다.', '수배 시작 후 차량 수리 기능 대신 사유지가 가깝다면 비콘으로 차량 복구가 가능하다.', '수배 패배 벌금: 2억 / 구금: 30분이다.'], points: 10 },
      { type: 'essay', question: '당신은 경사로서 경찰 복무 중, 후임 경관이 RP 중 시민에게 반말을 사용하고 과잉 체포를 시도하는 장면을 목격했습니다. 후임 경관이 잘못한 점과 잘못한 점에 대한 피드백을 서술하시오', points: 10 },
      { type: 'essay', question: '스토리RP 중 강도 측이 정상적인 절차 없이 벨을 울려서 RP가 시작됐다. 이때 조치해야할 행동을 서술하시오. 지휘권, 법률, 규정을 포함해 서술하시오.', points: 10 },
      { type: 'essay', question: '폭주로 인해 체포된 시민이 폭언 및 물리적 저항을 반복하여 경찰 공무집행을 방해하고 있습니다. 이때 알맞은 행동을 서술하시오.', points: 10 },
      { type: 'essay', question: '도주가 수배로 전환되어 출석 공지를 올렸으나 도주자가 출석 공지가 올라오기전에 디컨한 사실을 확인하였다. 이때 알맞은 행동을 서술 하시오.', points: 10 },
    ]
  },
  '3': {
    title: '경사 → 경위 진급시험',
    timeLimit: 40,
    questions: [
      { type: 'ox', question: '경찰은 정차 명령을 3회 실시 후에도 도주 차량이 멈추지 않을 경우, 보고 없이 현장 판단으로 발포를 진행할 수 있다. (O / X)', points: 10 },
      { type: 'ox', question: '퇴근 중인 경찰은 내부 규칙에 따라 경찰 무전 채널 청취는 허용되며, 무전 송출만 금지된다. (O / X)', points: 10 },
      { type: 'multiple', question: '다음 중 "즉흥RP"의 성립 조건으로 맞는 것은?', options: ['경찰이 먼저 총기를 사용한 경우', '시민이 경찰에게 무기를 휘두른 뒤 도주할 경우', '강도RP가 종료된 후 전투가 다시 시작될 경우', '경찰이 정차 명령을 2회만 하고도 발포할 경우'], points: 10 },
      { type: 'multiple', question: '마공포 수배 공지 절차에서 옳지 않은 항목은?', options: ['수배자는 고유번호와 닉네임을 포함해 공지한다.', '수배 공지 없이 /추적 명령은 금지되어 있다.', '수배 공지는 디스코드 자유채팅이 아닌 팩션 공지에 작성한다.', '수배는 별도의 출석 없이 공지가 가능하다.'], points: 10 },
      { type: 'multiple', question: '다음 중 경찰청 감사관의 역할 및 권한으로 맞는 것은?', options: ['모든 징계 처리를 단독으로 확정한다.', '징계 결정권은 치안정감급 이상이 가능하다.', '징계가 가능한 범위는 치안총감을 포함한 경찰청에 속한 경관이다.', '감찰 신고는 별도의 영상이 없더라도 증인이 있다면 가능하다.'], points: 10 },
      { type: 'multiple', question: '다음 중 바디캠 영상의 법적 효력에 대한 설명으로 맞는 것은?', options: ['경찰의 바디캠은 모든 상황에서 영상 제공 의무가 있다.', '시민이 바디캠 영상을 요청할 경우, 경찰은 거부할 수 없다.', '바디캠 영상은 내부 절차 없이 즉시 삭제가 가능하다.', '바디캠 영상은 출근 시 녹화가 시작되어야 하며, RP 근거로 효력이 인정된다.'], points: 10 },
      { type: 'essay', question: '영장RP 도중 헬기 탑승자가 낙하산을 매고 낙하해서 옥상으로 착지했다. 이때 옥상에 착지한 경관은 지상에 영장 인원과 격렬하게 대치하였으며 상대측은 옥상으로 올라와 경찰을 죽였다. 이 지문에 대한 잘못된 점을 서술하시오', points: 10 },
      { type: 'essay', question: '즉흥RP 도중, 체포한 시민이 바디캠 영상이 없다는 이유로 혐의를 인정하지 않으며 억울함을 주장합니다. 이때 행동을 서술 하시오', points: 10 },
      { type: 'essay', question: '당신은 경위로서 신고콜을 받고 출동했지만, 현장에는 시민이 여럿 몰려 혼란스러운 상태입니다. 이때 신고자와 어떻게 만날것이며, 출근 중인 경관들에게 어떠한 지시를 내릴 것인지 서술하시오', points: 10 },
      { type: 'essay', question: '당신은 경위로써 순찰 중 경찰차 문단속이 제대로 되지 않아 시민이 차량을 탈취하는 사고를 목격했습니다. 이때 목격 후 행동, RP 종료 후 사후처리에 대해 서술하시오.', points: 10 },
    ]
  }
};

export default function Exam({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [timeLeft, setTimeLeft] = useState(examData[params.id]?.timeLimit * 60 || 0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [windowKeyCount, setWindowKeyCount] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submissionReason, setSubmissionReason] = useState<string>('');
  const answerSheetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!examData[params.id]) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 0) {
          clearInterval(timer);
          setSubmissionReason('시간 초과로 인한 자동 제출');
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'Meta' || e.key === 'Windows') {
        setWindowKeyCount((prev) => {
          const newCount = prev + 1;
          if (newCount >= 3) {
            setSubmissionReason('윈도우키 3회 사용으로 인한 자동 제출');
            handleSubmit();
          } else if (newCount === 1) {
            toast.error('첫 번째 경고입니다.');
          } else if (newCount === 2) {
            toast.error('두 번째 경고입니다.');
          }
          return newCount;
        });
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    document.addEventListener('contextmenu', (e) => e.preventDefault());
    document.addEventListener('copy', (e) => e.preventDefault());
    document.addEventListener('paste', (e) => e.preventDefault());

    return () => {
      clearInterval(timer);
      window.removeEventListener('keydown', handleKeyPress);
    };
    // eslint-disable-next-line
  }, [router, params.id]);

  const handleSubmit = async () => {
    setIsSubmitted(true);
    
    // 사용자 정보 가져오기
    const userInfo = JSON.parse(localStorage.getItem('examUserInfo') || '{}');
    
    // 시험 기록 저장
    const examRecord = {
      examId: params.id,
      title: examData[params.id].title,
      date: new Date().toISOString(),
      answers: answers,
      submissionReason: submissionReason,
      name: userInfo.name || '미입력',
      idNumber: userInfo.idNumber || '미입력'
    };

    try {
      // API를 통해 데이터베이스에 저장
      const response = await fetch('/api/exam-records', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(examRecord),
      });

      if (!response.ok) {
        throw new Error('시험 기록 저장 실패');
      }

      // 답안지 이미지 생성 및 다운로드
      if (answerSheetRef.current) {
        try {
          const canvas = await html2canvas(answerSheetRef.current, {
            scale: 2,
            backgroundColor: '#ffffff',
            logging: false,
          });
          
          const image = canvas.toDataURL('image/png');
          const link = document.createElement('a');
          link.href = image;
          link.download = `답안지_${examData[params.id].title}_${userInfo.name}_${userInfo.idNumber}_${new Date().toLocaleDateString()}.png`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        } catch (error) {
          console.error('답안지 생성 중 오류 발생:', error);
          toast.error('답안지 생성 중 오류가 발생했습니다.');
        }
      }

      setTimeout(() => {
        router.push('/exam');
      }, 2000);
    } catch (error) {
      console.error('시험 제출 중 오류 발생:', error);
      toast.error('시험 제출 중 오류가 발생했습니다.');
    }
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  if (!examData[params.id]) {
    return <div>존재하지 않는 시험입니다.</div>;
  }

  if (isSubmitted) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <h2 className="text-2xl font-bold mb-4">시험이 제출되었습니다.</h2>
          <p>답안지가 다운로드되었습니다.</p>
          <p className="mt-2">수고하셨습니다!</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">{examData[params.id].title}</h1>
            <div className="text-xl font-semibold text-red-600">
              남은 시간: {formatTime(timeLeft)}
            </div>
          </div>

          {submissionReason && (
            <div className="mb-4 p-4 bg-red-100 text-red-700 rounded">
              {submissionReason}
            </div>
          )}

          <div ref={answerSheetRef} className="space-y-8">
            {examData[params.id].questions.map((question, index) => (
              <div key={index} className="border-b pb-6">
                <h3 className="text-lg font-semibold mb-4">
                  {index + 1}. {question.question}
                </h3>
                {question.type === 'ox' && (
                  <div className="flex gap-4">
                    <button
                      className={`px-4 py-2 rounded ${answers[index] === 'O' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
                      onClick={() => setAnswers({ ...answers, [index]: 'O' })}
                    >
                      O
                    </button>
                    <button
                      className={`px-4 py-2 rounded ${answers[index] === 'X' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
                      onClick={() => setAnswers({ ...answers, [index]: 'X' })}
                    >
                      X
                    </button>
                  </div>
                )}
                {question.type === 'multiple' && question.options && (
                  <div className="space-y-2">
                    {question.options.map((option, optionIndex) => (
                      <label key={optionIndex} className="flex items-center space-x-2">
                        <input
                          type="radio"
                          name={`question-${index}`}
                          value={option}
                          checked={answers[index] === option}
                          onChange={(e) => setAnswers({ ...answers, [index]: e.target.value })}
                          className="form-radio"
                        />
                        <span>{option}</span>
                      </label>
                    ))}
                  </div>
                )}
                {question.type === 'essay' && (
                  <textarea
                    className="w-full h-32 p-2 border rounded"
                    value={answers[index] || ''}
                    onChange={(e) => setAnswers({ ...answers, [index]: e.target.value })}
                    placeholder="답변을 입력하세요..."
                  />
                )}
              </div>
            ))}
          </div>

          <div className="mt-8 flex justify-end">
            <button
              onClick={handleSubmit}
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
            >
              제출하기
            </button>
          </div>
        </div>
      </div>
    </main>
  );
} 