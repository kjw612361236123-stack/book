'use client';

import { useTheme } from './ThemeProvider';
import { Sun, Moon, Monitor } from 'lucide-react';

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  const cycle = () => {
    if (theme === 'system') setTheme('light');
    else if (theme === 'light') setTheme('dark');
    else setTheme('system');
  };

  return (
    <button
      onClick={cycle}
      className="w-8 h-8 rounded-full flex items-center justify-center bg-[#EEEBE3] dark:bg-[#201E1C] text-[#A39E98] dark:text-[#7A746D] hover:text-[#6B6560] dark:hover:text-[#D4C3A3] transition-all duration-300 outline-none focus:outline-none focus:ring-0 border-transparent shadow-inner"
      title={theme === 'system' ? '시스템 모드' : theme === 'light' ? '라이트 모드' : '다크 모드'}
    >
      {theme === 'dark' ? (
        <Moon className="w-3.5 h-3.5" />
      ) : theme === 'light' ? (
        <Sun className="w-3.5 h-3.5" />
      ) : (
        <Monitor className="w-3.5 h-3.5" />
      )}
    </button>
  );
}
