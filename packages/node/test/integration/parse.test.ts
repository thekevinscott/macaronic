import { readFile } from 'node:fs/promises';
import { describe, expect, test } from 'vitest';
import { parse } from 'macaronic';

const fixture = (name: string) =>
  readFile(new URL(`./__fixtures__/${name}`, import.meta.url), 'utf8');

describe('parse', () => {
  describe('a document with blocks in three languages', () => {
    test('runs each code block and returns its language, name, content, and value, in document order', async () => {
      const parsed = await parse(await fixture('three-languages.md'));
      expect(parsed.blocks.length).toEqual(8);
      expect(parsed.codeBlocks).toEqual([
        {
          language: 'json',
          name: undefined,
          content: '[{"path": "a.md"}, {"path": "b.md"}, {"path": "c.md"}]',
          value: [{ path: 'a.md' }, { path: 'b.md' }, { path: 'c.md' }],
        },
        {
          language: 'python',
          name: undefined,
          content: 'numbers = [1, 2, 3]\nsum(numbers)',
          value: 6,
        },
        {
          language: 'typescript',
          name: undefined,
          content: "const name: string = 'world';\n`hello ${name}`;",
          value: 'hello world',
        },
      ]);
    });
  });

  describe('a document whose blocks refer to earlier named blocks', () => {
    test('replaces each $name with the value of the block of that name', async () => {
      const parsed = await parse(await fixture('variables.md'));
      expect(parsed.codeBlocks).toEqual([
        { language: 'json', name: 'numbers', content: '[1, 2, 3]', value: [1, 2, 3] },
        { language: 'python', name: 'total', content: 'sum($numbers)', value: 6 },
        { language: 'typescript', name: 'doubled', content: '$total * 2;', value: 12 },
      ]);
    });
  });
});
