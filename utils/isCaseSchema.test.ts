import { describe, it, expect } from 'vitest';
import { isCaseSchema } from './json';

describe('isCaseSchema', () => {
  it('returns true for a valid case', () => {
    const validCase = {
      case: { id: 'abc', age: 30, sex: 'M', chiefComplaint: 'headache', history: [] }
    };
    expect(isCaseSchema(validCase)).toBe(true);
  });

  it('returns false when case property is missing', () => {
    const invalidCase = { notcase: {} };
    expect(isCaseSchema(invalidCase)).toBe(false);
  });

  it('returns false when id is not a string', () => {
    const invalidCase = { case: { id: 123, age: 30, sex: 'M', chiefComplaint: '', history: [] } };
    expect(isCaseSchema(invalidCase)).toBe(false);
  });

  it('returns false when age is not a number', () => {
    const invalidCase = { case: { id: 'abc', age: 'thirty', sex: 'M', chiefComplaint: '', history: [] } };
    expect(isCaseSchema(invalidCase)).toBe(false);
  });
});
