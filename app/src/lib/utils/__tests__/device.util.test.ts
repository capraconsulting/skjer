import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { isSafariOrIOS } from '../device.util';

describe('Device Utilities', () => {
  // Save original window object
  const originalWindow = global.window;

  beforeEach(() => {
    // Reset all mocks before each test
    vi.resetAllMocks();
  });

  afterEach(() => {
    // Restore original window after each test
    global.window = originalWindow;
  });

  describe('isSafariOrIOS', () => {
    it('should return true for Safari browser', () => {
      // Mock window and navigator for Safari
      global.window = {
        navigator: {
          userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Safari/605.1.15'
        }
      } as any;

      // Act
      const result = isSafariOrIOS();

      // Assert
      expect(result).toBe(true);
    });

    it('should return false for Chrome browser', () => {
      // Mock window and navigator for Chrome
      global.window = {
        navigator: {
          userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.114 Safari/537.36'
        }
      } as any;

      // Act
      const result = isSafariOrIOS();

      // Assert
      expect(result).toBe(false);
    });

    it('should return true for iOS device', () => {
      // Mock window and navigator for iOS
      global.window = {
        navigator: {
          userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1'
        }
      } as any;

      // Act
      const result = isSafariOrIOS();

      // Assert
      expect(result).toBe(true);
    });

    it('should return false when window is undefined', () => {
      // Mock window as undefined
      global.window = undefined as any;

      // Act
      const result = isSafariOrIOS();

      // Assert
      expect(result).toBe(false);
    });
  });
});
