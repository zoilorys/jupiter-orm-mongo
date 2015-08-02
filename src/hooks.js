
export function registerHook(hooks, name, hook) {
  return hooks[name].push(hook);
}

export function getHooks(hooks, name) {
  return hooks[name];
}
