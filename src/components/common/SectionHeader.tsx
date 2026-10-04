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
      <h2 className="mt-4 font-serif text-[clamp(2rem,4.5vw,3.25rem)] leading-[1.02] tracking-[-0.015em]">{title}</h2>
    </header>
  );
}
