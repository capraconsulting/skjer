import { describe, it, expect, vi } from 'vitest';
import { validateDomain } from '../domain';
import { ALLOWED_DOMAINS } from "$models/allowedDomains.model";

// Mock the ALLOWED_DOMAINS
vi.mock('$models/allowedDomains.model', () => {
  return {
    ALLOWED_DOMAINS: ['@capraconsulting.no', '@fryde.no', '@liflig.no']
  };
});

describe('Domain Utilities', () => {
  describe('validateDomain', () => {
    it('should return true for email with allowed domain', () => {
      // Arrange
      const email = 'test@capraconsulting.no';

      // Act
      const result = validateDomain(email);

      // Assert
      expect(result).toBe(true);
    });

    it('should return false for email with disallowed domain', () => {
      // Arrange
      const email = 'test@example.com';

      // Act
      const result = validateDomain(email);

      // Assert
      expect(result).toBe(false);
    });

    it('should check all allowed domains', () => {
      // Test each allowed domain
      ALLOWED_DOMAINS.forEach(domain => {
        // Arrange
        const email = `test${domain}`;

        // Act
        const result = validateDomain(email);

        // Assert
        expect(result).toBe(true);
      });
    });

    it('should return false for email without @ symbol', () => {
      // Arrange
      const email = 'testcapraconsulting.no';

      // Act
      const result = validateDomain(email);

      // Assert
      expect(result).toBe(false);
    });

    it('should return false for empty string', () => {
      // Arrange
      const email = '';

      // Act
      const result = validateDomain(email);

      // Assert
      expect(result).toBe(false);
    });

    it('should be case sensitive', () => {
      // Arrange
      const email = 'test@CAPRACONSULTING.NO';

      // Act
      const result = validateDomain(email);

      // Assert
      expect(result).toBe(false);
    });
  });
});
