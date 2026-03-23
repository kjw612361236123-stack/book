'use client';

import { useState, useEffect, Suspense } from 'react';
import { createPortal } from 'react-dom';
import { NotionRenderer } from 'react-notion-x';
import Link from 'next/link';
import Image from 'next/image';
import dynamic from 'next/dynamic';

// Import essential styles
import 'react-notion-x/src/styles.css';
import 'prismjs/themes/prism-tomorrow.css';
import 'katex/dist/katex.min.css';

// Dynamic imports for optional components — all with ssr: false
const Code = dynamic(
  () => import('react-notion-x/build/third-party/code').then((m) => m.Code),
  { ssr: false }
);
const Collection = dynamic(
  () => import('react-notion-x/build/third-party/collection').then((m) => m.Collection),
  { ssr: false }
);
const Equation = dynamic(
  () => import('react-notion-x/build/third-party/equation').then((m) => m.Equation),
  { ssr: false }
);
const Modal = dynamic(
  () => import('react-notion-x/build/third-party/modal').then((m) => m.Modal),
  { ssr: false }
);

export const NotionPage = ({ recordMap, comment }: { recordMap: any, comment?: string }) => {
  const [mounted, setMounted] = useState(false);
  const [portalTarget, setPortalTarget] = useState<Element | null>(null);
  const [isDark, setIsDark] = useState(false);

  // Detect dark mode from html class
  useEffect(() => {
    const html = document.documentElement;
    setIsDark(html.classList.contains('dark'));

    const observer = new MutationObserver(() => {
      setIsDark(html.classList.contains('dark'));
    });
    observer.observe(html, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
    }, 50);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (mounted && comment) {
      let retries = 0;
      
      const checkAndInsert = () => {
        const propertiesTable = document.querySelector('.notion-collection-page-properties');
        let targetNode = document.querySelector('.notion-page-content') || document.querySelector('.notion-page');

        if (propertiesTable && propertiesTable.parentNode) {
          const existingWrapper = document.querySelector('.custom-comment-wrapper');
          if (!existingWrapper) {
            const wrapper = document.createElement('div');
            wrapper.className = 'custom-comment-wrapper w-full pt-8 pb-4 border-b border-[#DED8CE]/40 dark:border-[#363330]/60';
            // properties 바로 다음에 삽입
            propertiesTable.parentNode.insertBefore(wrapper, propertiesTable.nextSibling);
            setPortalTarget(wrapper);
          } else {
            // 속성 테이블이 뒤늦게 렌더링되어 코멘트가 위로 밀려난 경우, 위치를 다시 바로잡음
            propertiesTable.parentNode.insertBefore(existingWrapper, propertiesTable.nextSibling);
            setPortalTarget(existingWrapper);
          }
        } else if (targetNode && targetNode.parentNode && retries > 10) {
          // 1초 이상 기다려도 propertiesTable이 없으면 기존 로직(content 위)으로 Fallback
          const existingWrapper = document.querySelector('.custom-comment-wrapper');
          if (!existingWrapper) {
            const wrapper = document.createElement('div');
            wrapper.className = 'custom-comment-wrapper w-full pt-8 pb-4 border-b border-[#DED8CE]/40 dark:border-[#363330]/60';
            targetNode.parentNode.insertBefore(wrapper, targetNode);
            setPortalTarget(wrapper);
          }
        } else {
          retries++;
          setTimeout(checkAndInsert, 100);
        }
      };

      const targetTimer = setTimeout(checkAndInsert, 100);
      return () => clearTimeout(targetTimer);
    }
  }, [mounted, comment]);

  if (!mounted) {
    return (
      <div className="w-full py-16 flex items-center justify-center min-h-[50vh]">
        <div className="w-6 h-6 border-2 border-[#DED8CE] border-t-[#8B7355] rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="notion-container relative" suppressHydrationWarning>
      <Suspense fallback={<div className="w-full py-8 text-center text-[#A39E98] font-serif italic text-sm">Loading content...</div>}>
        <NotionRenderer
          recordMap={recordMap}
          fullPage={true}
          darkMode={isDark}
          showTableOfContents={false}
          components={{
            nextLink: Link,
            nextImage: Image, // Use next/image for Notion images
            Code,
            Collection,
            Equation,
            Modal
          }}
        />
        {portalTarget && comment && createPortal(
          <div className="px-1">
            <h3 className="text-[#A39E98] dark:text-[#7A746D] text-[10px] sm:text-[11px] font-sans tracking-[0.2em] uppercase mb-3">재원의 코멘트</h3>
            <p className="font-sans text-[#4A453F] dark:text-[#EFEFE9] text-[13px] sm:text-[14px] leading-[1.8] whitespace-pre-wrap">
              {comment}
            </p>
          </div>,
          portalTarget
        )}
      </Suspense>
    </div>
  );
};

