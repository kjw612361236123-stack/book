'use client';

import { Component, ReactNode } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

export default class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('ErrorBoundary caught:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="w-full py-24 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 rounded-full bg-[#EEEBE3] dark:bg-[#201E1C] flex items-center justify-center mb-4">
            <svg className="w-6 h-6 text-[#A39E98]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.5c-.77-.833-2.694-.833-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <p className="font-serif text-[#A39E98] italic text-sm mb-1">문제가 발생했어요</p>
          <p className="font-sans text-[#C4BCB3] text-[10px]">페이지를 새로고침해 주세요</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 text-[11px] font-sans text-[#8B7355] dark:text-[#D4C3A3] border border-[#E8E3D8] dark:border-[#2C2826] rounded-full hover:bg-[#EEEBE3] dark:hover:bg-[#201E1C] transition-colors"
          >
            새로고침
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
