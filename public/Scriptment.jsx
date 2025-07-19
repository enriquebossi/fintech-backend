const { useState, useEffect } = React;

function Scriptment() {
  const [script, setScript] = useState(null);
  const [addons, setAddons] = useState({});

  useEffect(() => {
    fetch('./scriptment-content.json')
      .then(r => r.json())
      .then(setScript)
      .catch(err => console.error('Script load error:', err));
  }, []);

  useEffect(() => {
    if (!script) return;
    const names = [...new Set(script.scenes.flatMap(s => s.addons || []))];
    names.forEach(name => {
      if (!addons[name]) {
        import(`./addons/${name}.js`)
          .then(mod => setAddons(prev => ({ ...prev, [name]: mod.default })))
          .catch(err => console.error('Add-on load error:', err));
      }
    });
  }, [script]);

  if (!script) {
    return React.createElement('div', { className: 'p-4' }, 'Loading script...');
  }

  return (
    React.createElement('div', { className: 'p-4' },
      React.createElement('h2', { className: 'text-2xl font-bold mb-4' }, script.title),
      script.scenes.map(scene => (
        React.createElement('div', { key: scene.id, className: 'mb-6' },
          React.createElement('h3', { className: 'text-xl font-semibold mb-2' }, scene.title),
          scene.lines.map((line, idx) => (
            React.createElement('p', { key: idx, className: 'ml-4' },
              React.createElement('strong', null, line.character + ': '),
              line.text
            )
          )),
          (scene.addons || []).map(name => {
            const Addon = addons[name];
            return Addon ? React.createElement(Addon, { key: name }) : null;
          })
        )
      ))
    )
  );
}
