export default function HelloAddon(){
  return React.createElement('div', {className:'p-4 bg-blue-50 rounded mt-4'}, 'Hello Addon Loaded');
}

if(window.Blackboard){
  window.Blackboard.registerAddon(HelloAddon);
}
