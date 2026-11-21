import { fromMarkdown } from 'mdast-util-from-markdown';
import { parseAttributes } from './parse-attributes.js';
import { runners } from './runners/index.js';
import type { CodeBlock, Parsed, Variables } from './types.js';

export async function parse(text: string): Promise<Parsed> {
  const blocks = fromMarkdown(text).children;
  const codeBlocks: CodeBlock[] = [];
  const variables: Variables = {};

  for (const block of blocks) {
    if (block.type !== 'code') {
      continue;
    }
    const language = block.lang ?? undefined;
    const run = language === undefined ? undefined : runners[language];
    if (language === undefined || run === undefined) {
      const line = block.position?.start.line;
      throw new Error(`No runner for the ${language ?? 'unlabeled'} code block on line ${line}`);
    }
    const { name } = parseAttributes(block.meta);
    const value = await run(block.value, variables);
    if (name !== undefined) {
      variables[name] = value;
    }
    codeBlocks.push({ language, name, content: block.value, value });
  }

  return { blocks, codeBlocks };
}
