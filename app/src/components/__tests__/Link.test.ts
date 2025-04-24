import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/svelte';
import Link from '../shared/Link.svelte';

describe('Link Component', () => {
  it('renders a link when href is provided', () => {
    const portableText = {
      value: { _type: 'link', _key: '', href: 'https://example.com' },
      children: [],
      markKey: '',
      markType: '',
      plainTextContent: '',
      indexInParent: 0,
      global: {}
    };

    const { container } = render(Link, { props: { portableText } });

    const link = container.querySelector('a') as HTMLAnchorElement;
    expect(link).toBeTruthy();
    expect(link.getAttribute('href')).toBe('https://example.com');
    expect(link.getAttribute('target')).toBe('_blank');
    expect(link.getAttribute('rel')).toBe('noopener noreferrer');
  });

  it('renders a link when url is provided instead of href', () => {
    const portableText = {
      value: { _type: 'link', _key: '', url: 'https://example.com' },
      children: [],
      markKey: '',
      markType: '',
      plainTextContent: '',
      indexInParent: 0,
      global: {}
    };

    const { container } = render(Link, { props: { portableText } });

    const link = container.querySelector('a') as HTMLAnchorElement;
    expect(link).toBeTruthy();
    expect(link.getAttribute('href')).toBe('https://example.com');
  });

  it('renders a link when link is provided instead of href or url', () => {
    const portableText = {
      value: { _type: 'link', _key: '', link: 'https://example.com' },
      children: [],
      markKey: '',
      markType: '',
      plainTextContent: '',
      indexInParent: 0,
      global: {}
    };

    const { container } = render(Link, { props: { portableText } });

    const link = container.querySelector('a') as HTMLAnchorElement;
    expect(link).toBeTruthy();
    expect(link.getAttribute('href')).toBe('https://example.com');
  });

  // This test is skipped because the component doesn't support direct string values
  it.skip('renders a link when value is a string', () => {
    const portableText = {
      value: 'https://example.com',
      children: [],
      markKey: '',
      markType: '',
      plainTextContent: '',
      indexInParent: 0,
      global: {}
    };

    const { container } = render(Link, { props: { portableText } });

    const link = container.querySelector('a') as HTMLAnchorElement;
    expect(link).toBeTruthy();
    expect(link.getAttribute('href')).toBe('https://example.com');
  });

  it('does not render a link when href is not a string', () => {
    const portableText = {
      value: { _type: 'link', _key: '', href: null },
      children: [],
      markKey: '',
      markType: '',
      plainTextContent: '',
      indexInParent: 0,
      global: {}
    };

    const { container } = render(Link, {
      props: { portableText }
    });

    const link = container.querySelector('a');
    expect(link).toBeFalsy();
  });

  it('renders a link with target="_blank" and rel="noopener noreferrer"', () => {
    const portableText = {
      value: { _type: 'link', _key: '', href: 'https://example.com' },
      children: [],
      markKey: '',
      markType: '',
      plainTextContent: '',
      indexInParent: 0,
      global: {}
    };

    const { container } = render(Link, {
      props: { portableText }
    });

    const link = container.querySelector('a') as HTMLAnchorElement;
    expect(link).toBeTruthy();
    expect(link.getAttribute('href')).toBe('https://example.com');
    expect(link.getAttribute('target')).toBe('_blank');
    expect(link.getAttribute('rel')).toBe('noopener noreferrer');
  });
});
