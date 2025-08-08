import { describe, it, expect } from 'vitest';
import { extractJson } from './json';

describe('extractJson', () => {
  it('parses fenced json', () => {
    const s = '```json\n{"a":1}\n```';
    expect(extractJson(s)).toEqual({ a: 1 });
  });
  it('finds first balanced object', () => {
    const s = 'noise {"a":2} tail';
    expect(extractJson(s)).toEqual({ a: 2 });
  });
});
