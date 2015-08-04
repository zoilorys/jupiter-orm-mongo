import { isEmpty } from 'ramda';

function hooksManager() {
  const hooks = {
    create: {
      before: [],
      after: [],
    },
    update: {
      before: [],
      after: [],
    },
    find: {
      before: [],
      after: [],
    },
    delete: {
      before: [],
      after: [],
    },
  };

  const controller = {};

  controller.registerBeforeHook = function(name, hook) {
    hooks[name]['before'].push(hook);
    return this;
  };

  controller.registerAfterHook = function(name, hook) {
    hooks[name]['after'].push(hook);
    return this;
  };

  controller.execBeforeHooks = function(name) {
    return function(value) {
      return isEmpty(hooks[name]['before']) ? value : hooks[name]['before']
        .reduce(function(value, func) {
          return func(value);
        }, value);
    };
  };

  controller.execAfterHooks = function(name) {
    return function(value) {
      return isEmpty(hooks[name]['after']) ? value : hooks[name]['after']
        .reduce(function(value, func) {
          return func(value);
        }, value);
    };
  };

  controller.clearBeforeHooks = function(name) {
    hooks[name]['before'].length = 0;
    return this;
  }

  controller.clearAfterHooks = function(name) {
    hooks[name]['after'].length = 0;
    return this;
  }

  return controller;
};

export const hooks = hooksManager();
