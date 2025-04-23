import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render } from '@testing-library/svelte';
import EventLogos from '../shared/EventLogos.svelte';
import { createTestSanityEvent } from '../../test/fixtures/sanity-fixtures';

// Mock the image imports
vi.mock('$lib/assets/capra-black-small.webp', () => ({ default: 'capra-black-mock-path' }));
vi.mock('$lib/assets/fryde-black-small.webp', () => ({ default: 'fryde-black-mock-path' }));
vi.mock('$lib/assets/liflig-black-small.webp', () => ({ default: 'liflig-black-mock-path' }));
vi.mock('$lib/assets/capra-white-small.webp', () => ({ default: 'capra-white-mock-path' }));
vi.mock('$lib/assets/fryde-white-small.webp', () => ({ default: 'fryde-white-mock-path' }));
vi.mock('$lib/assets/liflig-white-small.webp', () => ({ default: 'liflig-white-mock-path' }));

describe('EventLogos Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders all logos when organisers is "Alle"', () => {
    // Arrange
    const testEvent = createTestSanityEvent({ organisers: 'Alle' });
    const height = 5;

    // Act
    const { getAllByAltText } = render(EventLogos, { props: { event: testEvent, height } });

    // Assert
    const capraLogos = getAllByAltText('Capra logo');
    const lifligLogos = getAllByAltText('Liflig logo');
    const frydeLogos = getAllByAltText('Fryde logo');

    // Should have both light and dark mode logos
    expect(capraLogos.length).toBe(2);
    expect(lifligLogos.length).toBe(2);
    expect(frydeLogos.length).toBe(2);

    // Check that the logos have the correct src attributes
    expect(capraLogos[0].getAttribute('src')).toBe('capra-black-mock-path');
    expect(capraLogos[1].getAttribute('src')).toBe('capra-white-mock-path');
    expect(lifligLogos[0].getAttribute('src')).toBe('liflig-black-mock-path');
    expect(lifligLogos[1].getAttribute('src')).toBe('liflig-white-mock-path');
    expect(frydeLogos[0].getAttribute('src')).toBe('fryde-black-mock-path');
    expect(frydeLogos[1].getAttribute('src')).toBe('fryde-white-mock-path');
  });

  it('renders only Capra logos when organisers is "Capra"', () => {
    // Arrange
    const testEvent = createTestSanityEvent({ organisers: 'Capra' });
    const height = 5;

    // Act
    const { getAllByAltText, queryAllByAltText } = render(EventLogos, { props: { event: testEvent, height } });

    // Assert
    const capraLogos = getAllByAltText('Capra logo');
    const lifligLogos = queryAllByAltText('Liflig logo');
    const frydeLogos = queryAllByAltText('Fryde logo');

    // Should have both light and dark mode logos for Capra only
    expect(capraLogos.length).toBe(2);
    expect(lifligLogos.length).toBe(0);
    expect(frydeLogos.length).toBe(0);

    // Check that the logos have the correct src attributes
    expect(capraLogos[0].getAttribute('src')).toBe('capra-black-mock-path');
    expect(capraLogos[1].getAttribute('src')).toBe('capra-white-mock-path');
  });

  it('renders only Liflig logos when organisers is "Liflig"', () => {
    // Arrange
    const testEvent = createTestSanityEvent({ organisers: 'Liflig' });
    const height = 5;

    // Act
    const { getAllByAltText, queryAllByAltText } = render(EventLogos, { props: { event: testEvent, height } });

    // Assert
    const capraLogos = queryAllByAltText('Capra logo');
    const lifligLogos = getAllByAltText('Liflig logo');
    const frydeLogos = queryAllByAltText('Fryde logo');

    // Should have both light and dark mode logos for Liflig only
    expect(capraLogos.length).toBe(0);
    expect(lifligLogos.length).toBe(2);
    expect(frydeLogos.length).toBe(0);

    // Check that the logos have the correct src attributes
    expect(lifligLogos[0].getAttribute('src')).toBe('liflig-black-mock-path');
    expect(lifligLogos[1].getAttribute('src')).toBe('liflig-white-mock-path');
  });

  it('renders only Fryde logos when organisers is "Fryde"', () => {
    // Arrange
    const testEvent = createTestSanityEvent({ organisers: 'Fryde' });
    const height = 5;

    // Act
    const { getAllByAltText, queryAllByAltText } = render(EventLogos, { props: { event: testEvent, height } });

    // Assert
    const capraLogos = queryAllByAltText('Capra logo');
    const lifligLogos = queryAllByAltText('Liflig logo');
    const frydeLogos = getAllByAltText('Fryde logo');

    // Should have both light and dark mode logos for Fryde only
    expect(capraLogos.length).toBe(0);
    expect(lifligLogos.length).toBe(0);
    expect(frydeLogos.length).toBe(2);

    // Check that the logos have the correct src attributes
    expect(frydeLogos[0].getAttribute('src')).toBe('fryde-black-mock-path');
    expect(frydeLogos[1].getAttribute('src')).toBe('fryde-white-mock-path');
  });

  it('applies the correct height class to the logos', () => {
    // Arrange
    const testEvent = createTestSanityEvent({ organisers: 'Alle' });
    const height = 8;

    // Act
    const { getAllByAltText } = render(EventLogos, { props: { event: testEvent, height } });

    // Assert
    const allLogos = [
      ...getAllByAltText('Capra logo'),
      ...getAllByAltText('Liflig logo'),
      ...getAllByAltText('Fryde logo')
    ];

    // Check that all logos have the correct height class
    allLogos.forEach(logo => {
      expect(logo.className).toContain(`h-${height}`);
    });
  });
});
