/* eslint-disable @typescript-eslint/unbound-method */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { supabase } from '$lib/server/supabase/client';
import {
  getOrCreateEvent,
  getEventParticipant,
  deleteEventParticipant,
  setParticipantNotAttending
} from '$lib/server/supabase/queries';
import {
  createTestEvent,
  createTestParticipant
} from '../../../../test/fixtures/event-fixtures';
import type { Database, Tables } from "$models/database.model";

// Define the return type for Supabase query results
interface SupabaseQueryResult<T> {
  data: T | null;
  error: Error | null;
}

// Define interfaces for the Supabase client mock chain
interface MockMaybeSingleReturn<T = unknown> {
  maybeSingle: () => Promise<SupabaseQueryResult<T>>;
}

interface MockEqReturn<T = unknown> extends MockMaybeSingleReturn<T> {
  eq: <K extends string>(column: K, value: unknown) => MockEqReturn<T>;
}

interface MockSelectReturn<T = unknown> extends MockEqReturn<T> {
  select: (columns?: string) => MockSelectReturn<T>;
  neq: <K extends string>(column: K, value: unknown) => MockSelectReturn<T>;
  gt: <K extends string>(column: K, value: unknown) => MockSelectReturn<T>;
  gte: <K extends string>(column: K, value: unknown) => MockSelectReturn<T>;
  lt: <K extends string>(column: K, value: unknown) => MockSelectReturn<T>;
  lte: <K extends string>(column: K, value: unknown) => MockSelectReturn<T>;
  like: <K extends string>(column: K, value: unknown) => MockSelectReturn<T>;
  ilike: <K extends string>(column: K, value: unknown) => MockSelectReturn<T>;
  likeAllOf: <K extends string>(column: K, values: unknown[]) => MockSelectReturn<T>;
  likeAnyOf: <K extends string>(column: K, values: unknown[]) => MockSelectReturn<T>;
  ilikeAllOf: <K extends string>(column: K, values: unknown[]) => MockSelectReturn<T>;
  ilikeAnyOf: <K extends string>(column: K, values: unknown[]) => MockSelectReturn<T>;
  is: <K extends string>(column: K, value: unknown) => MockSelectReturn<T>;
  in: <K extends string>(column: K, values: unknown[]) => MockSelectReturn<T>;
  contains: <K extends string>(column: K, value: unknown) => MockSelectReturn<T>;
  containedBy: <K extends string>(column: K, value: unknown) => MockSelectReturn<T>;
  rangeLt: <K extends string>(column: K, range: unknown) => MockSelectReturn<T>;
  rangeGt: <K extends string>(column: K, range: unknown) => MockSelectReturn<T>;
  rangeGte: <K extends string>(column: K, range: unknown) => MockSelectReturn<T>;
  rangeLte: <K extends string>(column: K, range: unknown) => MockSelectReturn<T>;
  rangeAdjacent: <K extends string>(column: K, range: unknown) => MockSelectReturn<T>;
  overlaps: <K extends string>(column: K, value: unknown) => MockSelectReturn<T>;
  textSearch: <K extends string>(column: K, query: string, options?: { config?: string }) => MockSelectReturn<T>;
  filter: <K extends string>(column: K, operator: string, value: unknown) => MockSelectReturn<T>;
  not: <K extends string>(column: K, operator: string, value: unknown) => MockSelectReturn<T>;
  or: (filters: string, options?: { foreignTable?: string }) => MockSelectReturn<T>;
  order: <K extends string>(column: K, options?: { ascending?: boolean; nullsFirst?: boolean; foreignTable?: string }) => MockSelectReturn<T>;
  limit: (count: number, options?: { foreignTable?: string }) => MockSelectReturn<T>;
  offset: (count: number, options?: { foreignTable?: string }) => MockSelectReturn<T>;
  single: () => Promise<{ data: T | null; error: Error | null }>;
  maybeSingle: () => Promise<{ data: T | null; error: Error | null }>;
  csv: () => Promise<{ data: string | null; error: Error | null }>;
  then: <TResult1 = { data: T | null; error: Error | null }, TResult2 = never>(
    onfulfilled?: ((value: { data: T | null; error: Error | null }) => TResult1 | PromiseLike<TResult1>) | null,
    onrejected?: ((reason: unknown) => TResult2 | PromiseLike<TResult2>) | null
  ) => Promise<TResult1 | TResult2>;
}

interface MockInsertReturn<T = unknown> {
  select: () => MockMaybeSingleReturn<T>;
}

