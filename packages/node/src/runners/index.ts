import type { Runner } from '../types.js';
import { javascript } from './javascript.js';
import { json } from './json.js';
import { python } from './python.js';
import { typescript } from './typescript.js';

export const runners: Record<string, Runner> = { javascript, json, python, typescript };
