const LAB_NAME = /Bajhaiya|Sreenikethanam|Subhisha Raj/;

/** Lab members are set in the paper colour; everyone else is muted. */
export function AuthorList({ authors }: { authors: string[] }) {
  return (
    <p className="text-sm leading-relaxed">
      {authors.map((a, i) => (
        <span key={a + i} className={LAB_NAME.test(a) ? 'text-paper' : 'text-mute'}>
          {a}
          {i < authors.length - 1 && <span className="text-mute">, </span>}
        </span>
      ))}
    </p>
  );
}
