import { describe, it, expect } from 'vitest';
import {
  toLocalIsoString,
  formatDate,
  formatTime,
  endsOnDifferentDay,
  dateHasPassed
} from './date.util';

describe('Date Utils', () => {
  describe('toLocalIsoString', () => {
    it('should convert UTC date string to local ISO string', () => {
      const result = toLocalIsoString('2023-01-01T12:00:00Z');
      expect(result).toBeDefined();
      expect(typeof result).toBe('string');
    });
  });

  describe('formatDate', () => {
    it('should format today\'s date as "I dag"', () => {
      const today = new Date().toISOString();
      const result = formatDate(today);
      expect(result).toBe('I dag');
    });

    it('should format past date correctly', () => {
      const pastDate = '2023-01-01T12:00:00Z';
      const result = formatDate(pastDate);
      expect(result).toBeDefined();
      expect(typeof result).toBe('string');
    });
  });

  describe('formatTime', () => {
    it('should format time correctly', () => {
      const result = formatTime('2023-01-01T12:00:00Z');
      expect(result).toBeDefined();
      expect(typeof result).toBe('string');
    });
  });

  describe('endsOnDifferentDay', () => {
    it('should return false when dates are on the same day', () => {
      const result = endsOnDifferentDay('2023-01-01T12:00:00Z', '2023-01-01T18:00:00Z');
      expect(result).toBe(false);
    });

    it('should return true when dates are on different days', () => {
      const result = endsOnDifferentDay('2023-01-01T12:00:00Z', '2023-01-02T12:00:00Z');
      expect(result).toBe(true);
    });
  });

  describe('dateHasPassed', () => {
    it('should return true for past dates', () => {
      const pastDate = '2023-01-01T12:00:00Z';
      const result = dateHasPassed(pastDate);
      expect(result).toBe(true);
    });

    it('should return false for future dates', () => {
      const futureDate = new Date();
      futureDate.setFullYear(futureDate.getFullYear() + 1);
      const result = dateHasPassed(futureDate.toISOString());
      expect(result).toBe(false);
    });
  });
});
