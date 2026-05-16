import { describe, it, expect } from 'vitest';
import { calculateScore, generateQuizCode } from './utils';

describe('Utility Functions', () => {
  describe('calculateScore', () => {
    it('returns 0 if the answer is incorrect', () => {
      expect(calculateScore(false, 30)).toBe(0);
      expect(calculateScore(false, 0)).toBe(0);
    });

    it('returns 100 + (timeLeft * 2) if the answer is correct', () => {
      expect(calculateScore(true, 30)).toBe(160);
      expect(calculateScore(true, 10)).toBe(120);
      expect(calculateScore(true, 0)).toBe(100);
    });
  });

  describe('generateQuizCode', () => {
    it('generates a 6-character string', () => {
      const code = generateQuizCode();
      expect(code).toHaveLength(6);
    });

    it('generates a string containing only digits', () => {
      const code = generateQuizCode();
      expect(/^\d+$/.test(code)).toBe(true);
    });
  });
});
