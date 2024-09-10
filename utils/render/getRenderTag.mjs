import { getRender, ENV_NEXT } from './getRender.mjs';

export class RenderTag extends Function {
  #env = {};
  #options = {};

  constructor(env = {}, options = {}) {
    super();

    this.#env = {...ENV_NEXT, ...env }
    this.#options = options;

    const instance = this;

    this.use = this.use.bind(this);
    this.clear = this.clear.bind(this);
    this.render = this.render.bind(this);
    this.has = this.has.bind(this);

    return new Proxy(this, {
      apply: (target, thisArg, argumentsList) => {
        const [strings, ...values] = argumentsList;

        let input = '';

        if (Array.isArray(strings)) {
          for (let i = 0; i < strings.length; i++) {
            if (i > 0) {
              input += values[i - 1];
            }

            input += strings[i];
          }
        } else {
          input = strings;
        }

        return target.render.call(instance, input);
      },
      get: (target, prop, receiver) => {
        return Reflect.get(instance, prop, target);
      },
    });
  }

  use(...fn) {
    for (const f of fn) {
      if (typeof f === 'object') {
        Object.entries(f).forEach(([key, value]) => {
          this.#env[key] = value;
        });
      } else if (typeof f === 'string' && typeof fn[1] === 'function') {
        this.#env[f] = fn[1];
      } else if (typeof f === 'string' && typeof fn[1] === 'object') {
        Object.entries(fn[1]).forEach(([key, value]) => {
          this.#env[key] = value;
        });
      } else if (typeof f === 'function') {
        this.#env[f.name] = f;
      }
    }
  }

  has(name) {
    return this.#env[name] !== undefined;
  }

  clear() {
    this.#env = {};
  }

  get env() {
    return this.#env;
  }

  render(string) {
    const r = getRender(this.#env);
    const result = r(string);
  
    return result;
  }
}

export const getRenderTag = (env = {}, options = {}) => {
  const tag = new RenderTag(env, options);

  return tag;
};

export const cssf = getRenderTag();