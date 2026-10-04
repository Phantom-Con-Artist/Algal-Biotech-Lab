import { FOCUS_AREAS } from '../../data/focus';
import { cn } from '../../utils/cn';
import { useT } from '../../i18n/I18nProvider';

interface Props {
  active: number;
  onSelect: (i: number) => void;
}

export function FocusNav({ active, onSelect }: Props) {
  const t = useT().focus;
  return (
    <nav aria-label={t.navLabel} className="absolute inset-x-0 top-16 z-20 px-5 sm:px-8 lg:px-12">
      <ul className="mx-auto grid max-w-7xl grid-cols-4 border-b border-line">
        {FOCUS_AREAS.map((a, i) => (
          <li key={a.id}>
            <button
              type="button"
              aria-current={i === active}
              onClick={() => onSelect(i)}
              className={cn(
                'relative flex min-h-11 w-full flex-col items-start justify-center gap-0.5 py-1 text-left transition-colors md:flex-row md:items-center md:gap-2',
                i === active ? 'text-paper' : 'text-mute hover:text-paper',
              )}
            >
              <span className="font-mono text-[11px] text-leaf">{a.number}</span>
              <span className="text-[11px] leading-tight sm:text-xs md:text-sm">
                <span className="md:hidden">{t.areas[a.id].short}</span>
                <span className="hidden md:inline">{t.areas[a.id].label}</span>
              </span>
              {i === active && <span className="absolute inset-x-0 -bottom-px h-px bg-leaf" />}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}
