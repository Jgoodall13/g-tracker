const ALL_LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

interface Props {
  calledSet: Set<string>;
  target: string;
}

export default function AlphaGrid({ calledSet, target }: Props) {
  return (
    <div className="alpha-grid">
      {ALL_LETTERS.map(l => {
        const isTarget = l === target;
        const isCalled = calledSet.has(l);
        let cls = 'letter-cell';
        if (isTarget) cls += ' target';
        if (isCalled) cls += ' called';
        return <div key={l} className={cls}>{l}</div>;
      })}
    </div>
  );
}