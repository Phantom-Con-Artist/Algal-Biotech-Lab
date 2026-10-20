import { ImageResponse } from 'next/og';
import { LAB_INFO } from '@/data/labData';
import { getDictionary } from '@/i18n/config';

export const dynamic = 'force-static';

const t = getDictionary('en');

/** The 1200×630 card shown when any page is shared, rendered once at build time. */
export function GET() {
  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: 72, background: '#f6f5ef', color: '#13231c' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 22, letterSpacing: 3, textTransform: 'uppercase', color: '#5b6a62' }}>
          <span>{LAB_INFO.name}</span>
          <span>{LAB_INFO.institutionShort}</span>
        </div>
        <div style={{ display: 'flex', fontSize: 84, lineHeight: 1, letterSpacing: -3, maxWidth: 980 }}>{t.home.title}</div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '2px solid #13231c', paddingTop: 24, fontSize: 26, color: '#2f4a3c' }}>
          <span>{t.lab.department} · {LAB_INFO.institution}</span>
          <span style={{ width: 28, height: 28, borderRadius: 14, background: '#2f7a4f' }} />
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  );
}
