import { getDictionary, localeInfo, localePath, type Locale } from '../i18n/config';
import { LAB_INFO, SITE_URL } from '../data/labData';
import { fullName, PI } from '../data/members';
import type { LabMember, Publication } from '../types';
import { absoluteUrl } from './seo';
import { memberPath } from './lab';

/** Schema.org JSON-LD builders. Ids are stable across languages so search engines merge them. */
const ORG_ID = `${SITE_URL}/#lab`;
const SITE_ID = `${SITE_URL}/#website`;
const personId = (m: LabMember) => `${absoluteUrl(memberPath(m))}#person`;

const UNIVERSITY = {
  '@type': 'CollegeOrUniversity',
  name: LAB_INFO.institution,
  url: LAB_INFO.website,
};

const ADDRESS = {
  '@type': 'PostalAddress',
  streetAddress: LAB_INFO.postal.street,
  addressLocality: LAB_INFO.postal.locality,
  addressRegion: LAB_INFO.postal.region,
  postalCode: LAB_INFO.postal.postalCode,
  addressCountry: LAB_INFO.postal.country,
};

export function siteGraph(locale: Locale) {
  const t = getDictionary(locale);
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'ResearchOrganization',
        '@id': ORG_ID,
        name: LAB_INFO.name,
        alternateName: LAB_INFO.shortName,
        url: absoluteUrl('/'),
        logo: absoluteUrl('/icon.png'),
        description: getDictionary('en').meta.description,
        foundingDate: String(LAB_INFO.founded),
        email: LAB_INFO.email,
        telephone: LAB_INFO.phone,
        address: ADDRESS,
        parentOrganization: { ...UNIVERSITY, department: { '@type': 'Organization', name: getDictionary('en').lab.department } },
        founder: { '@id': personId(PI) },
        knowsAbout: ['Microalgae', 'Algal biotechnology', 'Chlamydomonas reinhardtii', 'Biofuels', 'Carbon capture', 'Biofertilisers', 'Phycoremediation', 'Nutraceuticals'],
      },
      {
        '@type': 'WebSite',
        '@id': SITE_ID,
        url: absoluteUrl('/'),
        name: t.meta.siteTitle,
        inLanguage: localeInfo(locale).htmlLang,
        publisher: { '@id': ORG_ID },
      },
    ],
  };
}

export function breadcrumbs(locale: Locale, trail: { name: string; path: string }[]) {
  const t = getDictionary(locale);
  const items = [{ name: t.nav.home, path: '/' }, ...trail];
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: absoluteUrl(localePath(locale, item.path)),
    })),
  };
}

export function personLd(member: LabMember, roleLabel: string, locale: Locale) {
  const sameAs = Object.values(member.links).filter(Boolean);
  return {
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    url: absoluteUrl(localePath(locale, memberPath(member))),
    inLanguage: localeInfo(locale).htmlLang,
    mainEntity: {
      '@type': 'Person',
      '@id': personId(member),
      name: fullName(member),
      jobTitle: roleLabel,
      image: absoluteUrl(member.photo.src),
      description: member.bio,
      knowsAbout: member.interests,
      ...(member.email ? { email: member.email } : {}),
      ...(sameAs.length ? { sameAs } : {}),
      ...(member.status === 'alumni'
        ? { alumniOf: { '@id': ORG_ID } }
        : { affiliation: { '@id': ORG_ID }, worksFor: UNIVERSITY }),
    },
  };
}

export function publicationsLd(pubs: Publication[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: pubs.map((p, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      item: {
        '@type': p.type === 'chapter' ? 'Chapter' : 'ScholarlyArticle',
        headline: p.title,
        name: p.title,
        author: p.authors.map((name) => ({ '@type': 'Person', name })),
        datePublished: String(p.year),
        isPartOf: { '@type': p.type === 'chapter' ? 'Book' : 'Periodical', name: p.venue },
        sameAs: `https://doi.org/${p.doi}`,
        identifier: { '@type': 'PropertyValue', propertyID: 'DOI', value: p.doi },
      },
    })),
  };
}
