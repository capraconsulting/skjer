import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render } from '@testing-library/svelte';
import EventBadges from '../shared/EventBadges.svelte';
import { createTestEventWithAttending } from '../../test/fixtures/sanity-fixtures';
import { formatDate, formatTime } from '$lib/utils/date.util';
import { isToday } from 'date-fns';

// Mock date-fns
vi.mock('date-fns', () => ({
  isToday: vi.fn()
}));

// Mock date utils
vi.mock('$lib/utils/date.util', () => ({
  formatDate: vi.fn(),
  formatTime: vi.fn()
}));

describe('EventBadges Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders "For alle" badge when event is open for externals', () => {
    const testEvent = createTestEventWithAttending(false, { openForExternals: true });

    const { getByText } = render(EventBadges, { props: { event: testEvent } });

    expect(getByText('For alle')).toBeTruthy();
  });

  it('renders "Kun interne" badge when event is not open for externals', () => {
    const testEvent = createTestEventWithAttending(false, { openForExternals: false });

    const { getByText } = render(EventBadges, { props: { event: testEvent } });

    expect(getByText('Kun interne')).toBeTruthy();
  });

  it('renders category badge when event has a category', () => {
    const testEvent = createTestEventWithAttending(false, { category: 'Fag' });

    const { getByText } = render(EventBadges, { props: { event: testEvent } });

    expect(getByText('Fag')).toBeTruthy();
  });

  it('renders "I dag" badge when event is today', () => {
    const testEvent = createTestEventWithAttending(false);
    vi.mocked(isToday).mockReturnValue(true);
    vi.mocked(formatTime).mockReturnValue('10:00');

    const { getByText } = render(EventBadges, { props: { event: testEvent } });

    expect(getByText('I dag kl. 10:00')).toBeTruthy();
  });

  it('renders formatted date badge when event is not today', () => {
    const testEvent = createTestEventWithAttending(false);
    vi.mocked(isToday).mockReturnValue(false);
    vi.mocked(formatDate).mockReturnValue('15. mai 2023');

    const { getByText } = render(EventBadges, { props: { event: testEvent } });

    expect(getByText('15. mai 2023')).toBeTruthy();
  });

  it('renders "Du er påmeldt" badge when user is attending', () => {
    const testEvent = createTestEventWithAttending(true);

    const { getByText } = render(EventBadges, { props: { event: testEvent } });

    expect(getByText('Du er påmeldt')).toBeTruthy();
  });

  it('does not render "Du er påmeldt" badge when user is not attending', () => {
    const testEvent = createTestEventWithAttending(false);

    const { queryByText } = render(EventBadges, { props: { event: testEvent } });

    expect(queryByText('Du er påmeldt')).toBeFalsy();
  });
});
