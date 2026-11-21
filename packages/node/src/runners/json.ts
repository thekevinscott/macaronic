import type { Runner } from '../types.js';

export const json: Runner = (content) => JSON.parse(content) as unknown;
