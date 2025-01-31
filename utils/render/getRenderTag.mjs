import { getRender, ENV_NEXT } from './getRender.mjs';
import { Plugin, PluginDef } from './Plugin.mjs';
import { describe } from '../meta/describe.mjs';
import { kebabCase } from 'change-case';

const isPlainObj = (value) => {
  if (typeof value !== 'object' || value === null) return false;
  let obj = {};
  if (String(obj.constructor) !== String(value.constructor)) return false;

  return Object.getPrototypeOf(value) === Object.getPrototypeOf(obj)
}

export class RenderTag extends Function {
  #env = {};
  #envProxy = {};
  #plugins = [];
  #options = {};

  static isPlugin(obj) {
    // return obj[PluginDef] === true;
    return !isPlainObj(obj);
  }

  constructor(env = {}, options = {}) {
    super();
    const instance = this;
    this.#options = options;

    this._registerPlugin = this._registerPlugin.bind(this);
    this._registerFunction = this._registerFunction.bind(this);
    this.use = this.use.bind(this);
    this.clear = this.clear.bind(this);
    this.render = this.render.bind(this);
    this.has = this.has.bind(this);
    this.set = this.set.bind(this);
    this.get = this.get.bind(this);
    this._call = this._call.bind(this);
    this.__applyPlugins = this.__applyPlugins.bind(this);

    this.#envProxy = new Proxy({}, {
      get: (target, prop, receiver) => {
        if (!Reflect.has(target, prop)) {
          const kebabProp = kebabCase(prop);

          if (Reflect.has(target, kebabProp)) {
            return Reflect.get(target, kebabProp, receiver);
          }
        }
        
        return Reflect.get(target, prop, receiver);
      },
    });

    const thisObj = new Proxy(this, {
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

        return thisObj.render(input, options);
      },
      get: (target, prop, receiver) => {
        const value = Reflect.get(instance, prop, target);
        // console.log('RENDER TAG GET: ', prop, value);

        if (typeof value === 'function') {
          const f = (...args) => instance.__applyPlugins(prop, value, ...args);

          Object.defineProperty(f, 'name', { value: prop, writable: false });

          return f;
        }

        return value;
      },
    });

    const initEnv = {...ENV_NEXT, ...env };

    Object.entries(initEnv).forEach(([key, value]) => this._registerFunction(key, value));

    return thisObj;
  }

  _registerPlugin(plugin) {
    this.#plugins.push(plugin);
  }

  _registerFunction(key, fn) {
    if (!fn && typeof key === 'function') {
      fn = key;
      key = key.name;
    }

    if (this.has(key)) {
      throw new Error(`Function ${key} already exists`);
    }

    this.#env[key] = fn;
    const instance = this;

    const proxyFn = new Proxy(fn, {
      apply: (target, thisArg, argumentsList) => {
        if (instance._call) {
          return instance.__applyPlugins('_call', instance._call, target, ...argumentsList);
        }

        return Reflect.apply(target, thisArg, argumentsList);
      },
    });

    this.#envProxy[key] = proxyFn;
  }

  use(...fn) {
    if (fn.length === 2 && typeof fn[0] === 'string') {
      this.#env[fn[0]] = fn[1];
      return;
    }

    for (const f of fn) {
      if (typeof f === 'object') {
        if (RenderTag.isPlugin(f)) {
          this._registerPlugin(f);
        } else {
          Object.entries(f).forEach(([key, value]) => {
            if (typeof value === 'function') {
              this._registerFunction(key, value);
            }
          });
        }
      } else {
        this._registerFunction(f);
      } 
    }
  }

  remove(fn) {
    if (RenderTag.isPlugin(fn)) {
      this.#plugins = this.#plugins.filter(p => p !== fn);
    }
    
    if (typeof fn === 'object') {
      Object.keys(fn).forEach(key => {
        this.remove(key);
      });
    }

    const key = typeof fn === 'string' ? fn : fn.name;

    delete this.#env[key];
    delete this.#envProxy[key];
  }

  __applyPlugins(hook, action, ...args) {
    const plugins = this.#plugins.filter((plugin) => typeof plugin[hook] === 'function');

    // Create a chain of plugin instances
    const createPipeline = (index) => {
      if (index >= plugins.length) {
        // At the end of the chain, return the original action function
        return (...finalArgs) => action(...finalArgs);
      }
  
      const plugin = plugins[index];
      let next = createPipeline(index + 1); // Create the next plugin instance

      next = next.bind(plugin);
  
      // Wrap the plugin with a proxy to inject `__next` as the next plugin instance
      const proxiedPlugin = new Proxy(plugin, {
        get(target, prop) {
          if (prop === '__next') return next;
          return Reflect.get(target, prop);
        },
      });
  
      // Return a function that calls the current plugin's hook
      return (...pluginArgs) => {
        return plugin[hook].call(proxiedPlugin, ...pluginArgs);
      };
    };
  
    // Start the pipeline
    const pipeline = createPipeline(0);
  
    // Execute the plugin chain
    return pipeline(...args);
  }
  
  _call(fn, ...args) {
    if (this.#options.callback) {
      return this.#options.callback(fn, args);
    }

    return fn(...args);
  }

  set(key, value) {
    this.#options[key] = value;
  }

  get(key) {
    return this.#options[key];
  }

  has(name) {
    return this.#env[name] !== undefined || !!this.#plugins.find(p => p === name);
  }

  clear() {
    this.#env = {};
  }

  get env() {
    return this.#envProxy;
  }

  get meta() {
    return describe(this.#env);
  }

  get plugins() {
    return this.#plugins;
  }

  render(string) {
    const r = getRender(this.env);
    const result = r(string, this.#options);
  
    return result;
  }
}

export const getRenderTag = (env = {}, options = {}) => {
  const tag = new RenderTag(env, options);

  return tag;
};

export const cssf = getRenderTag();