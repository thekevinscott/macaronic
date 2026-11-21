import { runners } from './runners/index.js';
import type { Runner } from './types.js';

export function register(language: string, runner: Runner): void {
  runners[language] = runner;
}
