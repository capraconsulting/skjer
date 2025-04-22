import { describe, it, expect } from 'vitest';
import { sanitize } from '../sanitize.util';

describe('Sanitize Utilities', () => {
  describe('sanitize', () => {
    it('should convert string to lowercase', () => {
      // Arrange
      const input = 'ABCDEF';

      // Act
      const result = sanitize(input);

      // Assert
      expect(result).toBe('abcdef');
    });

    it('should remove non-alphabetic characters', () => {
      // Arrange
      const input = 'abc123!@#';

      // Act
      const result = sanitize(input);

      // Assert
      expect(result).toBe('abc');
    });

    it('should handle empty strings', () => {
      // Arrange
      const input = '';

      // Act
      const result = sanitize(input);

      // Assert
      expect(result).toBe('');
    });

    it('should handle strings with only non-alphabetic characters', () => {
      // Arrange
      const input = '123!@#';

      // Act
      const result = sanitize(input);

      // Assert
      expect(result).toBe('');
    });

    it('should handle mixed case with special characters', () => {
      // Arrange
      const input = 'Hello World! 123';

      // Act
      const result = sanitize(input);

      // Assert
      expect(result).toBe('helloworld');
    });

    it('should preserve non-English alphabetic characters', () => {
      // Arrange
      const input = 'áéíóú';

      // Act
      const result = sanitize(input);

      // Assert
      expect(result).toBe('');
    });
  });
});
