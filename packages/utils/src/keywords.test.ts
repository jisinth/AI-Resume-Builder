import { describe, expect, it } from 'vitest';
import { tokenize } from './keywords';

describe('tokenize', () => {
  it('strips trailing sentence punctuation from tokens', () => {
    const tokens = tokenize('improving system reliability.');
    expect(tokens).toContain('reliability');
    expect(tokens).not.toContain('reliability.');
  });

  it('preserves periods inside compound words', () => {
    const tokens = tokenize('Experience with Node.js and .NET');
    expect(tokens).toContain('node.js');
  });

  it('removes stop words', () => {
    const tokens = tokenize('the quick and the brave');
    expect(tokens).not.toContain('the');
    expect(tokens).not.toContain('and');
  });
});
