import { describe, it, expect } from 'vitest';
import { getAlertColor } from '../form.util';
import type { FormMessage } from "$models/form.model";

describe('Form Utilities', () => {
  describe('getAlertColor', () => {
    it('should return "green" for success messages', () => {
      // Arrange
      const message: FormMessage = {
        success: true,
        warning: false,
        message: 'Operation successful'
      };

      // Act
      const result = getAlertColor(message);

      // Assert
      expect(result).toBe('green');
    });

    it('should return "yellow" for warning messages', () => {
      // Arrange
      const message: FormMessage = {
        success: false,
        warning: true,
        message: 'Warning: proceed with caution'
      };

      // Act
      const result = getAlertColor(message);

      // Assert
      expect(result).toBe('yellow');
    });

    it('should return "red" for error messages', () => {
      // Arrange
      const message: FormMessage = {
        success: false,
        warning: false,
        message: 'Error occurred'
      };

      // Act
      const result = getAlertColor(message);

      // Assert
      expect(result).toBe('red');
    });

    it('should prioritize success over warning', () => {
      // Arrange
      const message: FormMessage = {
        success: true,
        warning: true,
        message: 'Success with warning'
      };

      // Act
      const result = getAlertColor(message);

      // Assert
      expect(result).toBe('green');
    });
  });
});
