import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { parseISO, isSameDay, format, isToday, formatISO } from "date-fns";
import { zonedTimeToUtc } from "date-fns-tz";
import {
  toLocalIsoString,
  formatDate,
  formatTime,
  endsOnDifferentDay,
  dateHasPassed
} from '../date.util';

// Mock date-fns functions
vi.mock('date-fns', async () => {
  const actual = await vi.importActual('date-fns');
  return {
    ...actual,
    isToday: vi.fn(),
    parseISO: vi.fn((date: string) => new Date(date)),
    isSameDay: vi.fn(),
    format: vi.fn(),
    formatISO: vi.fn()
  };
});

// Mock date-fns-tz functions
vi.mock('date-fns-tz', async () => {
  const actual = await vi.importActual('date-fns-tz');
  return {
    ...actual,
    zonedTimeToUtc: vi.fn()
  };
});

// No need for dayjs mocks as we're using date-fns and date-fns-tz

describe('Date Utilities', () => {
  // Save original Date implementation
  const RealDate = global.Date;

  beforeEach(() => {
    // Reset all mocks before each test
    vi.resetAllMocks();
  });

  afterEach(() => {
    // Restore original Date after each test
    global.Date = RealDate;
  });

  describe('toLocalIsoString', () => {
    it('should convert UTC date string to local ISO string', () => {
      // Arrange
      const utcDateString = '2023-05-15T10:00:00Z';
      const parsedDate = new Date(utcDateString);
      const osloDate = new Date('2023-05-15T12:00:00+02:00');
      const expectedResult = '2023-05-15T12:00:00+02:00';

      vi.mocked(parseISO).mockReturnValue(parsedDate);
      vi.mocked(zonedTimeToUtc).mockReturnValue(osloDate);
      vi.mocked(formatISO).mockReturnValue(expectedResult);

      // Act
      const result = toLocalIsoString(utcDateString);

      // Assert
      expect(parseISO).toHaveBeenCalledWith(utcDateString);
      expect(zonedTimeToUtc).toHaveBeenCalledWith(parsedDate, 'Europe/Oslo');
      expect(formatISO).toHaveBeenCalledWith(osloDate);
      expect(result).toBe(expectedResult);
    });
  });

  describe('formatDate', () => {
    it('should return "I dag" if the date is today', () => {
      // Arrange
      const today = new Date().toISOString();
      vi.mocked(isToday).mockReturnValue(true);

      // Act
      const result = formatDate(today);

      // Assert
      expect(isToday).toHaveBeenCalled();
      expect(result).toBe('I dag');
    });

    it('should format the date correctly if not today', () => {
      // Arrange
      const dateString = '2023-05-15T10:00:00Z';
      vi.mocked(isToday).mockReturnValue(false);

      // Mock Date.prototype.toLocaleDateString
      const mockToLocaleDateString = vi.fn().mockReturnValue('15. mai 2023');
      const mockDate = {
        toLocaleDateString: mockToLocaleDateString
      };

      // Create a proper mock for the Date constructor
      const MockDateConstructor = vi.fn(() => mockDate) as unknown as DateConstructor;
      global.Date = MockDateConstructor;

      // Act
      const result = formatDate(dateString);

      // Assert
      expect(isToday).toHaveBeenCalled();
      expect(mockToLocaleDateString).toHaveBeenCalledWith('nb-NO', {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
      });
      expect(result).toBe('15. mai 2023');
    });
  });

  describe('formatTime', () => {
    it('should format the time correctly', () => {
      // Arrange
      const dateString = '2023-05-15T10:30:00Z';
      const expectedResult = '10:30';
      const parsedDate = new Date(dateString);

      vi.mocked(parseISO).mockReturnValue(parsedDate);
      vi.mocked(format).mockReturnValue(expectedResult);

      // Act
      const result = formatTime(dateString);

      // Assert
      expect(parseISO).toHaveBeenCalledWith(dateString);
      // Simplify the test to avoid type issues
      // Just check that format was called with the correct first two parameters
      expect(format).toHaveBeenCalledWith(
        parsedDate,
        'HH:mm',
        expect.any(Object)
      );
      expect(result).toBe(expectedResult);
    });
  });

  describe('endsOnDifferentDay', () => {
    it('should return true when dates are on different days', () => {
      // Arrange
      const startDate = '2023-05-15T10:00:00Z';
      const endDate = '2023-05-16T10:00:00Z';

      vi.mocked(isSameDay).mockReturnValue(false);

      // Act
      const result = endsOnDifferentDay(startDate, endDate);

      // Assert
      expect(parseISO).toHaveBeenCalledWith(startDate);
      expect(parseISO).toHaveBeenCalledWith(endDate);
      expect(isSameDay).toHaveBeenCalled();
      expect(result).toBe(true);
    });

    it('should return false when dates are on the same day', () => {
      // Arrange
      const startDate = '2023-05-15T10:00:00Z';
      const endDate = '2023-05-15T18:00:00Z';

      vi.mocked(isSameDay).mockReturnValue(true);

      // Act
      const result = endsOnDifferentDay(startDate, endDate);

      // Assert
      expect(parseISO).toHaveBeenCalledWith(startDate);
      expect(parseISO).toHaveBeenCalledWith(endDate);
      expect(isSameDay).toHaveBeenCalled();
      expect(result).toBe(false);
    });
  });

  describe('dateHasPassed', () => {
    it('should return true when date has passed', () => {
      // Arrange
      const pastDate = '2020-01-01T00:00:00Z';
      const nowDate = '2023-05-15T10:00:00Z';

      // Save original Date
      const OriginalDate = global.Date;

      // Create a proper mock for the Date constructor
      // This is a more type-safe approach to mocking the Date constructor
      const MockDateConstructor = vi.fn((dateString?: string) => {
        if (dateString) {
          return new OriginalDate(dateString);
        }
        return new OriginalDate(nowDate);
      }) as unknown as DateConstructor;

      // Ensure prototype chain is maintained
      Object.defineProperty(MockDateConstructor, 'prototype', {
        value: OriginalDate.prototype
      });

      global.Date = MockDateConstructor;

      // Act
      const result = dateHasPassed(pastDate);

      // Assert
      expect(result).toBe(true);

      // Restore original Date
      global.Date = OriginalDate;
    });

    it('should return false when date has not passed', () => {
      // Arrange
      const futureDate = '2025-01-01T00:00:00Z';
      const nowDate = '2023-05-15T10:00:00Z';

      // Save original Date
      const OriginalDate = global.Date;

      // Create a proper mock for the Date constructor
      // This is a more type-safe approach to mocking the Date constructor
      const MockDateConstructor = vi.fn((dateString?: string) => {
        if (dateString) {
          return new OriginalDate(dateString);
        }
        return new OriginalDate(nowDate);
      }) as unknown as DateConstructor;

      // Ensure prototype chain is maintained
      Object.defineProperty(MockDateConstructor, 'prototype', {
        value: OriginalDate.prototype
      });

      global.Date = MockDateConstructor;

      // Act
      const result = dateHasPassed(futureDate);

      // Assert
      expect(result).toBe(false);

      // Restore original Date
      global.Date = OriginalDate;
    });
  });
});
