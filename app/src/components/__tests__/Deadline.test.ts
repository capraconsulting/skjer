import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render } from '@testing-library/svelte';
import Deadline from '../shared/Deadline.svelte';
import { formatDate, formatTime } from '$lib/utils/date.util';

// Mock date utils
vi.mock('$lib/utils/date.util', () => ({
  formatDate: vi.fn(),
  formatTime: vi.fn()
}));

describe('Deadline Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the deadline with formatted date and time', () => {
    // Arrange
    const testDeadline = '2023-05-15T10:00:00Z';
    vi.mocked(formatTime).mockReturnValue('10:00');
    vi.mocked(formatDate).mockReturnValue('15. mai 2023');

    // Act
    const { getByText } = render(Deadline, { props: { deadline: testDeadline } });

    // Assert
    expect(formatTime).toHaveBeenCalledWith(testDeadline);
    expect(formatDate).toHaveBeenCalledWith(testDeadline);
    expect(getByText('Påmeldingsfrist kl. 10:00, 15. mai 2023')).toBeTruthy();
  });

  it('passes the deadline string to the formatting functions', () => {
    // Arrange
    const testDeadline = '2023-06-20T15:30:00Z';
    vi.mocked(formatTime).mockReturnValue('15:30');
    vi.mocked(formatDate).mockReturnValue('20. juni 2023');

    // Act
    render(Deadline, { props: { deadline: testDeadline } });

    // Assert
    expect(formatTime).toHaveBeenCalledWith(testDeadline);
    expect(formatDate).toHaveBeenCalledWith(testDeadline);
  });
});
