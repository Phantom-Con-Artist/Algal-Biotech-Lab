'use client';

import dynamic from 'next/dynamic';

/** The organism's code is split out of the page bundle and loaded after hydration; nothing renders on the server. */
export const OrganismLazy = dynamic(() => import('./Organism').then((m) => m.Organism), { ssr: false });
