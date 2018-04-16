export { AppLib as app } from './app';

export let libs = {};

export function composeLibs() {
  let { composeLibs } = require('./compose/default');
  libs = composeLibs();
  return libs;
}