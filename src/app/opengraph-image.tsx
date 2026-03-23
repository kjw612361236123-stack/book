import { ImageResponse } from 'next/og';
import { getDatabase } from '@/lib/notion';

export const runtime = 'edge';

// Image metadata
export const alt = 'Shelf. — 김재원의 서재';
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = 'image/png';

export default async function Image() {
  const databaseId = process.env.NOTION_DATABASE_ID;
  const books = await getDatabase(databaseId);
  const count = books.length;

  return new ImageResponse(
    (
      <div
        style={{
          background: '#1A1817', // Dark background for emotional feel
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: '"Nanum Myeongjo", serif',
          position: 'relative',
        }}
      >
        {/* Subtle vignette/gradient */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(circle at center, transparent 0%, rgba(0,0,0,0.6) 100%)',
          }}
        />

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '30px',
            zIndex: 10,
          }}
        >
          <span
            style={{
              fontSize: '28px',
              color: '#A39E98',
              letterSpacing: '0.4em',
              textTransform: 'uppercase',
            }}
          >
            김재원의 서재
          </span>
          <h1
            style={{
              fontSize: '110px',
              color: '#FDFBF7',
              margin: '0',
              fontWeight: 400,
              letterSpacing: '-0.02em',
              display: 'flex',
              alignItems: 'baseline',
            }}
          >
            Read:
            <span style={{ color: '#D4C3A3', fontStyle: 'italic', marginLeft: '5px' }}>log</span>
          </h1>
          <p
            style={{
              fontSize: '42px',
              color: '#DED8CE',
              margin: '30px 0 0',
              fontWeight: 400,
            }}
          >
            총 {count}권의 기록
          </p>
          <p
            style={{
              fontSize: '24px',
              color: '#7A746D',
              margin: '20px 0 0',
              fontStyle: 'italic',
            }}
          >
            "읽은 책들의 온기가 남아있는 곳"
          </p>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