interface MockUpdateReturn<T = unknown> {
  eq: <K extends string>(column: K, value: unknown) => {
    eq: <J extends string>(column: J, value: unknown) => Promise<SupabaseQueryResult<T>>;
  };
}

interface MockDeleteReturn<T = unknown> {
  eq: <K extends string>(column: K, value: unknown) => {
    eq: <J extends string>(column: J, value: unknown) => Promise<SupabaseQueryResult<T>>;
  };
}

interface MockFromReturn {
  select: <T = unknown>(columns?: string) => MockSelectReturn<T>;
  insert: <T = unknown, U = unknown>(data: U) => MockInsertReturn<T>;
  update: <T = unknown, U = unknown>(data: U) => MockUpdateReturn<T>;
  delete: <T = unknown>() => MockDeleteReturn<T>;
  // Add missing properties required by PostgrestQueryBuilder
  url: URL;
  headers: Record<string, string>;
  upsert: <T = unknown, U = unknown>(data: U) => MockInsertReturn<T>;
}

// Define type for the mocked Supabase client
interface MockSupabaseClient {
  from: <T extends keyof Database['public']['Tables']>(table: T) => MockFromReturn;
}

// Mock the supabase client
vi.mock('$lib/server/supabase/client', () => {
  // Create mock functions for each method
  const mockFrom = vi.fn();
  const mockSelect = vi.fn();
  const mockInsert = vi.fn();
  const mockUpdate = vi.fn();
  const mockDelete = vi.fn();
  const mockEq = vi.fn();
  const mockMaybeSingle = vi.fn();

  // Create the mock client
  const mockClient = {
    from: mockFrom
  } as unknown as MockSupabaseClient;

  // Set up the default behavior for the mock functions
  mockFrom.mockImplementation(() => ({
    select: mockSelect,
    insert: mockInsert,
    update: mockUpdate,
    delete: mockDelete,
    url: new URL('https://example.com'),
    headers: {},
    upsert: mockInsert
  } as unknown as MockFromReturn));

  mockSelect.mockImplementation(() => ({
    eq: mockEq,
    select: mockSelect,
    maybeSingle: mockMaybeSingle,
    neq: mockEq,
    gt: mockEq,
    gte: mockEq,
    lt: mockEq,
    lte: mockEq,
    like: mockEq,
    ilike: mockEq,
    likeAllOf: mockEq,
    likeAnyOf: mockEq,
    ilikeAllOf: mockEq,
    ilikeAnyOf: mockEq,
    is: mockEq,
    in: mockEq,
    contains: mockEq,
    containedBy: mockEq,
    rangeLt: mockEq,
    rangeGt: mockEq,
    rangeGte: mockEq,
    rangeLte: mockEq,
    rangeAdjacent: mockEq,
    overlaps: mockEq,
    textSearch: mockEq,
    filter: mockEq,
    not: mockEq,
    or: mockEq,
    order: mockEq,
    limit: mockEq,
    offset: mockEq,
    single: mockMaybeSingle,
    csv: mockMaybeSingle,
    then: mockMaybeSingle
  } as unknown as MockSelectReturn));

  mockInsert.mockImplementation(() => ({
    select: mockSelect
  } as unknown as MockInsertReturn));

  mockUpdate.mockImplementation(() => ({
    eq: mockEq
  } as unknown as MockUpdateReturn));

  mockDelete.mockImplementation(() => ({
    eq: mockEq
  } as unknown as MockDeleteReturn));

  mockEq.mockImplementation(() => ({
    eq: mockEq,
    maybeSingle: mockMaybeSingle
  } as unknown as MockEqReturn));

  return {
    supabase: mockClient
  };
});

