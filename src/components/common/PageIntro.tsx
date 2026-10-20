import { Container } from '../layout/Container';

interface Props {
  number: string;
  label: string;
  title: string;
  lede: string;
}

/** Opening block of an inner page: label in the left column, a large ragged-right heading, then the lede. */
export function PageIntro({ number, label, title, lede }: Props) {
  return (
    <Container as="header" className="grid gap-6 pb-20 pt-14 lg:grid-cols-12 lg:gap-12 md:pb-32 md:pt-24">
      <p className="label lg:col-span-3 lg:pt-4">
        <span className="text-ink">{number}</span>
        <span className="mx-2">/</span>
        {label}
      </p>
      <div className="lg:col-span-9">
        <h1 className="text-page max-w-[18ch] font-medium">{title}</h1>
        <p className="text-lede mt-8 max-w-[48ch] text-ink-2 md:mt-10">{lede}</p>
      </div>
    </Container>
  );
}
