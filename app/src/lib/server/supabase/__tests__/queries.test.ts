import { describe, it, expect, vi, beforeEach } from 'vitest';
import { supabase } from '$lib/server/supabase/client';
import { getOrCreateEvent } from '$lib/server/supabase/queries';
import { createTestEvent } from '../../../../test/fixtures/event-fixtures';

// Mock the supabase client
vi.mock('$lib/server/supabase/client', () => ({
  supabase: {
    from: vi.fn().mockReturnThis(),
    select: vi.fn().mockReturnThis(),
    insert: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    maybeSingle: vi.fn(),
  },
}));

describe('Supabase Queries', () => {
  beforeEach(() => {
    // Reset all mocks before each test
    vi.resetAllMocks();
  });

  describe('getOrCreateEvent', () => {
    it('should return existing event if found', async () => {
      // Arrange
      const testEvent = createTestEvent();
      const mockResult = { data: testEvent, error: null };

      // Setup the mock to return the test event
      vi.mocked(supabase.from).mockReturnThis();
      vi.mocked(supabase.select).mockReturnThis();
      vi.mocked(supabase.eq).mockReturnThis();
      vi.mocked(supabase.maybeSingle).mockResolvedValue(mockResult);

      // Act
      const result = await getOrCreateEvent({ document_id: testEvent.document_id });

      // Assert
      expect(supabase.from).toHaveBeenCalledWith('event');
      expect(supabase.select).toHaveBeenCalled();
      expect(supabase.eq).toHaveBeenCalledWith('document_id', testEvent.document_id);
      expect(supabase.maybeSingle).toHaveBeenCalled();
      expect(result).toEqual(mockResult);
      expect(supabase.insert).not.toHaveBeenCalled();
    });

    it('should create and return a new event if not found', async () => {
      // Arrange
      const testEvent = createTestEvent();
      const mockNotFoundResult = { data: null, error: null };
      const mockCreateResult = { data: testEvent, error: null };

      // Setup the mock to return null for the first call (not found)
      vi.mocked(supabase.from).mockReturnThis();
      vi.mocked(supabase.select).mockReturnThis();
      vi.mocked(supabase.eq).mockReturnThis();
      vi.mocked(supabase.maybeSingle).mockResolvedValueOnce(mockNotFoundResult);

      // Setup the mock to return the test event for the second call (after insert)
      vi.mocked(supabase.insert).mockReturnThis();
      vi.mocked(supabase.maybeSingle).mockResolvedValueOnce(mockCreateResult);

      // Act
      const result = await getOrCreateEvent({ document_id: testEvent.document_id });

      // Assert
      expect(supabase.from).toHaveBeenCalledWith('event');
      expect(supabase.select).toHaveBeenCalled();
      expect(supabase.eq).toHaveBeenCalledWith('document_id', testEvent.document_id);
      expect(supabase.maybeSingle).toHaveBeenCalled();
      expect(supabase.insert).toHaveBeenCalledWith({ document_id: testEvent.document_id });
      expect(result).toEqual(mockCreateResult);
    });

    it('should handle errors properly', async () => {
      // Arrange
      const testError = new Error('Database error');
      const mockErrorResult = { data: null, error: testError };

      // Setup the mock to throw an error
      vi.mocked(supabase.from).mockReturnThis();
      vi.mocked(supabase.select).mockReturnThis();
      vi.mocked(supabase.eq).mockReturnThis();
      vi.mocked(supabase.maybeSingle).mockRejectedValue(testError);

      // Act & Assert
      await expect(getOrCreateEvent({ document_id: 'test-id' })).rejects.toThrow(testError);
    });
  });
});