describe('Supabase Queries', () => {
  beforeEach(() => {
    // Reset all mocks before each test
    vi.resetAllMocks();
  });

  describe('getEventParticipant', () => {
    it('should return participant data when found', async () => {
      // Arrange
      const testParticipant = createTestParticipant();
      const mockResult: SupabaseQueryResult<typeof testParticipant> = { data: testParticipant, error: null };

      // Get references to the mock functions
      const mockFrom = vi.mocked(supabase.from);
      const mockSelect = vi.fn();
      const mockEq = vi.fn();
      const mockMaybeSingle = vi.fn().mockResolvedValue(mockResult);

      // Set up the mock chain
      mockFrom.mockReturnValue({
        select: mockSelect,
        insert: vi.fn(),
        update: vi.fn(),
        delete: vi.fn(),
        url: new URL('https://example.com'),
        headers: {},
        upsert: vi.fn()
      } as unknown as MockFromReturn);

      mockSelect.mockReturnValue({
        eq: mockEq
      } as unknown as MockSelectReturn<Tables<"event_participant">>);

      mockEq.mockReturnValueOnce({
        eq: mockEq
      } as unknown as MockEqReturn<Tables<"event_participant">>);

      mockEq.mockReturnValueOnce({
        maybeSingle: mockMaybeSingle
      } as unknown as MockEqReturn<Tables<"event_participant">>);

      // Act
      const result = await getEventParticipant({
        event_id: testParticipant.event_id,
        email: testParticipant.email
      });

      // Assert
      expect(mockFrom).toHaveBeenCalledWith('event_participant');
      expect(mockSelect).toHaveBeenCalledWith('email, attending, event_id');
      expect(mockEq).toHaveBeenCalledWith('event_id', testParticipant.event_id);
      expect(mockEq).toHaveBeenCalledWith('email', testParticipant.email);
      expect(mockMaybeSingle).toHaveBeenCalled();
      expect(result).toEqual(mockResult);
    });

    it('should handle when participant is not found', async () => {
      // Arrange
      const testParticipant = createTestParticipant();
      const mockResult: SupabaseQueryResult<null> = { data: null, error: null };

      // Get references to the mock functions
      const mockFrom = vi.mocked(supabase.from);
      const mockSelect = vi.fn();
      const mockEq = vi.fn();
      const mockMaybeSingle = vi.fn().mockResolvedValue(mockResult);

      // Set up the mock chain
      mockFrom.mockReturnValue({
        select: mockSelect,
        insert: vi.fn(),
        update: vi.fn(),
        delete: vi.fn(),
        url: new URL('https://example.com'),
        headers: {},
        upsert: vi.fn()
      } as unknown as MockFromReturn);

      mockSelect.mockReturnValue({
        eq: mockEq
      } as unknown as MockSelectReturn<Tables<"event_participant">>);

      mockEq.mockReturnValueOnce({
        eq: mockEq
      } as unknown as MockEqReturn<Tables<"event_participant">>);

      mockEq.mockReturnValueOnce({
        maybeSingle: mockMaybeSingle
      } as unknown as MockEqReturn<Tables<"event_participant">>);

      // Act
      const result = await getEventParticipant({
        event_id: testParticipant.event_id,
        email: testParticipant.email
      });

      // Assert
      expect(mockFrom).toHaveBeenCalledWith('event_participant');
      expect(mockSelect).toHaveBeenCalledWith('email, attending, event_id');
      expect(mockEq).toHaveBeenCalledWith('event_id', testParticipant.event_id);
      expect(mockEq).toHaveBeenCalledWith('email', testParticipant.email);
      expect(mockMaybeSingle).toHaveBeenCalled();
      expect(result).toEqual(mockResult);
    });

    it('should handle errors properly', async () => {
      // Arrange
      const testParticipant = createTestParticipant();
      const testError = new Error('Database error');
      const mockResult: SupabaseQueryResult<null> = { data: null, error: testError };

      // Get references to the mock functions
      const mockFrom = vi.mocked(supabase.from);
      const mockSelect = vi.fn();
      const mockEq = vi.fn();
      const mockMaybeSingle = vi.fn().mockResolvedValue(mockResult);

      // Set up the mock chain
      mockFrom.mockReturnValue({
        select: mockSelect,
        insert: vi.fn(),
        update: vi.fn(),
        delete: vi.fn(),
        url: new URL('https://example.com'),
        headers: {},
        upsert: vi.fn()
      } satisfies MockFromReturn);

      mockSelect.mockReturnValue({
        eq: mockEq
      } as unknown as MockSelectReturn<Tables<"event_participant">>);

      mockEq.mockReturnValueOnce({
        eq: mockEq
      } as unknown as MockEqReturn<Tables<"event_participant">>);

      mockEq.mockReturnValueOnce({
        maybeSingle: mockMaybeSingle
      } as unknown as MockEqReturn<Tables<"event_participant">>);

      // Act
      const result = await getEventParticipant({
        event_id: testParticipant.event_id,
        email: testParticipant.email
      });

      // Assert
      expect(mockFrom).toHaveBeenCalledWith('event_participant');
      expect(mockSelect).toHaveBeenCalledWith('email, attending, event_id');
      expect(mockEq).toHaveBeenCalledWith('event_id', testParticipant.event_id);
      expect(mockEq).toHaveBeenCalledWith('email', testParticipant.email);
      expect(mockMaybeSingle).toHaveBeenCalled();
      expect(result).toEqual(mockResult);
    });
  });

  describe('deleteEventParticipant', () => {
    it('should delete participant and return result', async () => {
      // Arrange
      const testParticipant = createTestParticipant();
      const mockResult: SupabaseQueryResult<null> = { data: null, error: null };

      // Get references to the mock functions
      const mockFrom = vi.mocked(supabase.from);
      const mockDelete = vi.fn();
      const mockEqOuter = vi.fn();
      const mockEqInner = vi.fn().mockResolvedValue(mockResult);

      // Set up the mock chain
      mockFrom.mockReturnValue({
        select: vi.fn(),
        insert: vi.fn(),
        update: vi.fn(),
        delete: mockDelete,
        url: new URL('https://example.com'),
        headers: {},
        upsert: vi.fn()
      } satisfies MockFromReturn);

      mockDelete.mockReturnValue({
        eq: mockEqOuter
      } as unknown as MockDeleteReturn<Tables<"event_participant">>);

      mockEqOuter.mockReturnValue({
        eq: mockEqInner
      } as unknown as MockDeleteReturn<Tables<"event_participant">>["eq"]);

      // Act
      const result = await deleteEventParticipant({
        event_id: testParticipant.event_id,
        email: testParticipant.email
      });

      // Assert
      expect(mockFrom).toHaveBeenCalledWith('event_participant');
      expect(mockDelete).toHaveBeenCalled();
      expect(mockEqOuter).toHaveBeenCalledWith('event_id', testParticipant.event_id);
      expect(mockEqInner).toHaveBeenCalledWith('email', testParticipant.email);
      expect(result).toEqual(mockResult);
    });
  });

  describe('setParticipantNotAttending', () => {
    it('should update participant to not attending and return result', async () => {
      // Arrange
      const testParticipant = createTestParticipant();
      const mockResult: SupabaseQueryResult<null> = { data: null, error: null };

      // Get references to the mock functions
      const mockFrom = vi.mocked(supabase.from);
      const mockUpdate = vi.fn();
      const mockEqOuter = vi.fn();
      const mockEqInner = vi.fn().mockResolvedValue(mockResult);

      // Set up the mock chain
      mockFrom.mockReturnValue({
        select: vi.fn(),
        insert: vi.fn(),
        update: mockUpdate,
        delete: vi.fn(),
        url: new URL('https://example.com'),
        headers: {},
        upsert: vi.fn()
      } satisfies MockFromReturn);

      mockUpdate.mockReturnValue({
        eq: mockEqOuter
      } as unknown as MockUpdateReturn<Tables<"event_participant">>);

      mockEqOuter.mockReturnValue({
        eq: mockEqInner
      } as unknown as MockUpdateReturn<Tables<"event_participant">>["eq"]);

      // Act
      const result = await setParticipantNotAttending({
        event_id: testParticipant.event_id,
        email: testParticipant.email
      });

      // Assert
      expect(mockFrom).toHaveBeenCalledWith('event_participant');
      expect(mockUpdate).toHaveBeenCalledWith({ attending: false });
      expect(mockEqOuter).toHaveBeenCalledWith('event_id', testParticipant.event_id);
      expect(mockEqInner).toHaveBeenCalledWith('email', testParticipant.email);
      expect(result).toEqual(mockResult);
    });
  });

  describe('getOrCreateEvent', () => {
    it('should return existing event if found', async () => {
      // Arrange
      const testEvent = createTestEvent();
      const mockResult: SupabaseQueryResult<typeof testEvent> = { data: testEvent, error: null };

      // Get references to the mock functions
      const mockFrom = vi.mocked(supabase.from);
      const mockSelect = vi.fn();
      const mockEq = vi.fn();
      const mockMaybeSingle = vi.fn().mockResolvedValue(mockResult);

      // Set up the mock chain
      mockFrom.mockReturnValue({
        select: mockSelect,
        insert: vi.fn(),
        update: vi.fn(),
        delete: vi.fn(),
        url: new URL('https://example.com'),
        headers: {},
        upsert: vi.fn()
      } satisfies MockFromReturn);

      mockSelect.mockReturnValue({
        eq: mockEq
      } as unknown as MockSelectReturn<Tables<"event">>);

      mockEq.mockReturnValue({
        maybeSingle: mockMaybeSingle
      } as unknown as MockEqReturn<Tables<"event">>);

      // Act
      const result = await getOrCreateEvent({ document_id: testEvent.document_id });

      // Assert
      expect(mockFrom).toHaveBeenCalledWith('event');
      expect(mockSelect).toHaveBeenCalled();
      expect(mockEq).toHaveBeenCalledWith('document_id', testEvent.document_id);
      expect(mockMaybeSingle).toHaveBeenCalled();
      expect(result).toEqual(mockResult);
    });

    it('should create and return a new event if not found', async () => {
      // Arrange
      const testEvent = createTestEvent();
      const mockNotFoundResult: SupabaseQueryResult<null> = { data: null, error: null };
      const mockCreateResult: SupabaseQueryResult<typeof testEvent> = { data: testEvent, error: null };

      // Get references to the mock functions
      const mockFrom = vi.mocked(supabase.from);

      // First call mocks (not found)
      const mockSelectFirst = vi.fn();
      const mockEqFirst = vi.fn();
      const mockMaybeSingleFirst = vi.fn().mockResolvedValue(mockNotFoundResult);

      // Second call mocks (after insert)
      const mockInsert = vi.fn();
      const mockSelectSecond = vi.fn();
      const mockMaybeSingleSecond = vi.fn().mockResolvedValue(mockCreateResult);

      // Set up the mock chain for the first call
      let callCount = 0;
      mockFrom.mockImplementation((table: keyof Database['public']['Tables']) => {
              if (table === 'event') {
                callCount++;
                if (callCount === 1) {
                  return {
                    select: mockSelectFirst,
                    insert: mockInsert,
                    update: mockInsert,
                    delete: mockInsert,
                    url: new URL('https://example.com'),
                    headers: {},
                    upsert: mockInsert
                  } as unknown as MockFromReturn;
                } else {
                  return {
                    select: mockSelectSecond,
                    insert: mockInsert,
                    update: mockInsert,
                    delete: mockInsert,
                    url: new URL('https://example.com'),
                    headers: {},
                    upsert: mockInsert
                  } as unknown as MockFromReturn;
                }
              }
              return {
                select: mockSelectFirst,
                insert: mockInsert,
                update: mockInsert,
                delete: mockInsert,
                url: new URL('https://example.com'),
                headers: {},
                upsert: mockInsert
              } as unknown as MockFromReturn;
            });

      mockSelectFirst.mockReturnValue({
        eq: mockEqFirst
      } as unknown as MockSelectReturn<Tables<"event">>);

      mockEqFirst.mockReturnValue({
        maybeSingle: mockMaybeSingleFirst
      } as unknown as MockEqReturn<Tables<"event">>);

      mockInsert.mockReturnValue({
        select: mockSelectSecond
      } as unknown as MockInsertReturn<Tables<"event">>);

      mockSelectSecond.mockReturnValue({
        maybeSingle: mockMaybeSingleSecond
      } as unknown as MockMaybeSingleReturn<Tables<"event">>);

      // Act
      const result = await getOrCreateEvent({ document_id: testEvent.document_id });

      // Assert
      expect(mockFrom).toHaveBeenCalledWith('event');
      expect(mockSelectFirst).toHaveBeenCalled();
      expect(mockEqFirst).toHaveBeenCalledWith('document_id', testEvent.document_id);
      expect(mockMaybeSingleFirst).toHaveBeenCalled();
      expect(mockInsert).toHaveBeenCalledWith({ document_id: testEvent.document_id });
      expect(mockSelectSecond).toHaveBeenCalled();
      expect(mockMaybeSingleSecond).toHaveBeenCalled();
      expect(result).toEqual(mockCreateResult);
    });

    it('should handle errors properly', async () => {
      // Arrange
      const testError = new Error('Database error');

      // Get references to the mock functions
      const mockFrom = vi.mocked(supabase.from);
      const mockSelect = vi.fn();
      const mockEq = vi.fn();
      const mockMaybeSingle = vi.fn().mockRejectedValue(testError);

      // Set up the mock chain
      mockFrom.mockReturnValue({
        select: mockSelect,
        insert: vi.fn(),
        update: vi.fn(),
        delete: vi.fn(),
        url: new URL('https://example.com'),
        headers: {},
        upsert: vi.fn()
      } satisfies MockFromReturn);

      mockSelect.mockReturnValue({
        eq: mockEq
      } as unknown as MockSelectReturn<Tables<"event">>);

      mockEq.mockReturnValue({
        maybeSingle: mockMaybeSingle
      } as unknown as MockEqReturn<Tables<"event">>);

      // Act & Assert
      await expect(getOrCreateEvent({ document_id: 'test-id' })).rejects.toThrow(testError);
    });
  });
});
