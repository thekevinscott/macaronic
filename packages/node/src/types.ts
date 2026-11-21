import type { RootContent } from 'mdast';

export type Variables = Record<string, unknown>;

export type Runner = (content: string, variables: Variables) => unknown;

export interface CodeBlock {
  language: string;
  name: string | undefined;
  content: string;
  value: unknown;
}

export interface Parsed {
  blocks: RootContent[];
  codeBlocks: CodeBlock[];
}
