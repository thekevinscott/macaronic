import { describe, expect, test } from 'vitest';
import { parse } from 'macaronic';
import { fixture } from './fixture.js';

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

  describe('a document whose second block uses a plain variable from the first', () => {
    test('rejects in Python, because each block runs on its own', async () => {
      await expect(parse(await fixture('isolated-python.md'))).rejects.toThrow(
        "name 'count' is not defined",
      );
    });

    test('rejects in JavaScript, because each block runs on its own', async () => {
      await expect(parse(await fixture('isolated-javascript.md'))).rejects.toThrow(
        'count is not defined',
      );
    });
  });

  describe('a document with a code block nothing can run', () => {
    test('rejects a block with no language, naming its line', async () => {
      await expect(parse(await fixture('no-language.md'))).rejects.toThrow(
        'No runner for the unlabeled code block on line 5',
      );
    });

    test('rejects a block in an unknown language, naming the language and its line', async () => {
      await expect(parse(await fixture('unknown-language.md'))).rejects.toThrow(
        'No runner for the cobol code block on line 5',
      );
    });
  });

  describe('a Python string holding a dollar sign that names no block', () => {
    test('leaves the string as written', async () => {
      const parsed = await parse(await fixture('dollar-in-string.md'));
      expect(parsed.codeBlocks[0].value).toEqual('costs $five');
    });
  });

  describe('a document with a YAML block', () => {
    test('parses the block as data and offers it to later blocks by name', async () => {
      const parsed = await parse(await fixture('yaml.md'));
      expect(parsed.codeBlocks.map((block) => block.value)).toEqual([
        { name: 'three-files', files: ['a.md', 'b.md', 'c.md'] },
        3,
      ]);
    });
  });
});
