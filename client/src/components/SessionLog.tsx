import type { Session } from '../types';

interface Props {
  sessions: Session[];
  target: string;
}

export default function SessionLog({ sessions, target }: Props) {
  if (!sessions.length) return <div className="empty-log">No sessions logged yet.</div>;

  return (
    <div className="log-panel">
      {[...sessions].reverse().map(s => (
        <div key={s.id} className="log-entry">
          <div className="log-date">Day {s.dayNumber} · {new Date(s.sessionDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</div>
          <div className="log-letters">
            {s.letters.map((l, i) => (
              <span key={i} className={l === target ? 'g-hit' : ''}>{l} </span>
            ))}
          </div>
          {s.gHit && <div className="hit-badge">HIT</div>}
        </div>
      ))}
    </div>
  );
}