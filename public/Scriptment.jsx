const { useState, useEffect, useContext } = React;

function Scriptment(){
  const [data, setData] = useState(null);
  const [activeTab, setActiveTab] = useState('team');
  const [flipped, setFlipped] = useState({});
  const [open, setOpen] = useState({});
  const [comm, setComm] = useState(null);
  const addons = useContext(window.Blackboard.AddonContext || React.createContext([]));

  useEffect(() => {
    fetch('scenes.json').then(r=>r.json()).then(setData);
  }, []);

  useEffect(() => {
    async function load(){
      try{
        const manifest = await fetch('addons/manifest.json').then(r=>r.json());
        for(const file of manifest.modules){
          await import(`./addons/${file}`);
        }
      }catch(err){
        console.error('addon load', err);
      }
    }
    load();
  }, []);

  useEffect(() => {
    if(activeTab==='sprint'){
      const ctx = document.getElementById('burndownChart');
      if(ctx){
        const sprintDays=10; const totalStoryPoints=10;
        const idealData=Array.from({length:sprintDays+1},(_,i)=>totalStoryPoints-(totalStoryPoints/sprintDays)*i);
        const actualData=[10,10,10,8,8,5,5,2,2,0,0];
        new Chart(ctx.getContext('2d'),{
          type:'line',
          data:{
            labels:Array.from({length:sprintDays+1},(_,i)=>`Day ${i}`),
            datasets:[
              {label:'Ideal',data:idealData,borderColor:'#9ca3af',borderDash:[5,5],backgroundColor:'transparent',pointRadius:0,tension:0.1},
              {label:'Actual',data:actualData.slice(0,idealData.length),borderColor:'#0d9488',backgroundColor:'rgba(13,148,136,0.1)',fill:true,tension:0.1}
            ]
          },
          options:{responsive:true,maintainAspectRatio:false,scales:{y:{beginAtZero:true,title:{display:true,text:'Story Points'}},x:{title:{display:true,text:'Sprint Day'}}}}
        });
      }
    }
  }, [activeTab]);

  const toggleCard=name=>setFlipped(p=>({...p,[name]:!p[name]}));
  const toggleAcc=name=>setOpen(p=>({...p,[name]:!p[name]}));

  if(!data) return React.createElement('div', {className:'p-4'}, 'Loading...');

  return (
    <div className="container mx-auto p-4 md:p-8">
      <header className="text-center mb-8 md:mb-12">
        <h1 className="text-3xl md:text-4xl font-bold text-teal-700">Scriptment</h1>
        <p className="mt-2 text-lg text-stone-600">Interactive blueprint powered by JSON scenes and add-ons.</p>
      </header>
      <nav className="mb-8 border-b border-stone-200">
        <ul className="flex flex-wrap -mb-px text-sm font-medium text-center text-stone-500">
          {['team','sprint','framework','practices'].map(tab=>(
            <li key={tab} className="mr-2">
              <button className={`nav-tab inline-block p-4 border-b-2 rounded-t-lg ${activeTab===tab?'border-teal-600 text-teal-600 font-semibold':'border-transparent text-stone-500'}`} onClick={()=>setActiveTab(tab)}>{tab}</button>
            </li>
          ))}
        </ul>
      </nav>
      <main>
        <section id="team" className={activeTab==='team'?'':'hidden'}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {data.team.map(member=>(
              <div key={member.name} className={flipped[member.name] ? 'card-flipper perspective-1000 flipped' : 'card-flipper perspective-1000'} onClick={()=>toggleCard(member.name)}>
                <div className="card-flip relative w-full h-80">
                  <div className="card-front absolute w-full h-full p-6 bg-white rounded-xl shadow-lg border border-stone-200 flex flex-col items-center justify-center text-center">
                    <div className="text-6xl mb-4">{member.emoji}</div>
                    <h3 className="text-xl font-bold text-teal-700">{member.name}</h3>
                    <p className="text-lg font-semibold text-stone-700">{member.role}</p>
                    <p className="mt-2 text-sm text-stone-500">{member.mission}</p>
                    <button className="mt-4 text-teal-600 font-semibold text-sm">View Details →</button>
                  </div>
                  <div className="card-back absolute w-full h-full p-6 bg-white rounded-xl shadow-lg border border-stone-200 flex flex-col">
                    <h4 className="font-bold text-teal-700">Key Responsibilities</h4>
                    <ul className="list-disc list-inside text-sm text-stone-600 mt-2 space-y-1 flex-grow">
                      {member.responsibilities.map((r,i)=>(<li key={i}>{r}</li>))}
                    </ul>
                    <button className="mt-4 text-teal-600 font-semibold text-sm">← Back</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
        <section id="sprint" className={activeTab==='sprint'?'mt-8':'hidden'}>
          <h2 className="text-xl font-bold mb-4">{data.sprint.title}</h2>
          <p className="text-stone-600 mb-4">{data.sprint.goal}</p>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              {data.sprint.stories.map((story,idx)=>(
                <div key={idx} className="bg-white p-4 rounded-lg border border-stone-200 shadow-sm">
                  <h4 className="font-semibold">{story.name}</h4>
                  <p className="text-sm text-stone-600 mt-1">{story.description}</p>
                  <div className={open['story'+idx]?'mt-4 pt-4 border-t border-stone-200':'hidden mt-4 pt-4 border-t border-stone-200'}>
                    <h5 className="font-semibold text-sm">Acceptance Criteria</h5>
                    <ul className="list-disc list-inside text-sm text-stone-600 mt-1 space-y-1">
                      {story.acceptance.map((a,i)=>(<li key={i}>{a}</li>))}
                    </ul>
                    <h5 className="font-semibold text-sm mt-3">Decomposed Tasks</h5>
                    <ul className="list-disc list-inside text-sm text-stone-600 mt-1 space-y-1">
                      {story.tasks.map((t,i)=>(<li key={i}>{t}</li>))}
                    </ul>
                  </div>
                  <button className="accordion-toggle text-teal-600 text-sm font-semibold mt-2" onClick={()=>toggleAcc('story'+idx)}>{open['story'+idx]?'Hide Details ▲':'Show Details ▼'}</button>
                </div>
              ))}
            </div>
            <div>
              <h3 className="font-bold text-xl mb-4">Sprint Burndown</h3>
              <div className="bg-white p-4 rounded-lg border border-stone-200 shadow-sm">
                <div className="chart-container" style={{position:'relative',width:'100%',height:'300px'}}>
                  <canvas id="burndownChart"></canvas>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section id="framework" className={activeTab==='framework'?'mt-8':'hidden'}>
          <h2 className="text-xl font-bold mb-4">Acceptance Criteria vs Definition of Done</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <div className="bg-white p-6 rounded-lg border-2 border-teal-100 shadow-sm">
              <h4 className="font-bold text-lg text-teal-700">Acceptance Criteria</h4>
              <ul className="list-disc list-inside text-stone-700 space-y-2 text-sm">
                {data.framework.ac.map((a,i)=>(<li key={i}>{a}</li>))}
              </ul>
            </div>
            <div className="bg-white p-6 rounded-lg border-2 border-stone-300 shadow-sm">
              <h4 className="font-bold text-lg text-stone-700">Definition of Done</h4>
              <ul className="list-disc list-inside text-stone-700 space-y-2 text-sm">
                {data.framework.dod.map((d,i)=>(<li key={i}>{d}</li>))}
              </ul>
            </div>
          </div>
          <div className="mt-8">
            <h3 className="text-xl font-bold text-center mb-6">Communication Protocol</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 text-center">
              {Object.keys(data.framework.comm).map(name => (
                <div key={name} className={`comm-item bg-white p-4 rounded-lg shadow-sm border cursor-pointer hover:shadow-md ${comm===name ? 'border-teal-400 bg-teal-50' : 'border-stone-200'}`} onClick={()=>setComm(name)}>
                  <h4 className="font-semibold text-sm">{name}</h4>
                </div>
              ))}
            </div>
            <div id="comm-details" className="mt-6 bg-teal-50/50 p-6 rounded-lg border border-teal-100 min-h-[160px]">
              {comm ? (
                <div className="text-left">
                  <h4 className="font-bold text-teal-700">{comm}</h4>
                  <p className="text-sm text-stone-700 mt-2"><strong>Purpose:</strong> {data.framework.comm[comm].purpose}</p>
                  <p className="text-sm text-stone-700 mt-2"><strong>Participants:</strong> {data.framework.comm[comm].participants}</p>
                  <p className="text-sm text-stone-700 mt-2"><strong>Frequency:</strong> {data.framework.comm[comm].frequency}</p>
                </div>
              ) : <p className="text-stone-600">Click on an event above to see details.</p>}
            </div>
          </div>
        </section>
        <section id="practices" className={activeTab==='practices'?'mt-8':'hidden'}>
          <div className="max-w-3xl mx-auto space-y-4">
            {data.practices.map((p,i)=>(
              <div key={i} className="bg-white rounded-lg border border-stone-200 shadow-sm">
                <button className="accordion-toggle w-full text-left p-4 font-semibold" onClick={()=>toggleAcc('practice'+i)}>{p.title} {open['practice'+i]?'▲':'▼'}</button>
                <div className={open['practice'+i]? 'p-4 pt-0 text-stone-600 text-sm' : 'hidden p-4 pt-0 text-stone-600 text-sm'}>{p.content}</div>
              </div>
            ))}
          </div>
        </section>
        {addons.map((Addon,i)=>(<Addon key={i}/>))}
      </main>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(
  React.createElement(window.Blackboard.BlackboardProvider, null,
    React.createElement(Scriptment, null)
  )
);
