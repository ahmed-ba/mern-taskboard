import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './style.css';
function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const load = async () => {
    try {
      const r = await fetch('/api/tasks');
      if (!r.ok) throw new Error('Could not load tasks');
      setTasks(await r.json()); setError('');
    } catch(e) { setError(e.message); }
  };
  useEffect(() => { load(); }, []);
  const add = async e => {
    e.preventDefault(); if (!title.trim()) return;
    setBusy(true);
    try {
      const r = await fetch('/api/tasks', {method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({title, description})});
      if (!r.ok) throw new Error('Could not save task');
      setTitle('');setDescription('');await load();
    } catch(e) {setError(e.message);} finally {setBusy(false);}
  };
  const update = async (id, completed) => {
    try {
      const r = await fetch(`/api/tasks/${id}`, {method:'PATCH',headers:{'Content-Type':'application/json'},body:JSON.stringify({completed})});
      if (!r.ok) throw new Error('Could not update task'); await load();
    } catch(e) {setError(e.message);}
  };
  const remove = async id => {
    if (!confirm('Delete this task?')) return;
    try { const r = await fetch(`/api/tasks/${id}`, {method:'DELETE'}); if(!r.ok) throw Error('Could not delete task'); await load(); }
    catch(e) {setError(e.message);}
  };
  const remaining = tasks.filter(t=>!t.completed).length;
  return <div className="page"><header><div className="logo">✦ <b>TaskBoard</b> <span>MERN edition</span></div><div className="hint">Build • Ship • Learn</div></header>
  <main><div className="intro"><div><span className="eyebrow">YOUR DEVOPS MINI PROJECT</span><h1>Make progress,<br/><em>one task at a time.</em></h1><p>A complete full-stack app running on React, Express, Node.js & MongoDB.</p></div><div className="stat"><strong>{remaining}</strong><span>tasks remaining</span></div></div>
  <section className="panel"><h2>✍️ Add a new task</h2><form onSubmit={add}><input value={title} onChange={e=>setTitle(e.target.value)} placeholder="What needs to get done?" maxLength={200} required/><input value={description} onChange={e=>setDescription(e.target.value)} placeholder="Description (optional)" maxLength={1000}/><button disabled={busy}>{busy?'Adding…':'+ Add task'}</button></form></section>
  <section className="panel"><div className="tasks-heading"><h2>📋 Your tasks</h2><span>{tasks.length} total</span></div>{error && <div className="error">{error} <button onClick={load}>Retry</button></div>}{tasks.length===0 && !error && <div className="empty">No tasks yet. Add your first one above 🚀</div>}{tasks.map(t=><article key={t._id} className={'task '+(t.completed?'done':'')}><button aria-label="Toggle task" className="check" onClick={()=>update(t._id,!t.completed)}>{t.completed?'✓':''}</button><div className="task-text"><strong>{t.title}</strong>{t.description&&<p>{t.description}</p>}</div><button className="delete" aria-label="Delete task" onClick={()=>remove(t._id)}>×</button></article>)}</section>
  <footer>Made with ☕ · React + Express + MongoDB + Docker · Demo project (no login)</footer></main></div>;
}
createRoot(document.getElementById('root')).render(<App />);
