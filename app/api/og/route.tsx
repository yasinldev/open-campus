import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const title = searchParams.get('title') || 'Open Campus';
  const subtitle = searchParams.get('subtitle') || 'Redefining Learning. Together.';

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'center',
          backgroundColor: '#0B0F14',
          padding: '80px',
        }}
      >
        <div
          style={{
            fontSize: 60,
            fontWeight: 'bold',
            color: '#E6F0FF',
            marginBottom: 20,
          }}
        >
          {title}
        </div>
        <div
          style={{
            fontSize: 30,
            color: '#00E0C7',
          }}
        >
          {subtitle}
        </div>
        <div
          style={{
            position: 'absolute',
            bottom: 80,
            left: 80,
            fontSize: 24,
            color: '#6B7280',
          }}
        >
          Open Campus
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
