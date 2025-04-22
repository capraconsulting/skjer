import { describe, it, expect, vi } from 'vitest';
import { assertEnvVar } from '../api';

// Mock environment variables
vi.mock('$env/static/private', () => ({
  SUPABASE_URL: 'https://test-supabase-url.com',
  SUPABASE_KEY: 'test-supabase-key'
}));

describe('Supabase API', () => {
  describe('assertEnvVar', () => {
    it('should return the value if it is defined', () => {
      // Arrange
      const value = 'test-value';
      const name = 'TEST_VAR';

      // Act
      const result = assertEnvVar(value, name);

      // Assert
      expect(result).toBe(value);
    });

    it('should throw an error if the value is undefined', () => {
      // Arrange
      const value = undefined;
      const name = 'TEST_VAR';

      // Act & Assert
      expect(() => assertEnvVar(value, name)).toThrow(`Missing environment variable: ${name}`);
    });

    it('should accept different types of values', () => {
      // Arrange
      const numberValue = 123;
      const booleanValue = true;
      const objectValue = { key: 'value' };
      const name = 'TEST_VAR';

      // Act & Assert
      expect(assertEnvVar(numberValue, name)).toBe(numberValue);
      expect(assertEnvVar(booleanValue, name)).toBe(booleanValue);
      expect(assertEnvVar(objectValue, name)).toBe(objectValue);
    });
  });
});
