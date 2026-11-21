import { runInNewContext } from 'node:vm';
import type { Runner, Variables } from '../types.js';

const asGlobals = (variables: Variables): Variables =>
  Object.fromEntries(Object.entries(variables).map(([name, value]) => [`$${name}`, value]));

export const javascript: Runner = (content, variables) =>
  runInNewContext(content, asGlobals(variables)) as unknown;
