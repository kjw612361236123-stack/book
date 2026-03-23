'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

const QUOTES = [
  "한 페이지가 하루를 바꾸기도 합니다.",
  "오늘도 한 줄을 베겼습니다.",
  "책장을 덮을 때 비로소 시작되는 이야기.",
  "읽은 만큼 깊어지는 사람이 되고 싶어.",  
  "어떤 문장은 내가 찾던 말이 아니라, 나를 찾아온 말이었다.",
  "밑줄은 그 순간의 내가 남긴 지문.",
  "독서는 혼자지만, 외롭지 않은 시간.",
  "다 읽은 책이 아니라, 다 되지 못한 생각.",
];

export default function RandomQuote() {
  const [quote, setQuote] = useState('');

  useEffect(() => {
    setQuote(QUOTES[Math.floor(Math.random() * QUOTES.length)]);
  }, []);

  if (!quote) return <span className="opacity-0">loading</span>;

  return <>{quote}</>;
}
