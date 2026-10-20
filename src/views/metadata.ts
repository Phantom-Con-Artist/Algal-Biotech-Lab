import type { Metadata } from 'next';
import { fmt, getDictionary, type Locale } from '../i18n/config';
import { getMember, fullName } from '../data/members';
import { memberPath } from '../utils/lab';
import { pageMetadata } from '../utils/seo';

/** Metadata for each page, shared by the English and translated route trees. */
export const PAGE_METADATA = {
  home: (locale: Locale): Metadata => pageMetadata({ locale, path: '/', description: getDictionary(locale).meta.description }),
  research: (locale: Locale): Metadata => sectionMetadata(locale, 'research', '/research'),
  people: (locale: Locale): Metadata => sectionMetadata(locale, 'people', '/people'),
  publications: (locale: Locale): Metadata => sectionMetadata(locale, 'publications', '/publications'),
  contact: (locale: Locale): Metadata => sectionMetadata(locale, 'contact', '/contact'),
  member: (locale: Locale, slug: string): Metadata => {
    const member = getMember(slug);
    if (!member) return {};
    const t = getDictionary(locale);
    const role = t.people.roles[member.role];
    return pageMetadata({
      locale,
      path: memberPath(member),
      title: fullName(member),
      description: fmt(t.meta.member, { name: fullName(member), role, interests: member.interests.slice(0, 3).join(', ') }),
      image: { url: member.photo.src, width: member.photo.width, height: member.photo.height, alt: fullName(member) },
      type: 'profile',
    });
  },
};

function sectionMetadata(locale: Locale, key: 'research' | 'people' | 'publications' | 'contact', path: string): Metadata {
  const m = getDictionary(locale).meta[key];
  return pageMetadata({ locale, path, title: m.title, description: m.description });
}
