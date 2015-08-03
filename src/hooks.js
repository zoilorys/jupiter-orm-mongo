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

  controller.registerHook = function(name, hook) {
    const args = name.split(' ');
    hooks[args[0]][args[1]].push(hook);
    return this;
  };

  controller.execHooks = function(prefix) {
    return function(suffix) {
      return function(value) {
        return isEmpty(hooks[prefix][suffix]) ? value : hooks[prefix][suffix]
          .reduce(function(value, func) {
            return func(value);
          }, value);
      };
    };
  };

  controller.clearHooks = function(name) {
    const args = name.split(' ');
    hooks[args[0]][args[1]].length = 0;
    return this;
  }

  return controller;
};

export const hooks = hooksManager();
