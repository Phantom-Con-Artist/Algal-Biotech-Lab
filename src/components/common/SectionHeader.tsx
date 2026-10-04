import { Eyebrow } from './Eyebrow';

interface Props {
  number: string;
  label: string;
  title: string;
}

export function SectionHeader({ number, label, title }: Props) {
  return (
    <header className="mb-10 border-t border-line pt-6 md:mb-14">
      <Eyebrow number={number}>{label}</Eyebrow>
      <h2 className="mt-4 font-serif text-[clamp(1.8rem,4vw,2.9rem)] leading-[1.02] tracking-[-0.015em]">{title}</h2>
    </header>
  );
}
