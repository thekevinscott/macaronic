import { describe, expect, test } from 'vitest';
import { parse, register } from 'macaronic';
import { fixture } from './fixture.js';

const brainfuck = (source: string): string => {
  const tape = new Uint8Array(30000);
  let pointer = 0;
  let output = '';
  for (let i = 0; i < source.length; i++) {
    const command = source[i];
    if (command === '>') {
      pointer++;
    } else if (command === '<') {
      pointer--;
    } else if (command === '+') {
      tape[pointer]++;
    } else if (command === '-') {
      tape[pointer]--;
    } else if (command === '.') {
      output += String.fromCharCode(tape[pointer]);
    } else if (command === '[' && tape[pointer] === 0) {
      for (let depth = 1; depth > 0;) {
        i++;
        depth += source[i] === '[' ? 1 : source[i] === ']' ? -1 : 0;
      }
    } else if (command === ']' && tape[pointer] !== 0) {
      for (let depth = 1; depth > 0;) {
        i--;
        depth += source[i] === ']' ? 1 : source[i] === '[' ? -1 : 0;
      }
    }
  }
  return output;
};

describe('register', () => {
  describe('a language nothing built in can run', () => {
    test('runs the block with the registered function', async () => {
      register('brainfuck', brainfuck);
      const parsed = await parse(await fixture('brainfuck.md'));
      expect(parsed.codeBlocks[0].value).toEqual('Hi');
    });
  });

  describe('the registered function', () => {
    test('receives the block content and the values of earlier named blocks', async () => {
      register('echo', async (content, variables) => ({ content, variables }));
      const parsed = await parse(await fixture('register-variables.md'));
      expect(parsed.codeBlocks[1].value).toEqual({
        content: 'anything at all',
        variables: { numbers: [1, 2, 3] },
      });
    });
  });

  describe('a language that already has a built-in runner', () => {
    test('uses the registered function in place of the built-in', async () => {
      register('json', () => 'replaced');
      const parsed = await parse(await fixture('three-languages.md'));
      expect(parsed.codeBlocks.map((block) => block.value)).toEqual(['replaced', 6, 'hello world']);
    });
  });
});
