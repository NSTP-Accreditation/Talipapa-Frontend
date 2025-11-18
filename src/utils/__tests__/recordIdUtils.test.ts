import {
  extractNumericSequence,
  getNextRecordIdFromList,
} from '../recordIdUtils';

describe('recordIdUtils', () => {
  test('extractNumericSequence returns numeric part, prefix and suffix', () => {
    const result = extractNumericSequence('EST-00012-A');
    expect(result).not.toBeNull();
    expect(result?.value).toBe(12);
    expect(result?.str).toBe('00012');
    expect(result?.prefix).toBe('EST-');
    expect(result?.suffix).toBe('-A');
  });

  test('getNextRecordIdFromList returns next padded id', () => {
    const list = ['EST-00001', 'EST-00002', 'EST-00010'];
    const next = getNextRecordIdFromList(list);
    expect(next).toBe('EST-00011');
  });

  test('getNextRecordIdFromList returns null when not numeric', () => {
    const list = ['ABC', 'FOO'];
    const next = getNextRecordIdFromList(list);
    expect(next).toBeNull();
  });
});
