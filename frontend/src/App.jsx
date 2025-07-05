import './App.css'

function App() {
  return (
    <div className="container">
      <header>
        <h1>Fintech Project Dashboard</h1>
      </header>

      <section>
        <h2>Timeline</h2>
        <ol className="timeline">
          <li><strong>Week 1:</strong> Project kickoff and requirement gathering</li>
          <li><strong>Week 2:</strong> Architecture design and tooling setup</li>
          <li><strong>Week 3:</strong> Initial development and integrations</li>
          <li><strong>Week 4:</strong> Testing and stakeholder review</li>
          <li><strong>Week 5:</strong> Launch preparation and deployment</li>
        </ol>
      </section>

      <section>
        <h2>Personas</h2>
        <div className="personas">
          <div className="card">
            <h3>Ana – Finance Lead</h3>
            <p>Oversees compliance and financial reporting for the platform.</p>
          </div>
          <div className="card">
            <h3>Carlos – Developer</h3>
            <p>Implements API integrations and ensures code quality.</p>
          </div>
          <div className="card">
            <h3>María – Product Owner</h3>
            <p>Defines product roadmap and prioritizes the backlog.</p>
          </div>
          <div className="card">
            <h3>Sofia – Operations</h3>
            <p>Manages day‑to‑day user issues and support tickets.</p>
          </div>
        </div>
      </section>

      <section>
        <h2>Architecture</h2>
        <img src="https://via.placeholder.com/600x350?text=Architecture+Diagram" alt="Architecture diagram" />
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
              <td>Requirements</td>
              <td>María</td>
              <td>Ana</td>
              <td>Carlos</td>
              <td>Sofia</td>
            </tr>
            <tr>
              <td>Development</td>
              <td>Carlos</td>
              <td>María</td>
              <td>Ana</td>
              <td>Sofia</td>
            </tr>
            <tr>
              <td>Testing</td>
              <td>Sofia</td>
              <td>Carlos</td>
              <td>María</td>
              <td>Ana</td>
            </tr>
            <tr>
              <td>Deployment</td>
              <td>Carlos</td>
              <td>Ana</td>
              <td>María</td>
              <td>Sofia</td>
            </tr>
          </tbody>
        </table>
      </section>
    </div>
  )
}

export default App
