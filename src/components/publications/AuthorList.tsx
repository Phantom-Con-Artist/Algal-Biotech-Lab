import { isLabAuthor } from '../../utils/lab';

/** Lab members are set in medium weight and full ink; everyone else is muted. */
export function AuthorList({ authors }: { authors: string[] }) {
  return (
    <p className="text-[0.8125rem] leading-relaxed">
      {authors.map((a, i) => (
        <span key={a + i} className={isLabAuthor(a) ? 'font-medium text-ink' : 'text-mute'}>
          {a}
          {i < authors.length - 1 && <span className="font-normal text-mute">, </span>}
        </span>
      ))}
    </p>
  );
}
