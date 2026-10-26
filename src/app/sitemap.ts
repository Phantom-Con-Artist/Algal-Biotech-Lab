import type { MetadataRoute } from 'next';
import { LOCALES, localePath } from '@/i18n/config';
import { MEMBERS } from '@/data/members';
import { PUBLICATIONS } from '@/data/publications';
import { absoluteUrl, languageAlternates } from '@/utils/seo';
import { memberPath } from '@/utils/lab';
import { LAB_PHOTO_SLUGS } from '@/data/gallery';

export const dynamic = 'force-static';

/** Year of the newest publication: a truthful "last changed" for the pages that list them. */
const latest = new Date(Date.UTC(PUBLICATIONS[0].year, 0, 1));

const PAGES: { path: string; priority: number; changeFrequency: 'monthly' | 'yearly' }[] = [
  { path: '/', priority: 1, changeFrequency: 'monthly' },
  { path: '/research', priority: 0.9, changeFrequency: 'monthly' },
  { path: '/people', priority: 0.9, changeFrequency: 'monthly' },
  { path: '/publications', priority: 0.8, changeFrequency: 'monthly' },
  { path: '/contact', priority: 0.6, changeFrequency: 'yearly' },
  { path: '/explore', priority: 0.7, changeFrequency: 'monthly' },
  ...MEMBERS.map((m) => ({ path: memberPath(m), priority: m.status === 'pi' ? 0.8 : 0.6, changeFrequency: 'yearly' as const })),
  ...LAB_PHOTO_SLUGS.map((slug) => ({ path: `/lab/${slug}`, priority: 0.4, changeFrequency: 'yearly' as const })),
];

/** One entry per page per language, each listing all its translations as hreflang alternates. */
export default function sitemap(): MetadataRoute.Sitemap {
  return PAGES.flatMap((page) =>
    LOCALES.map((l) => ({
      url: absoluteUrl(localePath(l.code, page.path)),
      lastModified: latest,
      changeFrequency: page.changeFrequency,
      priority: l.code === 'en' ? page.priority : Math.round(page.priority * 7) / 10,
      alternates: { languages: languageAlternates(page.path) },
    })),
  );
}
