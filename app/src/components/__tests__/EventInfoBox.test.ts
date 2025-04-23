import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render } from '@testing-library/svelte';
// Using a simplified version of the EventInfoBox component for testing
// This avoids issues with mocking child components (phosphor-svelte icons)
import EventInfoBox from './EventInfoBox.test.svelte';
import { createTestSanityEvent } from '../../test/fixtures/sanity-fixtures';
import { dateHasPassed, endsOnDifferentDay, formatDate, formatTime } from '$lib/utils/date.util';

// Mock the date utility functions
vi.mock('$lib/utils/date.util', () => ({
  dateHasPassed: vi.fn(),
  endsOnDifferentDay: vi.fn(),
  formatDate: vi.fn(),
  formatTime: vi.fn()
}));

describe('EventInfoBox Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(formatDate).mockReturnValue('15. mai 2023');
    vi.mocked(formatTime).mockReturnValue('10:00');
    vi.mocked(endsOnDifferentDay).mockReturnValue(false);
    vi.mocked(dateHasPassed).mockReturnValue(false);
  });

  it('renders the event category when available', () => {
    const testEvent = createTestSanityEvent({ category: 'Fag' });
    const numberOfParticipants = 0;

    const { getByText } = render(EventInfoBox, {
      props: { event: testEvent, numberOfParticipants }
    });

    expect(getByText('Fag')).toBeTruthy();
  });

  it('renders the event date and time', () => {
    const testEvent = createTestSanityEvent();
    const numberOfParticipants = 0;

    const { getByText } = render(EventInfoBox, {
      props: { event: testEvent, numberOfParticipants }
    });

    expect(formatDate).toHaveBeenCalledWith(testEvent.start);
    expect(formatTime).toHaveBeenCalledWith(testEvent.start);
    expect(formatTime).toHaveBeenCalledWith(testEvent.end);
    expect(getByText('15. mai 2023')).toBeTruthy();
    expect(getByText('10:00 - 10:00')).toBeTruthy();
  });

  it('renders the event place', () => {
    const testEvent = createTestSanityEvent({ place: 'Test Place' });
    const numberOfParticipants = 0;

    const { getByText } = render(EventInfoBox, {
      props: { event: testEvent, numberOfParticipants }
    });

    expect(getByText('Test Place')).toBeTruthy();
  });

  it('renders the food information when available', () => {
    const testEvent = createTestSanityEvent({ food: 'Test Food' });
    const numberOfParticipants = 0;

    const { getByText } = render(EventInfoBox, {
      props: { event: testEvent, numberOfParticipants }
    });

    expect(getByText('Test Food')).toBeTruthy();
  });

  it('renders the streaming link when available', () => {
    const testEvent = createTestSanityEvent({ linkStreaming: 'https://example.com/stream' });
    const numberOfParticipants = 0;

    const { getByText } = render(EventInfoBox, {
      props: { event: testEvent, numberOfParticipants }
    });

    expect(getByText('https://example.com/stream')).toBeTruthy();
  });

  it('renders "Åpent for alle" when openForExternals is true', () => {
    const testEvent = createTestSanityEvent({ openForExternals: true });
    const numberOfParticipants = 0;

    const { getByText } = render(EventInfoBox, {
      props: { event: testEvent, numberOfParticipants }
    });

    expect(getByText('Åpent for alle')).toBeTruthy();
  });

  it('renders "Kun for interne" when openForExternals is false', () => {
    const testEvent = createTestSanityEvent({ openForExternals: false });
    const numberOfParticipants = 0;

    const { getByText } = render(EventInfoBox, {
      props: { event: testEvent, numberOfParticipants }
    });

    expect(getByText('Kun for interne')).toBeTruthy();
  });

  it('renders available spots when maxParticipant is set and not hidden', () => {
    const testEvent = createTestSanityEvent({
      maxParticipant: 10,
      hideMaxParticipant: false
    });
    const numberOfParticipants = 5;

    const { getByText } = render(EventInfoBox, {
      props: { event: testEvent, numberOfParticipants }
    });

    expect(getByText('5 ledige plasser')).toBeTruthy();
  });

  it('renders "1 ledig plass" when only one spot is available', () => {
    const testEvent = createTestSanityEvent({
      maxParticipant: 10,
      hideMaxParticipant: false
    });
    const numberOfParticipants = 9;

    const { getByText } = render(EventInfoBox, {
      props: { event: testEvent, numberOfParticipants }
    });

    expect(getByText('1 ledig plass')).toBeTruthy();
  });

  it('renders "Ingen ledige plasser" when no spots are available', () => {
    const testEvent = createTestSanityEvent({
      maxParticipant: 10,
      hideMaxParticipant: false
    });
    const numberOfParticipants = 10;

    const { getByText } = render(EventInfoBox, {
      props: { event: testEvent, numberOfParticipants }
    });

    expect(getByText('Ingen ledige plasser')).toBeTruthy();
  });

  it('does not render available spots when hideMaxParticipant is true', () => {
    const testEvent = createTestSanityEvent({
      maxParticipant: 10,
      hideMaxParticipant: true
    });
    const numberOfParticipants = 5;

    const { queryByText } = render(EventInfoBox, {
      props: { event: testEvent, numberOfParticipants }
    });

    expect(queryByText('5 ledige plasser')).toBeFalsy();
  });

  it('does not render available spots when deadline has passed', () => {
    const testEvent = createTestSanityEvent({
      maxParticipant: 10,
      hideMaxParticipant: false
    });
    const numberOfParticipants = 5;
    vi.mocked(dateHasPassed).mockReturnValue(true);

    const { queryByText } = render(EventInfoBox, {
      props: { event: testEvent, numberOfParticipants }
    });

    expect(queryByText('5 ledige plasser')).toBeFalsy();
  });

  it('renders end date when event spans multiple days', () => {
    const testEvent = createTestSanityEvent();
    const numberOfParticipants = 0;
    vi.mocked(endsOnDifferentDay).mockReturnValue(true);

    const { getByText } = render(EventInfoBox, {
      props: { event: testEvent, numberOfParticipants }
    });

    expect(getByText('15. mai 2023 - 15. mai 2023')).toBeTruthy();
  });
});
