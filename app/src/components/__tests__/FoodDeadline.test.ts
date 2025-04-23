import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render } from '@testing-library/svelte';
import FoodDeadline from '../shared/FoodDeadline.svelte';
import { formatDate, formatTime, dateHasPassed } from '$lib/utils/date.util';

// Mock date utils
vi.mock('$lib/utils/date.util', () => ({
  formatDate: vi.fn(),
  formatTime: vi.fn(),
  dateHasPassed: vi.fn()
}));

describe('FoodDeadline Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the food deadline with formatted date and time', () => {
    // Arrange
    const testDeadline = '2023-05-15T10:00:00Z';
    vi.mocked(formatTime).mockReturnValue('10:00');
    vi.mocked(formatDate).mockReturnValue('15. mai 2023');
    vi.mocked(dateHasPassed).mockReturnValue(false);

    // Act
    const { getByText } = render(FoodDeadline, { props: { foodDeadline: testDeadline } });

    // Assert
    expect(formatTime).toHaveBeenCalledWith(testDeadline);
    expect(formatDate).toHaveBeenCalledWith(testDeadline);
    expect(dateHasPassed).toHaveBeenCalledWith(testDeadline);
    expect(getByText('Matpåmeldingsfrist kl. 10:00, 15. mai 2023')).toBeTruthy();
  });

  it('shows "Fristen har gått ut" message when deadline has passed', () => {
    // Arrange
    const testDeadline = '2023-05-15T10:00:00Z';
    vi.mocked(formatTime).mockReturnValue('10:00');
    vi.mocked(formatDate).mockReturnValue('15. mai 2023');
    vi.mocked(dateHasPassed).mockReturnValue(true);

    // Act
    const { getByText } = render(FoodDeadline, { props: { foodDeadline: testDeadline } });

    // Assert
    expect(dateHasPassed).toHaveBeenCalledWith(testDeadline);
    expect(getByText('(Fristen har gått ut)')).toBeTruthy();
  });

  it('does not show "Fristen har gått ut" message when deadline has not passed', () => {
    // Arrange
    const testDeadline = '2023-05-15T10:00:00Z';
    vi.mocked(formatTime).mockReturnValue('10:00');
    vi.mocked(formatDate).mockReturnValue('15. mai 2023');
    vi.mocked(dateHasPassed).mockReturnValue(false);

    // Act
    const { queryByText } = render(FoodDeadline, { props: { foodDeadline: testDeadline } });

    // Assert
    expect(dateHasPassed).toHaveBeenCalledWith(testDeadline);
    expect(queryByText('(Fristen har gått ut)')).toBeFalsy();
  });
});
