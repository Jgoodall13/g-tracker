import { useState, useEffect, useCallback } from 'react';
import type { Cycle, Session } from './types';
import { getActiveCycle, addSession, deleteSession, resetCycle } from './api';
import ProbDisplay from './components/ProbDisplay';
import AlphaGrid from './components/AlphaGrid';
import SessionLog from './components/SessionLog';
import './App.css';

const TARGET = 'G';

export default function App() {
  const [cycle, setCycle] = useState<Cycle | null>(null);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(true);

  const calledLetters = sessions.flatMap(s => s.letters);
  const calledSet = new Set(calledLetters);
  const poolSize = 26 - calledSet.size;
  const gCalled = calledSet.has(TARGET);

  const fetchData = useCallback(async () => {
    try {
      const res = await getActiveCycle();
      setCycle(res.data.cycle);
      setSessions(res.data.sessions);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleAddDay = async () => {
    const letters = input.trim().toUpperCase().split(/[\s,]+/).filter(l => /^[A-Z]$/.test(l));
    if (!letters.length || letters.length > 3) return;
    const today = new Date().toISOString().split('T')[0];
    try {
      await addSession(letters, today);
      setInput('');
      await fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleUndo = async () => {
    if (!sessions.length) return;
    const last = sessions[sessions.length - 1];
    try {
      await deleteSession(last.id);
      await fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleReset = async () => {
    if (!confirm('Reset the cycle?')) return;
    try {
      await resetCycle();
      await fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="loading">LOADING...</div>;

  return (
    <div className="app">
      <header>
        <h1>G TRACKER</h1>
        <div className="subtitle-block">
          <div className="subtitle">Letter Draw Probability Engine</div>
          <div className="subtitle dim">Target: G &nbsp;|&nbsp; Mon–Fri 7AM</div>
        </div>
      </header>

      {gCalled && <div className="g-banner">🎯 G WAS CALLED — RESET THE CYCLE</div>}

      <ProbDisplay poolSize={poolSize} gCalled={gCalled} />

      <div className="section-label">Scenarios — if they call N letters today</div>
      <div className="scenarios">
        {[0, 1, 2, 3].map(k => {
          const p = gCalled || poolSize <= 0 ? 0 : Math.min(k / poolSize, 1);
          return (
            <div key={k} className={`scenario${k === 0 ? ' zero' : ''}`}>
              <div className="s-label">{k} Letter{k !== 1 ? 's' : ''}</div>
              <div className="s-val">{Math.round(p * 100)}%</div>
            </div>
          );
        })}
      </div>

      <div className="section-label">Click letters to toggle</div>
      <AlphaGrid calledSet={calledSet} target={TARGET} />

      <div className="controls">
        <input
          className="day-input"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleAddDay()}
          placeholder="Today's letters e.g. D N O"
        />
        <button className="btn-add" onClick={handleAddDay}>+ Add Day</button>
        <button className="btn-undo" onClick={handleUndo}>Undo</button>
        <button className="btn-reset" onClick={handleReset}>Reset Cycle</button>
      </div>

      <div className="status-bar">
        <div>Cycle days: <span>{sessions.length}</span></div>
        <div>G hits: <span>{sessions.filter(s => s.gHit).length}</span></div>
      </div>

      <div className="section-label">Session Log</div>
      <SessionLog sessions={sessions} target={TARGET} />
    </div>
  );
}