import * as libs from '../index.js';
import { FilesAdapter } from '../../adapters/files/electron';

let composedLibs = null;

export function composeLibs() {
  composedLibs = {
    files: new libs.files(new FilesAdapter())
  };

  Object.keys(composedLibs).forEach(name => {
    if (composedLibs[name].initLibs) {
      composedLibs[name].initLibs(composedLibs);
    }
  });

  return composedLibs;
}