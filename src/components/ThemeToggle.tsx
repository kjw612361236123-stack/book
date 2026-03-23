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
      className="w-8 h-8 rounded-full flex items-center justify-center bg-[#EEEBE3] dark:bg-[#201E1C] text-[#A39E98] hover:text-[#3A3530] dark:hover:text-[#EFEFE9] transition-all duration-300 border border-[#E8E3D8]/50 dark:border-[#2C2826]/50"
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
