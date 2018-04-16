export { FilesLib as files } from './files';

export let libs = {};

export function composeLibs() {
  let { composeLibs } = require('./compose/default');
  libs = composeLibs();
  return libs;
}