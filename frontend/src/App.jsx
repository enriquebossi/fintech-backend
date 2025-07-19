import { useState, useEffect } from 'react'
import './App.css'
import './index.css'

function App() {
  const [activeTab, setActiveTab] = useState('team')
  const [flipped, setFlipped] = useState({})
  const [open, setOpen] = useState({})
  const [comm, setComm] = useState(null)

  useEffect(() => {
    if (activeTab === 'sprint') {
      const ctx = document.getElementById('burndownChart')
      if (ctx && window.Chart) {
        const sprintDays = 10
        const totalStoryPoints = 10
        const idealData = Array.from({ length: sprintDays + 1 }, (_, i) => totalStoryPoints - (totalStoryPoints / sprintDays) * i)
        const actualData = [10,10,10,8,8,5,5,2,2,0,0]
        new window.Chart(ctx.getContext('2d'), {
          type: 'line',
          data: {
            labels: Array.from({ length: sprintDays + 1 }, (_, i) => `Day ${i}`),
            datasets: [
              { label: 'Ideal Burndown', data: idealData, borderColor: '#9ca3af', borderDash:[5,5], backgroundColor:'transparent', pointRadius:0, tension:0.1 },
              { label: 'Actual Burndown', data: actualData.slice(0, idealData.length), borderColor:'#0d9488', backgroundColor:'rgba(13,148,136,0.1)', fill:true, tension:0.1 }
            ]
          },
          options: {
            responsive:true, maintainAspectRatio:false,
            scales: { y:{ beginAtZero:true, title:{ display:true, text:'Story Points Remaining' } }, x:{ title:{ display:true, text:'Sprint Day' } } },
            plugins:{ legend:{ position:'top' }, tooltip:{ mode:'index', intersect:false } }
          }
        })
      }
    }
  }, [activeTab])

  const commDetails = {
    'Daily Scrum': {purpose:'A 15-minute daily planning event for the Developer(s) to inspect progress toward the Sprint Goal and adapt the plan for the next 24 hours.', participants:'<strong>Required:</strong> Codex. <strong>Facilitator:</strong> Core-Cosmo. <strong>Observer:</strong> Daria.', frequency:'Daily at a consistent time.'},
    'Sprint Planning': {purpose:'A collaborative event to define the Sprint Goal and select the work (Product Backlog Items) to be completed in the upcoming sprint.', participants:'<strong>Required:</strong> Daria, Codex, Core-Cosmo.', frequency:'At the beginning of every sprint.'},
    'Backlog Refinement': {purpose:'An ongoing activity to clarify, estimate, and detail upcoming Product Backlog items to ensure they are "ready" for future sprints.', participants:'<strong>Required:</strong> Daria, Codex. <strong>Optional:</strong> Core-Cosmo.', frequency:'Ongoing, typically 1-2 hours per sprint.'},
    'Sprint Review': {purpose:'A "show and tell" session where the Scrum Team demonstrates the "Done" increment to stakeholders to gather feedback and adapt the Product Backlog.', participants:'<strong>Required:</strong> Daria, Codex, Core-Cosmo, and key stakeholders.', frequency:'At the end of every sprint.'},
    'Retrospective': {purpose:'A private team meeting to reflect on the past sprint and create a plan for improvements to its process, relationships, and tools.', participants:'<strong>Required:</strong> Daria, Codex, Core-Cosmo (team only).', frequency:'At the end of every sprint, after the review.'}
  }

  const toggleCard = name => setFlipped(prev => ({ ...prev, [name]: !prev[name] }))
  const toggleAccordion = name => setOpen(prev => ({ ...prev, [name]: !prev[name] }))

  return (
    <div className="container mx-auto p-4 md:p-8">
      <header className="text-center mb-8 md:mb-12">
        <h1 className="text-3xl md:text-4xl font-bold text-teal-700">A Blueprint for Agile Execution</h1>
        <p className="mt-2 text-lg text-stone-600">An interactive guide to the team, the plan, and the process.</p>
      </header>

      <nav className="mb-8 border-b border-stone-200">
        <ul className="flex flex-wrap -mb-px text-sm font-medium text-center text-stone-500">
          {['team','sprint','framework','practices'].map(tab => (
            <li key={tab} className="mr-2">
              <button className={`nav-tab inline-block p-4 border-b-2 rounded-t-lg ${activeTab===tab?'tab-active':'tab-inactive'}`} onClick={() => setActiveTab(tab)}>
                {tab==='team' && <span className="hidden sm:inline">👥</span>}
                {tab==='sprint' && <span className="hidden sm:inline">🚀</span>}
                {tab==='framework' && <span className="hidden sm:inline">🏗️</span>}
                {tab==='practices' && <span className="hidden sm:inline">💡</span>}
                {tab==='team' ? ' Team Overview' : tab==='sprint' ? ' Sprint 1 Plan' : tab==='framework' ? ' Agile Framework' : ' Best Practices'}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      <main>
        <section id="team" className={activeTab==='team'?'content-section active':'content-section'}>
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-stone-800">Meet the Team</h2>
            <p className="mt-2 text-stone-600">A self-managing, cross-functional unit designed for effectiveness. Click on a card to learn more about each role's responsibilities.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {['Daria','Codex','Core-Cosmo'].map(name => (
              <div key={name} className={flipped[name] ? 'card-flipper perspective-1000 flipped' : 'card-flipper perspective-1000'} onClick={() => toggleCard(name)}>
                <div className="card-flip relative w-full h-96">
                  <div className="card-front absolute w-full h-full p-6 bg-white rounded-xl shadow-lg border border-stone-200 flex flex-col items-center justify-center text-center">
                    <div className="text-6xl mb-4">{name==='Daria'?'👑':name==='Codex'?'🛠️':'🛡️'}</div>
                    <h3 className="text-xl font-bold text-teal-700">{name}</h3>
                    <p className="text-lg font-semibold text-stone-700">{name==='Daria'?'Product Owner':name==='Codex'?'Developer':'Scrum Master'}</p>
                    <p className="mt-2 text-sm text-stone-500">{name==='Daria'?'Core Mission: Maximize Product Value':name==='Codex'?'Core Mission: Deliver a "Done" Increment':'Core Mission: Optimize Team Process'}</p>
                    <button className="mt-4 text-teal-600 font-semibold text-sm">View Details →</button>
                  </div>
                  <div className="card-back absolute w-full h-full p-6 bg-white rounded-xl shadow-lg border border-stone-200 flex flex-col">
                    <h4 className="font-bold text-teal-700">Key Responsibilities</h4>
                    <ul className="list-disc list-inside text-sm text-stone-600 mt-2 space-y-1 flex-grow">
                      {name==='Daria' && (<>
                        <li>Defines Product Goal and Sprint Goals</li>
                        <li>Creates, maintains, and prioritizes the Product Backlog</li>
                        <li>Represents stakeholder and user needs</li>
                        <li>Accepts or rejects work results</li>
                        <li>Has final say on product decisions</li>
                      </>)}
                      {name==='Codex' && (<>
                        <li>Turns Product Backlog items into a "Done" increment</li>
                        <li>Creates and manages the Sprint Backlog</li>
                        <li>Adheres to the Definition of Done to ensure quality</li>
                        <li>Adapts the plan daily to meet the Sprint Goal</li>
                        <li>Self-organizes to determine how to implement work</li>
                      </>)}
                      {name==='Core-Cosmo' && (<>
                        <li>Coaches the team in Scrum and self-management</li>
                        <li>Removes impediments to the team's progress</li>
                        <li>Facilitates Scrum events as needed</li>
                        <li>Protects the team from external distractions</li>
                        <li>Fosters a culture of continuous improvement</li>
                      </>)}
                    </ul>
                    <button className="mt-4 text-teal-600 font-semibold text-sm">← Back</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section id="sprint" className={activeTab==='sprint'?'content-section active':'content-section'}>
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-stone-800">Sprint 1 Plan: User Authentication</h2>
            <p className="mt-2 text-stone-600">This section breaks down the actionable plan for the first sprint. The goal is to build the core of the user authentication system, which is a critical foundation for future work.</p>
          </div>
          <div className="bg-teal-50 border-l-4 border-teal-500 text-teal-800 p-4 rounded-r-lg mb-8">
            <p className="font-bold">SMART Sprint Goal</p>
            <p>Establish the foundational user authentication service by enabling new user registration and login, providing a secure entry point for all future features.</p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <h3 className="font-bold text-xl mb-4">Sprint Backlog</h3>
              <div className="space-y-4">
                {[1,2,3].map(num => (
                  <div key={num} className="bg-white p-4 rounded-lg border border-stone-200 shadow-sm">
                    <h4 className="font-semibold">{num===1?'Story 1: Create Account (5 Story Points)':num===2?'Story 2: User Login (3 Story Points)':'Story 3: User Logout (2 Story Points)'}</h4>
                    <p className="text-sm text-stone-600 mt-1">{num===1?'As a new visitor, I want to create an account using my email and a password, so that I can access the platform\'s features.':num===2?'As a registered user, I want to log in with my credentials, so that I can securely access my account.':'As a logged-in user, I want a "logout" button, so that I can end my session securely.'}</p>
                    <div className={open['story'+num]?'mt-4 pt-4 border-t border-stone-200':'hidden mt-4 pt-4 border-t border-stone-200'}>
                      <h5 className="font-semibold text-sm">Acceptance Criteria</h5>
                      <ul className="list-disc list-inside text-sm text-stone-600 mt-1 space-y-1">
                        {num===1 && (<><li>Successful registration redirects to login page.</li><li>Registering with an existing email shows an error.</li></>)}
                        {num===2 && (<><li>Successful login redirects to dashboard.</li><li>Incorrect credentials show an error.</li></>)}
                        {num===3 && (<li>Clicking 'Logout' terminates the session and redirects to login page.</li>)}
                      </ul>
                      <h5 className="font-semibold text-sm mt-3">Decomposed Tasks</h5>
                      <ul className="list-disc list-inside text-sm text-stone-600 mt-1 space-y-1">
                        {num===1 && (<><li>Create `users` table schema</li><li>Build registration UI</li><li>Implement `/register` API endpoint & validation</li><li>Implement password hashing</li><li>Write unit tests</li></>)}
                        {num===2 && (<><li>Build login UI</li><li>Implement `/login` API endpoint</li><li>Implement password comparison</li><li>Create and return session token</li><li>Write unit tests</li></>)}
                        {num===3 && (<><li>Add 'Logout' button to header</li><li>Implement `/logout` API endpoint</li><li>Implement client-side session clearing</li></>)}
                      </ul>
                    </div>
                    <button className="accordion-toggle text-teal-600 text-sm font-semibold mt-2" onClick={() => toggleAccordion('story'+num)}>{open['story'+num]?'Hide Details ▲':'Show Details ▼'}</button>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h3 className="font-bold text-xl mb-4">Sprint Burndown</h3>
              <div className="bg-white p-4 rounded-lg border border-stone-200 shadow-sm">
                <div className="chart-container">
                  <canvas id="burndownChart"></canvas>
                </div>
                <p className="text-xs text-center text-stone-500 mt-2">Tracks progress towards completing the 10 total story points.</p>
              </div>
            </div>
          </div>
        </section>

        <section id="framework" className={activeTab==='framework'?'content-section active':'content-section'}>
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-stone-800">The Agile Framework</h2>
            <p className="mt-2 text-stone-600">Explore the core concepts that ensure quality and guide communication. These are the rules and rhythms that make the Agile process work.</p>
          </div>
          <div className="mb-12">
            <h3 className="text-xl font-bold text-center mb-4">Quality: Acceptance Criteria vs. Definition of Done</h3>
            <p className="text-center max-w-2xl mx-auto text-stone-600 mb-6">Understanding the difference is key to quality. Acceptance Criteria ensure we build the <span className="font-semibold text-teal-700">right thing</span> for a specific feature. The Definition of Done ensures we build the <span className="font-semibold text-teal-700">thing right</span>, every time.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              <div className="bg-white p-6 rounded-lg border-2 border-teal-100 shadow-sm">
                <h4 className="font-bold text-lg text-teal-700">Acceptance Criteria (AC)</h4>
                <p className="text-sm text-stone-500 mb-3">Unique per story</p>
                <ul className="list-disc list-inside text-stone-700 space-y-2 text-sm">
                  <li><strong>Scope:</strong> A single User Story</li>
                  <li><strong>Purpose:</strong> Confirms a story's specific functional requirements</li>
                  <li><strong>Author:</strong> Product Owner (Daria), with Developer (Codex)</li>
                  <li><strong>Example:</strong> "Given I enter an incorrect password, Then an 'Invalid credentials' error is displayed."</li>
                </ul>
              </div>
              <div className="bg-white p-6 rounded-lg border-2 border-stone-300 shadow-sm">
                <h4 className="font-bold text-lg text-stone-700">Definition of Done (DoD)</h4>
                <p className="text-sm text-stone-500 mb-3">Universal for all stories</p>
                <ul className="list-disc list-inside text-stone-700 space-y-2 text-sm">
                  <li><strong>Scope:</strong> All items in the Increment</li>
                  <li><strong>Purpose:</strong> Ensures consistent quality for all work</li>
                  <li><strong>Author:</strong> The entire Scrum Team</li>
                  <li><strong>Example:</strong> "Code is peer-reviewed and unit test coverage exceeds 80%."</li>
                </ul>
              </div>
            </div>
          </div>
          <div>
            <h3 className="text-xl font-bold text-center mb-6">Communication Protocol: The Rhythm of Scrum</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 text-center">
              {Object.keys(commDetails).map(name => (
                <div key={name} className={`comm-item bg-white p-4 rounded-lg shadow-sm border cursor-pointer hover:shadow-md ${comm===name ? 'border-teal-400 bg-teal-50' : 'border-stone-200'}`} onClick={() => setComm(name)}>
                  <h4 className="font-semibold text-sm">{name}</h4>
                  <p className="text-xs text-stone-500">{name==='Daily Scrum'?'15-min Plan':name==='Sprint Planning'?'Define Goal':name==='Backlog Refinement'?'Clarify Work':name==='Sprint Review'?'Show & Tell':'Improve Process'}</p>
                </div>
              ))}
            </div>
            <div id="comm-details" className="mt-6 bg-teal-50/50 p-6 rounded-lg border border-teal-100 min-h-[180px]" dangerouslySetInnerHTML={{__html: comm? `<div class='text-left'><h4 class='font-bold text-teal-700'>${comm}</h4><p class='text-sm text-stone-700 mt-2'><strong class='font-semibold'>Purpose:</strong> ${commDetails[comm].purpose}</p><p class='text-sm text-stone-700 mt-2'><strong class='font-semibold'>Participants:</strong> ${commDetails[comm].participants}</p><p class='text-sm text-stone-700 mt-2'><strong class='font-semibold'>Frequency:</strong> ${commDetails[comm].frequency}</p></div>` : '<p class="text-stone-600">Click on a communication event above to see its details.</p>' }} />
          </div>
        </section>

        <section id="practices" className={activeTab==='practices'?'content-section active':'content-section'}>
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-stone-800">Sustained Velocity & Continuous Improvement</h2>
            <p className="mt-2 text-stone-600 max-w-3xl mx-auto">Launching is just the beginning. These recommendations and warnings about common pitfalls are crucial for building and maintaining momentum over the long term.</p>
          </div>
          <div className="max-w-3xl mx-auto space-y-4">
            {[1,2,3].map(num => (
              <div key={num} className="bg-white rounded-lg border border-stone-200 shadow-sm">
                <button className="accordion-toggle w-full text-left p-4 font-semibold" onClick={() => toggleAccordion('practice'+num)}>{num===1?'The First Retrospective':num===2?'Continuous Backlog Refinement':'Avoiding Anti-Patterns'} {open['practice'+num]?'▲':'▼'}</button>
                <div className={open['practice'+num]? 'p-4 pt-0 text-stone-600 text-sm' : 'hidden p-4 pt-0 text-stone-600 text-sm'}>
                  {num===1 && <p>The first retrospective is the most important. It sets the precedent for honest feedback and continuous improvement. Keep it simple ("what went well, what didn't, what to try next") and ensure the output is one or two actionable improvement items for the next sprint.</p>}
                  {num===2 && <p>Don't wait for Sprint Planning to understand the backlog. Daria and Codex should dedicate a recurring time slot each sprint to review, discuss, and estimate upcoming work. This ensures a steady stream of "ready" work and makes planning meetings faster and more effective.</p>}
                  {num===3 && (
                    <ul className="list-disc list-inside space-y-2">
                      <li><strong>Daily Scrum is not a status report:</strong> It's a planning meeting for Codex, protected by Core-Cosmo.</li>
                      <li><strong>Don't over-commit:</strong> It's better to deliver a smaller forecast than to fail on a large one. Early success builds confidence.</li>
                      <li><strong>Never ignore the Definition of Done:</strong> A story is either 100% Done or not done. There is no partial credit. This prevents technical debt.</li>
                      <li><strong>Metrics are not weapons:</strong> Velocity is a forecasting tool for the team, not a performance metric for management.</li>
                    </ul>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}

export default App
