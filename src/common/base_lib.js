export class BaseLib {
  constructor(adapterInstances) {
    this.__adapter = adapterInstances;
    this.libs = {};

    return new Proxy(this, {
      get(targets, name) {
        if (!targets.inheritAdapter) return targets[name];
        if (targets.__adapter && targets.__adapter[name]) {
          return targets.__adapter[name];
        }

        return targets[name];
      }
    });
  }

  get adapter() {
    return this.__adapter;
  }

  init() { }

  async initLib(libs) {
    if (this.init) await this.init();

    if (this.inheritAdapter && !this.__adapter) {
      throw `${
      this.constructor.name
      } has inheritAdapter set to true but that adapter is not exist set in the composition`;
    }

    this.requiredLibs.forEach((lib) => {
      if (libs[lib]) {
        this.libs[lib] = libs[lib];
      } else {
        throw new Error(
          `The lib "${
          this.constructor.name
          }" requested the lib ${lib} as a requiredLibs, and it does not exist`
        );
      }
    });
  }
}

export function StatelessLib(methodCallback, config = {}) {

  return function StatelessLibWrapper(adapter) {
    const exposedLibs = {};
    let methods = {};

    const initLib = async function (libs) {

      methods = methodCallback(adapter || {}, exposedLibs);
      if (methods.init) await methods.init();

      if (config.requiredLibs) {

        config.requiredLibs.forEach((lib) => {
          if (libs[lib]) {
            exposedLibs[lib] = libs[lib];
          } else {
            throw new Error(
              `One lib requested another lib ${lib} as a requiredLibs, and it does not exist`
            );
          }
        });
      }
    }

    return new Proxy({}, {
      get(self, key) {
        if (key === 'initLib') return initLib;

        if (!config.inheritAdapter || !adapter) return self[key] || methods[key];

        return self[key] || methods[key] || adapter[key];
      }
    });
  }
}