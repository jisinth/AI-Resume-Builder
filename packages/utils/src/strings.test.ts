import { describe, expect, it } from 'vitest';
import { capitalize, initials, slugify, truncate } from './strings';

describe('slugify', () => {
  it('converts a title into a URL-safe slug', () => {
    expect(slugify('Senior Backend Engineer!')).toBe('senior-backend-engineer');
  });
});

describe('initials', () => {
  it('returns up to two initials from a full name', () => {
    expect(initials('Jane Doe')).toBe('JD');
    expect(initials('Madonna')).toBe('M');
  });
});

describe('truncate', () => {
  it('leaves short strings untouched', () => {
    expect(truncate('short', 10)).toBe('short');
  });

  it('truncates long strings with an ellipsis', () => {
    expect(truncate('a very long sentence indeed', 10)).toHaveLength(10);
  });
});

describe('capitalize', () => {
  it('capitalizes the first letter', () => {
    expect(capitalize('resume')).toBe('Resume');
  });
});
