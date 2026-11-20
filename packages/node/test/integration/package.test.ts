import { expect, test } from 'vitest';

test('the built package imports by name', async () => {
  await expect(import('macaronic')).resolves.toBeDefined();
});
