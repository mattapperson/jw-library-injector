import * as libs from '../index.js';
import { AppAdapter } from '../../adapters/app/electron';

let composedLibs = null;

export function composeLibs() {
  composedLibs = {
    app: new libs.app(new AppAdapter())
  };

  Object.keys(composedLibs).forEach(name => {
    if (composedLibs[name].initLibs) {
      composedLibs[name].initLibs(composedLibs);
    }
  });

  return composedLibs;
}