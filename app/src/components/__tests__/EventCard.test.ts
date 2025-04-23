import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render } from '@testing-library/svelte';
import EventCard from '../shared/EventCard.svelte';
import { createTestSanityEvent, createTestSanityEventWithImage } from '../../test/fixtures/sanity-fixtures';

// Mock the Sanity image URL builder
vi.mock('$lib/sanity/image', () => ({
  urlFor: vi.fn().mockReturnValue({
    url: vi.fn().mockReturnValue('https://test-image-url.com/image.jpg')
  })
}));

describe('EventCard Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the event title correctly', () => {
    const testEvent = createTestSanityEvent({ title: 'Test Event Title' });

    const { getByText } = render(EventCard, { props: { event: testEvent } });

    expect(getByText('Test Event Title')).toBeTruthy();
  });

  it('renders the event image when available', () => {
    const testEvent = createTestSanityEventWithImage();

    const { getByAltText } = render(EventCard, { props: { event: testEvent } });

    const image = getByAltText(`Bilde for arrangementet: ${testEvent.title}`);
    expect(image).toBeTruthy();
    expect(image.getAttribute('src')).toBe('https://test-image-url.com/image.jpg');
  });

  it('renders a placeholder div when no image is available', () => {
    const testEvent = createTestSanityEvent(); // No image

    const { container } = render(EventCard, { props: { event: testEvent } });

    // Check that there's a div with the placeholder classes
    const placeholder = container.querySelector('.h-full.w-full.bg-zinc-100.dark\\:bg-zinc-800');
    expect(placeholder).toBeTruthy();
  });

  it('links to the correct event page', () => {
    const testEvent = createTestSanityEvent({ _id: 'test-event-id' });

    const { container } = render(EventCard, { props: { event: testEvent } });

    const link = container.querySelector('a');
    expect(link).toBeTruthy();
    expect(link?.getAttribute('href')).toBe('/event/test-event-id');
  });
});
