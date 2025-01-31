export const PluginDef = Symbol('PluginDef');

export class Plugin {
  get [PluginDef]() {
    return true;
  }
}