export function parseAttributes(meta: string | null | undefined): Record<string, string> {
  const attributes: Record<string, string> = {};
  for (const pair of (meta ?? '').split(/\s+/)) {
    const separator = pair.indexOf('=');
    if (separator > 0) {
      attributes[pair.slice(0, separator)] = pair.slice(separator + 1);
    }
  }
  return attributes;
}
