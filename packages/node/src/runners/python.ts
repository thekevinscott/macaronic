import { createRequire } from 'node:module';
import { dirname } from 'node:path';
import type { PyodideInterface } from 'pyodide';
import type { Runner } from '../types.js';

let interpreter: Promise<PyodideInterface> | undefined;

const getInterpreter = (): Promise<PyodideInterface> => {
  // Pyodide's own lookup of its asset folder fails under vitest.
  const indexURL = dirname(createRequire(import.meta.url).resolve('pyodide'));
  interpreter ??= import('pyodide').then(({ loadPyodide }) => loadPyodide({ indexURL }));
  return interpreter;
};

const PREFIX = '__macaronic_';

interface Convertible {
  toJs: (options: { dict_converter: typeof Object.fromEntries }) => unknown;
}

const isConvertible = (value: unknown): value is Convertible =>
  typeof value === 'object' && value !== null && 'toJs' in value;

export const python: Runner = async (content, variables) => {
  const pyodide = await getInterpreter();
  const globals = pyodide.toPy(
    Object.fromEntries(Object.entries(variables).map(([name, value]) => [PREFIX + name, value])),
  ) as unknown;
  const result: unknown = await pyodide.runPythonAsync(content.replace(/\$(\w+)/g, `${PREFIX}$1`), {
    globals: globals as never,
  });
  return isConvertible(result) ? result.toJs({ dict_converter: Object.fromEntries }) : result;
};
