// This file is used to set up the test environment
import { expect, vi } from 'vitest';

// Mock environment variables
vi.mock('$env/static/private', () => ({
  SMTP_HOST: 'test-smtp-host',
  SMTP_AUTH_USER: 'test-user',
  SMTP_AUTH_KEY: 'test-key',
}));

// Mock the Supabase client
vi.mock('$lib/server/supabase/client', () => ({
  supabase: {
    from: vi.fn().mockReturnThis(),
    select: vi.fn().mockReturnThis(),
    insert: vi.fn().mockReturnThis(),
    update: vi.fn().mockReturnThis(),
    delete: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    maybeSingle: vi.fn(),
  },
}));

// Add any global setup here
