const { createContext, useState, useEffect } = React;

const AddonContext = createContext([]);
const addonList = [];
const listeners = new Set();

function registerAddon(Addon) {
  addonList.push(Addon);
  listeners.forEach(l => l([...addonList]));
}

function BlackboardProvider({ children }) {
  const [addons, setAddons] = useState(addonList);
  useEffect(() => {
    const listener = list => setAddons(list);
    listeners.add(listener);
    return () => listeners.delete(listener);
  }, []);
  return React.createElement(AddonContext.Provider, { value: addons }, children);
}

window.Blackboard = { registerAddon, AddonContext, BlackboardProvider };

export { registerAddon, AddonContext, BlackboardProvider };
