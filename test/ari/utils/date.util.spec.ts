import { addDays, formatDate } from '../../../src/ari/utils/date.util';

describe('ARI date utilities (server-local calendar)', () => {
  it('formats a local date with zero padding', () => {
    expect(formatDate(new Date(2026, 0, 2))).toBe('20260102');
  });
  it.each([
    [2026, 0, 31, 1, '20260201'],
    [2026, 11, 31, 1, '20270101'],
    [2024, 1, 28, 1, '20240229'],
    [2026, 2, 1, -1, '20260228'],
    [2026, 8, 8, 0, '20260908'],
  ])('adds days without mutating the input', (year, month, day, days, expected) => {
    const source = new Date(year, month, day, 12);
    const timestamp = source.getTime();
    const result = addDays(source, days);
    expect(formatDate(result)).toBe(expected);
    expect(source.getTime()).toBe(timestamp);
    expect(result).not.toBe(source);
  });
});
