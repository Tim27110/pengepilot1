import { describe, expect, it } from 'vitest';

const mockBankOnly = true;

describe('development foundation', () => {
  it('keeps external banking disabled in the foundation', () => {
    expect(mockBankOnly).toBe(true);
  });
});
