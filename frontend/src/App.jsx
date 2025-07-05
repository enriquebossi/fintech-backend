import React from 'react';
import './App.css';

function Timeline() {
  const events = [
    { month: 'Jan', text: 'Project kickoff' },
    { month: 'Feb', text: 'Requirements gathering' },
    { month: 'Mar', text: 'Prototype development' },
    { month: 'Apr', text: 'User testing' },
    { month: 'May', text: 'Launch' }
  ];
  return (
    <ul className="timeline">
      {events.map(e => (
        <li key={e.month}><strong>{e.month}:</strong> {e.text}</li>
      ))}
    </ul>
  );
}

function Personas() {
  const people = [
    { name: 'Analyst Alice', desc: 'Focuses on data-driven insights.' },
    { name: 'Developer Dan', desc: 'Implements product features.' },
    { name: 'Manager Maria', desc: 'Oversees deliverables and timelines.' }
  ];
  return (
    <div className="personas">
      {people.map(p => (
        <div className="persona" key={p.name}>
          <img src="https://via.placeholder.com/200x150" alt={p.name} />
          <h3>{p.name}</h3>
          <p>{p.desc}</p>
        </div>
      ))}
    </div>
  );
}

export default function App() {
  return (
    <div className="app">
      <header><h1>Project Dashboard</h1></header>
      <section>
        <h2>Timeline</h2>
        <Timeline />
      </section>
      <section>
        <h2>Personas</h2>
        <Personas />
      </section>
      <section className="diagram">
        <h2>Architecture Diagram</h2>
        <img src="https://via.placeholder.com/600x300" alt="Architecture" />
      </section>
      <section>
        <h2>RACI Matrix</h2>
        <table className="raci">
          <thead>
            <tr><th>Task</th><th>Analyst</th><th>Developer</th><th>Manager</th></tr>
          </thead>
          <tbody>
            <tr><td>Requirements</td><td>R</td><td>C</td><td>A</td></tr>
            <tr><td>Implementation</td><td>C</td><td>R</td><td>A</td></tr>
            <tr><td>Testing</td><td>C</td><td>R</td><td>A</td></tr>
          </tbody>
        </table>
      </section>
    </div>
  );
}
