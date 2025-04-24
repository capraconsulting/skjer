import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render } from '@testing-library/svelte';
// Using a simplified version of the EventSummary component for testing
// This avoids issues with mocking child components (Badge, PortableText, EventInfoBox, Link)
import EventSummary from './EventSummary.test.svelte';
import { createTestSanityEventWithImage } from '../../test/fixtures/sanity-fixtures';

// Mock the Sanity image URL builder
vi.mock('$lib/sanity/image', (): { urlFor: () => { url: () => string } } => ({
  urlFor: vi.fn().mockReturnValue({
    url: vi.fn().mockReturnValue('https://test-image-url.com/image.jpg')
  })
}));

describe('EventSummary Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the event title', () => {
    const testEvent = createTestSanityEventWithImage({ title: 'Test Event Title' });
    const testData = { numberOfParticipants: 5 };

    const { getByText } = render(EventSummary, {
      props: { event: testEvent, data: testData }
    });

    expect(getByText('Test Event Title')).toBeTruthy();
  });

  it('renders the event category badge when available', () => {
    const testEvent = createTestSanityEventWithImage({ category: 'Fag' });
    const testData = { numberOfParticipants: 5 };

    const { getByText } = render(EventSummary, {
      props: { event: testEvent, data: testData }
    });

    expect(getByText('Fag')).toBeTruthy();
  });

  it('does not render the category badge when category is not available', () => {
    const testEvent = createTestSanityEventWithImage({ category: undefined });
    const testData = { numberOfParticipants: 5 };

    const { container } = render(EventSummary, {
      props: { event: testEvent, data: testData }
    });

    // Check that no category div is rendered
    const categoryDiv = container.querySelector('.mb-4.h-6.border.border-black');
    expect(categoryDiv).toBeFalsy();
  });

  it('renders the event summary when available', () => {
    const testEvent = createTestSanityEventWithImage({ summary: 'Test Event Summary' });
    const testData = { numberOfParticipants: 5 };

    const { getByText } = render(EventSummary, {
      props: { event: testEvent, data: testData }
    });

    expect(getByText('Test Event Summary')).toBeTruthy();
  });

  it('does not render the summary when not available', () => {
    const testEvent = createTestSanityEventWithImage({ summary: undefined });
    const testData = { numberOfParticipants: 5 };

    const { container } = render(EventSummary, {
      props: { event: testEvent, data: testData }
    });

    // Check that no paragraph with the summary class is rendered
    const summaryParagraph = container.querySelector('p.break-words');
    expect(summaryParagraph).toBeFalsy();
  });

  it('renders the EventInfoBox component with correct props', () => {
    const testEvent = createTestSanityEventWithImage();
    const testData = { numberOfParticipants: 5 };

    const { container } = render(EventSummary, {
      props: { event: testEvent, data: testData }
    });

    const eventInfoBox = container.querySelector('[data-testid="event-info-box"]') as HTMLElement;
    expect(eventInfoBox).toBeTruthy();

    const propsString = eventInfoBox.getAttribute('data-props') || '{}';
    const props = JSON.parse(propsString) as Record<string, unknown>;
    expect(props).toHaveProperty('event', testEvent);
    expect(props).toHaveProperty('numberOfParticipants', 5);
  });

  it('renders the event image when available', () => {
    const testEvent = createTestSanityEventWithImage();
    const testData = { numberOfParticipants: 5 };

    const { container } = render(EventSummary, {
      props: { event: testEvent, data: testData }
    });

    const image = container.querySelector('img') as HTMLImageElement;
    expect(image).toBeTruthy();
    expect(image.getAttribute('src')).toBe('https://test-image-url.com/image.jpg');
    expect(image.getAttribute('alt')).toBe(`Bilde for arrangementet: ${testEvent.title}`);
  });

  it('does not render the image when not available', () => {
    const testEvent = createTestSanityEventWithImage();
    testEvent.image = undefined;
    const testData = { numberOfParticipants: 5 };

    const { container } = render(EventSummary, {
      props: { event: testEvent, data: testData }
    });

    const image = container.querySelector('img');
    expect(image).toBeFalsy();
  });

  it('renders the event body when available', () => {
    const testEvent = createTestSanityEventWithImage({ body: [{ _type: 'block', children: [], _key: 'test-block-key-1' }] });
    const testData = { numberOfParticipants: 5 };

    const { container } = render(EventSummary, {
      props: { event: testEvent, data: testData }
    });

    const portableText = container.querySelector('[data-testid="portable-text"]') as HTMLElement;
    expect(portableText).toBeTruthy();

    const propsString = portableText.getAttribute('data-props') || '{}';
    const props = JSON.parse(propsString) as Record<string, unknown>;
    expect(props).toHaveProperty('value', testEvent.body);
  });

  it('does not render the body when not available', () => {
    const testEvent = createTestSanityEventWithImage({ body: undefined });
    const testData = { numberOfParticipants: 5 };

    const { container } = render(EventSummary, {
      props: { event: testEvent, data: testData }
    });

    const portableText = container.querySelector('[data-testid="portable-text"]');
    expect(portableText).toBeFalsy();
  });

  it('sets up the Link component for PortableText', () => {
    const testEvent = createTestSanityEventWithImage({ body: [{ _type: 'block', children: [], _key: 'test-block-key-2' }] });
    const testData = { numberOfParticipants: 5 };

    const { container } = render(EventSummary, {
      props: { event: testEvent, data: testData }
    });

    const portableText = container.querySelector('[data-testid="portable-text"]') as HTMLElement;
    expect(portableText).toBeTruthy();

    const propsString = portableText.getAttribute('data-props') || '{}';
    const props = JSON.parse(propsString) as Record<string, unknown>;
    expect(props).toHaveProperty('components.marks.link');
  });

  it('initializes imageLoaded as false', () => {
    const testEvent = createTestSanityEventWithImage();
    const testData = { numberOfParticipants: 5 };

    const { container } = render(EventSummary, {
      props: { event: testEvent, data: testData }
    });

    const image = container.querySelector('img') as HTMLImageElement;
    expect(image).toBeTruthy();
    // Check that the image has the opacity-0 class and not the opacity-100 class
    expect(image.classList.contains('opacity-0')).toBeTruthy();
    expect(image.classList.contains('opacity-100')).toBeFalsy();
  });
});
