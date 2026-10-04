import { ArrowLeft, ArrowRight } from 'lucide-react';

interface Props {
  current: number;
  count: number;
  caption: string;
  previousLabel: string;
  nextLabel: string;
  onGo: (index: number) => void;
}

const pad = (n: number) => String(n).padStart(2, '0');
const button = 'grid size-11 place-items-center text-paper transition-colors hover:text-leaf disabled:text-line';

export function CoverflowControls({ current, count, caption, previousLabel, nextLabel, onGo }: Props) {
  return (
    <div className="mt-4 flex items-center justify-between gap-4">
      <p className="font-mono text-xs text-mute" aria-live="polite">
        <span className="text-leaf">{pad(current + 1)}</span> / {pad(count)} · {caption}
      </p>
      <div className="flex shrink-0">
        <button type="button" onClick={() => onGo(current - 1)} disabled={current === 0} aria-label={previousLabel} className={button}>
          <ArrowLeft size={18} />
        </button>
        <button type="button" onClick={() => onGo(current + 1)} disabled={current === count - 1} aria-label={nextLabel} className={button}>
          <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
}
