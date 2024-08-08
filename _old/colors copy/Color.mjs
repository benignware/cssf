import { convertColor } from "./convertColor.mjs";

export class Color {
  #colorSpace;
  #components;

  constructor(colorSpace, ...components) {
    this.#colorSpace = colorSpace;
    this.#components = components;
  }

  set colorSpace(colorSpace) {
    this.#colorSpace = colorSpace;
  }

  get colorSpace() {
    return this.#colorSpace;
  }0

  [Symbol.iterator]() {
    return this.components.values();
  }

  toString() {
    return `${this.#colorSpace}(${this.#components.join(', ')})`;
  }
}