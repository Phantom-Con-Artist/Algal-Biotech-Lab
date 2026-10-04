import { useMediaQuery } from '../../hooks/useMediaQuery';
import { FocusIntro } from './FocusIntro';
import { FocusStage } from './FocusStage';
import { FocusStatic } from './FocusStatic';

export function FocusSection({ number }: { number: string }) {
  const reduced = useMediaQuery('(prefers-reduced-motion: reduce)');
  return (
    <>
      <FocusIntro number={number} />
      {reduced ? <FocusStatic /> : <FocusStage />}
    </>
  );
}
