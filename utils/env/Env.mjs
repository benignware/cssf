let globalEnv = {};

export const ENV_2022 = '2022';
export const ENV_2023 = '2023';
export const ENV_2024 = '2024';
export const ENV_NEXT = 'next';

export class Env {
  static setEnv(env) {
    globalEnv = env;
  }

  static getEnv() {
    return globalEnv;
  }
}