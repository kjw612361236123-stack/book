'use client';

import { useState, useEffect } from 'react';

const QUOTES = [
  "한 페이지가 하루를 바꾸기도 합니다.",
  "오늘도 한 줄을 베겼습니다.",
  "책장을 덮을 때 비로소 시작되는 이야기.",
  "읽은 만큼 깊어지는 사람이 되고 싶어.",
  "어떤 문장은 내가 찾던 말이 아니라, 나를 찾아온 말이었다.",
  "밑줄은 그 순간의 내가 남긴 지문.",
  "독서는 혼자지만, 외롭지 않은 시간.",
  "다 읽은 책이 아니라, 다 되지 못한 생각.",
  "좋은 책은 읽는 것이 아니라, 경험하는 것이다.",
  "한 권의 책이 한 사람의 인생을 바꿀 수 있다.",
  "읽지 않은 책이 있다는 건, 아직 설렘이 남았다는 것.",
  "문장 하나에 하루 종일 머물렀다.",
];

export default function RandomQuote() {
  const [quote, setQuote] = useState('');

  useEffect(() => {
    setQuote(QUOTES[Math.floor(Math.random() * QUOTES.length)]);
  }, []);

  if (!quote) return <span className="opacity-0">loading</span>;

  return <>{quote}</>;
}
