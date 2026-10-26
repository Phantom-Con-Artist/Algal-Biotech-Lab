import { Container } from '../layout/Container';

interface Props {
  number: string;
  label: string;
  title: string;
  lede: string;
}

/** Opening of an inner page: the page's readout line, a wide light title, then the lede. */
export function PageIntro({ number, label, title, lede }: Props) {
  return (
    <Container as="header" className="pb-16 pt-14 md:pb-28 md:pt-24">
      <div className="hud flex items-center gap-4 text-mute">
        <span className="text-ink">{number}</span>
        <span>{label}</span>
        <span aria-hidden="true" className="h-px flex-1 bg-line-strong" />
      </div>
      <h1 className="text-page mt-8 max-w-[20ch] md:mt-12">{title}</h1>
      <p className="text-lede mt-8 max-w-[52ch] text-ink-2 md:mt-10">{lede}</p>
    </Container>
  );
}
