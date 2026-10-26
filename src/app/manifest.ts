import type { MetadataRoute } from 'next';
import { LAB_INFO } from '@/data/labData';
import { getDictionary } from '@/i18n/config';

export const dynamic = 'force-static';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: LAB_INFO.name,
    short_name: LAB_INFO.shortName,
    description: getDictionary('en').meta.description,
    start_url: '/',
    display: 'browser',
    background_color: '#f6f5ef',
    theme_color: '#f6f5ef',
    icons: [
      { src: '/icon.png', sizes: '512x512', type: 'image/png' },
      { src: '/apple-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  };
}
