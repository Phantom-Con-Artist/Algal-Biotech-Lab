import { useEffect } from 'react';

const BASE = 'Algal Biotech Lab · Central University of Tamil Nadu';

export function useDocumentTitle(title?: string): void {
  useEffect(() => {
    document.title = title ? `${title} · Algal Biotech Lab` : BASE;
  }, [title]);
}
