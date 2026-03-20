'use client';

import { useEffect, useState } from 'react';

export default function VisitorCounter() {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    // KST 기준으로 오늘 날짜(YYYY-MM-DD) 값을 가져옵니다.
    const kstDateString = new Date().toLocaleString('en-US', { timeZone: 'Asia/Seoul' });
    const today = new Date(kstDateString);
    const dateKey = `${today.getFullYear()}-${(today.getMonth() + 1).toString().padStart(2, '0')}-${today.getDate().toString().padStart(2, '0')}`;
    
    // 네임스페이스에 날짜를 붙여 매일 자정에 새로운 카운터가 시작되도록 합니다.
    fetch(`https://api.counterapi.dev/v1/shelf-kjw2026-${dateKey}/visits/up`)
      .then(res => res.json())
      .then(data => setCount(data.count))
      .catch(() => {
        // Silent block for adblockers or network errors
      });
  }, []);

  if (count === null) {
    return (
      <span className="w-6 h-2.5 mx-1 inline-block animate-pulse bg-[#DED8CE]/50 dark:bg-[#363330]/50 rounded-sm"></span>
    );
  }

  return <span>{count.toLocaleString()}</span>;
}
