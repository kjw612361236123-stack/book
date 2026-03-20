'use client';

import { useEffect, useState } from 'react';

export default function VisitorCounter() {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    // Fetch and increment hit counter
    // Using a free count API with a unique namespace for this site
    fetch('https://api.counterapi.dev/v1/shelf-kjw2026/visits/up')
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
