import { parse } from 'yaml';
import type { Runner } from '../types.js';

export const yaml: Runner = (content) => parse(content) as unknown;
