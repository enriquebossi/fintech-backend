import React from 'react';
import './App.css';

export default function App() {
  return (
    <div className="container">
      <h1>Fintech Project Dashboard</h1>
      <section>
        <h2>Timeline</h2>
        <ul className="timeline">
          <li><strong>Phase 1:</strong> Requirements & Planning</li>
          <li><strong>Phase 2:</strong> Prototype Development</li>
          <li><strong>Phase 3:</strong> Testing & Feedback</li>
          <li><strong>Phase 4:</strong> Deployment</li>
        </ul>
      </section>

      <section>
        <h2>Personas</h2>
        <div className="personas">
          <div className="card">
            <h3>Alice – Product Owner</h3>
            <p>Defines the product vision and priorities.</p>
          </div>
          <div className="card">
            <h3>Bob – Developer</h3>
            <p>Implements features and fixes bugs.</p>
          </div>
          <div className="card">
            <h3>Carol – QA Specialist</h3>
            <p>Ensures quality through testing.</p>
          </div>
        </div>
      </section>

      <section>
        <h2>Architecture Diagram</h2>
        <p>The architecture is illustrated below.</p>
        <img className="diagram" src="architecture.png" alt="Architecture Diagram placeholder" />
      </section>

      <section>
        <h2>RACI Matrix</h2>
        <table className="raci">
          <thead>
            <tr>
              <th>Task</th>
              <th>Responsible</th>
              <th>Accountable</th>
              <th>Consulted</th>
              <th>Informed</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Requirement Gathering</td>
              <td>Alice</td>
              <td>Product Committee</td>
              <td>Stakeholders</td>
              <td>Team</td>
            </tr>
            <tr>
              <td>Development</td>
              <td>Bob</td>
              <td>Alice</td>
              <td>Carol</td>
              <td>Team</td>
            </tr>
            <tr>
              <td>Quality Assurance</td>
              <td>Carol</td>
              <td>Alice</td>
              <td>Bob</td>
              <td>Team</td>
            </tr>
          </tbody>
        </table>
      </section>
    </div>
  );
}
