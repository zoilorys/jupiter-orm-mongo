export function hooksManager() {
  const hooks = {
    create: {
      before: [
        function(value) {
          return value;
        }
      ],
      after: [
        function(value) {
          return value;
        }
      ],
    },
    update: {
      before: [
        function(value) {
          return value;
        }
      ],
      after: [
        function(value) {
          return value;
        }
      ],
    },
    find: {
      before: [
        function(value) {
          return value;
        }
      ],
      after: [
        function(value) {
          return value;
        }
      ],
    },
    delete: {
      before: [
        function(value) {
        return value;
        }
      ],
      after: [
        function(value) {
          return value;
        }
      ],
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
        return hooks[prefix][suffix].reduce(function(value, func) {
          return func(value);
        }, value);
      };
    };
  };

  return controller;
};

export const hooks = hooksManager();
