import { useEffect, useRef, useState } from 'react';
import { Check, Globe } from 'lucide-react';
import { LOCALES } from '../../i18n/config';
import { useI18n } from '../../i18n/I18nProvider';
import { cn } from '../../utils/cn';

/** Inline grid of languages, used inside the mobile menu. */
export function LanguageList() {
  const { locale, setLocale, t } = useI18n();
  return (
    <div>
      <p className="mb-2 font-mono text-xs uppercase tracking-[0.14em] text-mute">{t.nav.language}</p>
      <ul className="grid grid-cols-3 gap-x-3">
        {LOCALES.map((l) => (
          <li key={l.code}>
            <button
              type="button"
              lang={l.htmlLang}
              aria-current={l.code === locale}
              onClick={() => setLocale(l.code)}
              className={cn('flex min-h-11 w-full items-center text-left text-sm', l.code === locale ? 'text-leaf' : 'text-soft')}
            >
              {l.name}
            </button>
          </li>
        ))}
      </ul>
      {t.machineNote && <p className="mt-2 text-xs text-mute">{t.machineNote}</p>}
    </div>
  );
}

/** Header dropdown for wider screens. */
export function LanguageSwitcher() {
  const { locale, setLocale, t } = useI18n();
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => !root.current?.contains(e.target as Node) && setOpen(false);
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('pointerdown', onDown);
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('pointerdown', onDown);
      window.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <div ref={root} className="relative">
      <button
        type="button"
        aria-haspopup="true"
        aria-expanded={open}
        aria-label={t.nav.language}
        onClick={() => setOpen((v) => !v)}
        className="flex h-11 items-center gap-2 font-mono text-xs uppercase text-mute transition-colors hover:text-paper"
      >
        <Globe size={15} aria-hidden="true" />
        {locale}
      </button>
      {open && (
        <div className="absolute right-0 top-full w-56 border border-line bg-ink p-2">
          <ul>
            {LOCALES.map((l) => (
              <li key={l.code}>
                <button
                  type="button"
                  lang={l.htmlLang}
                  aria-current={l.code === locale}
                  onClick={() => {
                    setLocale(l.code);
                    setOpen(false);
                  }}
                  className={cn(
                    'flex min-h-10 w-full items-center justify-between px-3 text-left text-sm transition-colors hover:bg-ink-2',
                    l.code === locale ? 'text-leaf' : 'text-soft',
                  )}
                >
                  {l.name}
                  {l.code === locale && <Check size={14} aria-hidden="true" />}
                </button>
              </li>
            ))}
          </ul>
          {t.machineNote && <p className="border-t border-line px-3 pb-1 pt-3 text-xs leading-snug text-mute">{t.machineNote}</p>}
        </div>
      )}
    </div>
  );
}
