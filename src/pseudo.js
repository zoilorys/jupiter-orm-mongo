import R from 'ramda';
import { Promise } from 'es6-promise';


function handler(a, b) {
  return a + b;
}

function before(key) {
  return function(x) {
    return key + x;
  }
}

function after(key) {
  return function(x) {
    return x + key;
  }
}

function executor(func, name) {
  return Promise.resolve(name)
    .then(func);
}

function composer(func, key) {
  return R.compose(after(key), func, before(key));
}


executor(composer(R.partialRight(handler, '-end'), 'X'), 'front')

.then(console.log.bind(console));

const str = 'goUNicorns';
console.log(str.split(/[A-Z]/)[0]);
