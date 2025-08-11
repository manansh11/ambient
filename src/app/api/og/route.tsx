import { ImageResponse } from '@vercel/og';
import { NextRequest } from 'next/server';

// For now, let's create a generic beautiful preview
function getDefaultIntention() {
  return {
    what: "Someone's ambient intention",
    when: new Date().toISOString(),
    where: "",
    note: "Join naturally",
    createdAt: Date.now()
  };
}

function formatTime(dateTime: string): string {
  const date = new Date(dateTime);
  const now = new Date();
  
  if (date.toDateString() === now.toDateString()) {
    return `Today at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  } else {
    return date.toLocaleString([], {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const payload = searchParams.get('payload');

    if (!payload) {
      return new Response('Missing payload parameter', { status: 400 });
    }

    const intention = getDefaultIntention();
    const location = intention.where || '';
    const timeDisplay = formatTime(intention.when);

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #dbeafe 0%, #e0e7ff 50%, #f3e8ff 100%)',
            fontFamily: 'system-ui',
          }}
        >
          {/* Card Container */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'rgba(255, 255, 255, 0.9)',
              borderRadius: '24px',
              padding: '60px',
              margin: '40px',
              boxShadow: '0 25px 50px -12px rgba(59, 130, 246, 0.2)',
              backdropFilter: 'blur(10px)',
              width: '1000px',
              height: '500px',
            }}
          >
            {/* Gradient Header */}
            <div
              style={{
                position: 'absolute',
                top: '40px',
                left: '40px',
                right: '40px',
                height: '6px',
                background: 'linear-gradient(90deg, #60a5fa 0%, #818cf8 50%, #a78bfa 100%)',
                borderRadius: '3px',
              }}
            />

            {/* Main Content */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                marginTop: '20px',
              }}
            >
              {/* Activity */}
              <h1
                style={{
                  fontSize: '48px',
                  fontWeight: 'bold',
                  color: '#1f2937',
                  margin: '0 0 20px 0',
                  lineHeight: '1.1',
                }}
              >
                {intention.what}
              </h1>

              {/* Time */}
              <div
                style={{
                  fontSize: '24px',
                  color: '#6b7280',
                  margin: '0 0 16px 0',
                }}
              >
                {timeDisplay}
              </div>

              {/* Location */}
              {location && (
                <div
                  style={{
                    fontSize: '20px',
                    color: '#6b7280',
                    margin: '0 0 20px 0',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  📍 {location}
                </div>
              )}

              {/* Note */}
              {intention.note && (
                <div
                  style={{
                    fontSize: '18px',
                    color: '#6b7280',
                    fontStyle: 'italic',
                    margin: '0 0 30px 0',
                  }}
                >
                  &quot;{intention.note}&quot;
                </div>
              )}

              {/* Ambient branding */}
              <div
                style={{
                  fontSize: '16px',
                  color: '#9ca3af',
                  fontWeight: '500',
                  marginTop: '20px',
                }}
              >
                ambient
              </div>
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (error) {
    console.error('Error generating OG image:', error);
    return new Response('Failed to generate image', { status: 500 });
  }
}