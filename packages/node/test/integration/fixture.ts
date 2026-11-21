import { readFile } from 'node:fs/promises';

export const fixture = (name: string) =>
  readFile(new URL(`./__fixtures__/${name}`, import.meta.url), 'utf8');
