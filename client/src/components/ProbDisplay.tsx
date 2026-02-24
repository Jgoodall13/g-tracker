interface Props {
  poolSize: number;
  gCalled: boolean;
}

export default function ProbDisplay({ poolSize, gCalled }: Props) {
  const avg = gCalled || poolSize <= 0 ? 0 : (1 / poolSize + 2 / poolSize + 3 / poolSize) / 3;
  const avgPct = Math.round(avg * 100);
  const cls = gCalled ? 'fire' : avgPct >= 30 ? 'fire' : avgPct >= 15 ? 'hot' : '';

  return (
    <div className="prob-box">
      <div className={`prob-main ${cls}`}>{gCalled ? 'HIT' : `${avgPct}%`}</div>
      <div className="prob-meta">
        <div className="prob-label">Avg Probability G Called Today</div>
        <div className="pool-info">Pool size: <span>{poolSize}</span> letters remaining</div>
        <div className="math-note">
          {gCalled ? 'G was called this cycle. Reset when ready.' : `Formula: avg(1,2,3) / ${poolSize} remaining = ${avgPct}%`}
        </div>
      </div>
    </div>
  );
}