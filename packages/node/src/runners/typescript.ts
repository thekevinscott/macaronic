import type { Runner } from '../types.js';
import { javascript } from './javascript.js';

export const typescript: Runner = async (content, variables) => {
  const { default: ts } = await import('typescript');
  const { outputText } = ts.transpileModule(content, {
    compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext },
  });
  return javascript(outputText, variables);
};
